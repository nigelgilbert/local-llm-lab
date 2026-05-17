#!/usr/bin/env python3
"""build-run-table.py — normalize per-run sidecars into a single CSV.

Reads every `host/test/.claw-runtime/<run-id>/run_summary.json` plus its
sibling `iterations.jsonl`, derives per-run aggregates, and writes a single
normalized CSV: `host/test/.claw-runtime/iter-distribution-runs.csv`.

This is the source of truth for downstream W2/W3/W4 analysis. Bash is brittle
for JSONL parsing; this script owns it.

Usage:
  build-run-table.py                       # default: scan all runs, write CSV
  build-run-table.py --runtime DIR         # override runtime dir
  build-run-table.py --filter test_id=csv-parser
  build-run-table.py --json                # emit JSON instead of CSV (for aggregate-results.sh)
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import os
import sys
from pathlib import Path
from typing import Any

DEFAULT_RUNTIME = (
    Path(__file__).resolve().parents[3] / "test" / ".claw-runtime"
)

COLUMNS = [
    "run_id",
    "test_id",
    "sampler_id",
    "model_id",
    "passed",
    "terminal_status",
    "censored",
    "join_status",
    "exit_code",
    "wallclock_ms",
    "iter_count",
    "total_input_tokens",
    "total_output_tokens",
    "total_cache_read_input_tokens",
    "total_cache_creation_input_tokens",
    "total_model_elapsed_ms",
    "total_iter_tool_elapsed_ms",
    "total_non_model_gap_ms",
    "non_model_gap_source",
    "total_server_decode_ms",
    "total_server_prompt_eval_ms",
    "total_server_total_ms",
    "max_input_tokens",
    "p50_iter_model_elapsed_ms",
    "p90_iter_model_elapsed_ms",
    "p50_iter_non_model_gap_ms",
    "p90_iter_non_model_gap_ms",
    "tool_call_count",
    "unique_tool_arg_hash_count",
    "repeated_tool_call_count",
    "workspace_changed_count",
    "result_changed_vs_prev_count",
    "no_progress_repeat_count",
    "error_tool_call_count",
    "schema_version",
    "git_sha",
    "ctx",
    "temperature",
    "top_p",
    "top_k",
    "presence_penalty",
    "hardware_instance",
    "timeout_ms",
    "run_started_ms",
    "run_finished_ms",
    "session_id",
    "timing_caveats",
]


def percentile(values: list[float], q: float) -> float | None:
    """Linear-interpolation percentile; returns None on empty input."""
    if not values:
        return None
    s = sorted(values)
    if len(s) == 1:
        return s[0]
    idx = (len(s) - 1) * q
    lo = math.floor(idx)
    hi = math.ceil(idx)
    if lo == hi:
        return s[lo]
    return s[lo] + (s[hi] - s[lo]) * (idx - lo)


def load_iterations(p: Path) -> list[dict]:
    out = []
    if not p.exists():
        return out
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out


def derive_iter_aggs(iters: list[dict]) -> dict:
    model_vals = [
        it["model_elapsed_ms"]
        for it in iters
        if isinstance(it.get("model_elapsed_ms"), (int, float))
    ]
    gap_vals = [
        it["non_model_gap_ms"]
        for it in iters
        if isinstance(it.get("non_model_gap_ms"), (int, float))
    ]
    return {
        "p50_iter_model_elapsed_ms": percentile(model_vals, 0.5),
        "p90_iter_model_elapsed_ms": percentile(model_vals, 0.9),
        "p50_iter_non_model_gap_ms": percentile(gap_vals, 0.5),
        "p90_iter_non_model_gap_ms": percentile(gap_vals, 0.9),
    }


def parse_filter(spec: str) -> tuple[str, str]:
    if "=" not in spec:
        raise ValueError(f"--filter expects key=value, got {spec!r}")
    k, v = spec.split("=", 1)
    return k.strip(), v.strip()


def load_assertion_result(child: Path) -> dict | None:
    """Reads <run_dir>/assertion_result.json if present; the eval-test
    harness writes this after running verify.js so `passed` reflects the
    actual assertion outcome (run_summary.json's own `passed` is null)."""
    path = child / "assertion_result.json"
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def collect_runs(runtime: Path, filters: list[tuple[str, str]]) -> list[dict]:
    runs = []
    for child in runtime.iterdir():
        if not child.is_dir():
            continue
        summary_path = child / "run_summary.json"
        if not summary_path.exists():
            continue
        try:
            summary = json.loads(summary_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        # Filter early to avoid loading iterations for runs we'll discard.
        skip = False
        for k, v in filters:
            sval = summary.get(k)
            if sval is None or str(sval) != v:
                skip = True
                break
        if skip:
            continue

        iters = load_iterations(child / "iterations.jsonl")
        iter_aggs = derive_iter_aggs(iters)
        assertion = load_assertion_result(child)
        passed_value = assertion.get("passed") if assertion else summary.get("passed")

        row = {
            "run_id": summary.get("run_id"),
            "test_id": summary.get("test_id"),
            "sampler_id": summary.get("sampler_id"),
            "model_id": summary.get("model_id"),
            "passed": passed_value,
            "terminal_status": summary.get("terminal_status"),
            "censored": summary.get("censored"),
            "join_status": summary.get("join_status"),
            "exit_code": summary.get("exit_code"),
            "wallclock_ms": summary.get("run_elapsed_ms"),
            "iter_count": summary.get("iter_count"),
            "total_input_tokens": summary.get("total_input_tokens"),
            "total_output_tokens": summary.get("total_output_tokens"),
            "total_cache_read_input_tokens": summary.get("total_cache_read_input_tokens"),
            "total_cache_creation_input_tokens": summary.get("total_cache_creation_input_tokens"),
            "total_model_elapsed_ms": summary.get("total_model_elapsed_ms"),
            "total_iter_tool_elapsed_ms": summary.get("total_iter_tool_elapsed_ms"),
            "total_non_model_gap_ms": summary.get("total_non_model_gap_ms"),
            "non_model_gap_source": summary.get("non_model_gap_source"),
            "total_server_decode_ms": summary.get("total_server_decode_ms"),
            "total_server_prompt_eval_ms": summary.get("total_server_prompt_eval_ms"),
            "total_server_total_ms": summary.get("total_server_total_ms"),
            "max_input_tokens": summary.get("max_input_tokens"),
            "tool_call_count": summary.get("tool_call_count"),
            "unique_tool_arg_hash_count": summary.get("unique_tool_arg_hash_count"),
            "repeated_tool_call_count": summary.get("repeated_tool_call_count"),
            "workspace_changed_count": summary.get("workspace_changed_count"),
            "result_changed_vs_prev_count": summary.get("result_changed_vs_prev_count"),
            "no_progress_repeat_count": summary.get("no_progress_repeat_count"),
            "error_tool_call_count": summary.get("error_tool_call_count"),
            "schema_version": summary.get("schema_version"),
            "git_sha": summary.get("git_sha"),
            "ctx": summary.get("ctx"),
            "temperature": summary.get("temperature"),
            "top_p": summary.get("top_p"),
            "top_k": summary.get("top_k"),
            "presence_penalty": summary.get("presence_penalty"),
            "hardware_instance": summary.get("hardware_instance"),
            "timeout_ms": summary.get("timeout_ms"),
            "run_started_ms": summary.get("run_started_ms"),
            "run_finished_ms": summary.get("run_finished_ms"),
            "session_id": summary.get("session_id"),
            "timing_caveats": ";".join(summary.get("timing_caveats") or []),
            **iter_aggs,
        }
        runs.append(row)

    runs.sort(key=lambda r: (r.get("run_started_ms") or 0))
    return runs


def write_csv(runs: list[dict], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS)
        writer.writeheader()
        for row in runs:
            writer.writerow({k: row.get(k) for k in COLUMNS})


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--runtime",
        type=Path,
        default=DEFAULT_RUNTIME,
        help="root .claw-runtime directory (default: %(default)s)",
    )
    p.add_argument(
        "--filter",
        action="append",
        default=[],
        metavar="key=value",
        help="repeatable; restrict to runs whose summary key matches value",
    )
    p.add_argument(
        "--out",
        type=Path,
        default=None,
        help="CSV output path (default: <runtime>/iter-distribution-runs.csv)",
    )
    p.add_argument(
        "--json",
        action="store_true",
        help="emit JSON to stdout instead of writing CSV",
    )
    args = p.parse_args()

    runtime: Path = args.runtime
    if not runtime.exists():
        print(
            f"build-run-table.py: runtime dir not found: {runtime}",
            file=sys.stderr,
        )
        return 2

    filters = [parse_filter(s) for s in args.filter]
    runs = collect_runs(runtime, filters)

    if args.json:
        json.dump(runs, sys.stdout, indent=2, default=str)
        sys.stdout.write("\n")
        return 0

    out_path = args.out or (runtime / "iter-distribution-runs.csv")
    write_csv(runs, out_path)
    print(f"wrote {len(runs)} rows → {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
