# Memo: Tier-16 model selection — 2026-04-27 evening

Continuation of [`TIER-EVAL-MEMO-20260427.md`](TIER-EVAL-MEMO-20260427.md). Earlier
in the day we ran the existing 9-test tier-eval and pinned `repeat-penalty=1.05`.
This session refactored the per-tier model lineup: shrink the 16 GB and 32 GB
models, keep 64 GB, then re-eval.

## What changed

| Tier | Before | After | Reason |
|------|--------|-------|--------|
| 16   | Qwen3-14B Q4_K_M (8.4 GB) | **Qwen2.5-7B-Instruct Q5_K_M (5.07 GB)** | 14B at tier-16 collapsed the tier hierarchy (same model as tier-32) and at 8.4 GB sat at 50%+ of a 16 GB host's RAM. Qwen3-8B was tried first and rejected — see "Qwen3-8B rejection" below. |
| 32   | Qwen3-30B-A3B-Instruct-2507 UD-Q4_K_XL (16 GB MoE) | **Qwen3-14B Q4_K_M (8.4 GB)** | Smaller dense alternative within budget. Passes 11/11 cleanly with default thinking-on; the 14B finishes its `<think>` block inside the 256-token wrap-test budget where the 8B can't. |
| 64   | Qwen3-Coder-30B-A3B-Instruct UD-Q6_K_XL (~24 GB) | (unchanged) | Reigning production. 9/9 on original eval, fastest tool-roundtrip in the lineup. |

## Qwen3-8B rejection (tier-16 attempt 1)

Qwen3-8B is a hybrid thinking model (emits `<think>...</think>` blocks). The
`tool-discipline` test calls the bridge with `max_tokens=256` and asserts ≥90%
of calls land on `stop_reason=tool_use`. With unrestricted thinking, the 8B
burns the 256-token budget on `<think>` content and never opens `<tool_call>` —
wrap rate landed at 6/10 (4× `stop=max_tokens`). Three plist configurations
exhausted before giving up:

| `--reasoning` flag | wrap-rate | tool-disc | refactor | other 6 |
|--------------------|-----------|-----------|----------|---------|
| (none) — default thinking on | 18/20 | 6/10 ✖ | ✔ 29 s | ✔ |
| `off` | 20/20 | 10/10 | ✖ 3.6 s (no-op fix) | ✔ |
| `--reasoning-budget 128` | 9/20 ✖ | 7/10 ✖ | ✖ 6.5 s | ✔ |

The model wants either *full* thinking or *zero* — capping was worst-of-both.
With thinking off the 8B isn't strong enough to spot the seeded off-by-one in
one pass; with thinking on it can't finish thinking + emit `<tool_call>` inside
256 tokens. Ergonomics-wise, neither setting is acceptable.

Raw transcripts: trimmed (8B rejection trail recoverable from git history;
the rejection table above captures the salient pass/fail data).

## Replacement search

A two-pass research sweep eliminated structurally-incompatible candidates
(Hermes/Mistral/Phi tool-call wrappers that `claw.gbnf` rejects, hybrid
thinking models, models without `<tool_call>` in their chat template):

