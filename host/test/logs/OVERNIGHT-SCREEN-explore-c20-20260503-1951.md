# Overnight Cross-Tier Screen — explore-c20-20260503-1951

- Date: 2026-05-03 19:51
- Tiers: 32
- Reps per tier: 1
- Harness git SHA: e8e946d
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c20-20260503-1951.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=32

```
 Container test-test-run-ea3d4ad1f898 Creating 
 Container test-test-run-ea3d4ad1f898 Created 

=== twelve-file-refactor (tier-32) ===
  claw: exit=0 elapsed=118660ms files=[".claw",".claw-runtime",".clawd-todos.json",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","currency-config.js","format-config.js","format-parse.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c20-20260503-1951.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-32)
  ✔ claw threads two parameters through every caller (118715.200752ms)
✔ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-32) (118715.625248ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 118742.822444
```

Exit code: 0 (rep=1 tier=32)

