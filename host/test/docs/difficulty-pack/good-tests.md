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

## Set aside (confirmed dead at t16/t32/t64)

`word-search`, `grade-school`, `count-power-of-two`, `twelve-file-refactor`, `ini-parser`, `needle-haystack-v1`, `cascade-eight`. Each saturates cleanly across the lineage; sniff-cycles c7 (t64) and c8 (cascade-eight, all 3 tiers, fresh image with checksum gate live) confirmed no remaining signal.

Notes:
- `cascade-eight` c7 t64 failure (forget-i.js, 26 iters) was sampling variance at N=1 — c8 N=1 across all 3 tiers passes with 30-33 iters. High iteration cost (~3-5× the other saturating cells) is real but flat across tiers, so it doesn't discriminate.
- `ini-parser` t32→t64 wallclock collapse (1250s → 13s) was sampler/loop pathology, not difficulty. Flagged separately to the bridge-diagnostics stream.
