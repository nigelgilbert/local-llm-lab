# Overnight Cross-Tier Screen — explore-c10-20260503-1657

- Date: 2026-05-03 16:57
- Tiers: 16
- Reps per tier: 1
- Harness git SHA: dfe7f7f
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c10-20260503-1657.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-46aebafb0c2f Creating 
 Container test-test-run-46aebafb0c2f Created 

=== needle-haystack v3 (tier-16) ===
  bootstrap: lib/core/registry.js = 'ed'
  map:       config/routes.js (MAP['ed'] = 20)
  table:     data/seeds.js (TABLE[20] = '8aa669')
  claw: exit=0 elapsed=25043ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
[run-registry] appended needle-haystack row → /workspace/.claw-runtime/run_registry.explore-c10-20260503-1657.jsonl
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16)
  ✔ claw locates REGION_KEY and writes solve.js (25086.498618ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16) (25086.969199ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 25114.557643
```

Exit code: 0 (rep=1 tier=16)

