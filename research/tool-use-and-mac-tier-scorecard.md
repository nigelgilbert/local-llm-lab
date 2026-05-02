# Research Proposal v2 — Protocol-Faithful Tool Use and Mac-Tier Agent Scorecard

**Status:** Revised draft for research-team review  
**Date:** 2026-04-30  
**Scope:** Two coupled research threads with one shared instrumentation layer  
**Target tiers:** 16 GB / 32 GB / 64 GB Apple Silicon unified memory  
**Mandate alignment:** Democratization across Mac tiers; architecture and orchestration, not only larger inference.

---

## Executive review

The original proposal is directionally strong: it picks an important systems bottleneck, connects tool-use reliability to end-to-end coding utility, and insists on a reusable scorecard before claiming progress. I would green-light the direction, but not the draft as written. The main revision is to make the proposal more testable and less dependent on one risky integration path.

Material changes in this revision:

1. **Replace "GBNF → XGrammar" as the first milestone with a structured-output backend bake-off.** XGrammar and XGrammar-2 are compelling research targets, but llama.cpp already has LLGuidance support while XGrammar is not yet a drop-in llama.cpp backend. Treat LLGuidance as the in-tree control, GBNF as the current baseline, and XGrammar/XGrammar-2 as research adapters.
2. **Add a real tool-calling benchmark.** Wrap-rate alone is too narrow, and coding benchmarks do not isolate protocol failures. The scorecard now includes BFCL-style function-calling evaluation plus an internal Anthropic protocol matrix.
3. **Decouple "decide to call a tool" from "format a valid tool call."** A two-phase decoder only helps if the transition into the constrained phase is reliable. The proposal now measures call-decision precision/recall separately from argument-schema conformance.
4. **Repair the evaluation tiers.** A 30-instance coding dev set is unlikely to run in 30 minutes on local Mac hardware once Docker setup, repository tests, and local model latency are included. This version separates a fast smoke set, a nightly dev set, and milestone/full runs.
5. **Treat SWE-bench on Apple Silicon as a systems risk.** SWE-bench is Docker-heavy, requires substantial disk/RAM, and ARM64 image coverage is incomplete. The harness must separate model-generation latency on Mac from patch-grading latency, and it must explicitly record whether tests ran natively on ARM64 or under x86_64 emulation.
6. **Use statistical non-inferiority instead of a fixed 1 percentage point rule everywhere.** On small dev sets, 1 pp is meaningless. This draft uses paired bootstrap/McNemar-style comparisons, Wilson intervals for proportions, and full-set confirmation before external claims.

---

## 1. Mission

Build a useful local coding agent harness for 16 GB, 32 GB, and 64 GB Apple Silicon machines. The core thesis is that local models become materially more useful when the orchestration layer is protocol-faithful, latency-aware, and measured against realistic agent workloads. The project therefore has two coupled threads:

- **Thread A — Protocol-faithful tool use.** Improve the local model server's ability to produce correct Anthropic-style tool-use turns, including multi-tool selection, parallel calls, multi-turn `tool_result` continuation, and schema-conformant arguments, without degrading free-form reasoning.
- **Thread B — Mac-tier scorecard.** Build the measurement layer that makes Thread A and future work falsifiable across 16 GB, 32 GB, and 64 GB Apple Silicon tiers.

The proposal's output is not only a feature. It is a reusable experimental apparatus: a trace schema, benchmark runner, hardware profile matrix, result format, and reporting template that future research directions must use before claiming wins.

---

## 2. Research questions and hypotheses

### RQ1 — Which structured-output backend should a Mac-local Anthropic-compatible server use?

**Hypothesis.** For current llama.cpp-based serving, LLGuidance is the most practical near-term structured-output backend because it is already integrated upstream. XGrammar/XGrammar-2 may become the best research backend if we can amortize dynamic per-request schema compilation and integrate token masking cleanly at the llama-server boundary.

**Rationale.** XGrammar reports up to 100x speedups and near-zero serving overhead for structured generation by prechecking context-independent tokens and optimizing context-dependent checks. XGrammar-2 is even more directly relevant because it targets dynamic structured-generation workloads such as tool calling and conditional protocols. However, llama.cpp already supports GBNF and LLGuidance, while XGrammar integration would be new engineering. LLGuidance also supports JSON Schema, regular expressions, and context-free grammars through Lark-like formats and is already integrated in llama.cpp.

