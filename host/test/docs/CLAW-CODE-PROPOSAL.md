# Claw-Code on Apple Silicon: A Proposal for Performance & Behavioral Gains

*Internal proposal, mac-llm-lab, 2026-04-28. Author: Claude Opus 4.7 under autonomous-research mandate. Read-only review of the rig — no infrastructure touched. The M5 Max is being driven by another engineer for stability sweeps; recommendations below are for the next sit-down session, not for immediate execution.*

## Audience & framing

This document is for the on-device-model practitioner. The stack already does the hard things: native Metal-accelerated llama-server with grammar-constrained tool decoding, an Anthropic-protocol bridge that survives the LiteLLM streaming-iterator and Responses-API edge cases, and an ephemeral test container that reproduces the agent loop end-to-end. Everything below is delta — what's left to gain, ranked by yield and risk.

The lab's goal is high-quality agentic coding at 16/32/64 GB. The 64 GB tier is the frontier (Qwen3.6-35B-A3B-UD-Q4_K_XL, just adopted 2026-04-28); the 16 and 32 GB tiers are the social-scale story. The recommendations are organized by where they bite.

## Executive summary

The single biggest insight from the recent eval session: **the harness is no longer the binding constraint at tier-64**. The previous candidate (Qwen3-Coder-30B) lost 5–7 tests per sweep to retry-storms; Qwen3.6-35B-A3B loses zero. The remaining failures are real ceiling (`mini-vm`), real long-tail variance (`csv-parser` 11s↔89s on the same prompt), and one new emergent failure mode at 64k context (`multi-bug-decoy` self-overruns into context exhaustion). Capability has decoupled from harness pathology, so future leverage is in three places: **sampler tuning to compress variance**, **tier-down calibration of the new 11-eval gauntlet**, and **harness instrumentation so the next regression is visible at the source**.

I rank recommendations P0/P1/P2 below; the P0 set is "if you do nothing else this month, do these" and is achievable inside a single tuning session given the lab's existing tooling.

## P0 — Highest yield, low risk

### P0.1 — Tier-down the 11 new evals to tier-16 and tier-32

**What:** Run the round-1/2/3 capability evals (`spec-precedence`, `dependency-graph`, `large-refactor`, `long-horizon-bugs`, `multi-bug-decoy`, `cascading-bugs`, `csv-parser`, `json-schema-validate`, `lru-cache`, `expression-eval`, `mini-vm`) against tier-16 (Qwen2.5-7B Q5_K_M) and tier-32 (Qwen3-14B Q4_K_M) at n=5.

**Why:** The original 22-eval suite saturates at tier-64 (22/22) and gives a clean 7B-vs-14B gradient at the discriminative tests. The 11 new evals have only ever run against tier-64. Per [`NEW-EVALS-REPORT.md`](NEW-EVALS-REPORT.md) §recommendation 4, the predicted shape is *tier-32 fails round-3 entirely and is variable on round-2; tier-16 fails most of round-2 and all of round-3* — but that's a hypothesis, not data. Without it, the lab can't claim a calibrated tier-stratified suite, and the "which tier do you need for X kind of work" question stays anecdotal.

**How:** `EVAL_TIERS="16 32" host/test/run-tier-eval.sh` × 5. Wallclock estimate: ~25 min/tier × 5 × 2 = ~4h, can run unattended overnight. Aggregate via `scripts/aggregate-results.sh --wilson`.

**Acceptance:** A pass-rate matrix with Wilson 95% lower bounds for all 33 tests × 3 tiers. Each test slotted into one of: anchor-floor (passes everywhere), tier-16-discriminator, tier-32-discriminator, tier-64-only, ceiling.

**Why P0:** This is the lab's strategic asset. Without the gradient, recommendations to downstream users ("if you have 32 GB, expect Y") are guesses. Getting it costs ~half a day of M5 Max time and zero cognitive load.

### P0.2 — Compress variance on the round-2 and round-3 tests via sampler tuning

