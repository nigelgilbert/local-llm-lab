# Research Proposal — Tool-Call Quality & Mac-Tier Scorecard

**Status:** Draft for research-team review
**Date:** 2026-04-30
**Scope:** Two coupled research threads with one shared instrumentation layer
**Target tiers:** 16 GB / 32 GB / 64 GB Apple Silicon unified memory
**Mandate alignment:** [MANIFESTO.md](../MANIFESTO.md) §"Three reasons it matters" #1 (democratization across all three tiers), #3 (architecture, not just inference)

---

## 1. Mission

Build a *truly useful* agentive coding harness on 16 / 32 / 64 GB Apple Silicon. The thesis from the manifesto: "most of the leverage was always in the orchestration, not the parameter count." This proposal commits to two research threads that test that thesis empirically, on this rig, with results that survive external citation-checking.

- **Thread A — Tool-call quality.** Improve the agent's ability to use tools correctly, fluently, and across the full Anthropic protocol surface — without sacrificing reasoning quality. The current win (10/10 wrap-rate via hand-coded GBNF) is real but narrow; the deeper question is how to make any local model behave as a *protocol-faithful* Anthropic-API agent.
- **Thread B — Mac-tier scorecard.** Build the measurement infrastructure the project currently lacks. Wrap-rate, eval-a, and eval-b are insufficient to claim "useful agent." We need a tier-stratified scorecard with credible benchmarks and latency metrics, so every future research direction can be evaluated against it.

These threads are coupled: every Thread A change is validated on Thread B's scorecard. The scorecard itself becomes the proof artifact for the manifesto's bet.

---

## 2. Thread A — Tool-Call Quality

### 2.1 Hypothesis

A two-phase decoder (free reasoning → grammar-masked tool call) using XGrammar-derived grammars from the Anthropic tool spec will:

1. preserve reasoning quality that current single-phase grammar masking erodes,
2. cover the entire Anthropic tool-use surface (multi-tool, parallel calls, multi-turn `tool_result`) without per-tool hand-coding, and
3. impose lower per-token decoding overhead than the current hand-rolled GBNF path.

### 2.2 Background

Current state: `host/llama-server/grammars/claw.gbnf` enforces `<tool_call>...</tool_call>` wrapping. Wrap-rate = 10/10 vs. 6/10 on the Ollama baseline. Hand-coded for one model family + one tool format.

Two findings from the literature drive this thread:

- **XGrammar** (Dong et al., MLSys '25, [arxiv:2411.15100](https://arxiv.org/abs/2411.15100)) reports up to 100× speedup over Outlines / lm-format-enforcer / llama.cpp GBNF and "near-zero overhead structure generation in end-to-end LLM serving" via vocabulary partitioning into context-independent (precheckable) and context-dependent tokens. Supports full CFG, including recursive schemas — a strict superset of GBNF's coverage.
- **"Let Me Speak Freely?"** (Tam et al. 2024, [arxiv:2408.02442](https://arxiv.org/abs/2408.02442)) reports "a significant decline in LLMs reasoning abilities under format restrictions," with "stricter format constraints generally lead to greater performance degradation in reasoning tasks." This is direct evidence that single-phase grammar masking is a quality cost we are currently paying without measuring.

CodeAct (Wang et al. 2024, [arxiv:2402.01030](https://arxiv.org/abs/2402.01030)) — code-as-action vs JSON tool calls, +20% success across 17 LLMs — is adjacent prior art for "format choice matters more than people think."

### 2.3 Work plan

1. **Swap GBNF → XGrammar** in `host/llama-server/`. Validate baseline wrap-rate is preserved (≥10/10), measure per-token overhead delta. Expect strict improvement.
2. **Two-phase decoder.** Decode the assistant turn unconstrained until a deterministic stop sequence (e.g. an explicit `<tool_call>` open tag), then engage XGrammar masking only for the structured payload. Implement at the llama-server boundary so claw-code is unaware of the change.
3. **Auto-grammar from Anthropic tool schemas.** At request time, derive an XGrammar CFG from the `tools` array in the incoming Anthropic `/v1/messages` payload. Eliminates the per-tool hand-coding step. This is the generalizable contribution.
4. **Cover the full surface.** Multi-tool selection, parallel `tool_use` blocks, multi-turn `tool_result` continuation, stop-sequence handling. The hand-rolled grammar today covers only the simplest case.

### 2.4 Success criteria

Measured via the Thread B scorecard:

- Wrap-rate ≥ current 10/10 across all profiles.
- Reasoning quality (Aider polyglot subset, LiveCodeBench) within 1 percentage point of free-form decoding — i.e. we recover what Tam et al. say single-phase grammar masking costs.
- Per-token structured-output decoding overhead reduced ≥ 30% vs. the current GBNF path (XGrammar's published delta is much larger; we'll claim what we measure). End-to-end TTFT reported separately as a secondary metric.
- Tool-call coverage across the Anthropic schema fully exercised on synthetic multi-tool tests.

---

## 3. Thread B — Mac-Tier Scorecard

### 3.1 Hypothesis

The current eval suite (wrap-rate, eval-a, eval-b) is insufficient to detect quality regressions or gains from any of the changes Thread A or future work will introduce. A tier-stratified scorecard built around an external benchmark anchor + latency + multi-turn discipline metrics is the missing instrumentation layer for every research direction the project will pursue.

### 3.2 Metric stack

Five metrics, two evaluation tiers (fast dev set + full-set), three hardware tiers (16 / 32 / 64 GB).

| Metric | Source | Tier-stratified? | Why |
|---|---|---|---|
| 1. **SWE-bench Lite** (300-instance subsample of original [SWE-bench](https://www.swebench.com/); independent of [SWE-bench Verified](https://www.swebench.com/verified.html), not a subset of it) | Jimenez et al. 2024; reference: [OpenHands CodeAct 2.1 = 53% on Verified, 41.7% on Lite w/ Sonnet 3.5](https://openhands.dev/blog/openhands-codeact-21-an-open-state-of-the-art-software-development-agent), [SWE-agent original = 12.5%](https://arxiv.org/abs/2405.15793) | Yes | External, comparable, paper-grade. Lite is the 16/32 GB tier's realistic ceiling; Verified runs land on 64 GB only. |
| 2. **LiveCodeBench** (contamination-resistant) | livecodebench.github.io | Yes | SWE-bench Verified is suspected-contaminated for Qwen2.5-Coder-era weights. LiveCodeBench uses post-cutoff problems; pair with SWE-bench so headline claims survive review. |
| 3. **Aider polyglot** subset (225 exercises) | [aider.chat leaderboard](https://aider.chat/docs/leaderboards/); reference points: Claude Opus 4.5 = 89.4% (current SOTA), GPT-5 = 88%, DeepSeek-V3.2-Exp Reasoner = 74.2%, Qwen3-32B = 40% | Yes | Calibrates against open-weight models and gives a multi-language signal. |
| 4. **End-to-end task latency** | Internal: time-to-first-meaningful-edit + total wall-clock | Yes | The metric the literature barely reports; uniquely visible from a local rig. |
| 5. **Multi-turn discipline** | Internal: turns-to-success, retry-rate, loop-detection rate | Yes | SWE-EVO ([arxiv:2512.18470](https://arxiv.org/abs/2512.18470), Dec 2025) shows GPT-5 + OpenHands drops from 65% to 21% under sustained multi-file pressure. Frontier weakness; ripe for measurement. |

Wrap-rate stays in the suite as a sanity floor, but is no longer the headline metric.

### 3.3 Two evaluation tiers

- **Dev set (~30 instances).** Stratified subsample across SWE-bench Lite difficulty buckets + LiveCodeBench recency buckets + Aider polyglot per-language. Designed to run in ≤ 30 min on a 64 GB Mac so the inner loop is minutes, not hours. This is what every Thread A experiment uses for fast iteration.
- **Full set.** SWE-bench Lite (300), LiveCodeBench (full), Aider polyglot (225). Wall-clock measured in hours per (model, config). Run only at thread milestones — not every commit.

### 3.4 Work plan

1. **Harness.** Build a dispatcher that takes `(model, config, dev|full)` and emits a structured JSON result. Reuse `host/test/` and `wizard/tester/` scaffolding where possible.
2. **Anchor runs.** Establish baselines on each tier with current settings: claw profile + GBNF + `q8_0` KV. Publish numbers as the t=0 reference.
3. **Contamination handling.** Document which benchmarks each candidate model may have seen in training; note in every reported number. Do not retract; flag.
4. **Calibration.** Re-run ≥ 1 published agent (e.g. mini-SWE-agent) on our scorecard to verify our numbers reproduce theirs within tolerance.

### 3.5 Success criteria

- Dev-set run completes in ≤ 30 min on 64 GB tier; ≤ 60 min on 32 GB.
- t=0 baselines published per tier with 95% CI from ≥ 3 seeds.
- Mini-SWE-agent calibration run reproduces published numbers within ± 2 percentage points on SWE-bench Lite.
- Every Thread A experiment is reportable as a delta against the t=0 baseline on the dev set within one working day of the change landing.

---

## 4. First experiments on Thread B

The scorecard's value is realized only by running experiments on it. These three are committed up front:

### 4.1 exp-a — GBNF vs XGrammar

Validates Thread A step 1. Hypothesis: latency improves, quality unchanged, wrap-rate preserved. Risk: XGrammar integration into llama.cpp may be non-trivial; budget 1 week of engineering before measurement.

### 4.2 exp-b — Single-phase vs two-phase decoding

Validates Thread A core claim. Hypothesis: two-phase recovers ≥ 1 percentage point on Aider polyglot reasoning subset and ≥ 1 percentage point on LiveCodeBench, no regression on SWE-bench Lite or wrap-rate. Direct test of Tam et al. on our models.

### 4.3 exp-c — KV-cache quantization sweep (mainline-only)

Folds in the original "Topic 3" question, scoped to KV-quant options *that already ship in llama.cpp*: `f16` baseline, `q8_0` (current), `q5_1`, `q5_0`, `q4_1`, `q4_0`, `iq4_nl`. Sweep at 32K / 64K / 128K context per tier.

Hypothesis: the Pareto frontier picks differ per tier, and the 16 GB tier becomes viable only with `q4_0` or `iq4_nl` KV at ≤ 32K context. Measure regressions on every scorecard metric; pick the per-tier default that maximizes (quality preserved at fixed context budget).

Explicit non-goals for exp-c: KIVI 2-bit ([arxiv:2402.02750](https://arxiv.org/abs/2402.02750)), H2O eviction ([arxiv:2306.14048](https://arxiv.org/abs/2306.14048)), Apple LLM-in-a-flash style tiered loading ([arxiv:2312.11514](https://arxiv.org/abs/2312.11514)). Those would require a llama.cpp fork or move to MLX. If the scorecard motivates them, that's a follow-on engineering project, not part of this research.

---

## 5. Out of scope for this proposal

To prevent scope creep, the following are explicitly deferred:

- **Speculative decoding.** EAGLE-2/3, Medusa, vanilla draft-model spec sampling. Real latency lever, but training EAGLE heads for our target models is an engineering project of its own. Tracked separately; not in this proposal's success criteria.
- **Sub-Q4 KV cache or eviction.** See exp-c non-goals.
- **Fine-tuning.** Distilling Anthropic-protocol traces onto Qwen2.5-Coder-7B/14B is the natural next research bet (high-leverage for the 16 GB tier). Out of scope here so the scorecard exists *first* — without it we can't measure the win.
- **RAG / sidecar memory.** Already on the project's Phase 3+ roadmap.
- **Web search, Caddy, Tailscale, WoL.** Phase 2+ infrastructure, not research.

---

## 6. Risks & open questions

1. **XGrammar ↔ llama.cpp integration cost.** XGrammar's reference implementation targets MLC-LLM, SGLang, vLLM, TensorRT-LLM, and (since late 2025) Mirai/OpenVINO; llama.cpp mainline is *not* on that list as of April 2026. A llama.cpp adapter may require non-trivial work. Two fallbacks: (a) measure two-phase with hand-rolled GBNF first; XGrammar swap second; (b) evaluate llama.cpp's already-mainlined **LLGuidance** (`common/llguidance.cpp`) — Microsoft's fast structured-output engine — as a drop-in for the GBNF path. LLGuidance lacks XGrammar's published 100× headline but is in-tree today, which lets us decouple "two-phase decoding wins" from "XGrammar port lands." Also track XGrammar 2 ([arxiv:2601.04426](https://arxiv.org/abs/2601.04426), Jan 2026), which adds dynamic schema switching aimed at agentic workloads — exactly our use case.
2. **Benchmark contamination.** SWE-bench Verified contamination on Qwen2.5-Coder is suspected, not proven. LiveCodeBench is the hedge; flag contamination risk in every reported number.
3. **Dev-set representativeness.** A 30-instance subsample may have high variance vs. full-set. Bootstrap CI on every dev-set number; require full-set confirmation before any externally-published claim.
4. **Tool-call coverage during two-phase decode.** When does the model decide to stop free reasoning and emit `<tool_call>`? If we rely on the model emitting a stop sequence we may miss cases where it forgets. Investigate forced-format prompts vs trained discipline.
5. **Apple Silicon idiosyncrasies.** `--cache-type-v` quantization needs `-fa` (flash attention) on Metal; older ggml versions had quirks. Document the exact llama.cpp commit each scorecard run uses.
6. **SWE-EVO regime.** Even GPT-5 + OpenHands drops to 21% on multi-file long-horizon tasks. We should measure on it as an aspirational ceiling — even our best result will be far below frontier — but include it specifically because the gap is interesting.

---

## 7. Reading list (verified citations from the research pass)

Papers and resources that directly inform this proposal. Every numeric claim above is traceable to one of these.

**Tool-call quality / structured generation:**
- XGrammar — [arxiv:2411.15100](https://arxiv.org/abs/2411.15100) (Dong et al., MLSys '25). 100× over GBNF, near-zero overhead, full CFG.
- XGrammar 2 — [arxiv:2601.04426](https://arxiv.org/abs/2601.04426) (Jan 2026). Dynamic schema switching for agentic LLMs; directly relevant to per-request grammar derivation in §2.3 step 3.
- LLGuidance — [github.com/guidance-ai/llguidance](https://github.com/guidance-ai/llguidance). Microsoft's structured-output engine; already integrated into llama.cpp mainline (`common/llguidance.cpp`). Pragmatic fallback to XGrammar.
- "Let Me Speak Freely?" — [arxiv:2408.02442](https://arxiv.org/abs/2408.02442) (Tam et al. 2024). Constrained decoding hurts reasoning.
- "Generating Structured Outputs from Language Models" — [arxiv:2501.10868](https://arxiv.org/abs/2501.10868) (Jan 2025). Benchmark of XGrammar / Outlines / GBNF / LLGuidance across efficiency and quality. Useful methodological template for exp-a.
- CodeAct — [arxiv:2402.01030](https://arxiv.org/abs/2402.01030) (Wang et al. 2024). Code-as-action +20% over JSON.

**Agent harness & evaluation:**
- SWE-agent — [arxiv:2405.15793](https://arxiv.org/abs/2405.15793) (Yang et al., NeurIPS '24). ACI design as a research surface; 12.5% on original SWE-bench.
- OpenHands CodeAct 2.1 — [Nov 2025 announcement](https://openhands.dev/blog/openhands-codeact-21-an-open-state-of-the-art-software-development-agent). 53% on SWE-bench Verified, 41.7% on SWE-bench Lite, w/ Claude Sonnet 3.5.
- OpenHands Software Agent SDK — [arxiv:2511.03690](https://arxiv.org/abs/2511.03690) (Nov 2025). Composable foundation for production agents; relevant priors for the dispatcher in §3.4 step 1.
- SWE-bench (original) — [arxiv:2310.06770](https://arxiv.org/abs/2310.06770) (Jimenez et al., ICLR '24). 2,294 instances; both Lite (300, easier subsample) and Verified (500, human-validated solvable) are independent subsets of this set.
- SWE-bench Verified — [swebench.com/verified.html](https://www.swebench.com/verified.html).
- SWE-bench Lite — [swebench.com/lite.html](https://www.swebench.com/lite.html).
- Aider polyglot — [aider.chat/docs/leaderboards](https://aider.chat/docs/leaderboards/).
- SWE-EVO — [arxiv:2512.18470](https://arxiv.org/abs/2512.18470) (Dec 2025). Multi-file long-horizon weakness; GPT-5+OpenHands = 21% (vs 65% on SWE-bench Verified). 48 tasks, avg 21 files modified, 874 tests/instance.
- SWE-bench Pro — [arxiv:2509.16941](https://arxiv.org/abs/2509.16941) (Sep 2025). Long-horizon SWE companion to SWE-EVO; hold in reserve as a stretch metric.

**KV-cache compression (out-of-scope context for exp-c non-goals):**
- KIVI — [arxiv:2402.02750](https://arxiv.org/abs/2402.02750) (Liu et al., ICML '24). Tuning-free 2-bit KV; 2.6× memory.
- H2O — [arxiv:2306.14048](https://arxiv.org/abs/2306.14048) (Zhang et al. 2023). Heavy-hitter eviction at 20%.
- LLM in a flash — [arxiv:2312.11514](https://arxiv.org/abs/2312.11514) (Alizadeh et al., ACL '24). Apple's flash-tiered loading.

**Speculative decoding (deferred — referenced for completeness):**
- EAGLE-2 — [arxiv:2406.16858](https://arxiv.org/abs/2406.16858), 3.05–4.26× lossless.
- EAGLE-3 — [arxiv:2503.01840](https://arxiv.org/abs/2503.01840), up to 6.5×; not yet in mainline llama.cpp ([discussion #15902](https://github.com/ggml-org/llama.cpp/discussions/15902)).

**Models referenced:**
- Qwen2.5-Coder — [arxiv:2409.12186](https://arxiv.org/abs/2409.12186). Six sizes 0.5B–32B; at-size SOTA on 10+ benchmarks. Primary contamination-risk anchor for SWE-bench Verified.
- Qwen3 — [arxiv:2505.09388](https://arxiv.org/abs/2505.09388) (May 2025). 0.6B–235B; dense + MoE; unified thinking/non-thinking modes. Tier-64 currently runs Qwen3.6-35B-A3B per recent repo state — scorecard t=0 baselines should explicitly name commit + variant per tier.

---

## 8. Recommended next steps

1. Research-team review of this proposal; commit or revise.
2. If accepted: stand up the scorecard harness skeleton (Thread B step 1) before any Thread A code lands. The discipline rule is: no Thread A change merges without a dev-set scorecard delta in the PR description.
3. Set milestone dates per thread; carve out an explicit "scorecard t=0 baselines published" gate before exp-a runs.
4. Decide who runs full-set evaluations and on what cadence (monthly? per-release?).
