# Overnight Cross-Tier Screen — explore-c9-20260503-1646

- Date: 2026-05-03 16:46
- Tiers: 16
- Reps per tier: 1
- Harness git SHA: dfe7f7f
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c9-20260503-1646.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-c2ce68066e6a Creating 
 Container test-test-run-c2ce68066e6a Created 

=== needle-haystack v2 (tier-16) ===
  index needle: lib/core/registry.js = 1
  table needle: data/seeds.js (TABLE[1] = 'c801f3')
  claw: exit=0 elapsed=17772ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
[run-registry] appended needle-haystack row → /workspace/.claw-runtime/run_registry.explore-c9-20260503-1646.jsonl
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16)
  ✔ claw locates REGION_KEY and writes solve.js (17813.360358ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16) (17813.831106ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 17842.488543
```

Exit code: 0 (rep=1 tier=16)

