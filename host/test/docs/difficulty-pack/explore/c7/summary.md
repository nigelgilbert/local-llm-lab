# Sprint 1.21 Explore — Cycle 7

Generated 2026-05-03T21:19:16.514Z from `run_registry.explore-c7-20260503-1616.jsonl` (7 rows).

Tiers in this cycle: 64.  Tests: 7.

## Per-cell pass-rate matrix

| test_id | t64 pass | t64 status |
|---|---|---|
| `word-search` | 100% (1/1) | clean |
| `grade-school` | 100% (1/1) | clean |
| `count-power-of-two` | 100% (1/1) | clean |
| `twelve-file-refactor` | 100% (1/1) | clean |
| `cascade-eight` | 0% (0/1) | 1e |
| `ini-parser` | 100% (1/1) | clean |
| `needle-haystack` | 100% (1/1) | clean |

Status legend: `Nt`=timeouts, `Nh`=harness_error, `Ne`=error, `Nn`=passed=null. 'clean' means all `done`.

## R1–R6 calibration flags (per-cell)

| test_id | tier | R1 floor/ceil | R2 timeout | R3 harn-err | R4 null-pass | R5 iter-storm | R6 sat | p90 iters | p90 elapsed (ms) |
|---|---|---|---|---|---|---|---|---|---|
| `word-search` | t64 | ⚠️ |  |  |  |  | ⚠️ | 5 | 12750 |
| `grade-school` | t64 | ⚠️ |  |  |  |  | ⚠️ | 5 | 13743 |
| `count-power-of-two` | t64 | ⚠️ |  |  |  |  | ⚠️ | 6 | 15324 |
| `twelve-file-refactor` | t64 | ⚠️ |  |  |  |  | ⚠️ | 10 | 44621 |
| `cascade-eight` | t64 | ⚠️ |  |  |  | ⚠️ |  | 26 | 38409 |
| `ini-parser` | t64 | ⚠️ |  |  |  |  | ⚠️ | 4 | 12693 |
| `needle-haystack` | t64 | ⚠️ |  |  |  |  | ⚠️ | 5 | 5560 |

R1: 0/N or N/N pass.  R2: ≥25% timeouts.  R3: any harness_error.  R4: >20% passed=null.  R5: p90 iters > 25.  R6: pass-rate > 85%.

## Failing-cell snapshots

One iterations.jsonl head+tail (60 lines each end) per failing cell, for analyze-agent to inspect failure modes without pulling the full trace.

| test_id | tier | run_id | snapshot | terminal_status |
|---|---|---|---|---|
| `cascade-eight` | t64 | `c7b50613-f6f7-4030-8933-569d64effce7` | [snapshots/cascade-eight.t64.jsonl](snapshots/cascade-eight.t64.jsonl) | error |

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
