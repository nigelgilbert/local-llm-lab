# Proposal: Three remaining behavioral fixes for the claw-code stack

*mac-llm-lab, 2026-05-02. Carve-out of the still-open items from the earlier `CLAW-CODE-PROPOSAL.md`. Calibration work and per-turn telemetry have shipped (Sprints 0–1.19, W1 telemetry in `f7e8ef5`, tier-64 sampler grid in `c727d31`, tier-32 model lock in `d5f7054`). What remains is three behaviorally-load-bearing changes that need an A/B before they can land.*

## Why these three, why now

The harness is no longer the binding constraint at tier-64. The remaining failures the lab still sees — variance on round-2 tasks, the `multi-bug-decoy` long-tail at 64k context, and the perceptual-snap regression introduced with the Qwen3.6 swap — are not capability-bound. They're behavioral, in the sense that the stack permits a degree of freedom (preamble length, iteration count, prefill cost) that the model occasionally exploits to its detriment.

Each item below proposes one structural fix, with a clean A/B and an acceptance bar.

## Proposal 1 — Cap the grammar prelude at 80 characters

**Current state.** [host/llama-server/grammars/claw.gbnf:28-32](../host/llama-server/grammars/claw.gbnf#L28-L32):

```
root             ::= prelude? response
prelude          ::= prose-char+
```

The prelude is unbounded.

**Change.** Replace `prelude ::= prose-char+` with `prelude ::= prose-char{0,80}` — the soft alternative sketched in [`TODO-GRAMMAR-PRELUDE.md`](../host/llama-server/docs/TODO-GRAMMAR-PRELUDE.md). 80 chars ≈ one short sentence; preserves "I'll start by..." but forbids "Let me think about this. The user wants me to first..." which is the failure mode.

**Why.** Two convergent observations:

1. **`agent-single` 1-in-3 flake on Coder-30B** — model emitted prose, hit no tool call, ended turn. Lived inside the prelude branch.
2. **`multi-bug-decoy` long-tail at 64k context on Qwen3.6** — structurally similar; model takes a "narrate then call" path under one sampler regime that converges short under another.

The full drop (`root ::= tool-call | trailing-text`) is too aggressive — it could regress models that legitimately need a brief plan-statement. The 80-char cap is the minimum intervention.

**Risk.** Small grammar changes have surprised this lab before — the CLAUDE.md plant regressed tier-64 by 2 tests on Coder-30B. This needs a real A/B, not a smoke test.

**A/B design.** Two cells: current grammar (control), 80-char cap (treatment). Full 33-test suite × 3 tiers × n=5. ≈990 test-runs, ≈24h M5 wall-clock; can't be parallelized, can't shrink n below 5 without putting borderline calls back into Wilson-CI noise.

**Acceptance.** Capped pass-rate ≥ control everywhere, with a meaningful improvement on `agent-single` (Coder-30B 1-in-3 flake → 0% if reproduced) and lower preamble-token cost on `tool-discipline`. Promote on green; revert otherwise.

## Proposal 2 — Attribute and recover the +56ms TTFT regression

**Current state.** TTFT moved from 81ms median (Coder-30B) to 137ms median (Qwen3.6-35B-A3B) at the swap. No commit attributes or recovers it.

**Change.** Diagnose the source, then act on the diagnosis.

**Two hypotheses.**

1. **Hybrid SSM/attention prefill cost.** Qwen3.6 has a 4-block full-attention interval over 40 blocks — structurally different from a pure-attention 30B and could legitimately add ~50ms to first-token. If this is the cause, the latency is intrinsic to the model and not recoverable without a different model.
2. **`chat_template_kwargs.enable_thinking=false` round-trip overhead.** [host/litellm/litellm-config.yaml:67-78](../host/litellm/litellm-config.yaml#L67-L78) carries an `extra_body` block that LiteLLM has to translate per request. If the Python-dict round-trip is adding 30–50ms, that's recoverable by pinning the kwarg at the llama.cpp env-var layer or short-circuiting in a custom LiteLLM provider.

**Diagnostic.** Direct-vs-bridge benchmark. 50 requests of an empty-tool prompt to llama-server's `/v1/chat/completions` directly with the kwarg in the body, then 50 through the bridge with the same body. Delta is bridge cost; absolute floor is model cost. If bridge cost > 30ms, hypothesis (2) is the candidate.

**Acceptance.**
- A short memo (`research/ttft-attribution.md`) with the direct-vs-bridge numbers and a verdict on which hypothesis the data supports.
- If hypothesis (2): a fix that removes the `extra_body` round-trip without unifying the `claw` and `claw-llama` LiteLLM routes (the asymmetry is deliberate per the original proposal's risk section). Target: TTFT back under 100ms median.
- If hypothesis (1): file the finding, accept the cost, document it in `profiles.md`. Don't paper over it with sampler tricks.

**Why it matters.** TTFT is the perceptual contract for agent-loop snappiness. 56ms × 5–10 turns is a quarter to half a second the user feels per session. If recoverable, it's recoverable cheaply.

## Proposal 3 — Add a `context_overflow` failure class and an iteration cap

**Current state.** [host/test/scripts/classify-failures.sh:1-15](../host/test/scripts/classify-failures.sh#L1-L15) splits failures into three categories: `timeout`, `discipline`, `capability`. There's no separate class for context-overflow, and the harness has no iteration cap.

**Change.** Two parts:

1. **Classifier.** Add a fourth category, `context_overflow`, distinguishable from `timeout` by inspecting the per-iteration record in `iterations.jsonl` (W1 telemetry, already shipped) — overflow shows as token-budget exhaustion, not wall-clock exhaustion. The productive-iteration taxonomy in `scripts/analysis/iter-distribution.py` characterizes iteration productivity but doesn't split this failure class; that piece is still missing.
2. **Harness-side iteration cap.** Cap turns per agentic test (start at 12 tool calls; tunable in `models.conf`). Surface "agent over budget" as a distinct failure class and emit it in `run_summary.json`.

**Why.** The 32k → 64k context bump didn't break the model — it gave the iteration-count distribution room to stretch into the new ceiling. Same model, same prompt, same sampler: 6/6 deterministic at 32k → 1-of-2 fail at 64k on `multi-bug-decoy`, because the model decided to take a longer path. Every long-horizon agentic eval will eventually hit this if context grows. Worth solving once at the harness layer rather than catching it via context-overflow errors masquerading as timeouts.

**Why a cap and not compaction.** Compaction (summarize-and-restart) is the cloud-agent answer. On-device the cost of an extra LLM call is high relative to the work being saved — a literature pass on cheaper KV-cache truncation patterns is research-grade and explicitly out of scope here. The iteration cap is the minimum intervention that makes the failure mode visible without committing to compaction architecture.

**Acceptance.**
- `classify-failures.sh` emits four categories; `context_overflow` is distinguishable from `timeout` on the existing logs (re-classify the `multi-bug-decoy` 64k failure as `context_overflow`, not `timeout`).
- Iteration cap configurable per tier; over-budget runs surface a `agent_over_budget` row in `run_summary.json`.
- Re-run `multi-bug-decoy` × n=10 at tier-64/64k under the cap; verify no test changes verdict and the cap fires only on the long-tail runs.

## Sequencing

The TTFT investigation is pure bridge-side work — no M5 time, can run any day. The classifier + iteration cap is harness-side; can ship before any sweep. The grammar A/B is the binding constraint — 24h M5 wall-clock, sequence last so the classifier is in place to characterize any regressions the cap exposes.

**Order:** classifier + cap → TTFT → grammar A/B.

## Out of scope

Compaction architecture, speculative decoding, multimodal, prose-smush, the `mini-vm` ceiling probe — all worth revisiting after these three land, not before.
