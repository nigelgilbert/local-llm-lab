# Sprint 1.21 Explore — Cycle 1

Generated 2026-05-03T00:25:35.647Z from `run_registry.explore-c1-20260502-1735.jsonl` (33 rows).

Tiers in this cycle: 32.  Tests: 12.

## Per-cell pass-rate matrix

| test_id | t32 pass | t32 status |
|---|---|---|
| `wordy` | 100% (3/3) | clean |
| `alphametics` | 0% (0/3) | 2t 1e |
| `book-store` | 67% (2/3) | 1e |
| `forth` | 0% (0/3) | 1t 2e |
| `grade-school` | 67% (2/3) | 1e |
| `word-search` | 100% (3/3) | clean |
| `two-bucket` | 100% (3/3) | clean |
| `count-power-of-two` | 100% (3/3) | clean |
| `cascade-eight` | 100% (3/3) | clean |
| `twelve-file-refactor` | 100% (3/3) | clean |
| `semver-range` | — (0/0) | clean |
| `ini-parser` | 67% (2/3) | 1e |

Status legend: `Nt`=timeouts, `Nh`=harness_error, `Ne`=error, `Nn`=passed=null. 'clean' means all `done`.

## R1–R6 calibration flags (per-cell)

| test_id | tier | R1 floor/ceil | R2 timeout | R3 harn-err | R4 null-pass | R5 iter-storm | R6 sat | p90 iters | p90 elapsed (ms) |
|---|---|---|---|---|---|---|---|---|---|
| `wordy` | t32 | ⚠️ |  |  |  | ⚠️ | ⚠️ | 27 | 637687 |
| `alphametics` | t32 | ⚠️ | ⚠️ |  |  |  |  | 21 | 1226811 |
| `book-store` | t32 |  |  |  |  |  |  | 10 | 411170 |
| `forth` | t32 | ⚠️ | ⚠️ |  |  |  |  | 13 | 285041 |
| `grade-school` | t32 |  |  |  |  |  |  | 5 | 73831 |
| `word-search` | t32 | ⚠️ |  |  |  |  | ⚠️ | 8 | 87483 |
| `two-bucket` | t32 | ⚠️ |  |  |  |  | ⚠️ | 12 | 600245 |
| `count-power-of-two` | t32 | ⚠️ |  |  |  |  | ⚠️ | 6 | 22929 |
| `cascade-eight` | t32 | ⚠️ |  |  |  | ⚠️ | ⚠️ | 27 | 392515 |
| `twelve-file-refactor` | t32 | ⚠️ |  |  |  |  | ⚠️ | 18 | 124857 |
| `ini-parser` | t32 |  |  |  |  |  |  | 5 | 67461 |

R1: 0/N or N/N pass.  R2: ≥25% timeouts.  R3: any harness_error.  R4: >20% passed=null.  R5: p90 iters > 25.  R6: pass-rate > 85%.

## Failing-cell snapshots

One iterations.jsonl head+tail (60 lines each end) per failing cell, for analyze-agent to inspect failure modes without pulling the full trace.

| test_id | tier | run_id | snapshot | terminal_status |
|---|---|---|---|---|
| `alphametics` | t32 | `80b8bb2d-3c58-4b2f-bafc-a5866d8e9af4` | [snapshots/alphametics.t32.jsonl](snapshots/alphametics.t32.jsonl) | error |
| `book-store` | t32 | `af219478-ec93-46ac-94c5-f59a4906b14f` | [snapshots/book-store.t32.jsonl](snapshots/book-store.t32.jsonl) | error |
| `forth` | t32 | `fea8212c-b3ea-4477-87a8-61072cc8ff1c` | [snapshots/forth.t32.jsonl](snapshots/forth.t32.jsonl) | error |
| `grade-school` | t32 | `cf6c01ff-09c8-405c-a3c7-11c314be7901` | [snapshots/grade-school.t32.jsonl](snapshots/grade-school.t32.jsonl) | error |
| `ini-parser` | t32 | `6c947190-c1af-4d09-82c7-0dd67350002b` | [snapshots/ini-parser.t32.jsonl](snapshots/ini-parser.t32.jsonl) | error |

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
