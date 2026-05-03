# Sprint 1.21 — Good tests from the difficulty pack

**As of:** 2026-05-03 (post-c12 needle-haystack v4 t16/t64 sniff)
**Branch:** feature/harder-test-suite-1

These are the cells that earned a place in the suite — each one carries a real, evidence-backed signal across the model lineage we run.

| # | cell | what it gives us | evidence |
|---|---|---|---|
| 1 | `book-store` | tier discriminator (R9-A) | c3: t16 0/3, t32 2/3 — t16 floors, t32 hits the middle band. Clean signal; one fresh-image re-confirm pending |
| 2 | `two-bucket` | tier discriminator | c3+c4: t16 0-1/3, t32 3/3. Robust across two independent cycles — the strongest cell in the pack |
| 3 | `wordy` | Tier-D context-floor marker | c3+c4: both tiers floor (R9-B). Not a gate cell — but a load-bearing frontier-reserve probe: tells us when a model can't even start a multi-clause arithmetic-parse task |
| 4 | `needle-haystack` | candidate tier discriminator (R9-A) — v4 ambiguous-candidate disambiguation | v1/v2/v3 all saturated at t16 in 8-25s via grep+inline. v4 (4-each candidates with single self-consistent triple) hit clean t16 ctx-overflow at c11 (14 iters, 39.7k tokens > 32k ctx) — exactly the manifest's R9-A trigger. t64 confirmation pending: c12 t64 dispatch was invalidated by a harness-side `grep_search` leak into `.claw-runtime/` (filed: usability-pack U1) |

## Set aside — under redesign review

`word-search`, `twelve-file-refactor`, `ini-parser`, `needle-haystack-v1`. Each saturates cleanly across the lineage but has a defeasible saturation strategy worth a v2 redesign attempt (see triage 2026-05-03):

- `word-search` (t16/t32/t64 p90: 8/8/5 iters): greedy per-direction match. Defeat path: cross-directional constraint or hidden-message ordering.
- `twelve-file-refactor` (18/18/10): verifier output examples leak the locale rules. Defeat path: hide rules in larger config + add round-trip invariant.
- `ini-parser` (~5/noisy/4): true saturation low; t32 number is bridge SSE noise (1250s→13s collapse), not difficulty. Defeat path: schema-validation requiring multi-pass / backtracking. Re-confirm noise hypothesis before redesigning.

## Removed (structural — no defeat path)

Deleted from `__tests__/tier-eval/` 2026-05-03:
- `grade-school` — pure bookkeeping spec, no algorithmic depth to attack.
- `count-power-of-two` — reference brute O(N² log) is always viable at relaxed N≤100; tightening N breaks the <10-min hand-solve rule.
- `cascade-eight` — flat at ~30-33 iters across all 3 tiers (c8 evidence). Expensive but not a tier discriminator. (c7 t64 failure was N=1 sampling variance, not signal.)

Orphans cleaned up at the same time: removed from `host/test/scripts/explore-cycle.sh` `NEW_TESTS` allowlist; `canonicals/grade-school/` directory deleted (the other two had no canonicals).
