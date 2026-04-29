# TODO — Iteration-Distribution Characterization (pre-v2 prerequisite)

*Status: planned, not started. Author: director + planning-agent synthesis, 2026-04-28. To be processed and digested before any further deep tuning runs.*

## One-line summary

Characterize the iteration-count distribution of agent loops on the noisy tier-64 tests so we know whether wallclock variance is sampler-sensitive (tuneable) or iteration-path-driven (needs different levers). Block deep tuning runs (v2) on the answer.

## Why this is a prerequisite, not a parallel work item

B3 (sampler grid, 8 cells × 5 tests × n=3, ctx=65536, completed 2026-04-28) produced a negative result: no sampler cell is dramatically worse on capability, no cell is clearly better than the current production sampler (Cell 6: temp=0.7, presence_penalty=1.5), and the within-cell n is below the variance floor that A2 already characterized (lru-cache 2.8× spread at fixed sampler, n=7).

The single most informative data point in B3 is **Cell 2 iter 2 csv-parser at 170s**. Cell 2 is the most deterministic sampler in the grid (temp=0.3, presence_penalty=1.5). If sampling were the dominant variance source, that cell should be the tightest. It produced the largest single outlier instead. Combined with A2's lru-cache spread at fixed sampler, the **working hypothesis** is:

> Wallclock variance on these tests is dominated by iteration path length — how many agent iterations claw runs — rather than per-token sampling decisions. W1–W3 are designed to confirm or falsify this. The 170s csv-parser run could equally be explained by high iteration count, slow tool execution, infrastructure latency, slow model decode, or timeout-adjacent behavior; the proposed telemetry is what distinguishes those cases.

If the hypothesis is correct, every downstream sampler-tuning effort is chasing variance with the wrong instrument, and v2 work that depends on sampler decisions inherits that error. The instrumentation and characterization proposed below is what either confirms or falsifies it. Until it lands, sampler-tuning tickets should be paused.

## Hypothesis to test

**H1 (primary):** Wallclock variance on `csv-parser`, `lru-cache`, and `expression-eval` is primarily driven by the number of claw agent iterations per run, not by per-token sampling stochasticity. Iteration-count distribution is bimodal or long-tailed; sampler temperature does not strongly modulate it.

**H2 (corollary):** Long-tail iteration runs cluster into a small number of identifiable failure-mode classes. Each class has a distinct lever; sampler tuning is the right lever for at most one of them, possibly none. *(The concrete taxonomy and acceptance criteria are specified in §"Implementation plan v2" → W4 below.)*

> **The v1 falsification criteria, workstream specs (§W1–§W5), and sequencing diagram have been removed from this document — they were superseded twice by reviewer rounds and an implementation agent reading top-to-bottom would have been forced to reconcile contradictory instructions. The executable plan begins at §"Implementation plan v2" below; H1/H2 confirmation criteria, the analysis battery, the W4 taxonomy, and the sequencing gates all live there. Removed content is recoverable from `git log -- host/llama-server/docs/TODO-ITERATION-DISTRIBUTION-TEST.md` if design rationale is needed.*

## Estimated effort (revised post-reviewer round 2)

- Step 0.5 source audit (claw header injection, bridge lifetime, `CLAW_HOME`, tool-timestamp availability): 0.5–1h.
- W1 implementation: 0.5–1 engineering day.
- W1 validation tests (synthetic + real run + induced-timeout + stream-abort): 0.5 day.
- W2/W3 sweep driver + analysis scripts: 0.5–1 day.
- Sweep wallclock: ~6h M5.
- W4 packet build + classification + adjudication: 0.5–1 day.
- W5 ticket writeup: 1–2h.

Total: ~2.5–4 calendar days. The increase from the v1 ~1.5-day estimate is not slippage — it reflects the v2 plan producing data that can actually support the downstream decisions (split timing, run metadata, randomization, joint validation, packet enrichment).

## Decision rules (for the architect agent and the planner)

1. **Do not start W2/W3 before W1 is committed and verified.** Running the experiment without per-iteration traces wastes M5 time on data that can't answer the hypothesis.
2. **Do not promote any sampler change based on this work.** This work characterizes; it does not promote. Sampler decisions wait for a properly-resolved grid (or are retired as a category, depending on W3 outcome).
3. **Do not start v2 deep tuning until W5 produces lever assignments.** That's the prerequisite framing this whole document encodes.
4. **The director reviews W4's classification taxonomy manually before W5 proceeds.** The autonomous loop can run W1, W2, W3, and the data collection portion of W4. The decision "is this taxonomy real or force-fit" needs a human in the loop.
5. **The H1 verdict is multi-outcome (per v2 W2 analysis): supported / mixed-or-unresolved / not supported.** Do not force a binary verdict. If "not supported" with sampler arm showing differential effect, abandon this work item and run a properly-resolved sampler grid. If "mixed-or-unresolved", proceed to trace inspection (W4) before deciding between sampler grid and lever tickets — n=20 may genuinely lack power to resolve. Document negative or mixed outcomes either way.

## What this produces beyond unblocking v2

If W4 yields a clean failure-mode taxonomy with classified long-tail runs, that's a citeable research artifact: there are few widely shared, trace-level characterizations of iteration-count distributions in agentic coding loops. Aggregate pass-rate benchmarks hide this layer entirely. Worth holding the writeup to a standard that lets it be shared externally — a 4–6 page methods note plus the trace dataset would be a real contribution to agentic-coding eval methodology. (External writeup is deferred per director decision; the v1 prior-art scan covered AI21's "duplicity" framing, Anthropic's Sonnet 3.7 trajectory note, arXiv 2511.00197, and MAST/arXiv 2503.13657 — the methods note must include and cite this scan when written.)

## Out of scope

- Sampler tuning beyond the W3 negative-result generator. If sampler matters more than expected, it gets its own follow-up ticket; this work item does not promote.
- Cross-tier work (tier-16, tier-32). This is tier-64 only. Lower-tier iteration distributions are a separate question, sequenced after v2 baselines.
- Model swap or grammar changes. The work characterizes the current rig, not changes to it.
- `mini-vm` and `multi-bug-decoy`. mini-vm is a known ceiling; multi-bug-decoy is low-variance. Neither is in the population of interest for this work.

## Open questions to flag for director review when work lands

- Did the iteration-count distribution match the expected bimodal-or-long-tailed shape, or something else?
- Is there a sampler effect on iteration count (separate from sampler effect on per-token distribution)?
- Are the six candidate failure-mode classes (A–F) the right taxonomy, or did the data force a different cut?
- For each class, is the proposed lever the best lever, or is there a better one not on the candidate list?
- Does the W5 ticket list cleanly map to v2 work, or does it expose new prerequisites?

---

## Implementation plan v2 (revised 2026-04-28, post-reviewer feedback)

*Author: planning-agent synthesis after pre-W1 scoping and reviewer round 1. v2 supersedes the v1 implementation plan. Reviewer round 1 (two senior SWE / ML reviewers) flagged ten P0-class corrections (telemetry semantics, run metadata, randomization, run-id propagation, bind-mount design, join validation, censoring, W4 selection rule), eight P1 corrections (causal-claim softening, expanded H1 metric battery, equivalence-based W3, tail-aware sampler comparison, expanded W4 taxonomy, richer W4 packets, Python normalized-table builder, kappa-CI / confusion-matrix reporting), and six P2 cleanups (terminology, M5 definition, output locations, schema appendix, softened external claim, privacy). All accepted. The original §W1–§W5 sections above retain the high-level framing; this section is the canonical execution plan where it conflicts with them.*