### RQ2 — Can constrained decoding be applied only where it helps?

**Hypothesis.** A gated two-phase policy — free reasoning until the system decides a tool call is needed, then constrained decoding only for the tool-use payload — will preserve more reasoning quality than single-phase grammar masking while retaining protocol fidelity.

**Important correction to the original draft.** The hard part is not just switching the grammar on after `<tool_call>`. The hard part is making the transition decision reliable. The evaluation must therefore measure:

- tool-use recall: did the model call a tool when the task required one?
- tool-use precision: did it avoid tools when no tool was needed?
- tool-name accuracy;
- argument schema conformance;
- argument semantic accuracy;
- multi-call ordering and dependency handling;
- continuation behavior after `tool_result`.

This directly addresses evidence that stricter format restrictions can degrade reasoning performance, and keeps the experiment honest about whether two-phase decoding helps or merely hides failures in the trigger mechanism.

### RQ3 — What scorecard proves local Mac usefulness rather than narrow protocol compliance?

**Hypothesis.** A useful local agent must be evaluated across three axes simultaneously: protocol fidelity, coding utility, and Mac viability. Any decoder or KV-cache change that improves wrap-rate but worsens real editing success, time-to-first-edit, memory pressure, or multi-turn stability is not a win.

---

## 3. Launch scope

### In scope for this proposal

1. Anthropic-compatible `/v1/messages` client-tool behavior for local serving:
   - `tools` definitions with JSON-schema-like `input_schema` objects;
   - `tool_choice` modes used by the harness;
   - one or more assistant `tool_use` content blocks;
   - user `tool_result` content blocks that reference tool-use IDs;
   - multi-turn continuation after tool results;
   - stop-reason handling compatible with `tool_use` and `end_turn`.
2. Structured-output backend comparison:
   - current GBNF path;
   - llama.cpp LLGuidance path;
   - XGrammar/XGrammar-2 prototype path if integration cost is acceptable.
3. Scorecard and trace infrastructure across 16 GB / 32 GB / 64 GB Mac tiers.
4. KV-cache quantization sweep using only options available in the pinned llama.cpp commit.

### Explicitly deferred

- Anthropic server-side tools such as hosted web search or code execution. A local compatibility server should emulate client-tool semantics first.
- Fine-grained tool streaming as a correctness target. It can stream partial/invalid JSON by design, so it needs a separate streaming repair/eager-consumption experiment.
- MCP, tool search, programmatic tool calling, and skill discovery.
- Fine-tuning or distillation of protocol traces.
- Speculative decoding, KV eviction, sub-Q4 KV research, RAG, and sidecar memory.

---

## 4. Thread A — Protocol-faithful tool use

### 4.1 Baseline and instrumentation first

Before changing decoding, add a trace layer around every assistant turn:

- request metadata: model, quantization, context length, prompt template hash, tool schema hash, llama.cpp commit, OS version, hardware tier;
- decoding metadata: grammar backend, grammar compile time, per-token mask time where available, sampling settings, stop sequences, tool trigger policy;
- protocol events: emitted text blocks, emitted tool-use blocks, tool-use IDs, tool names, raw argument strings, parsed arguments, parse errors, schema validation errors, repair attempts;
- outcome metadata: benchmark result, number of turns, retries, time-to-first-token, time-to-first-meaningful-edit, total wall-clock, peak memory, memory-pressure events.

This instrumentation is shared by both research threads. No decoder change should merge without emitting this trace format.

### 4.2 Backend bake-off: GBNF vs LLGuidance vs XGrammar prototype

**Goal.** Determine which backend should carry production work and which backend is worth research investment.

**Conditions.**

1. **GBNF baseline:** current hand-coded grammar path.
2. **LLGuidance:** upstream llama.cpp structured-output engine, used as the practical near-term alternative.
3. **XGrammar prototype:** minimal adapter if feasible; otherwise measured outside llama.cpp to estimate upside and integration risk.
4. **XGrammar-2 investigation:** no production dependency unless dynamic schema switching clearly reduces per-request compilation overhead for tool workloads.

**Metrics.**

- schema compile time;
- per-token mask generation/apply time;
- total tokens/sec during structured payload generation;
- TTFT and end-to-end tool-call latency;
- schema coverage over the internal protocol matrix;
- failure mode: unsupported schema keyword, grammar compile failure, invalid continuation, malformed output.

