# Tier-eval suite audit — handoff to analysis team

**Date:** 2026-04-29
**Branch:** `feature/iteration-distribution-test`
**Status:** planning artifact for the analysis team. No tests changed in this commit.

## Context

The iteration-distribution sweep needs a calibrated test suite that produces enough *failed* runs at n=20 per cell to support W4-style failure-mode classification with usable Cohen's κ. The original suite (csv-parser, lru-cache, expression-eval) was selected for "noisy at tier-64" behavior in earlier sampler-grid work, but at the widened claw timeouts (240/240/360s) needed for uncensored traces, csv-parser and lru-cache produced 0/40 failures each — yielding a single-cell failed-tail of 11 runs total, dominated by expression-eval. That's below the κ-CI floor (~±0.33 at n=11, vs target ±0.20 at n≈25–30) and offers no cross-cell variance.

Goal of this audit: identify which existing tier-eval tests carry usable failure signal at the current calibration, identify coverage gaps in the W4 taxonomy classes, and propose concrete new tests for the analysis team to consider implementing.

**What this doc is not:** a methodology decision. The analysis team owns whether to implement any of the proposals, whether to re-stratify by sampler arm, and whether to revise the W4 taxonomy itself.

## Section 1 — Existing-suite audit

Recommendations: **K** (keep), **D** (drop), **Q** (quarantine for harness fix), **C** (calibrate — no data yet, run a small pilot before committing to inclusion).

| Test | Empirical fail rate at tier-64 | Source | Reco | One-line rationale |
|---|---|---|---|---|
| adversarial-input | **42%** (10/24) | logs/a2/SAMPLER-GRID (deleted) | **K** | Slugify edge cases produce model-level spec-failure trace; high signal-per-run. |
| agent-parallel | no data | — | **C** | Tool-discipline target; pilot first to see if it produces gradeable traces vs hard-fail. |
| agent-single | ~33% (Qwen3-Coder TTFT-fail) | calibration notes | **K** | Rare failure mode (model emits prose, no tool call). One of the few D-class candidates. |
| algorithm-intervals | no data | — | **C** | Edge-case-rich (touching intervals, unsorted, containment); pilot. |
| api-evolution | no data | — | **C** | Multi-file refactor (2 files, signature change). Class C/multi-file candidate. |
| cascading-bugs | 4% (1/24) | logs/a2/SAMPLER-GRID (deleted) | **D** | Too stable; n=20 produces 0–1 failures. No κ contribution. |
| code-self-test | no data | — | **C** | Likely high pass; deprioritize unless pilot surprises. |
| comment-spec | 8% (2/24) | logs/a2/SAMPLER-GRID (deleted) | **D** | Too stable; below n=20 threshold for ≥4 failures per cell. |
| csv-parser | **0%** (0/40) at widened timeout | n=20 noisy-suite sweep 2026-04-29 | **D** | Was the calibration anchor; now produces no failures. Drop from iter-dist sweep (keep in tier-eval suite for general regression). |
| deep-equal | **25%** (6/24) | logs/a2/SAMPLER-GRID (deleted) | **K** | NaN / +0/-0 corner cases; consistent fail trigger; clean spec-precision trace. |
| dependency-graph | no data | — | **C** | Cycle detection + topological sort; pilot. Plausible spec-precision target. |
| distractor | no data | — | **C** | Debugging-class test; pilot. |
| expression-eval | **25%** (10/40) at widened timeout | n=20 noisy-suite sweep 2026-04-29 | **K** | 25+ assertions, recursive-descent parser; the cell carrying failed-tail today. |
| json-schema-validate | no data | — | **C** | Recursive descent + error accumulation; pilot. |
| large-refactor | no data | — | **C** | 5 call sites × 4 files. Strongest cross-cell candidate for context-drift (C). Pilot. |
| latency | informational only | — | **D** | Not pass/fail. Belongs in a separate health-check suite, not iter-dist. |
| long-horizon-bugs | 4% (1/24) | logs/a2/SAMPLER-GRID (deleted) | **D** | Too stable at tier-64. Consider re-tagging at tier-128 if that exists. |
| lru-cache | **0%** (0/40) at widened timeout | n=20 noisy-suite sweep 2026-04-29 | **D** | Same story as csv-parser. Drop from iter-dist; keep in regression suite. |
| mini-vm | **100% fail** but timeout-bound | logs/TIER-EVAL-RESULTS-20260428-1142 | **Q** | Hits 240s timeout consistently; not model-level failure. Quarantine until either (a) timeout extension produces real model-failure data, or (b) harness limit raised. |
| multi-bug | no data | — | **C** | 3 independent bugs in one file. Pilot. Plausible Class A target. |
| multi-bug-decoy | **harness-blocked** | logs/TIER-EVAL-RESULTS-20260428-1142 | **Q** | LiteLLM MidStreamFallbackError on context-size-exceeded. Fix harness, then re-evaluate. |
| multi-file-rename | no data | — | **C** | Cross-file rename + signature change. Plausible C-class. Pilot. |
| null-default | no data | — | **C** | `??` vs `\|\|` gotcha. Likely high pass; deprioritize. |
| prose-quality | 12% (3/24) | logs/a2/SAMPLER-GRID (deleted) | **D** | Borderline; format-output failures aren't the failure mode iter-dist cares about. Better suited to a prose-focused suite. |
| refactor | no data | — | **C** | Off-by-one fix. Likely high pass. |
| spec-compliance | no data | — | **C** | Tightly-spec'd 4-bullet output; pilot. Plausible spec-precision class. |
| spec-precedence | no data | — | **C** | 5 ordered rules; pilot. |
| state-machine | **17%** (4/24) | logs/a2/SAMPLER-GRID (deleted) | **K** | FSM transitions + invalid-state handling. Good stateful-logic candidate. Borderline n=20 contributor. |
| subtle-bug | no data | — | **C** | Lexicographic vs numeric sort. Single-line debugging fix; likely high pass. |
| tool-discipline | informational only | — | **D** | Health check, not iter-dist material. |
| two-step-refactor | no data | — | **C** | Extract + fix latent bug. Plausible C-class candidate. Pilot. |

