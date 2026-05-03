# Overnight Cross-Tier Screen — explore-c8-20260503-1625

- Date: 2026-05-03 16:25
- Tiers: 16 32 64
- Reps per tier: 1
- Harness git SHA: dfe7f7f
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c8-20260503-1625.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-56b17084bdc2 Creating 
 Container test-test-run-56b17084bdc2 Created 

=== cascade-eight (tier-16) ===
  claw: exit=0 elapsed=57261ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","i.js","run.js"]
  run.js: exists=true hash_ok=true (expected 266d53d066de, got 266d53d066de)
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c8-20260503-1625.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates fix/re-run until run.js exits clean (57327.829814ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-16) (57328.232353ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 57354.346263
```

Exit code: 0 (rep=1 tier=16)

## rep=1 tier=32

```
 Container test-test-run-c6f8cded74d7 Creating 
 Container test-test-run-c6f8cded74d7 Created 

=== cascade-eight (tier-32) ===
  claw: exit=0 elapsed=51923ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","i.js","run.js"]
  run.js: exists=true hash_ok=true (expected 266d53d066de, got 266d53d066de)
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c8-20260503-1625.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates fix/re-run until run.js exits clean (51970.548332ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-32) (51970.961579ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 51996.241993
```

Exit code: 0 (rep=1 tier=32)

## rep=1 tier=64

```
 Container test-test-run-408e333a3f97 Creating 
 Container test-test-run-408e333a3f97 Created 

=== cascade-eight (tier-64) ===
  claw: exit=0 elapsed=41283ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","i.js","run.js"]
  run.js: exists=true hash_ok=true (expected 266d53d066de, got 266d53d066de)
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c8-20260503-1625.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates fix/re-run until run.js exits clean (41342.078322ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-64) (41342.526028ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 41368.663146
```

Exit code: 0 (rep=1 tier=64)

