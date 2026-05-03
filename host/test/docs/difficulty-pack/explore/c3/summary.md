# Sprint 1.21 Explore — Cycle 3

Generated 2026-05-03T08:32:27.857Z from `run_registry.explore-c3-20260503-0132.jsonl` (54 rows).

Tiers in this cycle: 16, 32.  Tests: 9.

## Per-cell pass-rate matrix

| test_id | t16 pass | t16 status | t32 pass | t32 status |
|---|---|---|---|---|
| `wordy` | 0% (0/3) | 2e | 0% (0/3) | 1t 2e |
| `book-store` | 0% (0/3) | 3e | 67% (2/3) | 1t |
| `grade-school` | 100% (3/3) | clean | 100% (3/3) | clean |
| `word-search` | 100% (3/3) | clean | 100% (3/3) | clean |
| `two-bucket` | 0% (0/3) | 3e | 100% (3/3) | clean |
| `count-power-of-two` | 100% (3/3) | clean | 100% (3/3) | clean |
| `cascade-eight` | 100% (3/3) | clean | 100% (3/3) | clean |
| `twelve-file-refactor` | 100% (3/3) | clean | 100% (3/3) | clean |
| `ini-parser` | 100% (3/3) | clean | 67% (2/3) | 1t |

Status legend: `Nt`=timeouts, `Nh`=harness_error, `Ne`=error, `Nn`=passed=null. 'clean' means all `done`.

## R1–R6 calibration flags (per-cell)

| test_id | tier | R1 floor/ceil | R2 timeout | R3 harn-err | R4 null-pass | R5 iter-storm | R6 sat | p90 iters | p90 elapsed (ms) |
|---|---|---|---|---|---|---|---|---|---|
| `wordy` | t16 | ⚠️ |  |  |  |  |  | 18 | 200196 |
| `wordy` | t32 | ⚠️ | ⚠️ |  |  | ⚠️ |  | 33 | 379647 |
| `book-store` | t16 | ⚠️ |  |  |  |  |  | 14 | 114699 |
| `book-store` | t32 |  | ⚠️ |  |  |  |  | 13 | 719110 |
| `grade-school` | t16 | ⚠️ |  |  |  |  | ⚠️ | 6 | 18651 |
| `grade-school` | t32 | ⚠️ |  |  |  |  | ⚠️ | 6 | 411263 |
| `word-search` | t16 | ⚠️ |  |  |  |  | ⚠️ | 7 | 29807 |
| `word-search` | t32 | ⚠️ |  |  |  |  | ⚠️ | 11 | 489546 |
| `two-bucket` | t16 | ⚠️ |  |  |  |  |  | 14 | 594967 |
| `two-bucket` | t32 | ⚠️ |  |  |  |  | ⚠️ | 22 | 270462 |
| `count-power-of-two` | t16 | ⚠️ |  |  |  |  | ⚠️ | 7 | 14140 |
| `count-power-of-two` | t32 | ⚠️ |  |  |  |  | ⚠️ | 6 | 15422 |
| `cascade-eight` | t16 | ⚠️ |  |  |  | ⚠️ | ⚠️ | 27 | 40660 |
| `cascade-eight` | t32 | ⚠️ |  |  |  | ⚠️ | ⚠️ | 27 | 47715 |
| `twelve-file-refactor` | t16 | ⚠️ |  |  |  |  | ⚠️ | 16 | 53166 |
| `twelve-file-refactor` | t32 | ⚠️ |  |  |  |  | ⚠️ | 15 | 55683 |
| `ini-parser` | t16 | ⚠️ |  |  |  |  | ⚠️ | 7 | 29170 |
| `ini-parser` | t32 |  | ⚠️ |  |  |  |  | 14 | 1250127 |

R1: 0/N or N/N pass.  R2: ≥25% timeouts.  R3: any harness_error.  R4: >20% passed=null.  R5: p90 iters > 25.  R6: pass-rate > 85%.

## Failing-cell snapshots

One iterations.jsonl head+tail (60 lines each end) per failing cell, for analyze-agent to inspect failure modes without pulling the full trace.

| test_id | tier | run_id | snapshot | terminal_status |
|---|---|---|---|---|
| `wordy` | t16 | `78fe8212-ab25-41a3-81c9-b802c3ad1c37` | [snapshots/wordy.t16.jsonl](snapshots/wordy.t16.jsonl) | error |
| `wordy` | t32 | `b9e98a7d-af82-4cba-827f-3994453575e7` | [snapshots/wordy.t32.jsonl](snapshots/wordy.t32.jsonl) | error |
| `book-store` | t16 | `7b13b047-8dba-4964-94d0-8f7851d01e41` | [snapshots/book-store.t16.jsonl](snapshots/book-store.t16.jsonl) | error |
| `book-store` | t32 | `eca7672b-2c59-4c68-99cc-545ce0453c28` | [snapshots/book-store.t32.jsonl](snapshots/book-store.t32.jsonl) | timeout |
| `two-bucket` | t16 | `69b215bb-83cf-4c11-ad4e-580ffdcf757e` | [snapshots/two-bucket.t16.jsonl](snapshots/two-bucket.t16.jsonl) | error |
| `ini-parser` | t32 | `db9284c2-430e-42c6-8f0a-f2240c86c1ee` | [snapshots/ini-parser.t32.jsonl](snapshots/ini-parser.t32.jsonl) | timeout |

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