### Pre-W1 scoping — done

Confirmed transcript format on disk by inspecting [`../../../client/claw-code/`](../../../client/claw-code/) Dockerfile (claw-code is built from `github.com/ultraworkers/claw-code` in `rust/`) and a real session at `claw-code-test/.claw/sessions/990e10b3394addcf/session-*.jsonl` from a manual Apr-27 run.

Format is **structured JSONL**, one record per line, discriminated by `type`:
- `session_meta` — header with `session_id`, `model`, `workspace_root`, `created_at_ms`
- `prompt_history` — user prompt with `timestamp_ms`
- `message` — model turn or tool turn, with `role` ∈ {`assistant`, `tool`, `user`} and `blocks[]` of typed records (`text`, `tool_use`, `tool_result`). Assistant messages carry a `usage` object: `input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`. `tool_use` blocks carry `id`, `name`, `input`. `tool_result` blocks carry `is_error`, `output`, `tool_use_id`.

**Missing from on-disk format:** per-assistant-turn `elapsed_ms` and `stop_reason`. Both come from the bridge layer (it sees every `/v1/messages` call wall-clock).

**Canonical path terminology:** `.claw/sessions/<workspace-hash>/session-*.jsonl`. Earlier drafts alternated "transcripts" and "sessions"; v2 standardizes on **sessions** since that matches the on-disk layout. Drop "transcripts" except where quoting upstream documentation.

### Step 0.5 — Pre-implementation verification (gates W1)

Reviewer P0.4 / P0.5 flagged unverified assumptions in the v1 plan. Before W1 implementation, answer and record in this doc (or a short scoping note):

- **Header injection:** does claw-code's HTTP client support custom request headers (e.g., a CLI flag or env var that injects `X-Claw-Run-Id`)? Read `client/claw-code/rust/` source. If yes, document the injection point. If no, choose a fallback:
  - (a) bridge mints `run_id` on first request lacking one, writes it to `/workspace/.claw-runtime/_pending_run_id`, and `runClaw()` reads it back; or
  - (b) wrap claw with a thin shim that mints `run_id` and forwards.