**Acceptance gate.** LLGuidance becomes the default replacement candidate if it preserves protocol conformance and improves or does not materially worsen end-to-end latency. XGrammar advances only if a prototype demonstrates clear value beyond LLGuidance on dynamic schemas or recursive/nested tool arguments.

### 4.3 Schema-to-grammar compiler

Build a per-request compiler from Anthropic tool definitions to the selected backend format.

The compiler must maintain a capability matrix:

| Schema feature | Required for launch? | Notes |
|---|---:|---|
| root object input schema | Yes | Anthropic user-defined tools use object-shaped inputs in normal practice. |
| required / optional fields | Yes | Must preserve requiredness exactly. |
| string / number / integer / boolean / null | Yes | Include boundary cases and tokenizer edge cases. |
| arrays and nested objects | Yes | Common in coding tools and file-edit tools. |
| enum / const | Yes | Needed for command modes and patch operations. |
| additionalProperties=false | Yes | Critical for strict tool mode. |
| oneOf / anyOf / allOf | Phase 2 | Must be detected and either compiled or rejected with a clear error. |
| patternProperties / complex regex | Phase 2 | Backend support varies. |
| recursive schemas | Research | Useful to test XGrammar's claimed strengths, not required for v1. |

Unsupported schema constructs must fail closed in strict mode and fall back to validated free-form mode only when explicitly configured for research.

### 4.4 Gated two-phase decoder

The original proposal's "free reasoning → grammar-masked tool call" idea is retained, but with a more precise policy.

**Phase 1: unconstrained deliberation or answer drafting.** The model can reason and decide whether a tool is needed.

**Gate: deterministic transition.** The server detects one of three states:

1. no tool needed → finish normally;
2. tool required by harness or `tool_choice` → force the structured phase;
3. tool optional → enter structured phase only when a high-confidence trigger is present.

**Phase 2: constrained tool-use payload.** The backend constrains only the machine-readable content block or internal proxy format. The server then serializes to canonical Anthropic-compatible content blocks.

**Why not rely only on `<tool_call>`?** A model that forgets the tag would be counted as a tool-use recall failure, not a grammar failure. The gate must be instrumented so we can distinguish trigger failures from formatting failures.

### 4.5 Protocol coverage matrix

The internal synthetic suite should cover the Anthropic client-tool surface, not just tag wrapping.

| Case | Expected behavior | Failure modes to record |
|---|---|---|
| no tools supplied | no `tool_use` blocks | hallucinated tool |
| tools supplied, no tool needed | natural-language answer | false positive tool call |
| forced single tool | exactly one matching `tool_use` | wrong name, bad args, no call |
| optional single tool | call only when needed | precision/recall split |
| multiple candidate tools | select correct tool | wrong tool, ambiguous tool |
| independent parallel calls | multiple `tool_use` blocks in one turn | missing call, serial-only behavior |
| dependent multi-step call | second call after first `tool_result` | ignores result, repeats same call |
| tool error result | recover or ask clarifying question | infinite retry, argument thrash |
| nested arguments | schema-conformant nested JSON | truncation, stringified JSON |
| large string argument | valid payload under token pressure | broken escaping, early stop |
| enum/const fields | exact enum value | near-miss strings |
| strict object | no extra keys | extra keys, missing required keys |
| stop-sequence collision | no premature stop | truncated arguments |

---

## 5. Thread B — Mac-tier scorecard

### 5.1 Metric stack

The scorecard has four metric families. Wrap-rate remains as a sanity check but is no longer a headline.

| Metric family | Primary metrics | Benchmarks / sources | Why it matters |
|---|---|---|---|
| Protocol fidelity | parse rate, schema conformance, tool precision/recall, semantic argument accuracy, parallel-call correctness, `tool_result` continuation accuracy | Internal Anthropic protocol matrix; BFCL V4/V3 subsets | Isolates tool-use quality from coding skill. |
| Coding utility | resolved rate, pass@1, edit correctness, malformed edit rate | SWE-bench Lite, SWE-bench Verified where feasible, LiveCodeBench, Aider polyglot | Measures whether protocol improvements translate into useful coding. |
| Multi-turn discipline | turns-to-success, retries, repeated action loops, context exhaustion, failed recovery after tool errors | Internal coding traces; SWE-EVO as stretch/audit | Captures long-horizon fragility that single-turn tests hide. |
| Mac viability | TTFT, tokens/sec, time-to-first-meaningful-edit, total wall-clock, peak unified memory, memory pressure, thermal/power mode, cache type | Internal instrumentation | The lab's differentiator: local usefulness under real Mac constraints. |

