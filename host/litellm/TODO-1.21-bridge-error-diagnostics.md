# TODO — Bridge error diagnostics (Sprint 1.21 → Sprint 1.5/2 + usability-harness)

**Author:** Sprint 1.21 difficulty-pack work (operator + Claude Opus 4.7)
**Created:** 2026-05-03
**Owner / consumer:** Sprint 1.5/2 + usability-harness work (per user direction)
**Status:** open; not blocking 1.21, but blocking publishable Sprint 2 confirmatory at N=60

---

## TL;DR

Across cycles 1, 2, and 3 of the Sprint 1.21 difficulty-pack screening, the litellm bridge at `host/litellm/` produced two distinct anomaly classes that materially confound tier-eval results. **Neither is yet diagnosed at the bridge level.** This memo catalogs the failure modes, quantifies their rate, lists concrete reproductions (run_ids), and routes the work to whichever sprint takes the bridge next.

| Anomaly | Severity | c3 rate | Treatment |
|---|---|---|---|
| `orphan_transcript_record` | telemetry-only (runs complete fine) | **51/54 rows = 94%** | post-hoc filter at the registry-reader layer is fine for now; investigate root cause when bridge work reopens |
| `stream_aborted_mid_run+count_mismatch` + null timings | runs killed by claw timeout, but model never had a chance | **3/54 rows = 5.5%** | exclude from pass-rate calcs; investigate at bridge level |
| Spurious `Context size has been exceeded` 500 (c1 only) | runs killed; misleading 5xx wrapper around llama-server context error | c1: 3/36, none in c3 | suppress / fix at bridge — claw can't parse the malformed JSON |

---

## Anomaly 1 — `orphan_transcript_record` (universal, telemetry-only)

### What it is

Every `host/test/.claw-runtime/<run_id>/run_summary.json` writes `join_status: "orphan_transcript_record"` with `timing_caveats: ["join_status_orphan_transcript_record", "all_iterations_streaming_no_decode_split: server_prompt_eval_ms and server_decode_ms unavailable per iteration; only server_total_ms (LiteLLM-observed upstream wallclock) populated."]`. Per-iteration rows in `iterations.jsonl` show `request_started_ms: null`, `request_finished_ms: null`, `model_elapsed_ms: null`. Wallclock and token counts ARE populated; only the per-iter timing breakdown is missing.

### Why we think it's benign

- `terminal_status` and `passed` are correct on these rows.
- `iter_count`, `total_input_tokens`, `total_output_tokens` are correct.
- The model produces the right answers; the verifier validates correctness.
- "Orphan" appears to mean: the registry's transcript-record-id-chain doesn't link iter N to iter N-1 in a way the join logic recognizes. Likely the bridge generates fresh transcript IDs per request rather than threading a single conversation ID, or the SSE stream chunks aren't being correlated by the harness.

### Why it's still a problem

- Per-iteration timing (`server_decode_ms`, `server_prompt_eval_ms`) is permanently `null`. We cannot answer questions like "did the model spend more decode time on test X than test Y?" or "at what iter does decode latency tick up?" — the data isn't there to answer.
- The c1 + c2 + c3 reads of "empty trace" and "1-iter orphan" failures conflated two things: (a) the universal orphan flag (always present), and (b) the rare cases where iter_count = 0 or 1 because the model genuinely emitted no parsed tool call before claw died on a parse error. (a) is a bridge-telemetry bug; (b) is a real model-behavior signal masked by the bridge bug.

### Concrete reproductions (c3 — pick any; all 54 exhibit it)

- `host/test/.claw-runtime/7b13b047-8dba-4964-94d0-8f7851d01e41/` — book-store t16 rep1
- `host/test/.claw-runtime/50e35139-e212-48ff-847b-afdf75c9e371/` — cascade-eight t16 rep1
- `host/test/.claw-runtime/aa6fe58a-7feb-4fbf-aef7-c5b6ff2e454b/` — book-store t32 rep1 (passed cleanly)

### Action for bridge sprint

