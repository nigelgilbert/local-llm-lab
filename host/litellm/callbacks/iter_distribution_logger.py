"""Per-request bridge logger for iteration-distribution characterization (W1).

Wired in `litellm-config.yaml` under `litellm_settings.callbacks` as
`callbacks.iter_distribution_logger.iter_distribution_callback`. On every
successful `/v1/messages` (or `/v1/chat/completions`) request, appends a JSONL
record to `/runtime/_bridge.jsonl` (host-mounted to
`host/test/.claw-runtime/_bridge.jsonl`).

The record carries enough state for `runClaw()` to slice this aggregator log
by run-window and join against claw's session JSONL. See
TODO-ITERATION-DISTRIBUTION-TEST.md Step 1.1 for the schema contract.

server_prompt_eval_ms / server_decode_ms come from llama.cpp's `timings` block
when LiteLLM surfaces it on `response_obj._hidden_params['additional_headers']`
or the raw response dict; otherwise they are null and analysis must qualify
"model_elapsed_ms" as bridge-observed wallclock rather than pure decode time.
"""

from __future__ import annotations

import json
import os
import threading
import time
from typing import Any, Optional

from litellm.integrations.custom_logger import CustomLogger

_BRIDGE_LOG_PATH = os.environ.get(
    "ITER_DIST_BRIDGE_LOG", "/runtime/_bridge.jsonl"
)
_SCHEMA_VERSION = 1

# Single shared lock — LiteLLM uses one worker (--num_workers 1) but the SDK
# may invoke callbacks concurrently from streaming/async paths.
_LOG_LOCK = threading.Lock()
_SEQ_LOCK = threading.Lock()
_seq_counter = 0


def _next_seq() -> int:
    global _seq_counter
    with _SEQ_LOCK:
        _seq_counter += 1
        return _seq_counter


def _to_ms(value: Any) -> Optional[int]:
    if value is None:
        return None
    if hasattr(value, "timestamp"):
        return int(value.timestamp() * 1000)
    try:
        return int(float(value) * 1000)
    except (TypeError, ValueError):
        return None


def _safe_get(obj: Any, *names: str) -> Any:
    for name in names:
        if obj is None:
            return None
        if isinstance(obj, dict):
            obj = obj.get(name)
        else:
            obj = getattr(obj, name, None)
    return obj


def _parse_sse_timings(blob: Any) -> Optional[dict]:
    """Scan an SSE blob (string of `data: {...}` lines) for the final
    llama.cpp usage chunk that carries `timings`. Returns the timings dict
    or None.
    """
    if blob is None:
        return None
    if not isinstance(blob, str):
        try:
            blob = str(blob)
        except Exception:
            return None
    # Walk lines from the end (timings is in the last usage chunk).
    found = None
    for line in blob.split("\n"):
        if not line.startswith("data:"):
            continue
        payload = line[5:].strip()
        if payload == "[DONE]" or not payload:
            continue
        try:
            obj = json.loads(payload)
        except Exception:
            continue
        if isinstance(obj, dict) and isinstance(obj.get("timings"), dict):
            found = obj["timings"]
    return found