### 5.2 Benchmark choices

**SWE-bench Lite.** Keep as the main repository-level coding anchor because it is 300 instances and designed for lower-cost evaluation. The proposal should avoid saying Lite is independent from Verified unless the harness computes and reports actual overlap. Both are subsets of the original SWE-bench family.

**SWE-bench Verified.** Use as a milestone/audit benchmark on the 64 GB tier or an external grading machine. It is valuable but should not gate every Thread A experiment.

**LiveCodeBench.** Retain as a contamination hedge and algorithmic coding signal. Use date-windowed slices based on each candidate model's release/training cutoff when known.

**Aider polyglot.** Retain for multi-language editing. The official Aider page includes detailed per-run metadata such as edit format, malformed responses, cost, and seconds per case; these fields are useful templates for our own reporting.

**BFCL.** Add as the primary external tool-calling anchor. BFCL V4 explicitly evaluates function/tool calling accuracy and includes real-world data, periodic updates, latency, and format-sensitivity categories. BFCL V3 is also useful for multi-turn and multi-step tool use.

**tau-bench and AppWorld.** Hold as optional stretch benchmarks. tau-bench is more user-interaction/policy oriented; AppWorld is more API/coding-agent oriented. Either may be useful after the core scorecard is stable, but adding both at launch would dilute focus.

**SWE-EVO / SWE-bench Pro.** Treat as aspiration/audit only. They are valuable because they expose long-horizon, multi-file weakness, but they should not be part of the inner loop.

### 5.3 Evaluation tiers

| Tier | Purpose | Contents | Cadence | Target runtime |
|---|---|---|---|---|
| Smoke | Catch protocol and latency regressions before merge | 20-40 internal protocol cases, 5-10 coding tasks, tiny BFCL subset | Every decoder/harness PR | <= 30 min on 64 GB; <= 60 min on 32 GB |
| Dev | Compare research variants with useful signal | Stratified protocol matrix, BFCL subset, Aider mini-slice, LiveCodeBench slice, 10-30 SWE-bench Lite tasks | Every Thread A experiment | Same working day, not necessarily minutes |
| Milestone | Publishable internal comparison | Full protocol suite, BFCL selected/full, Aider 225, LiveCodeBench selected/full, SWE-bench Lite 300 | Thread milestones | Hours per model/config |
| Audit | Stress long-horizon claims | SWE-bench Verified, SWE-EVO or SWE-bench Pro subset, larger contexts | Monthly or release-gated | 64 GB tier or external grader |

This structure preserves the original intent — fast iteration and credible full results — without making unrealistic runtime promises.

### 5.4 Apple Silicon evaluation caveat

SWE-bench evaluation is Docker-heavy. Official documentation recommends at least 120 GB free disk and 16 GB+ RAM, with Docker resource allocation increased on macOS. Existing image registries provide strong x86_64 coverage, but ARM64 coverage is incomplete and in some cases untested. Therefore:

1. The scorecard must record **generation host** and **grading host** separately.
2. For Mac-tier claims, model inference must run on the target Mac tier.
3. Patch grading may run on native ARM64 Docker, x86_64 emulation, or an external x86_64 grader, but the mode must be reported.
4. Latency claims must separate model-generation latency from repository test execution latency.
5. A preflight step must verify Docker image availability and native/emulated architecture for every SWE-bench instance selected into smoke/dev sets.

This is not a blocker. It is a measurement hygiene requirement.

### 5.5 Statistical plan

For each comparison, report:

- exact task list and task hashes;
- deterministic seed and sampling settings;
- paired outcome table versus baseline;
- Wilson interval for single-condition proportions;
- paired bootstrap interval over task instances for deltas;
- McNemar-style significance check for binary pass/fail deltas when appropriate;
- n=3 stochastic repeats only where decoding remains stochastic enough to matter.

Do not claim a 1 pp win or loss on the smoke/dev set. Use dev results to decide whether to advance to milestone runs. For milestone/full runs, define non-inferiority margins before running: e.g. no more than 2 pp absolute degradation on coding success and no statistically clear increase in malformed protocol events.

---

## 6. First experiments

### E0 — Scorecard t=0 baseline

**Question.** What does the current system actually do on each Mac tier?

**Run.** Current claw profile + current GBNF grammar + current KV settings + pinned model roster per tier.