- **Eliminated**: DeepSeek-Coder-V2-Lite (no `<tool_call>` template),
  Granite-3.3 (hybrid thinking), Devstral / Phi-4-mini (wrong wrapper),
  Yi-Coder (no tool-calling), plain Qwen3-1.7B/4B (hybrid thinking),
  Qwen2.5-Coder-7B-Instruct (documented `<function_call>` regression — see
  [HF discussion #22](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct/discussions/22)).
- **Survivors**: Qwen3-4B-Instruct-2507 UD-Q6_K_XL (3.66 GB, native non-thinking)
  and Qwen2.5-7B-Instruct Q5_K_M (5.07 GB, dense non-coder Instruct) and
  Qwen3-14B Q4_K_M with `enable_thinking=False` (8.4 GB, hybrid).

Two A/Bs ran on `EVAL_TIERS=16` against the candidate models.

## A/B results

### Original eval (9 tests)

| Test | A: Qwen2.5-7B Q5 (5.07 GB) | B: Qwen3-14B Q4 (8.4 GB) |
|------|----------------------------|--------------------------|
| Tests passed | 9/9 ✔ | 9/9 ✔ |
| TTFT median | 140 ms | 88 ms |
| Tool-roundtrip median | **383 ms** | 2442 ms |
| agent-single | 1.3 s | 8.9 s |
| agent-parallel | 5.1 s | 19.3 s |
| code-self-test | 4.9 s | 27.9 s |
| refactor (off-by-one) | 6.6 s ✔ | 36.4 s ✔ |
| Wrap rate / discipline | 20/20, 10/10 | 20/20, 10/10 |

7B is ~6× faster end-to-end on the same workload. Both pass deterministically.
Result files:
[20260427-2241.md](../logs/TIER-EVAL-RESULTS-20260427-2241.md) (7B),
[20260427-2243.md](../logs/TIER-EVAL-RESULTS-20260427-2243.md) (14B).

### Harder evals — `multi-file-rename` and `subtle-bug` (default-sort gotcha)

Two new tests added under `__tests__/tier-eval/` to stress capabilities the
existing suite doesn't:

- **`multi-file-rename.test.js`** — three files seeded; index.js fails because
  lib.js doesn't yet export `transform`. Model must rename `compute → transform`
  in lib.js, change body to `x*2+1`, and update the call site in service.js.
  Tests cross-file awareness + multi-step planning.
- **`subtle-bug.test.js`** — median.js with the JS default-sort gotcha
  (`.sort()` is lexicographic — `[1,100,2,50,3]` becomes `["1","100","2","3","50"]`,
  median returns 100). Fix is `.sort((a,b)=>a-b)`. Tests stdlib knowledge that
  pattern-matching can't supply.

| | 7B run 1 | 7B run 2 | 14B (tier-16) | 14B (tier-32) | 30B (tier-64) |
|---|---|---|---|---|---|
| multi-file-rename | ✔ 15.8 s | ✖ 50.4 s | ✖ 51.7 s | ✔ 68.7 s | ✖ **240 s claw timeout** |
| subtle-bug | ✔ 132.5 s | ✖ 60.3 s | ✔ 54.6 s | ✔ 59.5 s | ✔ **21.0 s** |
| Tier total | 11/11 | 9/11 | 10/11 | 11/11 | 10/11 |

Result files:
[20260427-2313.md](../logs/TIER-EVAL-RESULTS-20260427-2313.md) — tier-32 + tier-64
final harder-evals run (kept). Per-candidate harder-eval runs on tier-16
(7B run 1 lucky pass, 14B at tier-16, 7B run 2 with both new ✖) were trimmed;
the per-run timings in the table above are the salient signal and the raw
logs are git-recoverable.

### Read on the harder evals

- **`multi-file-rename` is currently noisy, not capability-discriminating.**
  Every model failed it at least once. The 30B (production tier-64, strongest
  in the lineup) went 0/1 *and* hit claw's hardcoded 240 s timeout — a strong
  indicator the failure is a tool-use loop or claw retry pathology, not a
  capability ceiling. The 14B passed once (tier-32) and failed once (tier-16);
  the 7B passed once and failed once. These are noise-class numbers at n=1.
- **`subtle-bug` discriminates by speed, not pass/fail.** Order:
  30B 21 s → 14B ~58 s → 7B 60–132 s. The 7B failed once of two runs — its
  struggle envelope is real but not crippling.
- **The 132.5 s anomaly hypothesis (claw renderer warm-up tail?) was wrong.**
  Run 2 took 60 s and *failed* — i.e., 132.5 s on run 1 was the 7B genuinely
  iterating its way to a fix, not test-harness noise.

## Decision

Tier-16 → **Qwen2.5-7B-Instruct Q5_K_M**. The structural argument carried:
14B at tier-16 collapsed the hierarchy (identical to tier-32 GGUF) and pushed
RAM headroom on the target host class. The harder-evals signal isn't clean
enough at n=1 to override that. 7B is deterministic on the original 9 tests,
6× faster, smaller, and structurally a tier below the 32 GB profile.

Tier-32 → **Qwen3-14B Q4_K_M**. 11/11 on harder evals, 9/9 original, comfortable
RAM headroom on a 32 GB host. No `--reasoning` flag needed; the 14B finishes
thinking inside the wrap-test budget.

Tier-64 → **Qwen3-Coder-30B-A3B-Instruct UD-Q6_K_XL** (unchanged). Reigning
production model. The `multi-file-rename` failure is documented as an artifact
suspicion in [`host/llama-server/docs/TODO-MULTI-FILE-RENAME-FLAKE.md`](../../llama-server/docs/TODO-MULTI-FILE-RENAME-FLAKE.md);
not enough evidence to unseat the strongest model in the lineup over a single
flaky test.

## Files changed (this commit)

- `host/llama-server/models.conf` — `TIER_16_GGUF` repointed to
  `Qwen2.5-7B-Instruct-Q5_K_M.gguf` plus rationale comment.
- `host/llama-server/README.md` — tier table updated; download instructions
  updated; rationale link to this memo added.
- `host/llama-server/launchd/com.mac-llm-lab.llama-server.plist` — reverted to
  baseline (no `--reasoning` flag); flag is unnecessary because the 7B is
  non-thinking and the 14B/30B finish thinking within budget. Earlier
  experiments with `--reasoning off` and `--reasoning-budget 128` are documented
  above; both were rejected.
- `host/test/run-tier-eval.sh` — header banner updated.
- `host/test/__tests__/tier-eval/multi-file-rename.test.js` — NEW.
- `host/test/__tests__/tier-eval/subtle-bug.test.js` — NEW.
- `host/test/__tests__/tier-eval/refactor.test.js` — comment refresh
  (stale "14B model" reference).
- `host/test/__tests__/tier-eval/code-self-test.test.js` — comment refresh
  (stale "14B tier" reference).
- `host/llama-server/docs/TODO-MULTI-FILE-RENAME-FLAKE.md` — NEW.
- `host/test/docs/TIER-EVAL-MEMO-20260427-evening.md` — this memo.

## What's left (deferred)

1. **Investigate the multi-file-rename claw timeout on tier-64.** Tracked in
   [`host/llama-server/docs/TODO-MULTI-FILE-RENAME-FLAKE.md`](../../llama-server/docs/TODO-MULTI-FILE-RENAME-FLAKE.md).
   Strong-model 240 s timeout on a workspace edit task points at claw, not the
   model. Needs a transcript inspection from `/workspace/.claw/` during a fresh
   reproduction run.
2. **Characterize 7B harder-eval pass rate at n=5+.** Current data is 1/2 on
   each new test — too few samples for a real reliability number. Good
   off-hours candidate: loop the harder evals overnight against tier-16 and
   report the rate. Decision-quality data; not a blocker for this commit.