def _extract_server_timings(kwargs: dict, response_obj: Any) -> dict:
    """Best-effort extraction of llama.cpp `timings` from a LiteLLM response.

    LiteLLM's Anthropic-shape translation strips `timings` from the user-facing
    response, but the underlying upstream response (or _hidden_params) may
    still carry it. For non-streaming responses, `_hidden_params.additional_args`
    surfaces the field. For streaming responses, `kwargs["original_response"]`
    is the raw SSE blob and the final usage chunk carries `timings`.
    """
    found: dict = {
        "server_prompt_eval_ms": None,
        "server_decode_ms": None,
        "server_total_ms": None,
        "server_tokens_per_second": None,
        "server_queue_ms": None,  # llama.cpp does not expose queue time.
    }

    candidates = []
    candidates.append(_safe_get(response_obj, "_hidden_params"))
    candidates.append(_safe_get(response_obj, "_hidden_params", "additional_args"))
    candidates.append(kwargs.get("additional_args"))
    candidates.append(kwargs.get("standard_logging_object"))
    if isinstance(response_obj, dict):
        candidates.append(response_obj.get("timings"))
    candidates.append(_safe_get(response_obj, "timings"))

    timings = None
    for c in candidates:
        if c is None:
            continue
        if isinstance(c, dict):
            if "prompt_ms" in c and "predicted_ms" in c:
                timings = c
                break
            inner = c.get("timings") if isinstance(c, dict) else None
            if isinstance(inner, dict) and "prompt_ms" in inner:
                timings = inner
                break

    # Streaming fallback: parse the raw SSE blob (rarely populated for
    # streaming since LiteLLM hands us a coroutine, not the consumed body).
    if timings is None:
        timings = _parse_sse_timings(kwargs.get("original_response"))

    if timings is not None:
        prompt_ms = timings.get("prompt_ms")
        predicted_ms = timings.get("predicted_ms")
        found["server_prompt_eval_ms"] = (
            float(prompt_ms) if prompt_ms is not None else None
        )
        found["server_decode_ms"] = (
            float(predicted_ms) if predicted_ms is not None else None
        )
        if prompt_ms is not None and predicted_ms is not None:
            found["server_total_ms"] = float(prompt_ms) + float(predicted_ms)
        tps = timings.get("predicted_per_second")
        if tps is not None:
            found["server_tokens_per_second"] = float(tps)
        return found

    # Final fallback for streaming: LiteLLM exposes `_response_ms` on
    # `_hidden_params` — the upstream HTTP wallclock as LiteLLM observed it.
    # That's not the prompt-vs-decode split we'd ideally want, but it is the
    # cleanest "server-side total" we can recover without patching LiteLLM's
    # streaming accumulator. prompt_eval / decode remain null.
    response_ms = _safe_get(response_obj, "_hidden_params", "_response_ms")
    if response_ms is None:
        # Some code paths surface response_ms on response_obj directly.
        response_ms = _safe_get(response_obj, "_response_ms")
    if response_ms is not None:
        try:
            found["server_total_ms"] = float(response_ms)
        except (TypeError, ValueError):
            pass

    return found


def _extract_usage(response_obj: Any) -> dict:
    usage = _safe_get(response_obj, "usage")
    if usage is None:
        return {
            "input_tokens": None,
            "output_tokens": None,
            "cache_creation_input_tokens": None,
            "cache_read_input_tokens": None,
        }

    def get(name):
        return _safe_get(usage, name)

    input_tokens = get("prompt_tokens")
    if input_tokens is None:
        input_tokens = get("input_tokens")
    output_tokens = get("completion_tokens")
    if output_tokens is None:
        output_tokens = get("output_tokens")

    cache_read = None
    cache_create = None
    details = get("prompt_tokens_details")
    if details is not None:
        cache_read = _safe_get(details, "cached_tokens")
    if cache_read is None:
        cache_read = get("cache_read_input_tokens")
    if cache_create is None:
        cache_create = get("cache_creation_input_tokens")

    return {
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "cache_creation_input_tokens": cache_create,
        "cache_read_input_tokens": cache_read,
    }


def _extract_stop_reason(response_obj: Any) -> Optional[str]:
    # Anthropic-shape: response_obj.stop_reason
    sr = _safe_get(response_obj, "stop_reason")
    if sr:
        return sr
    # OpenAI-shape: response_obj.choices[0].finish_reason
    choices = _safe_get(response_obj, "choices")
    if choices and len(choices) > 0:
        return _safe_get(choices[0], "finish_reason")
    return None