**What:** Run a sampler grid against `csv-parser`, `json-schema-validate`, `lru-cache`, `multi-bug-decoy`, and `expression-eval` at tier-64. Variables: `temp ∈ {0.3, 0.5, 0.7}`, `presence_penalty ∈ {0, 1.0, 1.5}`, holding `top_p=0.8`, `top_k=20`. n=5 per cell.

**Why:** Three observations from [`QWEN3.6-MODEL-REPORT.md`](QWEN3.6-MODEL-REPORT.md) §weaknesses converge here:

1. `csv-parser` ran in 11s, 89s, 24s, 12s, 13s across five sweeps with the same prompt and config — an 8× spread on a fully-deterministic task (the verify suite has no nondeterminism).
2. `lru-cache` went 20s → 43s → 26s → 40s.
3. `multi-bug-decoy` flipped from 6/6 deterministic at 32k context to 1-of-2 fails at 64k *because the model decided to take a longer path and ran past the new ceiling*.

These point at one phenomenon: at temp=0.7 with presence_penalty=1.5, the model occasionally commits to a long-horizon iteration plan that's correct but expensive, and other times to a short one. Variance in iteration count → variance in latency → context-overflow long-tail. The sampler grid is the cheapest way to find a setting that keeps the ceiling intact (`expression-eval` passes) while making typical decode shorter (`lru-cache` always 20s, never 43s).

**How:** Reuse the per-tier sampler plumbing already in `models.conf` and the plist template. Each cell is one `LLAMA_TIER=64 ./host/llama-server/scripts/install` + a `EVAL_TIERS=64 host/test/run-tier-eval.sh` × 5. Wallclock per cell: ~50 min. Nine cells (3×3 grid) is one M5 Max overnight.

**Acceptance:** A heatmap of pass-rate × median-elapsed across the grid. The decision rule: pick the cell with the lowest median elapsed on the round-2 set *subject to* round-3 (`expression-eval`) staying ≥80% pass-rate. Bonus credit for narrower IQR on round-2 latency.

**Why P0:** Variance is the experience cost the user actually feels. A 89-second outlier on a 11-second task is the difference between "feels snappy" and "is this thing wedged?" Reducing the long tail is more user-visible than another point of pass-rate.

### P0.3 — Add per-turn telemetry to `runClaw` so failures are attributable

**Status: satisfied 2026-04-28** by [TODO-ITERATION-DISTRIBUTION-TEST.md](../../llama-server/docs/TODO-ITERATION-DISTRIBUTION-TEST.md) §W1. `runClaw()` now emits `iterations.jsonl` (per-iteration record with model_elapsed_ms, server_*_ms, tool_calls[], state-change diagnostics) and `run_summary.json` (per-run aggregate, censoring flag, join_status) into `host/test/.claw-runtime/<run-id>/`. The bridge layer (LiteLLM custom callback) captures upstream timings the Anthropic-shape translation strips. See the linked TODO §"Step 0.5 — Findings" for the architectural pivot vs. the original P0.3 sketch.

**What (original):** Modify [`host/test/lib/claw.js`](../lib/claw.js) to capture, per claw invocation: tool-call count, total tokens generated, total tokens received, per-turn elapsed, and the final stop_reason. Persist as a sidecar JSON next to the result file.

**Why:** [`EVAL-CALIBRATION-REPORT.md`](EVAL-CALIBRATION-REPORT.md) §5 lists this as a known limitation: *"a retry storm and an honest 240s decode look identical from this layer."* The classifier in [`scripts/classify-failures.sh`](../scripts/classify-failures.sh) currently splits by elapsed and workspace state, which is a clever workaround for missing telemetry, but it can't see *why* a 240s timeout happened — was claw stuck in a `read → propose → diff-mismatch → re-read` loop (harness pathology), or did the model genuinely think for 240s (capability bound), or did context fill up (`multi-bug-decoy` 64k-overflow class)?