**Summary of recommendations:**

- **Keep (5):** adversarial-input, agent-single, deep-equal, expression-eval, state-machine.
- **Drop (10):** cascading-bugs, comment-spec, csv-parser, latency, long-horizon-bugs, lru-cache, prose-quality, tool-discipline (and the implicit drop of csv-parser/lru-cache from iter-dist already done in commit `c145343`).
- **Quarantine (2):** mini-vm (timeout-bound), multi-bug-decoy (harness-blocked).
- **Calibrate (14):** any test marked `C` above. Pilot at n=5 per (test, sampler) cell — 30 runs total, ~30 min wallclock — to filter on empirical fail rate ≥15% before committing to a full sweep.

## Section 2 — Coverage gap analysis (against W4 taxonomy)

The W4 taxonomy has six classes. After re-stratification on the n=20 archive, the failed-tail Pass 1 distribution was: A=8, D=3, C=1, E=1, F=1, B=0. The n=20 noisy-suite sweep is structurally similar (all 11 failures concentrated in expression-eval, expected to be A-dominant).

**Class A (verify-loop) — over-represented.** Every "noisy" test we have (the K column above) produces A-class failures. This is what we'd expect from "model attempts to fix, can't converge in budget." A-class is the dominant model failure mode at this difficulty; that's a finding, not a test-design problem.

**Class B (wrong-module-shape) — empty (0 in both sweeps).** None of the existing tier-eval tests have non-trivial Node module-shape requirements. All workspaces use plain `.js` files, no `package.json` with `"type": "module"`, no `.cjs` / `.mjs` distinction, no transpilation step. To populate B, we'd need tests that intentionally trigger ESM/CJS confusion. *Whether B is worth populating is a methodology call:* if the production deployment never trips this, B may not be a useful class to keep in the taxonomy.

**Class C (context-drift) — under-represented (1/14).** Existing tests are mostly single-file, single-function. Multi-file or many-function tests (large-refactor, long-horizon-bugs) exist but at tier-64 the model handles them without context pressure. To populate C, we'd need either harder multi-file tests or longer-context-window tests where rereading + re-deriving subtasks shows up.

**Class D (grammar/tool dead-branch) — under-represented (3/14).** Most D-class signals in the n=20 archive came from expression-eval runs that hit edit_file shape errors (e.g., "old_string not found in file"). agent-single's "model emits prose, no tool call" failure mode is the cleanest D candidate but agent-single isn't currently in the iter-dist suite. Adding it would help.

