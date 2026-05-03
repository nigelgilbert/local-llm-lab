# Sprint 1.21 Explore — Cycle 4

Generated 2026-05-03T18:08:29.312Z from `run_registry.explore-c4-20260503-0902.jsonl` (24 rows).

Tiers in this cycle: 16, 32.  Tests: 5.

## Per-cell pass-rate matrix

| test_id | t16 pass | t16 status | t32 pass | t32 status |
|---|---|---|---|---|
| `cascade-eight` | 100% (3/3) | clean | 100% (3/3) | clean |
| `two-bucket` | 33% (1/3) | 2e | 100% (3/3) | clean |
| `word-search` | 100% (3/3) | clean | 100% (3/3) | clean |
| `wordy` | 0% (0/3) | 3e | 0% (0/3) | 3t |
| `needle-haystack` | — (0/0) | clean | — (0/0) | clean |

Status legend: `Nt`=timeouts, `Nh`=harness_error, `Ne`=error, `Nn`=passed=null. 'clean' means all `done`.

## R1–R6 calibration flags (per-cell)

| test_id | tier | R1 floor/ceil | R2 timeout | R3 harn-err | R4 null-pass | R5 iter-storm | R6 sat | p90 iters | p90 elapsed (ms) |
|---|---|---|---|---|---|---|---|---|---|
| `cascade-eight` | t16 | ⚠️ |  |  |  | ⚠️ | ⚠️ | 27 | 2232236 |
| `cascade-eight` | t32 | ⚠️ |  |  |  | ⚠️ | ⚠️ | 27 | 64731 |
| `two-bucket` | t16 |  |  |  |  |  |  | 15 | 117926 |
| `two-bucket` | t32 | ⚠️ |  |  |  |  | ⚠️ | 12 | 2483052 |
| `word-search` | t16 | ⚠️ |  |  |  |  | ⚠️ | 6 | 231176 |
| `word-search` | t32 | ⚠️ |  |  |  |  | ⚠️ | 8 | 83608 |
| `wordy` | t16 | ⚠️ |  |  |  |  |  | 13 | 6069099 |
| `wordy` | t32 | ⚠️ | ⚠️ |  |  | ⚠️ |  | 32 | 515849 |

R1: 0/N or N/N pass.  R2: ≥25% timeouts.  R3: any harness_error.  R4: >20% passed=null.  R5: p90 iters > 25.  R6: pass-rate > 85%.

## Failing-cell snapshots

One iterations.jsonl head+tail (60 lines each end) per failing cell, for analyze-agent to inspect failure modes without pulling the full trace.

| test_id | tier | run_id | snapshot | terminal_status |
|---|---|---|---|---|
| `two-bucket` | t16 | `2374cd5b-a835-4369-a846-e23a0df772ae` | [snapshots/two-bucket.t16.jsonl](snapshots/two-bucket.t16.jsonl) | error |
| `wordy` | t16 | `4af4ff7a-4567-4022-b7f3-87e92b825a0f` | [snapshots/wordy.t16.jsonl](snapshots/wordy.t16.jsonl) | error |
| `wordy` | t32 | `911a4c44-1db2-41e0-b769-6d7c6f43bcf1` | [snapshots/wordy.t32.jsonl](snapshots/wordy.t32.jsonl) | timeout |

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