The new tier-64 model has zero retry-storms today, but that won't stay true forever — a future model swap, a grammar tweak, or a claw-upstream change could re-introduce them. Without telemetry, the regression appears as "test got slower" rather than "test entered a tool loop." Cheap insurance.

**How:** claw writes its turn log to `.claw/transcripts/` already (verified in workspace `files=` listings). The change is: bind-mount `.claw/` to a host volume in [`docker-compose.yml`](../docker-compose.yml), have the test runner read the transcript on completion, summarize, and emit alongside the test verdict.

**Acceptance:** Failure attribution columns added to `aggregate-results.sh` output (`tool_calls`, `total_tokens`, `last_stop_reason`). The 240s `mini-vm` failure should distinguishably show as "max iteration count" rather than "harness wedge."

**Why P0:** The lab has measured itself into a corner where it knows pass-rates but not *mechanisms*. Adding the mechanism layer is a one-evening change that becomes load-bearing the first time something regresses.

## P1 — High-yield, requires care

### P1.1 — Resolve the grammar prelude question with a capped variant

**What:** Replace the current `root ::= prelude? response` rule in [`grammars/claw.gbnf`](../../llama-server/grammars/claw.gbnf) with a length-capped prelude: `prelude ::= prose-char{0,80}`. This is the "softer alternative" sketched in [`TODO-GRAMMAR-PRELUDE.md`](../../llama-server/docs/TODO-GRAMMAR-PRELUDE.md).

**Why:** Two problems converge in the prelude:

1. **Tier-16 (legacy)**: Qwen3-14B at tier-16 used to burn its 256-token wrap budget on prelude prose. The current tier-16 (Qwen2.5-7B) doesn't, but if a future tier-16 candidate is hybrid-thinking or weakly biased toward `<tool_call>`, the symptom returns.
2. **Tier-64 (current)**: The previous Coder-30B's `agent-single` 1-in-3 flake lived inside the prelude branch — model emits prose, hits no tool call, ends turn (see `TODO-AGENT-SINGLE-FLAKE.md`, since deleted after 10/10 re-verification on Qwen3.6). Qwen3.6 has not exhibited this in current runs, but the `multi-bug-decoy` long-tail at 64k context is structurally similar — model takes a "narrate then call" path under one sampler regime that converges short under another.

The full drop (`root ::= tool-call | trailing-text`) is too aggressive — it could regress models that legitimately need a brief plan-statement. A length-cap of ~80 chars (one short sentence) preserves "I'll start by..." but forbids "Let me think about this. The user wants me to first..." which is the failure mode.

**Why P1, not P0:** This is *behaviorally load-bearing* — small grammar changes have surprised this lab before (e.g., the CLAUDE.md plant that broke tier-64; see [`TODO-GRAMMAR-PRELUDE.md`](../../llama-server/docs/TODO-GRAMMAR-PRELUDE.md) §"Step 1 outcome"). It needs an A/B with the full 33-test suite at all three tiers and ≥n=5 to confirm the cap doesn't slip pass-rate anywhere. Plan two cells: current grammar (control), 80-char cap (treatment). Sequenced after P0.1 so the tier-down baseline is fresh.

**Acceptance:** Across all 3 tiers × 33 tests × n=5, the capped grammar produces ≥ control pass-rate, with statistically meaningful improvements on `agent-single` (tier-64 1-in-3 flake; should drop to 0%) and `tool-discipline` latency (lower preamble token cost).

### P1.2 — Investigate the 137ms TTFT regression

**What:** Diagnose where the +56ms TTFT came from when swapping Qwen3-Coder-30B (81ms median) for Qwen3.6-35B-A3B (137ms median).

**Why:** [`TIER-EVAL-MEMO-20260428-qwen36.md`](TIER-EVAL-MEMO-20260428-qwen36.md) §"Open questions for the next agent" #4 already flagged this. Two hypotheses:

1. **Hybrid SSM/attention prefill cost**: Qwen3.6 has a 4-block full-attention interval over 40 blocks; that's a structural difference from a pure-attention 30B that could legitimately add ~50ms to first-token.
2. **`chat_template_kwargs.enable_thinking=false` forwarding overhead**: the `extra_body` block in [`litellm-config.yaml`](../../litellm/litellm-config.yaml) lines 67-78 is a new request shape that LiteLLM has to translate per request. If it's adding 30-50ms via a Python dict round-trip, that's recoverable by either pinning the kwarg at the llama-server layer (env var to llama.cpp) or short-circuiting in a custom LiteLLM provider.

**How:** Direct-vs-bridge benchmark. 50 requests of an empty-tool-prompt to llama-server's `/v1/chat/completions` directly (with the kwarg in the body), then 50 through the bridge with the same body. The delta is the bridge cost; the absolute floor is the model cost. If bridge cost is >30ms, the kwarg-forwarding hypothesis is the candidate.

**Why P1:** TTFT is the perceptual contract for agent-loop snappiness. 56ms × the agent loop's typical 5-10 turns is a quarter to half a second the user feels per session. Recoverable, and the answer informs whether to keep `extra_body` or move thinking-suppression to the model layer.

### P1.3 — Compaction strategy for the `multi-bug-decoy` 64k overflow

**What:** Add a context-budget-watcher to claw's tool loop (or, if upstream-claw is too heavy a lift, instrument it from the harness via the `.claw` transcript). When a session crosses 80% of `n_ctx`, emit a warning and either summarize-and-restart or short-circuit.

**Why:** The new failure mode at 64k context is the model walking off into a long iteration on `multi-bug-decoy` (failed 1-of-2 at 64k after 6/6 at 32k). At 32k the model couldn't afford the long path, so it converged early. At 64k it can afford the long path, so it sometimes takes one — and crosses the new ceiling. This is *not* a model regression; it's the iteration-count distribution stretching to fill the available context.

The two structural fixes:

1. **Compaction**: when context fills past a threshold, ask the model to summarize state and continue from a shorter representation. This is what claude.ai/claude-code do at scale; on-device, it costs an extra LLM call but bounds the worst case.
2. **Bound the iteration**: cap turns per agentic test (say, 12 tool calls) and surface "agent over budget" as a distinct failure class.

**Why P1:** This is a recurring cost — every long-horizon agentic eval will eventually hit this if context grows. Worth solving once at the harness layer rather than catching it via context-overflow errors. The classifier in `scripts/classify-failures.sh` should grow a `context_overflow` category alongside `timeout/discipline/capability`.

### P1.4 — Tier-aware `CLAUDE.md` discipline rules

**What:** The discipline rules in [`host/llama-server/docs/system-prompt.md`](../../llama-server/docs/system-prompt.md) (six lines: ONE tool call per response, trust tool results, no narration, etc.) need to reach the model. Today they don't — claw discovers `CLAUDE.md` in the workspace and concatenates it, but the eval workspace doesn't seed one. The session that tried planting them ([`TODO-GRAMMAR-PRELUDE.md`](../../llama-server/docs/TODO-GRAMMAR-PRELUDE.md) §"Step 1 outcome") regressed tier-64 by 2 tests.

**Why:** That regression was Coder-30B-specific — the discipline rules combined with claw's existing system prompt pushed the model into "acknowledge and exit." The new Qwen3.6 has different instruction-following; it's plausible (untested) that it benefits where Coder-30B suffered. And tier-16 Qwen2.5-7B might benefit on a different axis — tighter wrapper bias.

**How:** Tier-conditional plant in `lib/workspace.js` `reset()`. For tier-16 only initially. Run n=5 at tier-16 with and without the plant. If it improves or no-ops, extend to tier-32. If both pass, run a guarded experiment at tier-64 (the new model, not the regressed one).

**Why P1:** Conditional on P0.1 (tier-down baselines) — running this against unknown tier-16/32 baselines means you can't tell if a delta is plant-driven or sampler-driven. After the baseline matrix is in hand, this is a one-line workspace edit and a re-run.

## P2 — Research-grade, longer horizon

