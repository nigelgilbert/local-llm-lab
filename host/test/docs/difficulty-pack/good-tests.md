# Sprint 1.21 — Good tests from the difficulty pack

**As of:** 2026-05-03 (post-c7 t64 sniff)
**Branch:** feature/harder-test-suite-1

These are the cells that earned a place in the suite — each one carries a real, evidence-backed signal across the model lineage we run.

| # | cell | what it gives us | evidence |
|---|---|---|---|
| 1 | `book-store` | tier discriminator (R9-A) | c3: t16 0/3, t32 2/3 — t16 floors, t32 hits the middle band. Clean signal; one fresh-image re-confirm pending |
| 2 | `two-bucket` | tier discriminator | c3+c4: t16 0-1/3, t32 3/3. Robust across two independent cycles — the strongest cell in the pack |
| 3 | `wordy` | Tier-D context-floor marker | c3+c4: both tiers floor (R9-B). Not a gate cell — but a load-bearing frontier-reserve probe: tells us when a model can't even start a multi-clause arithmetic-parse task |
| 4 | `cascade-eight` | long-horizon convergence probe (latent verdict) | c7 t64: clean failure by forgetting i.js after walking a-h. One N=1 t16+t32 fresh-image disambiguates *discriminator* vs *Tier-D convergence floor* — both useful roles |
| 5 | `needle-haystack` | multi-step retrieval (in design) | v1 confirmed dead at all tiers. v2 (option 3, indirect-lookup chain) is the active redesign |

## Set aside (confirmed dead at t16/t32/t64)

`word-search`, `grade-school`, `count-power-of-two`, `twelve-file-refactor`, `ini-parser`, `needle-haystack-v1`. Each saturated cleanly across the lineage; sniff-cycle c7 confirmed the t64 ceiling. No remaining signal in this model lineage.

`ini-parser` t32→t64 wallclock collapse (1250s → 13s) was sampler/loop pathology, not difficulty. Flagged separately to the bridge-diagnostics stream.