- **Bridge lifetime:** is the bridge a long-lived process across runs (likely yes, via docker-compose service) or per-run? If long-lived: confirm `runClaw()` invocations are sequential within a single sweep driver and document. The bridge maintains per-`run_id` state (counters, log file handles); reject requests with no `run_id` outside an explicit dev mode.
- **Concurrency policy:** wallclock is the response variable, so concurrency would confound. Default is sequential execution; record it in the experiment manifest.
- **`CLAW_HOME` / session path override:** does claw honor an env var that redirects its session emit directory? If yes, point it at `/workspace/.claw-runtime/<run-id>/`. If no, post-run `mv` from `/workspace/.claw/` into `/workspace/.claw-runtime/<run-id>/`.
- **Tool-timestamp availability (gates honest timing semantics):** does claw record actual tool start/finish timestamps (per `tool_use` block, in the session JSONL or elsewhere)? Three possible outcomes — record which applies before W1 schema is finalized:
  - (a) **Genuine tool timestamps available** → schema uses `tool_started_ms` / `tool_finished_ms` / `tool_elapsed_ms` per tool call.
  - (b) **No tool timestamps; only inter-request gap inferable** → schema uses `non_model_gap_ms` with `non_model_gap_source: "next_request_start_minus_current_request_finish"` and `tool_elapsed_ms: null`. Class E and the wallclock-decomposition analysis must consume `non_model_gap_ms`, not "tool time."
  - (c) **Mixed** (some tool kinds report, others don't) → per-call `elapsed_ms: null` for the unreported kinds; document.
- **Server-side timing exposure:** does llama-server expose `prompt_eval_ms` / `decode_ms` / `tokens_per_second` / `queue_ms` per request (timings field on the `/v1/messages` response, or accessible via a sibling endpoint)? If yes, capture into bridge log; this lets us decompose `model_elapsed_ms` into prompt vs decode vs queue. If no, `model_elapsed_ms` must be interpreted as bridge-observed model request time, not pure decode time, and analysis prose must say so.

This step is ~30–60 min of source reading and is the gate on Step 1.0.

#### Step 0.5 — Findings (recorded 2026-04-28, post-implementation-start)

Audit run against `/private/tmp/cyberia-ab/claw-code/` (commit `6db68a2`, the upstream `main` ref the Dockerfile clones) and a live llama-server probe at port 11435.

| Question | Answer | Citation |
|---|---|---|
| Header injection | **No.** claw's reqwest client (`crates/api/src/http_client.rs`) only supports proxy config; per-request headers in `crates/api/src/providers/anthropic.rs` are limited to auth + content-type + the static `request_profile.header_pairs()` list. No CLI flag, no env var that prepends arbitrary headers. Forking claw to add this is out of scope for this work item. | `http_client.rs:63-113`, `providers/anthropic.rs:481-485` |
| `CLAW_HOME` / data-dir override | **No.** `SessionStore::from_cwd()` is the only constructor used by the CLI binary; layout is hardcoded to `<cwd>/.claw/sessions/<workspace_hash>/`. The `from_data_dir(data_dir, workspace_root)` constructor exists but is unwired (`grep` for `data_dir` and `CLAW_DATA_DIR` in `crates/rusty-claude-cli/src` returned zero matches). `CLAW_CONFIG_HOME` exists for *config* only. | `crates/runtime/src/session_control.rs:32-72`, `crates/runtime/src/config.rs:561` |
| Tool-timestamp availability | **Outcome (b).** `ContentBlock::ToolUse { id, name, input }` and `ContentBlock::ToolResult { tool_use_id, tool_name, output, is_error }` carry no timestamps; `ConversationMessage { role, blocks, usage }` has no per-message timestamp either; only the session header records `created_at_ms` / `updated_at_ms`. Per-call and per-iteration wallclock must come from the bridge layer. | `crates/runtime/src/session.rs:27-52, 671-728` |
| Server-side timing exposure | **Partial.** A direct probe of `http://127.0.0.1:11435/v1/chat/completions` returned a `timings` object: `prompt_ms`, `predicted_ms`, `predicted_per_token_ms`, `predicted_per_second`, `prompt_n`, `predicted_n`, `cache_n`. No `queue_ms` (llama-server processes one request at a time, so queue depth is the harness's responsibility). **However**, LiteLLM's Anthropic-shape translation (`/v1/messages`) strips the `timings` field — verified by probing the bridge and observing only `usage` in the Anthropic response. Capture must happen inside LiteLLM (custom callback) before translation, or via a sidecar proxy. |  llama.cpp probe + LiteLLM probe |
| Bridge lifetime | **Long-lived containerized service.** `host/litellm/docker-compose.yml` runs `ghcr.io/berriai/litellm:main-stable` with `restart: unless-stopped`, `--num_workers 1`, `--max_requests_before_restart 1000`. State is per-process, persisting across `runClaw()` invocations. | `host/litellm/docker-compose.yml:1-44` |
| Concurrency policy | LiteLLM is single-worker (`--num_workers 1`). Sequential `runClaw()` is enforced by the sweep driver. Recorded in `_sweep-manifest.json`. | — |

#### Step 0.5 — Architectural correction for W1 (resolves audit constraints)

The v2 plan referenced `host/test/lib/bridge.js` as the bridge to instrument. **That file is the wrap-rate test-suite SDK shim, not the production bridge** — the production bridge is the LiteLLM container. The doc's Step 1.1 ("bridge appends one JSONL record per `/v1/messages` request") is therefore relocated to a LiteLLM custom-callback module rather than a Node.js edit.

Revised W1 architecture:

1. **`host/litellm/callbacks/iter_distribution_logger.py`** — LiteLLM custom-callback module. On every successful `/v1/messages` request, appends a JSONL record to `/runtime/_bridge.jsonl` (a host-mounted volume). Captures `request_started_ms`, `request_finished_ms`, `model_elapsed_ms` (bridge-observed), token counts, and — when extractable from `kwargs["response_obj"]._hidden_params` or the raw upstream response — `server_prompt_ms` and `server_predicted_ms`. Wired in `litellm-config.yaml` via `litellm_settings.callbacks`.
2. **`host/test/.claw-runtime/`** — host directory, gitignored. Mounted into the LiteLLM container as `/runtime` and into the test container as `/workspace/.claw-runtime`. Single source of truth across both.
3. **`runClaw()` in `host/test/lib/claw.js`** — mints `run_id` (UUID v4), records `run_started_ms` immediately before `spawn()` and `run_finished_ms` immediately after process close. After spawn completes:
   - Moves `/workspace/.claw/sessions/<workspace_hash>/session-*.jsonl` into `/workspace/.claw-runtime/<run-id>/sessions/<workspace_hash>/` (no `CLAW_HOME` override available — post-run mv is the fallback).
   - Slices `/workspace/.claw-runtime/_bridge.jsonl` by `[run_started_ms, run_finished_ms]` into `/workspace/.claw-runtime/<run-id>/bridge.iterations.jsonl`. Time-window correlation is sound under the sequential-execution invariant.
   - Joins session and bridge records by ordinal (assistant-message N ↔ bridge-request N) and emits `iterations.jsonl` and `run_summary.json` per the original v2 schema, with `tool_*_ms` fields null (outcome b) and `non_model_gap_ms` populated where computable.
4. **No header injection.** `run_id` is a harness-side identifier; the bridge has no awareness of it. The bridge_iterations.jsonl is purely time-correlated to the run.

Rationale: this preserves every analysis-relevant field in the v2 schema except per-call tool timing (which Step 0.5 outcome (b) had already declared null) and per-iteration `server_queue_ms` (no llama.cpp field to sample). All H1 / H2 / W3 / W4 acceptance criteria remain executable as written.

### Step 1.0 — Bind-mount design (revised P0.5)

The v1 plan used per-run `host/test/.claw-runtime/<run-id>/` mounted to `/workspace/.claw/`. Compose can't dynamically remount paths per invocation under a long-lived service, so v1 wouldn't have worked.

**Revised:** static mount `host/test/.claw-runtime/` → `/workspace/.claw-runtime/`. Each run writes under `/workspace/.claw-runtime/<run-id>/`. Either (a) `CLAW_HOME=/workspace/.claw-runtime/<run-id>` if claw honors it (Step 0.5 verifies), or (b) post-run move from `/workspace/.claw/` to `/workspace/.claw-runtime/<run-id>/`.

Add `host/test/.claw-runtime/` to `host/test/.gitignore`.

### W1 — implementation plan (v2)

**Goal:** for each `runClaw()` invocation, emit two artifacts to `host/test/.claw-runtime/<run-id>/`:
1. `iterations.jsonl` — one record per agent iteration, with split timing fields, full `tool_calls[]` array, and join-validation metadata.
2. `run_summary.json` — a single record with run-level metadata sufficient for reproducibility and censoring-aware analysis.

#### Step 1.1 — Bridge-side per-request log (revised P0.1, P0.2)

[host/test/lib/bridge.js](../../../host/test/lib/bridge.js) appends one JSONL record per `/v1/messages` request to `host/test/.claw-runtime/<run-id>/bridge.iterations.jsonl`. Schema:

```json
{
  "schema_version": 1,
  "run_id": "...",
  "bridge_request_seq": 4,
  "request_started_ms": 1777390000000,
  "request_finished_ms": 1777390001234,
  "model_elapsed_ms": 1234,
  "input_tokens": 12000,
  "output_tokens": 800,
  "cache_creation_input_tokens": 0,
  "cache_read_input_tokens": 6000,
  "stop_reason": "tool_call",
  "stream_aborted": false,
  "n_request": 4,
  "server_prompt_eval_ms": null,
  "server_decode_ms": null,
  "server_total_ms": null,
  "server_tokens_per_second": null,
  "server_queue_ms": null
}
```

**Critical naming:** `model_elapsed_ms` is *bridge-observed model request duration* — it includes prompt eval + decode + any server queueing as seen at the HTTP client. It is **not** iteration wallclock and **not** pure decode time. If Step 0.5 confirms llama-server exposes per-request timings, the `server_*_ms` fields are populated and downstream analysis can decompose; if not, those fields stay null and any "decode time" claim must be qualified.

`run_id` propagation: per Step 0.5 outcome. Default plan is `runClaw()` mints UUID, sets `CLAW_RUN_ID` env, harness injects `X-Claw-Run-Id` header, bridge strips before forwarding to llama-server. Bridge keys log files by `run_id`; rejects requests with no `run_id` in production mode.

Verification: hit the bridge with two sequential `runClaw()` calls; confirm two distinct `bridge.iterations.jsonl` files with monotonic `bridge_request_seq` values, no cross-contamination.

#### Step 1.2 — Claw-side join + sidecar emit (revised P0.1, P0.2, P0.3, P0.6)

[host/test/lib/claw.js](../../../host/test/lib/claw.js) `runClaw()`:

1. Generate `run_id` (UUID v4) before `spawn()`. Set `CLAW_RUN_ID` env. Set `CLAW_HOME` if applicable (Step 0.5).
2. Record `run_started_ms` immediately before `spawn()`, `run_finished_ms` immediately after process exit.
3. After spawn completion, read:
   - Session file(s) under `/workspace/.claw-runtime/<run-id>/sessions/<workspace-hash>/session-*.jsonl` (or post-run-moved equivalent).
   - `bridge.iterations.jsonl` from the same `<run-id>` directory.
4. Walk session, extracting AssistantTurn[k] (each `type=message, role=assistant`) and the corresponding ToolTurn record(s) that follow (`type=message, role=tool`, joined to AssistantTurn by `tool_use_id`).
5. **Compute timing fields (honest naming per Step 0.5 outcome):**
   - `model_elapsed_ms`: from bridge.
   - **If Step 0.5 outcome (a) — genuine tool timestamps available:** populate `tool_started_ms` / `tool_finished_ms` / `tool_elapsed_ms` per tool call (inside `tool_calls[]`, see schema below). Iteration-level `iter_tool_elapsed_ms` = sum of per-call `elapsed_ms`. `non_model_gap_ms` may still be reported as a sanity check (it should be ≥ `iter_tool_elapsed_ms`; the difference is harness/transport overhead).
   - **If Step 0.5 outcome (b) — only inter-request gap inferable:** set per-call `tool_started_ms` / `tool_finished_ms` / `tool_elapsed_ms` to null. At iteration level, populate `non_model_gap_ms` = `iter[k+1].request_started_ms − iter[k].request_finished_ms` (or `run_finished_ms − iter[last].request_finished_ms` for the last iter). Set `non_model_gap_source: "next_request_start_minus_current_request_finish"`. **The gap conflates actual tool runtime, claw bookkeeping, transcript writing, bridge/request setup, container/filesystem overhead, scheduler delay, and any retry/backoff.** Class E and wallclock-decomposition analysis must consume `non_model_gap_ms`, not assume it equals tool time.
   - **If Step 0.5 outcome (c) — mixed:** per-call timing populated where available; iteration-level `iter_tool_elapsed_ms` summed only over reporting calls; `non_model_gap_ms` always reported as fallback.
   - `iteration_elapsed_ms`: `iter[k+1].request_started_ms − iter[k].request_started_ms` (or `run_finished_ms − iter[last].request_started_ms` for the final iteration). Null if cannot compute. Reported regardless of outcome (a)/(b)/(c).
6. **Join validation (P0.6):** check
   - `len(AssistantTurns) == len(bridge_records)`,
   - per-pair `output_tokens` agreement (or document the accounting difference if cache-read tokens cause a known offset),
   - `bridge_request_seq` is strictly monotonic,
   - no `stream_aborted: true` except on the final record,
   - no orphan bridge records (without a matching AssistantTurn) and no orphan AssistantTurns (without a matching bridge record).

   Set `join_status ∈ {ok, count_mismatch, token_mismatch, orphan_bridge_record, orphan_transcript_record, stream_aborted_mid_run}`. **Do not silently exclude malformed runs from the run table** — they may correlate with the long-tail behavior we're studying. Aggregator surfaces them with the status field.

7. **Emit `iterations.jsonl`** — one record per iteration:

   ```json
   {
     "schema_version": 1,
     "run_id": "...",
     "test_id": "csv-parser",
     "sampler_id": "v1-prod",
     "iter": 4,
     "assistant_message_index": 4,
     "bridge_request_seq": 4,
     "join_status": "ok",
     "request_started_ms": 1777390000000,
     "request_finished_ms": 1777390001234,
     "model_elapsed_ms": 1234,
     "iter_tool_elapsed_ms": 500,
     "non_model_gap_ms": 666,
     "non_model_gap_source": "next_request_start_minus_current_request_finish",
     "iteration_elapsed_ms": 1900,
     "server_prompt_eval_ms": null,
     "server_decode_ms": null,
     "server_queue_ms": null,
     "input_tokens": 12000,
     "output_tokens": 800,
     "cache_creation_input_tokens": 0,
     "cache_read_input_tokens": 6000,
     "stop_reason": "tool_call",
     "tool_calls": [
       {
         "id": "toolu_...",
         "name": "run",
         "started_ms": 1777390001400,
         "finished_ms": 1777390001900,
         "elapsed_ms": 500,
         "arg_hash": "sha256:<hex>",
         "arg_summary": { "command": "npm test" },
         "workspace_changed": false,
         "result_hash": "sha256:<hex>",
         "result_changed_vs_previous_same_call": false,
         "result_is_error": true,
         "result_error_class": "syntax_error",
         "result_error_signature": "Cannot use import statement outside a module",
         "exit_code": 1
       }
     ],
     "iteration_status": "continue",
     "run_status": null
   }
   ```

   Notes:
   - **`tool_calls[]` per-call timing (item 3):** `started_ms` / `finished_ms` / `elapsed_ms` populated when Step 0.5 confirms genuine tool timestamps; null otherwise. `iter_tool_elapsed_ms` (iteration-level) is the sum of per-call `elapsed_ms` if all are populated, else null.
   - **Split state-change semantics (item 4 — replaces overloaded `state_changed`):**
     - `workspace_changed`: did this tool call modify the workspace filesystem? `true` for `write` tools that produced a content delta; `false` for reads; for `run` tools, `true` iff the command's stdout/stderr indicates a write (or post-run workspace hash differs), else `false`. Null if unclear.
     - `result_hash`: sha256 of the canonicalized tool result (output text or error message).
     - `result_changed_vs_previous_same_call`: walking back through prior iterations of this run, find the most recent tool call with the same `arg_hash`; compare `result_hash`. `true` if different (the call produced new info); `false` if identical (no progress); null if no prior identical call.
     - `result_error_class` / `result_error_signature`: derived from tool_result block; canonical short excerpt for the signature (first line of stderr, or first error-line of stdout for `run` tools).
   - **Iteration-level `non_model_gap_ms` and `non_model_gap_source` (item 2):** honest naming. If Step 0.5 outcome (a), `non_model_gap_ms` is reported alongside `iter_tool_elapsed_ms` for sanity-check purposes. If outcome (b) or (c), `iter_tool_elapsed_ms` may be null and `non_model_gap_ms` is the only signal — and it conflates tool runtime with harness overhead, container overhead, scheduler delay, etc. Class E and wallclock decomposition consume `non_model_gap_ms` honestly.
   - `iteration_status ∈ {continue, final, aborted}`; `run_status ∈ {done, error, context_overflow, timeout, null}` — only the final iter has non-null `run_status` (P0.3).
   - `run_status` is **not derived solely from transcript shape**: timeout from harness wallclock vs configured timeout; context_overflow from llama-server log signal; error from non-zero exit code with no clean stop reason. The harness/process supervisor is authoritative for timeout and context_overflow.
   - Any of the timing fields may be null if Step 0.5 reveals constraints. Document the null reason explicitly in `run_summary.json` (`timing_caveats` field).

8. **Emit `run_summary.json`** (P0.8) with:

   ```json
   {
     "schema_version": 1,
     "run_id": "...",
     "test_id": "csv-parser",
     "sampler_id": "v1-prod",
     "git_sha": "...",
     "docker_image_digest": "...",
     "model_id": "...",
     "model_digest": "...",
     "llama_server_build": "...",
     "ctx": 65536,
     "temperature": 0.7,
     "top_p": 0.8,
     "top_k": 20,
     "presence_penalty": 1.5,
     "hardware_instance": "M5",
     "concurrency": 1,
     "timeout_ms": 240000,
     "max_iterations": null,
     "run_started_ms": 1777390000000,
     "run_finished_ms": 1777390098765,
     "run_elapsed_ms": 98765,
     "iter_count": 13,
     "total_input_tokens": 140000,
     "total_output_tokens": 8500,
     "total_model_elapsed_ms": 50000,
     "total_iter_tool_elapsed_ms": null,
     "total_non_model_gap_ms": 30000,
     "non_model_gap_source": "next_request_start_minus_current_request_finish",
     "total_server_decode_ms": null,
     "total_server_prompt_eval_ms": null,
     "max_input_tokens": 24000,
     "terminal_status": "done",
     "passed": true,
     "timeout": false,
     "context_overflow": false,
     "exit_code": 0,
     "join_status": "ok",
     "censored": false,
     "timing_caveats": []
   }
   ```

9. Return `{ ..., iterationsPath, runSummaryPath }` from `runClaw()`.

#### Step 1.3 — Run-table builder (new per P1.7)

`host/test/scripts/analysis/build-run-table.py` reads all `host/test/.claw-runtime/*/run_summary.json` and `iterations.jsonl`; emits a normalized CSV `host/test/.claw-runtime/iter-distribution-runs.csv` with columns:

```
run_id, test_id, sampler_id, passed, terminal_status, censored, join_status,
wallclock_ms, iter_count,
total_input_tokens, total_output_tokens,
total_model_elapsed_ms,
total_iter_tool_elapsed_ms, total_non_model_gap_ms, non_model_gap_source,
total_server_decode_ms, total_server_prompt_eval_ms,
max_input_tokens,
p50_iter_model_elapsed_ms, p90_iter_model_elapsed_ms,
p50_iter_non_model_gap_ms, p90_iter_non_model_gap_ms,
tool_call_count, unique_tool_arg_hash_count, repeated_tool_call_count,
workspace_changed_count, result_changed_vs_prev_count,
no_progress_repeat_count, error_tool_call_count
```

`no_progress_repeat_count` = tool calls with `result_changed_vs_previous_same_call: false` — direct count of "did the same call again, got the same answer" events. Class D primary signal.

This is the single source of truth for downstream W2/W3/W4 scripts. Bash is brittle for JSONL parsing; Python with stdlib `json` + `csv` is appropriate.

#### Step 1.4 — Aggregator surface (revised)

[host/test/scripts/aggregate-results.sh](../../../host/test/scripts/aggregate-results.sh) delegates iter-column generation to `build-run-table.py --filter test_id=...` and selects `iter_count`, `iter_p50`, `iter_p90` columns into the existing per-test summary. Bash retains its existing role; Python owns the JSONL parsing.

#### Step 1.5 — Docs sync

Mark P0.3 in [host/test/docs/CLAW-CODE-PROPOSAL.md](../../../host/test/docs/CLAW-CODE-PROPOSAL.md) (lines 49-61) as satisfied by the W1 PR. Cross-reference this TODO from there.

#### Step 1.6 — Verification (Gate A — telemetry validity)

W1 acceptance requires all of:
- **Synthetic transcript test:** hand-craft a fixture with 3 assistant turns and mixed tool calls — at minimum: (a) a `read` call (workspace_changed false, result_changed_vs_previous_same_call null on first occurrence), (b) a `write` call with content delta (workspace_changed true), (c) a `run` call with non-zero exit and an `result_error_signature`, (d) a *repeated* `read` call with the same arg_hash as (a) returning the same result (workspace_changed false, result_changed_vs_previous_same_call false — Class D primary signal). Assert all fields populated as expected.
- **Real csv-parser run:** emit `iterations.jsonl` and `run_summary.json`; assert `join_status: "ok"`, `model_elapsed_ms` non-null, timing fields populated per Step 0.5 outcome contract (a/b/c) with `non_model_gap_source` set, `iter_count` matches assistant-message count, `run_status` set on final iter only.
- **Induced-timeout run:** configure a 5s timeout on a test that normally takes longer. Assert `terminal_status: "timeout"`, `timeout: true`, `censored: true`, `iteration_status: "aborted"` on the final iter.
- **Stream-abort run:** kill the bridge process mid-request. Assert `join_status` flags appropriately (e.g., `stream_aborted_mid_run`), and the run is recorded rather than dropped.
- **Two sequential `runClaw()` calls:** assert two distinct run-id directories with no cross-contamination of bridge records.
- **Timing-naming honesty check:** if Step 0.5 outcome was (b), assert `tool_elapsed_ms` per-call is null on every record; assert `non_model_gap_ms` is non-null and `non_model_gap_source` is set. The run table must not contain a column named anything that implies "tool time" when the source is the inter-request gap.

### W2 + W3 — combined sweep (revised P0.7, P0.8, P0.9)

Driver: `host/test/scripts/run-iter-distribution-sweep.sh`. **Randomized blocked design** (P0.7):

```
For each test in [csv-parser, lru-cache, expression-eval]:
  Generate 40 jobs: 20 × {sampler=v1-prod} ⊎ 20 × {sampler=v3-deterministic}
  Shuffle with seed = first 16 hex chars of SHA256("<git_sha>:<test_id>:2026-04-28")
  Execute sequentially
  Record schedule + seed in <runtime>/_sweep-manifest.json
```

Sequential execution within tests (no concurrency — wallclock is the response variable). Tests run in fixed order; sampler order is shuffled within each test. Recording the seed allows reproduction.

Sampler defs (frozen):
- **v1-prod:** `temp=0.7, presence_penalty=1.5, top_p=0.8, top_k=20`
- **v3-deterministic:** `temp=0.3, presence_penalty=1.5, top_p=0.8, top_k=20`

ctx=65536 fixed. 120 runs total, ~6h M5 wallclock. The sweep manifest captures: `git_sha`, `docker_image_digest`, `model_id`, `model_digest`, `llama_server_build`, `hardware_instance: "M5"`, per-job random order, seeds, sweep start/end timestamps. Manifest is the sweep-level analog of `run_summary.json`.

**Censoring policy (P0.9):** runs that timeout or hit context overflow have `censored: true` in `run_summary.json`. The run table includes them. Analysis scripts must handle censoring explicitly:
- Default rule: exclude censored runs from regression fits; report counts in a separate "censored runs" subsection of W2/W3 outputs.
- Per-test censored counts (`completed | timeout | context_overflow | harness_error`) reported alongside descriptive statistics.

### W2 analysis (revised P1.2)

`host/test/scripts/analysis/iter-distribution.py` reads the normalized run table; loads v1-prod runs only.

**Per test (and pooled with `test_id` fixed effects):**

1. **Distribution shape:**
   - Iteration-count histogram (1–20 bins).
   - Median, IQR, p75, p90, max iter_count.
   - **Tail-shape ratios** (item 5 — IQR alone misses tails): `p90/median`, `max/median`, top-quartile share of total iterations (sum of iter_count for top-25% of runs ÷ sum of all iter_count).
   - Wallclock median, IQR, p75, p90, max.
2. **Censoring:** counts of completed | timeout | context_overflow | harness_error per cell.
3. **Wallclock decomposition (item 6 — replaces tautological `wallclock~model+gap` regression):**
   - Per-run `model_share = total_model_elapsed_ms / wallclock_ms`, `non_model_gap_share = total_non_model_gap_ms / wallclock_ms`, `unaccounted_share = 1 − model_share − non_model_gap_share`.
   - Report median per test of: `model_share`, `non_model_gap_share`, `unaccounted_share` (the residual is harness/spawn/aggregator overhead — flag if median > 5%).
   - Then model the components separately:
     - `total_model_elapsed_ms ~ iter_count + total_output_tokens + max_input_tokens`
     - `total_non_model_gap_ms ~ iter_count + run_tool_count + test_id`
   - This decomposition answers whether long runs are caused by more turns, larger prompts, slow decode, or non-model gap — without the tautology of regressing wallclock on its own arithmetic components.
4. **Association statistics (per test, then pooled with fixed effects):**
   - **Spearman ρ:** iter_count×wallclock, output_tokens×wallclock, input_tokens×wallclock.
   - **Univariate R²:** `wallclock~iter_count`; `wallclock~output_tokens`; `wallclock~input_tokens`.
   - **Multivariate R²:** `wallclock~output_tokens+iter_count`.
   - **Incremental R²** of iter_count over output_tokens (diagnostic only — see verdict below for why).
   - **Partial R²** of iter_count in the full model.
5. **Pooled with fixed effects:** `wallclock~test_id+output_tokens+iter_count`; and with interaction: `+test_id:iter_count`.

**H1 verdict (multi-outcome, tail-aware — item 5):**

> **Why incremental R² is no longer the central gate:** if iterations cause additional output tokens (likely — more turns means more generation), partialing out output_tokens removes part of the iteration-path mechanism we're trying to confirm. Use it as one diagnostic among several, not the sole confirmation criterion.

**H1 supported (per test, with per-test agreement required for "supported"):**
1. **Tail-heavy condition** (any of the following):
   - `p90/median ≥ 2.0`, OR
   - `max/median ≥ 3.0`, OR
   - Top-quartile share of total iterations ≥ 40%.
2. AND iter_count strongly associates with wallclock (`Spearman ρ > 0.6` OR univariate `R²(wallclock~iter_count) ≥ 0.6`).
3. AND the W3 sampler arm does not practically reduce central or tail iteration counts (cross-reference W3 verdict — see W3 analysis section).
4. AND wallclock decomposition does not show the tail is primarily normal-iteration `non_model_gap` latency (i.e., long runs are not just runs with normal turn counts but slow tools/harness — that would be Class E territory).

**H1 not supported:** distribution is tight on all tail-shape ratios AND iter_count association is weak AND either model-time or non-model-gap dominates wallclock variance. Sampler grid (or tool-latency engineering) becomes the right v2 prerequisite instead.

**H1 mixed / unresolved:** tests disagree, metrics within a test disagree (e.g., tail-heavy by ratios but weak iter_count association), or censoring / data-quality issues are too large to draw a clean verdict. **Proceed to W4 trace inspection before deciding** — n=20 may genuinely lack power to resolve, and the long-tail trace evidence may discriminate where summary statistics cannot.

Per-test verdicts load-bearing. If tests disagree, report each separately and do not pool the verdict.

**Diagnostic forks (informative regardless of H1 outcome):**
- If `total_model_elapsed_ms` dominates wallclock variance → long runs are slow model time → sampler may matter; rerun properly-resolved grid.
- If `total_non_model_gap_ms` dominates → non-model latency is the lever (tool runtime, harness overhead, container, etc.) → Class E ticket in W5.
- If neither dominates and iter_count weak → genuinely irreducible noise; set wallclock budgets and retry on timeout.

### W3 analysis (revised P1.3, P1.4)

`host/test/scripts/analysis/sampler-arm-compare.py`. **Per test:**

Central tendency:
- Median iter_count by sampler.
- Median wallclock by sampler.

Tail behavior (item 7 — p90 at n=20 is fragile, so use a battery of tail metrics, not p90 alone):
- p75 iter_count by sampler.
- p90 iter_count by sampler (descriptive; CI very wide at n=20).
- Mean of top-5 iter_count per cell (more stable than p90 at n=20).
- Tail probability: P(iter_count > p75 of v1-prod) by sampler.
- p75 and p90 wallclock by sampler.
- Max iter_count delta as descriptive only (not a retirement-criterion input).

Effect-size and shift:
- Hodges-Lehmann shift estimate for iter_count (median of pairwise differences).
- Bootstrap 95% CI for **median** iter_count delta, **p75** iter_count delta, and **mean-of-top-5** iter_count delta (B=10000). p90 delta CI reported descriptively but not used as a gate (too unstable at n=20).
- Cliff's δ (or rank-biserial) effect size — nonparametric, appropriate for skewed count data. Cohen's d not used.
- Mann-Whitney U p-value (supporting evidence only).

Pass-rate guard (item 7 — counts, not percentages, since n=20 makes pp framing misleading):
- Per test, report `passed_v1prod` and `passed_v3deterministic` as counts out of 20.
- Compute `pass_count_delta = passed_v3deterministic − passed_v1prod`.

**Retirement criterion (revised — practical equivalence with tail battery):**

Retire sampler tuning as a recurring B-ticket category only if **all** hold:
- Median iter_count delta CI bounded within `±max(1 iteration, 20% of v1-prod median)` on all three tests, AND
- p75 iter_count delta CI bounded within `±max(1 iteration, 20% of v1-prod p75)` on all three tests, AND
- Mean-of-top-5 iter_count delta CI bounded within `±max(2 iterations, 25% of v1-prod top-5 mean)` on all three tests (replaces the p90-CI gate from round 1 — top-5 mean is more stable at n=20), AND
- `pass_count_delta ≥ −1` on every test (the deterministic arm may have at most one fewer pass than v1-prod per test; two or more fewer passes blocks retirement), AND
- No per-test result contradicts the pooled verdict.

**Mandatory conclusion language for a negative result (item 7 — distributional-shift framing, no Cohen's d):**
> "At n=20 per arm, this design is powered only for large distributional shifts. The result can support deprioritizing sampler tuning as a primary wallclock-variance lever when practical-equivalence criteria are met, but it does not prove sampler has no effect. Moderate sampler effects may remain unresolved; resolving them would require n ≥ 50 per arm."

Outputs go to `host/llama-server/docs/W2-W3-RESULTS-<date>.md`.

### W4 — failure-mode classification (revised P0.10, P1.5, P1.6, P1.8)

#### Long-tail selection rule (revised P0.10)

The v1 plan computed p75 ambiguously (per test? pooling samplers? production-only?). Revised rule operates per `(test_id, sampler_id)` cell:

For each cell:
1. Top 5 runs by iter_count, including boundary ties; AND
2. Any run with `wallclock_ms > p90` of the cell; AND
3. Any run with positive residual > 1.5σ from the per-cell `wallclock~output_tokens+iter_count` fit (catches runs slow for non-iteration reasons — Class E candidates).

Union across cells gives the W4 selection set. Expected ~30–40 runs. Report selection counts per criterion and per cell in W4 outputs.

#### Frozen taxonomy (revised P1.5)

Persisted to `host/llama-server/docs/W4-TAXONOMY.md` before any classification:

- **Class A — verify-loop:** repeated edit/verify cycles on the same target across **three or more iterations**, with repeated or closely-related `result_error_signature` values, and **low convergence** (the loop does not progress toward a passing state). Writes may have `workspace_changed: true`, but the cycle does not converge. Distinguishes from D by the *intent to make progress* — the model is editing and re-verifying, just not converging.
- **Class B — wrong-module-shape:** early `module_not_found` / `syntax_error` / equivalent signature with the model spending ≥ 3 iterations on shape resolution (changing import/require form, adding/editing `package.json`, switching ESM/CJS).
- **Class C — context-drift:** evidence of context pressure or lost state — **stronger than rising input_tokens alone** (which happens in any normal multi-turn run). Required signals (any one):
  - `input_tokens` reaches 70–80% of `ctx`, OR
  - repeated rereads of files containing already-established facts (same file, distant iterations, with no intervening `workspace_changed: true` on it), OR
  - contradictory statements about prior state visible in the transcript, OR
  - re-derivation of previously-solved subtasks.
- **Class D — grammar/tool dead-branch:** repeated tool calls with `result_changed_vs_previous_same_call: false` (same call → same result, no new information) **and** `workspace_changed: false` across the affected iterations. Or accepted tool shapes that produce no diagnostic information (e.g., reading the same file repeatedly with no edit between reads). The defining feature versus A is *no observable progress signal at all*; A is "trying to progress and failing", D is "not actually trying to progress" or "the call is structurally unproductive."
- **Class E — infrastructure / non-model-gap latency:** `wallclock_ms` residual > 1.5 σ from the per-cell `wallclock ~ output_tokens + iter_count` fit, AND `iter_count ≤ cell p75` (i.e., iteration count is not unusual), AND either `total_model_elapsed_ms > cell p90` OR `total_non_model_gap_ms > cell p90`. Class E does not absorb ordinary high-iteration failures — those go to A/B/C/D even if their non-model-gap is also high.
- **Class F — other / insufficient evidence:** doesn't fit A–E, OR trace data is insufficient to discriminate.

**Coding rule (mandatory):** assign primary class by **earliest identifiable root cause**, not by later symptom. If wrong-module-shape (B) causes a verify-loop (A), it's B unless the module issue is incidental and verify-loop dominates the iteration count. Both classifiers see this rule in the prompt.

**Class F counts toward the unclassified rate (item 9):** "unclassified" for acceptance-gate purposes = Class F + any explicit "unable to classify" responses. Class F is included in κ computation (so the two classifiers can agree that a run is genuinely unclassifiable), but a run labeled F by a classifier counts toward that classifier's unclassified rate. This prevents a classifier from quietly using F as a release valve to keep the unclassified rate artificially low.

Frozen during a classification pass. If acceptance gates fail, rebuild from the data and rerun — don't patch in place.

#### Classifier packets (new per P1.6)

For each W4-selected run, `host/test/scripts/analysis/build-w4-packet.py` builds `host/test/.claw-runtime/<run-id>/w4-packet.md`:

- **Run summary** from `run_summary.json` (id, test, sampler, status, totals).
- **Iteration table** from `iterations.jsonl`, columns: `iter, model_elapsed_ms, iter_tool_elapsed_ms (or non_model_gap_ms with source), input_tokens, output_tokens, stop_reason, tool_calls (name+arg_summary+per-call elapsed), workspace_changed flags, result_changed_vs_previous_same_call flags, error_signatures`.
- **Selected transcript excerpts:** first 3 iterations + last 3 + any iterations with `result_is_error: true`.
- **Files touched:** paths read/written, with `workspace_changed` flags per call.
- **Final status:** pass/fail, exit_code, terminal_status, censored flag.
- **Pointer** to raw session file for deeper inspection if needed.

State-change and error-signature metadata is what makes Class D (grammar dead-branch) and Class E (infra latency) detectable. Without it those classes collapse into "other".

#### Classification protocol

- **Pass 1 (agentic):** spawn one Explore-style subagent per packet (parallelizable; no shared state between agent calls). Each returns `{run_id, class ∈ {A,B,C,D,E,F}, primary_signal, justification}`. Output: `host/llama-server/docs/W4-pass1-agent.csv`.
- **Pass 2 (director):** director (Nigel) classifies the same set against the same frozen taxonomy. **Director is blind to Pass 1 labels** (P1.8). Output: `host/llama-server/docs/W4-pass2-director.csv`.

#### Acceptance reporting (revised P1.8)

`host/test/scripts/analysis/cohen-kappa.py` computes:

- Per-class counts (each pass).
- Raw pairwise agreement.
- Cohen's κ point estimate.
- Bootstrap 95% CI for κ (B=10000).
- Confusion matrix.
- Unclassified rate per pass.
- One example trace per agreed class (for V2-LEVERS authoring).

**Acceptance gates (all must hold):**
- κ point estimate ≥ 0.6 AND lower bound of 95% CI ≥ 0.4 (CI honesty per P1.8).
- Raw agreement ≥ 70% (kappa-imbalance backstop — κ alone can be misleading under skew).
- Unclassified rate < 30% in both passes.
- Director spot-checks `min(5, n_in_class)` examples per class for *correctness* (small classes get exhaustive checks per P1.8).

If gates fail: rebuild taxonomy from data and rerun. Don't patch in place.

### W5 — lever assignment (revised — reviewer ticket template)

`host/llama-server/docs/V2-LEVERS.md`. One section per accepted class:

```markdown
## Class X — <name>
- **Trace signature:** ...
- **Run count:** N (M% of W4 set)
- **Example run IDs:** [...]
- **Proposed lever:** ...
- **Expected mechanism:** ...
- **Metric expected to move:** ... (e.g., p90 iter_count from X to Y on csv-parser)
- **Validation experiment:** ... (n, design, primary criterion, joint-test correction if applicable)
- **Pass-rate regression risk:** ...
- **Rollback / no-go criterion:** ...
- **Confidence:** high | medium | low
```

If a class has no plausible lever (e.g., F — insufficient evidence): document explicitly that no v2 ticket is generated; this is a finding about the limits of trace-level diagnosis at our n.

Class-specific guidance:
- **A (verify-loop):** levers — clearer verification instructions, test-output truncation/summarization, structured error extraction. Validation requires reduced p90 iter_count without pass-rate regression.
- **B (wrong-module-shape):** levers — seed module format in workspace, add `package.json` when appropriate, clarify ESM/CJS in prompt or harness. Validation must ensure no benchmark leakage.
- **C (context-drift):** levers — compaction near 80% of `n_ctx`, explicit context budget warnings, hard iteration cap as a *policy*. Separate compaction (a fix) from a hard cap (a budget guardrail) — they are different interventions.
- **D (grammar/tool dead-branch):** levers — grammar restriction, better tool feedback, no-op detection. Before changing grammar, confirm it actually permits dead-end behavior rather than the model misusing valid tools.
- **E (infra/tool latency):** levers — tool-side optimization, runner caching, tool-output streaming. Out of scope for prompt/sampler work; surfaces as a separate engineering ticket.

### Sequencing & gates (revised — reviewer Gates A–E)

```
W1 PR + Step 0.5 verification + synthetic test + real csv-parser run + induced-timeout run + stream-abort run
   ↓
Gate A — telemetry validity
   ↓
Sweep schedule generated (random seed logged), sampler configs frozen, censoring policy frozen, analysis scripts dry-run on a sample
   ↓
Gate B — sweep readiness
   ↓
W2+W3 sweep (~6h M5)  →  build-run-table.py emits normalized CSV
   ↓
W2 analysis (H1 multi-criterion verdict) + W3 analysis (sampler retirement verdict, equivalence-based)  →  W2-W3-RESULTS-<date>.md
   ↓
Gate C — director reviews W2/W3 verdicts before W4 begins
   ↓
W4 long-tail selection, build-w4-packet.py, agentic Pass 1, director Pass 2 (blind), cohen-kappa.py
   ↓
Gate D — taxonomy acceptance (κ ≥ 0.6 with CI lower bound ≥ 0.4, raw agreement ≥ 70%, unclassified < 30%, director spot-checks)
   ↓
W5 ticket list (one section per accepted class with mechanism, metric, validation, regression risk, rollback)
   ↓
Gate E — v2 unblock
```

### Schema appendix (new per P2.4)

Schemas authoritative as of `schema_version: 1`. Future revisions bump version and document migration.

- **`bridge.iterations.jsonl`** — per `/v1/messages` request. Schema in Step 1.1.
- **`iterations.jsonl`** — per agent iteration, post-join. Schema in Step 1.2.
- **`run_summary.json`** — one per run. Schema in Step 1.2.
- **`iter-distribution-runs.csv`** (normalized run table) — columns enumerated in Step 1.3.
- **`_sweep-manifest.json`** — sweep-level provenance. Fields in W2+W3 section.
- **`W4-pass{1,2}-*.csv`** — `run_id, class, primary_signal, justification` (one row per long-tail run).
- **`W4-TAXONOMY.md`** — frozen at start of W4. Class definitions in W4 frozen taxonomy section.

Analysis scripts validate inputs against `schema_version` and refuse to run on mismatched data.

### Glossary (new per P2.2)

- **M5:** internal hardware host class — Apple-silicon workstation with 64 GB unified memory used as the standardized eval host. Distinct from `tier-64`, which is the test memory budget. M5 wallclock = wall time on M5.
- **Iteration:** one model turn = one `/v1/messages` completion call, regardless of how many `tool_use` blocks the turn emits. Anchored to claw's iteration budget and llama-server's `n_request`.
- **Long-tail run:** a run selected by the W4 selection rule (per-cell top-5 ∪ p90 wallclock ∪ high-residual).
- **v1-prod, v3-deterministic:** the two W3 sampler arms.
- **Cell:** a `(test_id, sampler_id)` combination — 6 cells in the W2+W3 sweep (3 tests × 2 samplers).
- **Censored run:** a run terminated by timeout or context overflow rather than reaching a model-issued stop.

### Privacy / external sharing (deferred per P2.6)

Methods note is internal-only for this work item (director decision 2026-04-28). When external sharing is reconsidered: redact tool-argument paths that include user-specific names, hash command lines, share derived run table + classifier outputs rather than raw transcripts, include schema / model id / harness version. Full handling deferred to that decision.

### Output-location convention (P2.3)

- **Code, runtime artifacts, scripts:** `host/test/...` — owned by the eval harness, committed or gitignored as appropriate.
- **Findings, decisions, taxonomies, ticket lists:** `host/llama-server/docs/...` — durable analysis artifacts that survive harness churn.
- **Per-run sidecars:** `host/test/.claw-runtime/<run-id>/` (gitignored; transient; reproducible from sweep manifest + code).

### Files to be created or modified (revised)

**New:**
- `host/test/.claw-runtime/` (gitignored runtime directory)
- `host/test/scripts/run-iter-distribution-sweep.sh`
- `host/test/scripts/analysis/build-run-table.py`
- `host/test/scripts/analysis/build-w4-packet.py`
- `host/test/scripts/analysis/iter-distribution.py`
- `host/test/scripts/analysis/sampler-arm-compare.py`
- `host/test/scripts/analysis/cohen-kappa.py`
- `host/test/scripts/analysis/classifier-prompt.md`
- `host/llama-server/docs/W4-TAXONOMY.md`
- `host/llama-server/docs/W2-W3-RESULTS-<date>.md`
- `host/llama-server/docs/V2-LEVERS.md`

**Modified:**
- `host/test/docker-compose.yml` (static `.claw-runtime` mount)
- `host/test/lib/bridge.js` (run_id header handling, per-request JSONL append, `model_elapsed_ms` naming)
- `host/test/lib/claw.js` (run_id mint, env propagation, post-run join, `iterations.jsonl` + `run_summary.json` emit)
- `host/test/scripts/aggregate-results.sh` (delegates iter-column generation to `build-run-table.py`)
- `host/test/.gitignore` (add `.claw-runtime/`)
- `host/test/docs/CLAW-CODE-PROPOSAL.md` (mark P0.3 satisfied)

### Reviewer round 1 — change log

P0 (must-fix, all adopted): P0.1 split timing fields, P0.2 `tool_calls[]` array + sha256 + `arg_summary`, P0.3 split iteration_status / run_status, P0.4 run-id propagation verified in Step 0.5, P0.5 static bind mount, P0.6 join_status field + non-silent malformed-run handling, P0.7 randomized blocked sweep, P0.8 full run_summary.json schema, P0.9 censoring policy, P0.10 per-cell long-tail selection rule.

P1 (strongly recommended, all adopted): P1.1 softened causal claim in §"Why this is a prerequisite", P1.2 expanded H1 metric battery with fixed effects, P1.3 W3 reframed as practical-equivalence, P1.4 tail-aware sampler comparison, P1.5 Class E + F + earliest-root-cause coding rule, P1.6 W4 packet enrichment, P1.7 `build-run-table.py` Python source-of-truth, P1.8 raw agreement + confusion matrix + κ CI lower-bound gate.

P2 (cleanup, all adopted): P2.1 standardize on `sessions/`, P2.2 glossary with M5 definition, P2.3 output-location convention, P2.4 schema appendix, P2.5 softened external-contribution claim in §"What this produces", P2.6 privacy/sharing deferred with explicit rules.

### Reviewer round 2 — change log

All ten focused-feedback items adopted:

1. **Archive v1 plan:** Falsification criteria, Workstreams §W1–§W5, and Sequencing diagram **deleted** from the doc body (recoverable via git log) — round-1 supersession bookmarks weren't enough; an implementation agent reading top-to-bottom would still hit incremental-R²-as-central-threshold and the four-class taxonomy before the v2 plan. Now the v2 plan is the only executable section. H2 paragraph now points to v2 W4 for the taxonomy. Effort estimate replaced with v2 numbers.
2. **Honest timing naming:** `tool_elapsed_ms` populated only when Step 0.5 confirms genuine claw tool timestamps. Otherwise the schema uses `non_model_gap_ms` with `non_model_gap_source` set. Step 0.5 now explicitly asks the timing-availability question with three outcomes (a/b/c). `total_tool_elapsed_ms` renamed `total_iter_tool_elapsed_ms` (nullable) + `total_non_model_gap_ms` in run_summary.json and the run table.
3. **Per-tool timing:** `tool_calls[].started_ms` / `finished_ms` / `elapsed_ms` added when timing data is available. Iteration-level `iter_tool_elapsed_ms` is the sum.
4. **Split state-change semantics:** single overloaded `state_changed` replaced with `workspace_changed` (filesystem delta), `result_hash` (canonical hash of output), `result_changed_vs_previous_same_call` (Class D primary signal — same call, same result?), `result_error_class` / `result_error_signature` (canonical error excerpt). Run table gains `no_progress_repeat_count`.
5. **Tail-aware H1 verdict with three outcomes:** IQR criterion replaced with a tail-shape battery (`p90/median ≥ 2.0` OR `max/median ≥ 3.0` OR top-quartile share ≥ 40%). Incremental R² demoted from gate to diagnostic. New verdict states: H1 supported / not supported / mixed-or-unresolved (the third outcome explicitly proceeds to W4 trace inspection rather than forcing a binary verdict at n=20).
6. **Wallclock decomposition replaces tautological regression:** report `model_share` / `non_model_gap_share` / `unaccounted_share` medians per test; then model `total_model_elapsed_ms` and `total_non_model_gap_ms` separately on iter_count + tokens + test_id. Server-side timing fields (`server_prompt_eval_ms`, `server_decode_ms`, `server_queue_ms`) added to bridge log and iteration record, captured if Step 0.5 confirms availability.
7. **Tail-metric battery in W3:** p75 delta + mean-of-top-5 delta added; p90 delta retained descriptively but no longer a retirement gate (too unstable at n=20). Mean-of-top-5 delta CI replaces p90 delta CI in retirement criterion. Cohen's d removed from negative-result language; replaced with distributional-shift framing. Pass-rate guard reframed as count delta (`pass_count_delta ≥ −1`) rather than percentage points.
8. **W4 taxonomy boundaries tightened:** A vs D distinction sharpened (A = trying to progress and failing; D = no observable progress signal at all, defined by `result_changed_vs_previous_same_call: false` AND `workspace_changed: false`). C requires more than rising input_tokens (now requires ctx-pressure threshold OR reread-of-established-fact OR contradictory state OR re-derivation). E requires normal-ish iter_count (≤ cell p75) AND high residual AND high model or non-model gap.
9. **Class F counts toward unclassified rate:** explicit rule added; prevents F from being a release valve.
10. **Effort estimate revised:** ~2.5–4 calendar days (was ~1.5).