def _write_record(record: dict) -> None:
    line = json.dumps(record, separators=(",", ":")) + "\n"
    try:
        with _LOG_LOCK:
            # Append-only: each record is one line, ordered by request finish.
            with open(_BRIDGE_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(line)
    except Exception as e:  # pragma: no cover — keep proxy resilient
        # We must NEVER let logger failure propagate to user requests; the
        # callback is best-effort. Write a sentinel to /tmp so a debug pass
        # can recover.
        try:
            with open("/tmp/iter_distribution_logger.errors", "a") as f:
                f.write(f"{int(time.time() * 1000)} {type(e).__name__} {e}\n")
        except Exception:
            pass


def _debug_dump(kwargs: dict, response_obj: Any) -> None:
    """One-shot: dump structure of streaming response_obj to /tmp for debug.

    Triggered only when ITER_DIST_DEBUG=1 in env. Writes once per process.
    """
    if os.environ.get("ITER_DIST_DEBUG") != "1":
        return
    flag = "/tmp/iter_distribution_logger.dumped"
    if os.path.exists(flag):
        return
    try:
        with open("/tmp/iter_distribution_logger.dump.txt", "w") as f:
            f.write(f"response_obj type: {type(response_obj).__name__}\n")
            f.write(f"response_obj attrs: {[a for a in dir(response_obj) if not a.startswith('_')][:40]}\n")
            f.write(f"response_obj _hidden_params: {getattr(response_obj, '_hidden_params', None)}\n")
            if isinstance(response_obj, dict):
                f.write(f"response_obj dict keys: {list(response_obj.keys())[:40]}\n")
                if 'timings' in response_obj:
                    f.write(f"  timings: {response_obj['timings']}\n")
            f.write(f"kwargs keys: {list(kwargs.keys())[:60]}\n")
            slo = kwargs.get('standard_logging_object', None)
            if isinstance(slo, dict):
                f.write(f"slo keys: {list(slo.keys())[:60]}\n")
                hp = slo.get('hidden_params')
                f.write(f"slo.hidden_params: {repr(hp)[:1500]}\n")
            aa = kwargs.get('additional_args')
            f.write(f"additional_args: {repr(aa)[:1500]}\n")
            orig = kwargs.get('original_response')
            f.write(f"original_response type: {type(orig).__name__}\n")
            f.write(f"original_response repr (first 3000 chars): {repr(orig)[:3000]}\n")
            csr = kwargs.get('complete_streaming_response')
            f.write(f"complete_streaming_response type: {type(csr).__name__}\n")
            if csr is not None:
                f.write(f"complete_streaming_response _hidden_params: {getattr(csr, '_hidden_params', None)}\n")
                if hasattr(csr, 'model_dump'):
                    try:
                        d = csr.model_dump()
                        f.write(f"complete_streaming_response keys: {list(d.keys())[:30]}\n")
                        if 'timings' in d:
                            f.write(f"  csr.timings: {d['timings']}\n")
                    except Exception as e:
                        f.write(f"  model_dump fail: {e}\n")
            acsr = kwargs.get('async_complete_streaming_response')
            f.write(f"async_complete_streaming_response type: {type(acsr).__name__}\n")
            if acsr is not None and hasattr(acsr, '_hidden_params'):
                f.write(f"async_complete_streaming_response _hidden_params: {getattr(acsr, '_hidden_params', None)}\n")
        with open(flag, "w") as f:
            f.write("dumped")
    except Exception:
        pass


def _build_record(
    kwargs: dict, response_obj: Any, start_time: Any, end_time: Any
) -> dict:
    _debug_dump(kwargs, response_obj)
    request_started_ms = _to_ms(start_time) or int(time.time() * 1000)
    request_finished_ms = _to_ms(end_time) or int(time.time() * 1000)
    model_elapsed_ms = max(0, request_finished_ms - request_started_ms)

    usage = _extract_usage(response_obj)
    timings = _extract_server_timings(kwargs, response_obj)
    stop_reason = _extract_stop_reason(response_obj)

    # `model` carries the user-facing alias (e.g., "claw"). `model_id_upstream`
    # is the openai/* or ollama_chat/* underlying route.
    model = kwargs.get("model")
    litellm_params = kwargs.get("litellm_params", {}) or {}
    api_base = (
        kwargs.get("api_base")
        or litellm_params.get("api_base")
        or _safe_get(kwargs, "litellm_params", "api_base")
    )

    record = {
        "schema_version": _SCHEMA_VERSION,
        "bridge_request_seq": _next_seq(),
        "request_started_ms": request_started_ms,
        "request_finished_ms": request_finished_ms,
        "model_elapsed_ms": model_elapsed_ms,
        "model": model,
        "api_base": api_base,
        "stop_reason": stop_reason,
        "stream_aborted": False,
        **usage,
        **timings,
    }
    return record


class IterDistributionLogger(CustomLogger):
    """Append one JSONL record per successful request to /runtime/_bridge.jsonl."""

    def log_success_event(self, kwargs, response_obj, start_time, end_time):
        try:
            record = _build_record(kwargs, response_obj, start_time, end_time)
            _write_record(record)
        except Exception:
            pass

    async def async_log_success_event(
        self, kwargs, response_obj, start_time, end_time
    ):
        try:
            record = _build_record(kwargs, response_obj, start_time, end_time)
            _write_record(record)
        except Exception:
            pass

    def log_failure_event(self, kwargs, response_obj, start_time, end_time):
        try:
            record = _build_record(kwargs, response_obj, start_time, end_time)
            record["stream_aborted"] = True
            _write_record(record)
        except Exception:
            pass

    async def async_log_failure_event(
        self, kwargs, response_obj, start_time, end_time
    ):
        try:
            record = _build_record(kwargs, response_obj, start_time, end_time)
            record["stream_aborted"] = True
            _write_record(record)
        except Exception:
            pass


# Module-level instance referenced from litellm-config.yaml.
iter_distribution_callback = IterDistributionLogger()
