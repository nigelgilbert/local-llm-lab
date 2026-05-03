# Sprint 1.21 Explore — Cycle 2

Generated 2026-05-03T03:09:02.595Z from `run_registry.explore-c2-20260502-2044.jsonl` (24 rows).

Tiers in this cycle: 16.  Tests: 12.

## Per-cell pass-rate matrix

| test_id | t16 pass | t16 status |
|---|---|---|
| `wordy` | 0% (0/2) | 2e |
| `alphametics` | 0% (0/2) | 2e |
| `book-store` | 0% (0/2) | 2e |
| `forth` | 0% (0/2) | 2e |
| `grade-school` | 100% (2/2) | clean |
| `word-search` | 50% (1/2) | 1e |
| `two-bucket` | 50% (1/2) | 1e |
| `count-power-of-two` | 100% (2/2) | clean |
| `cascade-eight` | 100% (2/2) | clean |
| `twelve-file-refactor` | 100% (2/2) | clean |
| `semver-range` | 0% (0/2) | 2e |
| `ini-parser` | 100% (2/2) | clean |

Status legend: `Nt`=timeouts, `Nh`=harness_error, `Ne`=error, `Nn`=passed=null. 'clean' means all `done`.

## R1–R6 calibration flags (per-cell)

| test_id | tier | R1 floor/ceil | R2 timeout | R3 harn-err | R4 null-pass | R5 iter-storm | R6 sat | p90 iters | p90 elapsed (ms) |
|---|---|---|---|---|---|---|---|---|---|
| `wordy` | t16 | ⚠️ |  |  |  |  |  | 17 | 746473 |
| `alphametics` | t16 | ⚠️ |  |  |  |  |  | 13 | 97806 |
| `book-store` | t16 | ⚠️ |  |  |  |  |  | 14 | 2439200 |
| `forth` | t16 | ⚠️ |  |  |  |  |  | 10 | 562502 |
| `grade-school` | t16 | ⚠️ |  |  |  |  | ⚠️ | 6 | 13054 |
| `word-search` | t16 |  |  |  |  |  |  | 9 | 86902 |
| `two-bucket` | t16 |  |  |  |  |  |  | 12 | 107971 |
| `count-power-of-two` | t16 | ⚠️ |  |  |  |  | ⚠️ | 6 | 12094 |
| `cascade-eight` | t16 | ⚠️ |  |  |  | ⚠️ | ⚠️ | 34 | 44854 |
| `twelve-file-refactor` | t16 | ⚠️ |  |  |  |  | ⚠️ | 21 | 65147 |
| `semver-range` | t16 | ⚠️ |  |  |  |  |  | 5 | 90157 |
| `ini-parser` | t16 | ⚠️ |  |  |  |  | ⚠️ | 10 | 35982 |

R1: 0/N or N/N pass.  R2: ≥25% timeouts.  R3: any harness_error.  R4: >20% passed=null.  R5: p90 iters > 25.  R6: pass-rate > 85%.

## Failing-cell snapshots

One iterations.jsonl head+tail (60 lines each end) per failing cell, for analyze-agent to inspect failure modes without pulling the full trace.

| test_id | tier | run_id | snapshot | terminal_status |
|---|---|---|---|---|
| `wordy` | t16 | `e7192ca1-ee49-4b2f-955a-4e2f99ab46ed` | [snapshots/wordy.t16.jsonl](snapshots/wordy.t16.jsonl) | error |
| `alphametics` | t16 | `a9e8709c-1ee7-4082-a456-cb2fc36fecd7` | [snapshots/alphametics.t16.jsonl](snapshots/alphametics.t16.jsonl) | error |
| `book-store` | t16 | `bed493a8-d563-461e-8876-127a306334d9` | [snapshots/book-store.t16.jsonl](snapshots/book-store.t16.jsonl) | error |
| `forth` | t16 | `44c43628-0b20-4eae-bc78-e6cdc621699c` | [snapshots/forth.t16.jsonl](snapshots/forth.t16.jsonl) | error |
| `word-search` | t16 | `9ae20772-9f26-45ce-b74e-19601641c059` | [snapshots/word-search.t16.jsonl](snapshots/word-search.t16.jsonl) | error |
| `two-bucket` | t16 | `9fbe7f77-6f82-4441-b1c7-a3d27bbcf788` | [snapshots/two-bucket.t16.jsonl](snapshots/two-bucket.t16.jsonl) | error |
| `semver-range` | t16 | `aee32362-a1ff-43bd-b549-ff8f925aeefd` | [snapshots/semver-range.t16.jsonl](snapshots/semver-range.t16.jsonl) | error |

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