### P2.1 — Speculative decoding / draft model for tier-64

**What:** Pair Qwen3.6-35B-A3B (verifier) with Qwen2.5-7B-Instruct (drafter) via llama.cpp's `--model-draft` flag. The drafter generates k tokens; the verifier accepts/rejects.

**Why:** A3B's 3B active params per token means decode is already bandwidth-cheap, but speculative decoding still wins ~1.5-2× in the typical case where the drafter's distribution agrees with the verifier on common tokens (`{`, `}`, `"`, function-name characters). Tool-call decoding is *especially* well-suited because the grammar narrows the legal continuations and most are predictable.

The drafter (Qwen2.5-7B) is already on disk for tier-16. Adding it as a draft model for tier-64 costs ~5GB additional resident memory — well within the 21GB Qwen3.6 + 5GB drafter = 26GB envelope on a 64GB box.

**Why P2:** Real engineering: requires llama-server flag plumbing in the plist template, validation that the verify-rejection path doesn't break grammar enforcement (it shouldn't — grammar masks at sample time, drafter proposes are independent), and a careful latency benchmark. Could also regress if the two models' distributions diverge enough that the rejection rate is high. Worth exploring after the variance question (P0.2) because variance could disappear with the right sampler before speculative is needed.

### P2.2 — Prose-smush in the claw renderer