**Class E (infra) — empty after timeout widening.** Class E was structurally tied to censoring under tight timeouts; with 0 timeouts in the new sweep, E loses its mechanical signal. *This may be a class to drop from the taxonomy*, since "normal turn count, abnormal non-model time" is no longer empirically observable in our setup.

**Class F (unclassified) — properly small (≤7%).** This is the success of the stratum-split — F is now used only for genuinely insufficient-evidence cases (e.g., the iter_count=0 harness-error run).

## Section 3 — New test proposals

Five candidates, each rated for the gap it addresses. The analysis team owns implementation decisions; my role is sketching shape and rationale. Each proposal needs a verify.js with ≥6 assertions to support graded pass/fail.

### Proposal 1: `parseISO-with-timezone` — spec-precision, A-class likely

**Prompt sketch:** "Implement `parseISO(s)` that returns a Date for ISO 8601 strings handling: UTC `Z` suffix, fixed offsets `+05:30`, no-offset (assume local), invalid input (throw). The verify script tests 12 cases."

**Target file:** `iso.js`

**Predicted dominant class:** A (verify-loop). Spec-precision-style. Model implements the common case, misses one of the corner cases (probably the offset arithmetic), iterates.

**Coverage gap addressed:** Diversifies the A-class population beyond expression-eval. Different spec shape than parser-style tests.

**Risk:** May be too easy at tier-64 (Date manipulation is well-trained). Pilot at n=5.

### Proposal 2: `module-shape-resolver` — Class B target

**Prompt sketch:** "The workspace has `package.json` with `"type": "module"`. Add a CommonJS module `legacy.cjs` that exports a `compute()` function, and import it from a new ESM module `index.js`. Then ensure `node verify.mjs` exits 0."

**Target files:** `legacy.cjs`, `index.js`

**Predicted dominant class:** B (wrong-module-shape). Spec-by-construction.

**Coverage gap addressed:** The empty B class. If after pilot B is still empty across 20 runs, that's evidence to *drop B from the taxonomy* — also valuable.

**Risk:** Single-purpose test for a class that may not matter for production. Implement only if the analysis team decides B is worth keeping in the taxonomy.

### Proposal 3: `eight-functions` — Class C target

**Prompt sketch:** "Implement these eight independent helper functions, each in its own file: `pad.js`, `clamp.js`, `unique.js`, `chunk.js`, `flatten.js`, `omit.js`, `pick.js`, `compact.js`. Each with 3–5 assertions in `verify.js` that imports all eight."

**Target files:** 8 separate `.js` files.

**Predicted dominant class:** C (context-drift) at scale. Each function is trivial individually, but tracking 8 of them across iterations stresses context.

**Coverage gap addressed:** Multi-file workspace pressure. Distinguishes "pure A" from "A with C contamination." Worth piloting at tier-64.

**Risk:** May still be too easy if the model handles all 8 in two iterations. Increase function count to 12 if pilot shows pass rate >85%.

### Proposal 4: `tool-confusion-redundant-verifies` — Class D target (subtle)

**Prompt sketch:** "The workspace contains `verify.js`, `check.js`, and `validate.js`. Each tests slightly different aspects of the same `parse()` function. Implement `parse.js` such that `node verify.js` exits 0. The other two verifiers are red herrings — passing them is not required, but model output that calls them is wasted work."

**Target file:** `parse.js`. Plus the three verifiers seeded.

**Predicted dominant class:** D (grammar/tool dead-branch). Model may run `check.js` and `validate.js` repeatedly chasing irrelevant feedback.

**Coverage gap addressed:** D-class diversity beyond edit_file shape errors.

**Risk:** May be too on-the-nose; the model may simply ignore the red herrings. Worth piloting with both v1-prod (more likely to wander) and v3-deterministic (more focused).

### Proposal 5: `subtle-broken-spec` — A-class with cleaner trace than expression-eval

**Prompt sketch:** "Implement `formatTime(seconds)` that produces strings like `'1h 23m'` for ≥1h, `'23m 5s'` for 1m–59m, and `'5s'` for <1m. **The spec lies:** the verify script also requires `formatTime(0)` to return `'0s'` (not the empty string the prompt implies)."

**Target file:** `formatTime.js`

**Predicted dominant class:** A. The model fails on the one assertion the prompt under-specifies, iterates to fix.

