# Tier-eval pilot loops — escalation finding

**Date:** 2026-04-29
**Branch:** `feature/iteration-distribution-test`
**Context:** Two iterative pilot loops (per [TIER-EVAL-SUITE-AUDIT.md](TIER-EVAL-SUITE-AUDIT.md) and the implementation plan at `~/.claude/plans/you-re-a-senior-software-unified-eich.md`) attempted to populate the audit-identified taxonomy gaps (Class C, Class D, more diverse Class A) with new test candidates. Both loops converged to the same finding: at tier-64 with the current model, the proposed test types do not produce model-level failures.

## Pilot loops

### Loop 1 (n=5 per cell, 10 runs per test, retrofit-aware data only)

| Test | Pass rate | Iter med/p90 | Notes |
|---|---|---|---|
| agent-single | 20/20 = 100% | 2/5 | Audit cited 33% TTFT-fail (Qwen3-Coder); did not reproduce |
| parseISO-with-timezone | 19/19 = 100% | 4/15 | Some iter variance, no failures |
| eight-functions (8 files) | 10/10 = 100% | 4/6 | Audit's "may be too easy" risk note materialized |
| tool-confusion-redundant-verifies | 10/10 = 100% | 4/4 | Model ignored red herrings entirely |
| subtle-broken-spec | 9/10 = 90% | 5/7 | 1 "error" terminal (not assertion-fail); spec-lie trip-wire ineffective |

### Loop 2 (n=5 per cell, 10 runs per test)

After loop 1, dropped parseISO + tool-confusion from the pilot, redesigned eight-functions to 12 files with 4 cross-file dependencies, sharpened subtle-broken-spec's prompt to explicitly show compact-form examples ("60 → '1m'"), and added two existing C-tagged tests (large-refactor, api-evolution) with `writeAssertionResult()` retrofit.

| Test | Pass rate | Iter med/p90 | Loop-1 → Loop-2 |
|---|---|---|---|
| agent-single | 10/10 = 100% | 2/5 | Same |
| eight-functions (12 files + 4 cross-deps) | 10/10 = 100% | 4/4 | Redesigned; still passes |
| subtle-broken-spec (sharpened) | 10/10 = 100% | 5/11 | Sharpened; 90% → 100% |
| large-refactor | 10/10 = 100% | 4/7 | First pilot |
| api-evolution | 10/10 = 100% | 4/4 | First pilot |

## Finding

**Only expression-eval produces model-level failures at tier-64 with this model.** The audit's coverage-gap proposals (Class B target, Class C target via multi-file pressure, Class D target via tool-confusion) did not produce failures even with redesigned harder versions. The K-rated agent-single's documented 33% TTFT-fail did not reproduce on the current model.

This is consistent with the audit's *risk* notes (each new proposal flagged "may be too easy"); empirically all of those risks materialized. The audit's coverage-gap *theory* — that we can populate B/C/D classes by designing tests for each — is empirically false at this configuration.

### Per-test failure-rate summary (across all retained data: production sweep + loop 1 + loop 2)

| Test | n | passed | fail rate | Source |
|---|---|---|---|---|
| **expression-eval** | 40 | 29 | **27.5%** | production sweep (2026-04-29) |
| csv-parser | 40 | 40 | 0% | production sweep |
| lru-cache | 40 | 40 | 0% | production sweep |
| agent-single | 30 | 30 | 0% | loops 1+2 (retrofit-aware n=20) |
| api-evolution | 10 | 10 | 0% | loop 2 |
| eight-functions | 20 | 20 | 0% | loops 1+2 |
| large-refactor | 10 | 10 | 0% | loop 2 |
| parseISO-with-timezone | 19 | 19 | 0% | loop 1 |
| subtle-broken-spec | 20 | 20 | 0% | loops 1+2 |
| tool-confusion-redundant-verifies | 10 | 10 | 0% | loop 1 |

## Why the redesigns didn't trip the model

Three plausible explanations, none of which can be falsified from this data alone:

