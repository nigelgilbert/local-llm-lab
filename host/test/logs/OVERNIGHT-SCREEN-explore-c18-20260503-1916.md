# Overnight Cross-Tier Screen — explore-c18-20260503-1916

- Date: 2026-05-03 19:16
- Tiers: 16
- Reps per tier: 1
- Harness git SHA: e8e946d
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c18-20260503-1916.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-28b05817ff72 Creating 
 Container test-test-run-28b05817ff72 Created 

=== twelve-file-refactor (tier-16) ===
  claw: exit=0 elapsed=59541ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","format-config.js","format-parse.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c18-20260503-1916.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-16)
  ✔ claw threads two parameters through every caller (59600.547417ms)
✔ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-16) (59600.985749ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 59628.122786
```

Exit code: 0 (rep=1 tier=16)