**Coverage gap addressed:** Cleaner A-class trace than expression-eval (where 25+ assertions make it harder to identify which one drives the loop). Helps the classifier produce sharper Class-A signatures for the lever authoring stage.

**Risk:** "Spec lies" is a manipulation; if the analysis team wants tests that mirror real usage, this isn't representative. Ethical test-design call.

## Section 4 — Risks and open questions for the analysis team

1. **Is Class B worth keeping in the taxonomy?** Empty in both sweeps. Two paths: (a) implement Proposal 2 to populate it; (b) drop B and report a 5-class taxonomy. (b) is cleaner if production rarely trips module-shape errors.

2. **Is Class E still a meaningful class?** With timeouts widened to eliminate censoring, E lost its mechanical signal. Either (a) re-define E to mean something else (e.g., "normal completion, but `total_non_model_gap_ms > 2σ`"), or (b) drop E.

3. **n=20 is structurally insufficient for the 5-class κ.** Even with the K-only suite (5 tests), at ~25% failure rate per cell × 5 tests × 2 samplers, we'd expect ~50 failed-tail runs — better, but the per-class counts after the dominant A class would still be 1–5 each. Either pool across samplers (loses arm-comparison), pool across tests (loses cell-comparison), or accept wide CI on individual class rates.

4. **The single-cell concentration is a finding, not a bug.** That all 11 failures in the n=20 noisy-suite came from expression-eval is itself a result: at this difficulty, only one of three "noisy" tests produces failures. The new K suite (5 tests) should diversify this, but may still concentrate in 1-2 cells. Worth reporting as a methodology finding.

5. **Pilot-before-commit cost.** Calibrating each `C`-tagged test at n=5 costs ~30 runs total = ~30 min wallclock. Worth it before the next full sweep — avoids the same "tests dropped to 0% failure" problem we hit going from old timeout to new.

6. **The W4-PRODUCTIVE taxonomy is largely untested at scale.** P1–P5 was defined from 6 successful-tail packets and applied to 26. With the K suite and a fresh sweep, productive-tail count may grow to 70–90 runs across cells. The classifier may discover the P-classes are over- or under-specified. Worth a Pass-2 director check on productive runs before committing P1–P5 to v2 lever authoring.

7. **What's the production deployment goal?** The taxonomy ideally targets failure modes that matter in production. Need analysis team's input on whether the model-level failure modes we're seeing (verify-loop on parser/spec tests) are representative of real workload failures, or whether the iter-distribution work needs different test selection altogether.

## Section 5 — Suggested next sequence

1. **Analysis team reads this doc, decides:**
   - Which `C`-tagged tests to pilot (n=5 each).
   - Whether to implement any of Proposals 1–5.
   - Whether to keep or drop classes B and E.

2. **Pilot phase** (~30 min): run the chosen `C` tests at n=5 to filter on empirical fail rate ≥15%.

3. **Commit a finalized iter-distribution suite** of 4–6 tests with empirical evidence backing each.

4. **Resume the iter-distribution sweep** at n=20 on the finalized suite — by this point we'd expect 30–60 failed-tail runs total, sufficient for κ at CI ~±0.18.

5. **Re-run W4 Pass 1 + 2 + κ** on the new dataset.

## Sources cited

- `host/test/.claw-runtime/_archive-2026-04-28/iter-distribution-runs.csv` — n=20 archived dataset (proxy-based passed)
- `host/test/.claw-runtime/iter-distribution-runs.csv` — current n=20 noisy-suite sweep (real assertion-based passed)
- `host/test/logs/a2/SAMPLER-GRID` (deleted) — sampler grid, 5 tests × 8 cells × n=3
- `host/test/logs/a2/LOWER-TIER-CALIB` (deleted) — tier-32 calibration data
- `host/test/logs/TIER-EVAL-RESULTS-20260428-1142.md` — single-run tier-64 across all tests (mini-vm + multi-bug-decoy harness issues)
- [W4-TAXONOMY.md](W4-TAXONOMY.md) and [W4-TAXONOMY-PRODUCTIVE.md](W4-TAXONOMY-PRODUCTIVE.md) — frozen taxonomies the analysis is validating against
- [W2-W3-RESULTS-20260428.md](W2-W3-RESULTS-20260428.md) — prior n=20 analysis output