**What:** Fix the claw markdown renderer that strips `## ` glyphs without preserving the `\n` after them — see `TODO-PROSE-SMUSH.md` (since deleted; bug is upstream in claw-code's terminal renderer, not in this repo).

**Why:** The eval has been split into raw-bridge (assertive) and claw-rendered (informational), so the bug is currently invisible to test outcomes. But it's user-visible — every prose response through claw collapses headers and bullets into a wall of text. Cosmetic but real.

**How:** Fork claw-code, fix the markdown→ANSI renderer's pre-tokenization-strip pass to preserve newlines around stripped glyphs, ship the fork in the local Dockerfile via `CLAW_REF=<fork-sha>`. Or wait for upstream — flag the issue, link the eval reproduction, hope someone picks it up.

**Why P2:** Quality-of-experience improvement for chat use, no impact on agentic-coding pass-rates. Right priority is "do this when the agent-loop questions are settled."

### P2.3 — Multimodal eval lane

**What:** Qwen3.6 is multimodal (`pipeline_tag: image-text-to-text`); we send text-only prompts so the vision tower is dead weight in RAM. If the lab adds a multimodal eval (screenshot-of-code → fix), this model is overqualified, and the previous Coder-30B couldn't do that at all.

**Why P2:** This is a use-case expansion, not a performance improvement. Worth doing if the lab's downstream users actually want screenshot-driven coding (the OWUI `general` profile already supports vision); irrelevant if the use-case is purely text-coding.

### P2.4 — `mini-vm` capability ceiling probe

**What:** `mini-vm` (12 opcodes, CALL/RET frames, recursive factorial) has failed in every config it's been run against. It's the lab's standing top-end anchor.

**Why P2:** The next tier-64 candidate that solves it is genuinely a frontier-class on-device model. Until such a model exists, the test is doing its job (anchor); pushing beyond it would mean designing yet-harder evals, which has diminishing returns per [`NEW-EVALS-REPORT.md`](NEW-EVALS-REPORT.md) §recommendations 5.

## Risks & non-recommendations

### Don't tighten the grammar to specific tool names

The lab has been right to keep [`grammars/claw.gbnf`](../../llama-server/grammars/claw.gbnf) permissive on tool names and argument shapes. claw advertises 50+ tools that drift across versions; baking the schema in would couple the rig to the client. The model is already reliable on argument shape correctness — only the *wrapping* was broken, and that's solved. Resist the temptation to add more grammar enforcement; it trades model-side discipline for repo-side fragility.

### Don't push tier-64 context past 64k without solving P1.3

The 32k → 64k bump was forced by `expression-eval` running out of room mid-decode. The bump worked, but introduced the `multi-bug-decoy` long-tail. Going to 128k would compound that — more rope for the model to walk off with. The right next step is bounding iteration count or compacting context, not enlarging the budget.

### Don't unify the `claw` and `claw-llama` litellm routes

[`litellm-config.yaml`](../../litellm/litellm-config.yaml) keeps the production `claw` route asymmetric from the test `claw-llama` route — only the test route carries `chat_template_kwargs.enable_thinking=false`. The asymmetry is deliberate: it makes test-only knobs explicit and prevents a test-time decision from quietly bleeding into production. Don't unify them even when they look duplicative.

### Don't drop the streaming-iterator patch without checking upstream

[`patches/streaming_iterator.py`](../../litellm/patches/streaming_iterator.py) is load-bearing — it re-emits the trigger chunk as `content_block_delta(input_json_delta)` so Anthropic clients see tool-call args. The upstream LiteLLM bug it patches is filed but unfixed. Every LiteLLM image upgrade needs a re-snapshot diff (per [`README.md` §streaming patch](../../litellm/README.md)). Don't assume the next upstream version fixed it; verify.

## Suggested sequenced plan

Compressed 5-day cadence assuming 24/7 M5 Max utilization, weekend work, and the engineer pipelining analysis alongside running sweeps. The M5 is the only serial resource (one llama-server resident at a time) — everything else parallelizes.

**Sequencing rule:** the M5 is never idle. Engineer work runs *concurrently* with whichever sweep is in flight, not sequentially after it.

| Day | M5 Max (24h) | Engineer (concurrent) | Outputs |
|---|---|---|---|
| 1 | **P0.1 sweep** — tier-16 + tier-32 × 11 evals × n=5 (~8h) → rolls into **P0.2 sampler grid prep run** (3 baseline cells × n=5, ~12h) | Land P0.3 (per-turn telemetry in `runClaw`); start drafting `EVAL-CALIBRATION-REPORT-v2.md` skeleton from streaming P0.1 data | Telemetry shipped; partial P0.1 matrix |
| 2 | Finish remaining **P0.2 sampler grid** (6 cells × n=5, ~6h) → start **P1.1 grammar-prelude A/B** (control + cap × 33 tests × 3 tiers × n=5, runs ~24h, spans into Day 3) | Aggregate P0.1 with `--wilson`; classify gradient; finalize report v2; pick P0.2 winning cell from streaming heatmap | `EVAL-CALIBRATION-REPORT-v2.md` complete; latency heatmap; winning sampler chosen |
| 3 | Continue P1.1 (~remaining 18h) | P1.2 TTFT direct-vs-bridge benchmark (no M5 needed — bridge + curl loop only); promote P0.2 winning cell to `models.conf` (commit when M5 frees up) | TTFT attribution memo; sampler promoted |
| 4 | P1.1 finish + **P1.4 tier-conditional CLAUDE.md plant** A/B at tier-16 (n=5, ~5h) → **stability re-confirm sweep** under new sampler at tier-64 (n=7, ~12h) | P1.3 compaction-or-iter-cap design memo (pure design work); analyze P1.1 results when they land | P1.1 verdict (cap or revert); plant verdict; design memo |
| 5 | **Verification full sweep** — all 33 tests × 3 tiers × n=5 with all P0/P1 changes baked in (~24h, runs into Day 6 morning) | Write session report consolidating all P0/P1 outcomes; update `profiles.md` and `README.md` if model/sampler choices shifted | Final session report; rig in known-good state |

### What got compressed

- **Originally 10 working days → 5 calendar days.** The M5 was idle ~14h/day in the original plan (overnights only); now it runs continuously.
- **P0.1 + P0.2 parallelize with P0.3 (telemetry).** Telemetry is pure code-side work; no reason to serialize it before sweeps.
- **P1.1 (24h M5 sweep) overlaps engineer-side analysis.** Day 3 has no M5-bound engineer work — TTFT investigation is pure bridge-vs-direct curl.
- **Day 5 verification sweep** is new — gives a single clean run that proves the stack still passes everything end-to-end after all changes land. Worth the day; without it, regressions hide.

### What did NOT compress, and why

- **P1.1 grammar A/B is the hard floor.** 2 cells × 33 tests × 3 tiers × n=5 ≈ 990 test-runs ≈ 24h M5 wall-clock. This is the binding constraint. Can't be parallelized (one llama-server at a time) and shrinking n below 5 would put the borderline calls back into Wilson-CI noise.
- **Engineer cognitive load.** Day 2 (analysis + sampler choice + concurrent prelude A/B kickoff) is the heaviest day. If the engineer is solo and tired, slipping Day 2 by 12h is fine — the M5 doesn't care.

### Risk: what to do if a sweep wedges

The M5 can't be split, so a wedged sweep costs the rest of the day. Mitigations:

- **Daily checkpoint at 06:00 local.** Engineer glance at `tail /tmp/llama-server.log` and `host/test/logs/`; if a sweep is dead, kick the next one off rather than waiting.
- **Bound each cell to 90min via the existing `cleanup` trap in `run-tier-eval.sh`.** A wedged single tier kills the cell, not the whole sweep.
- **Keep the rollback `git checkout` on the sampler change at hand** — the per-tier sampler refactor means a bad cell on tier-64 doesn't poison tier-16/32 reads.

## Open research questions (longer-horizon)

1. **What's the right compaction strategy for on-device agents?** Cloud agents use summary-and-replay; on-device the cost of an extra LLM call is high relative to the work being saved. Is there a cheaper KV-cache truncation pattern that preserves agent state? Worth a literature pass.
2. **Is there a tier-64 candidate that solves `mini-vm`?** This is the standing ceiling. If a future model card claims strong long-horizon-bytecode reasoning, it's worth a sniff test even if costs are 50%+ higher than current tier-64. The mini-vm pass would be the buy signal.
3. **How does the rig perform under genuine multi-user load?** The lab is single-user in design. If the OWUI side starts to see real LAN guests using `general` while a `claw` session is also active, both daemons compete for the GPU. The current architecture (one resident profile) handles this by serial-loading; under load a hybrid arrangement (KV-cache-quantized smaller drafters always-resident + on-demand large verifiers) would be the next engineering question.
4. **Does the variance compress naturally as the model gets more practice on a workspace?** A workspace-persistent claw session might exhibit lower variance than a cold-start session, because the model's state about file structure and conventions is encoded in conversation history. Untested; would need a bind-mounted `.claw` volume across runs and a longitudinal eval design.

## What success looks like

After P0+P1 land, the lab should be able to make claims of this form:

- *"At 64 GB you get the full 33-eval suite at ≥95% with median latency under 15s on round-2 tasks, and a documented capability ceiling at `mini-vm`."*
- *"At 32 GB you get the anchor-floor + 5 round-1 capability tests deterministically; round-2 is variable but ≥70%."*
- *"At 16 GB you get the anchor-floor + tool-discipline; round-1 is ≥50% with a ~3× latency penalty vs 32 GB."*

Today the first claim is true, the second and third are educated guesses. The tier-down baseline (P0.1) is what closes that gap. Everything else is refinement on top.

## Summary

The single big shift since the calibration report is that **the tier-64 model is no longer the harness's bottleneck**. With Qwen3.6-35B-A3B installed and grammar/sampler aligned, the failures that remain are real-signal: variance on hard tasks, capability ceiling on `mini-vm`, and one new emergent class (`multi-bug-decoy` 64k overflow). The lab's next half-month of yield is in **calibrating downward** (P0.1), **compressing variance** (P0.2), and **instrumenting attribution** (P0.3). The behaviorally-load-bearing changes (grammar prelude, CLAUDE.md plant, compaction) are P1 and should wait for the baselines.

Net: the rig is closer to "ready to ship to friends" than the previous calibration report suggested. The remaining work is mostly measurement and minor tuning, not architectural.
