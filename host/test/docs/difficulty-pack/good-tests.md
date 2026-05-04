# Sprint 1.21 — Good tests from the difficulty pack

**As of:** 2026-05-04 (post-c20 twelve-file-refactor v3 t16/t32 sniff)
**Branch:** feature/harder-test-suite-1

These are the cells that earned a place in the suite — each one carries a real, evidence-backed signal across the model lineage we run.

| # | cell | what it gives us | evidence |
|---|---|---|---|
| 1 | `book-store` | tier discriminator (R9-A) | c3: t16 0/3, t32 2/3 — t16 floors, t32 hits the middle band. Clean signal; one fresh-image re-confirm pending |
| 2 | `two-bucket` | tier discriminator | c3+c4: t16 0-1/3, t32 3/3. Robust across two independent cycles — the strongest cell in the pack |
| 3 | `wordy` | Tier-D context-floor marker | c3+c4: both tiers floor (R9-B). Not a gate cell — but a load-bearing frontier-reserve probe: tells us when a model can't even start a multi-clause arithmetic-parse task |
| 4 | `needle-haystack` | candidate tier discriminator (R9-A) — v4 ambiguous-candidate disambiguation | v1/v2/v3 all saturated at t16 in 8-25s via grep+inline. v4 (4-each candidates with single self-consistent triple) hit clean t16 ctx-overflow at c11 (14 iters, 39.7k tokens > 32k ctx) — exactly the manifest's R9-A trigger. t64 confirmation pending: c12 t64 dispatch was invalidated by a harness-side `grep_search` leak into `.claw-runtime/` (filed: usability-pack U1) |
| 5 | `word-search` | provisional tier discriminator (debug-capacity class) — v2.1 dual-anchor + array | v1 saturated at t16 in 8 iters via greedy per-direction match. v2 (single anchor, multi-file) still saturated at 7 iters (c14). v2.1 (dual prefix+suffix anchors, array return, sort-by-row-major) flipped the signal: t16 0/2 (c15 13 iters error, c17 18 iters error — debug loop crashes in own `node -e` bounds checks); t32 1/1 (c16 10 iters, 3 write attempts, 3rd passed). N=3 confirmatory sweeps deferred. Failure mode is *iter-storm + claw error*, not ctx-overflow — distinct class from R9-A but same tier-step shape |
| 6 | `twelve-file-refactor` | provisional tier discriminator (debug-capacity class) — v3 split-config + per-currency fractions | v1 saturated at t16 18 iters (c1/c2 100%); cycle-3 stricter spec (multi-thousands + negatives) didn't help. v2 cycle-18 (kill literal expected strings, move locale rules to format-config.js, ship strict parsePrice in format-parse.js, verifier asserts parse(format(x,c,l), l) round-trips) STILL saturated t16 20 iters — model read config and wrote a config-driven formatter in one shot. v3 cycle-19 (split fraction-digit count into separate currency-config.js: USD/EUR/GBP=2, JPY/KRW=0, BHD/KWD=3; two-step parse: peel currency at locale's known position, look up CURRENCIES[ccy].fractionDigits, then build amount regex; tests now exercise JPY 0-decimals + BHD 3-decimals + KRW thousands-grouped-no-decimal) flipped the signal: t16 0/1 c19 21 iters error (debug loop: 4 format.js rewrites cycling through `cart en: parsePrice rejected "015.50 GBP"` → `"15.50 GBP"` (currency suffix instead of prefix for en) → `"99.00 EUR"` (period decimal instead of comma for de) → never converges); t32 1/1 c20 21 iters clean. N=3 confirmatory sweeps deferred. Failure mode = iter-storm + claw error (same class as word-search v2.1, distinct from R9-A ctx-overflow). |

## Set aside — under redesign review

`ini-parser`, `needle-haystack-v1`. Each saturates cleanly across the lineage but has a defeasible saturation strategy worth a v2 redesign attempt (see triage 2026-05-03):

- `ini-parser` (~5/noisy/4): true saturation low; t32 number is bridge SSE noise (1250s→13s collapse), not difficulty. Defeat path: schema-validation requiring multi-pass / backtracking. Re-confirm noise hypothesis before redesigning.

## Removed (structural — no defeat path)

Deleted from `__tests__/tier-eval/` 2026-05-03:
- `grade-school` — pure bookkeeping spec, no algorithmic depth to attack.
- `count-power-of-two` — reference brute O(N² log) is always viable at relaxed N≤100; tightening N breaks the <10-min hand-solve rule.
- `cascade-eight` — flat at ~30-33 iters across all 3 tiers (c8 evidence). Expensive but not a tier discriminator. (c7 t64 failure was N=1 sampling variance, not signal.)

Orphans cleaned up at the same time: removed from `host/test/scripts/explore-cycle.sh` `NEW_TESTS` allowlist; `canonicals/grade-school/` directory deleted (the other two had no canonicals).