**Outputs.**

- scorecard JSON for each tier;
- trace bundle for every task;
- report with hardware, OS, llama.cpp commit, model hash, quantization, context length, KV cache type, and prompt-template hash;
- known failures grouped into protocol, decoding, model, harness, grading, and Mac resource categories.

**Gate.** No Thread A decoder change starts until E0 has produced at least smoke and dev baselines.

### E1 — Structured-output backend bake-off

**Question.** Is the current GBNF path the right baseline, or should LLGuidance replace it before XGrammar work?

**Arms.** GBNF, LLGuidance, XGrammar prototype if feasible.

**Primary metrics.** Protocol conformance, schema coverage, structured-output latency, TTFT, tokens/sec during tool payload generation.

**Decision.** Pick the near-term backend for E2. Keep XGrammar/XGrammar-2 as a research track only if it beats LLGuidance on dynamic schema workload or supports schema constructs LLGuidance/GBNF cannot handle cleanly.

### E2 — Single-phase vs gated two-phase decoding

**Question.** Does gating constrained decoding recover reasoning quality without losing protocol fidelity?

**Arms.**

1. free-form decoding + post-hoc parser/repair;
2. single-phase constrained decoding;
3. gated two-phase constrained decoding.

**Primary metrics.**

- tool-use recall and precision;
- argument conformance and semantic accuracy;
- Aider/LiveCodeBench/SWE-bench Lite deltas on dev set;
- malformed response rate;
- time-to-first-meaningful-edit and total wall-clock.

**Success criterion.** Two-phase must be non-inferior to free-form coding quality on milestone runs while materially reducing malformed or unparseable tool calls. A small latency cost is acceptable only if Mac-tier end-to-end task time does not regress meaningfully.

### E3 — KV-cache quantization sweep

**Question.** Which KV cache setting maximizes useful local context per Mac tier?

**Scope.** Mainline llama.cpp options only, pinned to the exact commit used in the scorecard. Planned sweep from the original proposal: `f16`, `q8_0`, `q5_1`, `q5_0`, `q4_1`, `q4_0`, `iq4_nl`, subject to what the pinned build exposes.

**Contexts.** 32K / 64K / 128K where the model and tier can support them without pathological swapping.

**Metrics.**

- coding utility deltas;
- protocol failure deltas;
- prompt processing and decode tokens/sec;
- peak unified memory and memory pressure;
- crash/OOM rate;
- Metal/flash-attention requirements and failures.

**Decision.** Select per-tier defaults. The 16 GB tier may prioritize survival and 32K context; the 64 GB tier may prioritize quality and longer context. Do not pick one global default unless the data supports it.

### E4 — Protocol stress and negative controls

**Question.** Are improvements real, or are we overfitting prompt and schema formats?

**Run.** Add adversarial schema/name variations, no-tool tasks, similar-tool ambiguity, and stop-sequence collision cases. Include a prompt-only condition to test format sensitivity.

**Decision.** Any backend that passes the happy path but fails negative controls is not protocol-faithful.

---

## 7. Success criteria

### Thread A success

Thread A is successful if, on milestone runs:

1. protocol conformance improves materially versus the current GBNF baseline;
2. tool-use precision and recall improve or remain non-inferior;
3. coding quality is non-inferior to free-form decoding within the predeclared margin;
4. structured-output latency is improved versus the current path, or any overhead is small enough that end-to-end task time is not meaningfully worse;
5. schema coverage expands beyond the current hand-coded one-format grammar;
6. trace-level failure analysis shows fewer malformed, repaired, or silently dropped tool calls.

### Thread B success

Thread B is successful if:

1. every benchmark run emits a stable JSON result and trace bundle;
2. smoke runs are fast enough to gate decoder PRs;
3. dev runs are fast enough to compare Thread A experiments within one working day;
4. t=0 baselines exist for 16 GB, 32 GB, and 64 GB tiers;
5. at least one external harness calibration is performed using SWE-bench/mini-SWE-agent or published predictions, with version-matched expectations;
6. reports include confidence intervals, task lists, hardware metadata, and contamination notes;
7. every future decoder, KV, prompt, model, or harness change can be reported as a delta against t=0.

### Useful-ness as a second axis (note for future scope)