1. **Tier-64 is well above the model's natural failure threshold for these task types.** The model has been trained on enough multi-file refactors, helper-function batteries, and ISO-date parsing that the harder-but-still-conventional designs don't push it. To get failures we'd need genuinely novel or pathological task shapes.
2. **The model reads verify scripts and matches them rather than working from the prompt.** This would explain why "spec-lie" trip-wires are ineffective: the model ignores the prompt's misleading examples and writes code matching the verify file. Loop-2 subtle-broken-spec data is consistent with this (model produced verbose form despite explicit compact-form examples in the prompt).
3. **Failures are concentrated on test designs that contain *multiple semantic ambiguities or edge cases that interact*.** expression-eval is the only test in the suite with this property — 25+ assertions covering operator precedence, associativity, error messages, function-call semantics, and variable lookups. Single-axis tests (multi-file refactor, helper batteries, single-spec parsers) don't produce failures.

If (3) is correct, the next-attempt design would be a single test with a wide spec-edge surface (more like expression-eval, less like the audit's narrow proposals). But that's effectively just "more expression-evals" and still concentrates in Class A.

## Recommended path forward (escalation to user)

The plan §P3.3 stop condition was "Cap at 3 iterations; if not converged, escalate." Two iterations converged to the same finding; loop 3 is unlikely to change the answer.

Three concrete options:

### Option A — accept the 11-failure stratum and proceed to W4 (recommended)
- Use the existing 2026-04-29 production sweep CSV.
- 11 expression-eval failures = the failed-tail.
- Run W4 Pass 1 + Pass 2 + κ on those 11 (plus the 26 productive successful-tail runs already classified per `W4-pass1-productive-agent-n20-v1.csv`).
- Cohen's κ CI will be wide (~±0.33 per audit estimate at n=11) but the point estimate is the answer we have. Document the wide CI as a methodology limitation.
- **Time cost:** ~1–2 hours (run existing W4 tooling on existing data).
- **Risk:** wide CI may not satisfy a downstream consumer expecting ±0.18 or even ±0.25.

### Option B — change the experimental condition (medium-effort)
- Run the pilot at a different tier (tier-32 — smaller model, more failures expected) or at a longer-context setting.
- Pros: probably produces more failures across more test types; restores the multi-test diversity the audit wanted.
- Cons: changes what we're measuring. Tier-32 results don't generalize to tier-64; sampler comparison is no longer apples-to-apples with the audit's prior sampler-grid data.
- **Time cost:** ~3–5 hours (re-run sweep at new tier + W4).

### Option C — pause and replan (low-effort, high-judgment)
- Recognize the audit's coverage-gap theory failed empirically.
- Discuss with stakeholders whether the iteration-distribution work needs different framing.
- May involve revising the W4 taxonomy (e.g., are A/C/D the right cuts at all if 95% of runs are Class A?).
- **Time cost:** zero this round; downstream impact unclear.

## Mechanical state

- `.claw-runtime/iter-distribution-runs.csv` currently contains: production sweep (120 rows) + loop-2 pilot (50 rows) + small residual loop-1 retrofit-aware data (a few rows). 172 rows total post-loop-2.
- `.claw-runtime/iter-distribution-runs.pre-pilot-20260429.csv` is a frozen snapshot of the production sweep CSV before any pilot.
- `.claw-runtime/_loop1-pilot-archive/` contains the loop-1 run-id directories (79 of them).
- The new test files (`parseISO-with-timezone.test.js`, `eight-functions.test.js`, `tool-confusion-redundant-verifies.test.js`, `subtle-broken-spec.test.js`) remain in the codebase as regression tests but are **not** in the iter-distribution sweep driver.
- `agent-single.test.js`, `large-refactor.test.js`, `api-evolution.test.js` have `writeAssertionResult()` retrofit and 240s claw timeout convention; all three are now telemetry-compatible if added to a future sweep.
- W4-TAXONOMY.md amendment dated 2026-04-29 deprecates Class E. Class B is recommended for deprecation pending one more decision.