1. Reproduce: any cycle-3 run will exhibit it. Open `iterations.jsonl` and `run_summary.json` for any run_id; verify all `*_ms` fields are null.
2. Trace from the bridge side: the SSE / streaming path in `host/litellm/patches/` — likely `streaming_iterator.py` is the suspect. Possibly `host/litellm/callbacks/`.
3. Likely root cause hypothesis: the harness's transcript-join logic (in `host/test/lib/registry.js` or `lib/run_row.js`) expects per-request bridge-side IDs that get threaded across iterations. The bridge isn't emitting them in a form the harness recognizes.
4. Fix could land at either layer (bridge emits stable IDs, OR harness-side logic accepts the bridge's actual format). Cheaper at the harness layer if the bridge format is stable.

---

## Anomaly 2 — `stream_aborted_mid_run+count_mismatch` (genuine transient, ~5.5%)

### What it is

A subset of runs where claw eventually hits its 285s timeout (`exit=null`, `terminal_status: timeout`) AND the run wallclock vastly exceeds the timeout budget (`run_elapsed_ms` 700-1250 seconds vs 285s timeout). Per-iter `request_started_ms` is null on every iter. The bridge stream got aborted mid-flight; claw never received the stream-end event; claw eventually timed out from above.

### Why this matters

These runs LOOK like model failures (terminal_status = timeout) but the model never had a fair chance — the bridge dropped the stream. Treating these as "model couldn't solve this in 285s" inflates failure rate against a model that was never given a chance to finish. At Sprint 2 confirmatory N=60/cell, ~3-5 spurious failures per cell could shift Wilson CIs by 5-10pp.

### Concrete reproductions (c3 — all 3 cases)

- `host/test/.claw-runtime/eca7672b-2c59-4c68-99cc-545ce0453c28/` — book-store t32 rep2 (719s wallclock, 11 iters, timeout)
- `host/test/.claw-runtime/db9284c2-430e-42c6-8f0a-f2240c86c1ee/` — ini-parser t32 rep2 (1250s wallclock, 14 iters, timeout) — **the worst case; ~21 min hang on a test that normally solves in 15-30s**
- `host/test/.claw-runtime/2a29b5ac-0b4c-4b12-a58c-6342f2bfcc84/` — wordy t32 rep3 (285s wallclock, 3 iters, timeout)

### Action for bridge sprint

1. The 1250s ini-parser case is the cleanest reproduction: a normally-fast test, ran 21 minutes wallclock against a 285s nominal budget, with only 14 iters captured. Something on the bridge side held the SSE stream open without emitting events.
2. Hypothesis: a llama-server hang or a litellm internal retry/fallback that the bridge surfaces as "still streaming" to claw without claw being able to detect the stall. Might be aggravated by sustained chip load (long sweep).
3. Possible fixes:
   - Bridge-side stream watchdog: if no SSE events for >N seconds during a single request, abort the upstream and return a 504 to claw.
   - Pass-through llama-server `keep_alive_ms` health check — kill the upstream connection if llama-server stops emitting tokens.
   - Document expected "no model output for >X seconds = bridge hang" so claw can short-circuit.

---

## Anomaly 3 — Spurious `Context size has been exceeded` 500 (c1 only, not seen in c3)

### What it is

In cycle 1, three test cells (`grade-school.t32` rep2, `ini-parser.t32` rep2, `alphametics.t32` rep1) failed with claw stderr:

```
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama:
  missing field `type` at line 1 column 199;
first 200 chars of body: {"error": {"message":
  "litellm.MidStreamFallbackError: litellm.APIConnectionError:
   APIConnectionError: OpenAIException - Context size has been exceeded.",
  "type": null, "param": null, "code": "500"}}
```

Crucially, the prompts that triggered these errors were ~5700 tokens — far below the 65536 ctx limit. The `Context size has been exceeded` message was upstream-generated but spurious; the actual prompts had ample headroom.

### Why this matters

- The malformed JSON (no `type` field) crashes claw's response parser → claw exits 1 → harness records as `terminal_status: error`.
- The error message is misleading: "Context size has been exceeded" implies a real model-config mismatch, but the prompts were under ctx. Operators waste time investigating a non-issue.
- We did NOT see this in cycle 3, but the lack of repro is not the same as a fix — could be sampler/state/load-dependent.

### Concrete reproductions (c1)

- `host/test/.claw-runtime/cf6c01ff-09c8-405c-a3c7-11c314be7901/` — grade-school t32 (empty_run, 0 iters)
- `host/test/.claw-runtime/6c947190-c1af-4d09-82c7-0dd67350002b/` — ini-parser t32 (empty_run, 0 iters)
- `host/test/.claw-runtime/80b8bb2d-3c58-4b2f-bafc-a5866d8e9af4/` — alphametics t32 (orphan, 1 iter, 5704 input tokens)

Snapshot: `host/test/docs/difficulty-pack/explore/c1/snapshots/{grade-school,ini-parser,alphametics}.t32.jsonl`
Sweep log (full claw stderr): `host/test/logs/OVERNIGHT-SCREEN-explore-c1-20260502-1735.md` lines 281-305

### Action for bridge sprint

1. Reproduce the 500 + malformed JSON. Likely path: load llama-server with a preceding test that does something stateful (forth.t32 285s timeout was the immediate predecessor of the c1 grade-school + ini-parser failures), then send a fresh small prompt — see if the bridge state pollutes the new request.
2. Alternative: inspect litellm's `MidStreamFallbackError` handling. The error wrapping is what produces the `"type": null` JSON that claw can't parse. Either:
   - Fix the upstream malformed-JSON wrapper in litellm so `type` is always populated, OR
   - Have claw tolerate `type: null` (less ideal — patches the symptom).
3. Distinguish "real ctx-overflow 400" (which IS legitimate model behavior at t16 32k under iter-storm — see Sprint 1.21 c3 cycle for examples) from this "spurious 500 ctx-overflow under-budget" case. The 400 path is fine; the 500 path is broken.

---

## Aggregate quantification

| Cycle | Cells | orphan_transcript_record | stream_aborted | spurious 500 | Combined non-OK rate |
|---|---|---|---|---|---|
| c1 | 36 | 36/36 (100%) | unknown (didn't filter) | 3/36 (8.3%) | 100% on telemetry, 8.3% on real failures |
| c2 | 18 | 18/18 (100%) | none observed | 0 | 100% / 0% |
| c3 | 54 | 51/54 (94%) | 3/54 (5.5%) | 0 | 94% / 5.5% |

The orphan flag has been **silently 100% the whole time**. We only noticed a subset of cases because they coincided with 0-iter / 1-iter outcomes that broke pass-rate analysis.

The genuine bridge-level failures (5.5% in c3) are tolerable for screening but should be quantified and either fixed or post-hoc filtered before Sprint 2 confirmatory N=60.

---

## Recommended next moves

1. **Immediate (post-hoc filter, no bridge work):** add a registry-reader filter that excludes rows where `terminal_status = timeout AND join_status = stream_aborted_mid_run+count_mismatch`. Document the exclusion rate in any Sprint 2 matrix output. This is doable at `host/test/lib/` or in `explore-summarize.mjs` without touching the bridge.

2. **Sprint 1.5 / 2 / usability-harness:** investigate orphan_transcript_record and stream_aborted_mid_run at the bridge level. The orphan case is high value (recovers per-iter timing data we currently can't access). The stream_aborted case is medium value (reduces N=60 confound).

3. **Defensive:** add a llama-server stream-stall watchdog at the bridge layer (anomaly 2) — independent of root-cause work. If no SSE event for N seconds, abort upstream + return 504. Cheap insurance.

4. **Verify spurious-500 anomaly stays gone:** if it doesn't recur in c4/c5, deprioritize. If it returns, prioritize because it conflates legitimate ctx-overflow signal with bridge state corruption.

## References

- Sprint 1.21 plan: `host/test/docs/difficulty-pack/PLAN.md`
- c3 summary: `host/test/docs/difficulty-pack/explore/c3/summary.md`
- Bridge component: `host/litellm/` (this dir), `host/test/lib/bridge.js` (claw-side client)
- Snapshot tooling: `host/test/scripts/explore-summarize.mjs`
