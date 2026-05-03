# Sprint 1.21 Explore — Cycle 15

Generated 2026-05-03T23:31:41.353Z from `run_registry.explore-c15-20260503-1829.jsonl` (1 rows).

Tiers in this cycle: 16.  Tests: 1.

## Per-cell pass-rate matrix

| test_id | t16 pass | t16 status |
|---|---|---|
| `word-search` | 0% (0/1) | 1e |

Status legend: `Nt`=timeouts, `Nh`=harness_error, `Ne`=error, `Nn`=passed=null. 'clean' means all `done`.

## R1–R6 calibration flags (per-cell)

| test_id | tier | R1 floor/ceil | R2 timeout | R3 harn-err | R4 null-pass | R5 iter-storm | R6 sat | p90 iters | p90 elapsed (ms) |
|---|---|---|---|---|---|---|---|---|---|
| `word-search` | t16 | ⚠️ |  |  |  |  |  | 13 | 114741 |

R1: 0/N or N/N pass.  R2: ≥25% timeouts.  R3: any harness_error.  R4: >20% passed=null.  R5: p90 iters > 25.  R6: pass-rate > 85%.

## Failing-cell snapshots

One iterations.jsonl head+tail (60 lines each end) per failing cell, for analyze-agent to inspect failure modes without pulling the full trace.

| test_id | tier | run_id | snapshot | terminal_status |
|---|---|---|---|---|
| `word-search` | t16 | `e55a8f78-5a94-4b6a-ae4e-95d50bce13e5` | [snapshots/word-search.t16.jsonl](snapshots/word-search.t16.jsonl) | error |

## Tweak-allowed scope (for analyze-agent)

**ALLOWED edits** (within `host/test/__tests__/tier-eval/` and `host/test/docs/difficulty-pack/`):
- Prompt-string clarifications, examples, or disambiguation
- Verifier assertion-message improvements
- Loosening over-strict spec clauses (e.g., specific sort order → "any order")
- Removing genuinely-ambiguous test cases (with rationale)
- Manifest field updates (e.g., `expected_tier_signature` flip after pilot evidence)
- Updates to `mutations.md`, `PLAN.md`, or `1.21-handsolve-log.md` to reflect the tweak

**NOT ALLOWED** (require user sign-off):
- Cutting a test (write recommendation to `1.21-cycle-N-recommendations.md` instead)
- Adding new test files (no H5)
- Modifying `lib/*.js`, `lib/model_configs.json`, anything in `scripts/`, or `canonicals/`
- Raising `CLAW_TIMEOUT` (legitimate-looking shortcut that hides spec problems)
- Swapping picks from the runner-up bench (deeper-pass concern)

## Reference

- [PLAN.md](../../PLAN.md) — engineering plan (R1–R8 reject criteria, calibration protocol)
- [mutations.md](../../mutations.md) — per-pick mutation specs
- [1.21-handsolve-log.md](../../1.21-handsolve-log.md) — design intent + estimated hand-solve per test
- [memos/aider-calibration-note.md](../../memos/aider-calibration-note.md) — runner-up swap protocol (informational)