The current tier-eval suite is a **capability-gradient instrument** — designed to rank model/quant/context choices across 16/32/64. It has done that job: tier-16 and tier-32 capability are both up ~30% from baseline through Sprints 0–1.19, and the aggregate pass-rate has been the right scalar for that comparison. Nothing in this section proposes changing that.

What is *not* yet measured directly is the orthogonal question: "would a real user find the stack useful for their workflow at tier-16/32?" The aggregate doesn't answer it because the suite mixes three classes of test that move under different levers:

- **Agent-loop** (~7 tests: cascading-bugs, long-horizon-bugs, multi-bug-decoy, two-step-refactor, multi-bug, refactor, subtle-bug; arguably multi-file-rename, api-evolution, large-refactor) — iterative read/edit/run; sensitive to harness loop quality and context budget.
- **Codegen-ceiling** (~16 tests incl. csv-parser, expression-eval, lru-cache, parseISO, json-schema-validate) — single-shot spec implementation; sensitive to base-model quality, mostly insensitive to harness changes.
- **Infra** (prose-quality, tool-discipline, latency) — renderer/grammar/server health.

If/when a useful-ness research thread opens, it would overlay (not replace) the gradient suite by emitting per-class pass-rates in `run_summary.json` and scoring sprint deltas per-class. Bottlenecks differ by tier: tier-16 is context-budget-bound (most fails are mid-loop `exceeds 32768`), tier-32 is codegen-quality-bound (the loop runs to completion but the model can't one-shot the spec). Out of scope for the current proposal; flagged here so the suite shape doesn't have to change before that thread starts.

---

## 8. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---:|---|
| XGrammar integration into llama.cpp takes longer than expected | High | Use LLGuidance as the practical first alternative; keep XGrammar as prototype until justified. |
| Two-phase trigger misses tool calls | High | Measure trigger precision/recall separately; include forced-tool and optional-tool conditions. |
| Schema compiler silently weakens schemas | High | Maintain a feature matrix; fail closed for unsupported strict schemas. |
| SWE-bench on Apple Silicon is slow or inconsistent | High | Preflight image architecture; separate generation from grading; report native vs emulated tests. |
| Dev set variance hides real regressions | Medium | Use paired comparisons and full-set confirmation before external claims. |
| Benchmark contamination affects model conclusions | Medium | Report model release/training dates when known; use LiveCodeBench/SWE-bench Live-style date slices as hedges. |
| KV quantization changes quality subtly | Medium | Sweep against coding and protocol metrics, not perplexity or speed alone. |
| Apple Silicon thermal/memory pressure confounds latency | Medium | Fix power mode where possible; record peak memory, memory pressure, and run order. |
| Tool benchmark does not resemble coding harness tools | Medium | Pair BFCL with internal tool matrix modeled after actual file/edit/bash tools. |

---

## 9. Milestone plan

### Gate 0 — Measurement skeleton

- Define result JSON schema and trace schema.
- Add hardware/profile metadata capture.
- Add protocol matrix runner.
- Add smoke/dev/full tier selection files.

### Gate 1 — t=0 baselines

- Run current system across target Mac tiers where hardware is available.
- Publish baseline report with failure taxonomy.
- Validate SWE-bench Docker mode on Apple Silicon for selected tasks.

### Gate 2 — Backend bake-off

- Run E1 on smoke and dev.
- Pick near-term backend for E2.
- Decide whether XGrammar/XGrammar-2 remains active in this proposal or moves to a follow-on integration project.

### Gate 3 — Gated two-phase decoder

- Implement gate and constrained payload phase.
- Run E2 on dev.
- Advance to milestone only if protocol metrics improve and coding quality is non-inferior on dev.

### Gate 4 — KV-tier defaults

- Run E3 by tier.
- Publish default model/context/KV profile per Mac tier.

### Gate 5 — Milestone report

- Run milestone scorecard for selected model/config pairs.
- Publish results, traces, and analysis.
- Decide whether next research bet is fine-tuning protocol traces, MLX migration, speculative decoding, or long-horizon memory.

---

## 10. Recommended near-term decisions

1. **Approve the project, but revise the first engineering milestone.** Start with instrumentation and LLGuidance-vs-GBNF, not an immediate XGrammar port.
2. **Add BFCL and the internal Anthropic protocol matrix to the headline metrics.** SWE-bench/Aider/LiveCodeBench are necessary but do not isolate tool-call failures.
3. **Rename the Thread A target from "tool-call wrapping" to "protocol-faithful tool use."** This makes the work harder but more publishable and more useful.
4. **Split the evaluation tiers into smoke/dev/milestone/audit.** Keep the inner loop fast without pretending full coding-agent evaluation is cheap on local Macs.
5. **Make Apple Silicon Docker feasibility a Gate 1 deliverable.** If repository tests must run externally or under x86_64 emulation, say so in every report.
6. **Predeclare statistical margins.** Avoid cherry-picking small task-set deltas.

---

## 11. Reference notes verified during this review

- **XGrammar.** Reports acceleration for context-free-grammar constrained generation through vocabulary partitioning into context-independent and context-dependent tokens, with up to 100x speedups over existing approaches and near-zero overhead in serving settings.[^xgrammar]
- **XGrammar-2.** Targets dynamic agentic structured generation such as tool calling, adds TagDispatch/JIT/cross-grammar caching, and reports more than 6x speedup over existing structured generation engines for dynamic workloads.[^xgrammar2]
- **LLGuidance.** Supports JSON Schema, regex, and CFG-style grammars, and is integrated with llama.cpp via a CMake option.[^llguidance]
- **Format restriction risk.** Tam et al. report significant reasoning declines under structured format restrictions, with stricter constraints generally causing larger degradation on reasoning tasks.[^speakfreely]
- **Structured-output evaluation.** JSONSchemaBench evaluates constrained decoding across efficiency, schema coverage, and output quality for engines including llama.cpp, XGrammar, Guidance, OpenAI, and Gemini.[^jsonschemabench]
- **Anthropic tool semantics.** Claude client tools return one or more `tool_use` blocks with stop reason `tool_use`; the application executes them and returns `tool_result` blocks. Strict tool use and parallel tool use are part of the documented surface.[^anthropic-tools]
- **CodeAct.** Code-as-action outperformed text/JSON alternatives by up to 20% success rate across tested settings, supporting the broader point that action format is a first-class research variable.[^codeact]
- **SWE-bench family.** SWE-bench Lite is a 300-instance subset for cheaper evaluation; Verified is a 500-instance human-validated subset. Treat both as subsets of the same benchmark family and check overlap before making independence claims.[^swe-lite][^swe-verified]
- **SWE-bench on Mac.** SWE-bench uses Docker-based grading and recommends substantial disk/RAM. Optimized x86_64 image registries are much more complete than ARM64 registries, making Apple Silicon grading a systems risk.[^swe-docker][^epoch-swe]
- **LiveCodeBench.** Continuously collects new coding problems over time and is positioned as contamination-free/contamination-resistant for code evaluation.[^livecodebench]
- **Aider polyglot.** Tests 225 Exercism exercises across C++, Go, Java, JavaScript, Python, and Rust; official leaderboard metadata includes edit format, malformed responses, time per case, and other useful reporting fields.[^aider]
- **BFCL.** BFCL V4 evaluates function/tool calling accuracy and includes real-world data, latency, and format-sensitivity categories; V3 introduced multi-turn/multi-step function calling.[^bfcl]
- **tau-bench and AppWorld.** tau-bench evaluates tool-agent-user interaction with domain policies; AppWorld provides a high-fidelity app/API environment with programmatic state and execution checks.[^taubench][^appworld]
- **SWE-EVO and SWE-bench Pro.** Both highlight long-horizon software-engineering gaps and are best treated as audit/stretch metrics rather than inner-loop tests.[^sweevo][^swepro]
- **Qwen model context.** Qwen2.5-Coder covers 0.5B through 32B model sizes; Qwen3 introduces dense and MoE models from 0.6B to 235B with thinking/non-thinking modes; Qwen3.6-35B-A3B is a recent open-weight MoE option relevant to the 32/64 GB tiers if it fits the local runtime.[^qwen25][^qwen3][^qwen36]

---

## Appendix A — Minimal scorecard JSON shape

```json
{
  "run_id": "2026-04-30_qwen36_35b_a3b_llguidance_dev",
  "timestamp_utc": "2026-04-30T00:00:00Z",
  "hardware": {
    "tier": "64gb",
    "machine": "MacBook Pro / Mac Studio",
    "chip": "Apple Silicon model string",
    "os": "macOS version",
    "power_mode": "recorded if available"
  },
  "model": {
    "name": "model name",
    "weights_hash": "sha256-or-gguf-hash",
    "quantization": "Q4_K_M / etc",
    "context_tokens": 32768,
    "kv_cache_k": "q8_0",
    "kv_cache_v": "q8_0"
  },
  "server": {
    "runtime": "llama.cpp",
    "commit": "git-sha",
    "metal": true,
    "flash_attention": true,
    "structured_backend": "gbnf|llguidance|xgrammar-prototype",
    "decoder_policy": "free|single_phase|gated_two_phase"
  },
  "benchmark": {
    "suite": "protocol_matrix|bfcl|aider|livecodebench|swe_bench_lite",
    "split": "smoke|dev|milestone|audit",
    "task_id": "stable-task-id",
    "task_hash": "hash"
  },
  "metrics": {
    "success": true,
    "parse_ok": true,
    "schema_ok": true,
    "tool_precision_event": null,
    "tool_recall_event": null,
    "turns": 3,
    "retries": 0,
    "ttft_ms": 0,
    "time_to_first_edit_ms": 0,
    "wall_ms": 0,
    "peak_memory_mb": 0,
    "tokens_per_second_decode": 0.0
  },
  "grading": {
    "host_arch": "arm64|x86_64",
    "docker_mode": "native|emulated|external",
    "image": "image-ref",
    "result": "passed|failed|error"
  }
}
```

---

## References

[^xgrammar]: Yixin Dong et al., "XGrammar: Flexible and Efficient Structured Generation Engine for Large Language Models," arXiv:2411.15100, https://arxiv.org/abs/2411.15100.
[^xgrammar2]: Linzhang Li et al., "XGrammar-2: Dynamic and Efficient Structured Generation Engine for Agentic LLMs," arXiv:2601.04426, https://arxiv.org/abs/2601.04426.
[^llguidance]: LLGuidance project and llama.cpp integration notes, https://github.com/guidance-ai/llguidance and https://github.com/ggml-org/llama.cpp/blob/master/docs/llguidance.md.
[^speakfreely]: Zhi Rui Tam et al., "Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models," arXiv:2408.02442, https://arxiv.org/abs/2408.02442.
[^jsonschemabench]: Saibo Geng et al., "Generating Structured Outputs from Language Models: Benchmark and Studies," arXiv:2501.10868, https://arxiv.org/abs/2501.10868.
[^anthropic-tools]: Anthropic Claude API docs, "Tool use with Claude," https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview.
[^codeact]: Xingyao Wang et al., "Executable Code Actions Elicit Better LLM Agents," arXiv:2402.01030, https://arxiv.org/abs/2402.01030.
[^swe-lite]: SWE-bench Lite, https://www.swebench.com/lite.html.
[^swe-verified]: SWE-bench Verified, https://www.swebench.com/verified.html.
[^swe-docker]: SWE-bench Docker setup guide, https://github.com/SWE-bench/SWE-bench/blob/main/docs/guides/docker_setup.md.
[^epoch-swe]: Epoch AI SWE-bench Docker image registry, https://github.com/epoch-research/SWE-bench.
[^livecodebench]: LiveCodeBench, https://livecodebench.github.io/.
[^aider]: Aider LLM leaderboards, https://aider.chat/docs/leaderboards/.
[^bfcl]: Berkeley Function-Calling Leaderboard, https://gorilla.cs.berkeley.edu/leaderboard.html.
[^taubench]: Shunyu Yao et al., "tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains," arXiv:2406.12045, https://arxiv.org/abs/2406.12045.
[^appworld]: Harsh Trivedi et al., "AppWorld: A Controllable World of Apps and People for Benchmarking Interactive Coding Agents," arXiv:2407.18901, https://arxiv.org/abs/2407.18901.
[^sweevo]: Minh V. T. Thai et al., "SWE-EVO: Benchmarking Coding Agents in Long-Horizon Software Evolution Scenarios," arXiv:2512.18470, https://arxiv.org/abs/2512.18470.
[^swepro]: Xiang Deng et al., "SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?" arXiv:2509.16941, https://arxiv.org/abs/2509.16941.
[^qwen25]: Binyuan Hui et al., "Qwen2.5-Coder Technical Report," arXiv:2409.12186, https://arxiv.org/abs/2409.12186.
[^qwen3]: An Yang et al., "Qwen3 Technical Report," arXiv:2505.09388, https://arxiv.org/abs/2505.09388.
[^qwen36]: Qwen, "Qwen3.6-35B-A3B: Agentic Coding Power, Now Open to All," https://qwen.ai/blog?id=qwen3.6-35b-a3b.
