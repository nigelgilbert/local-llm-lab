# Overnight Cross-Tier Screen — explore-c7-20260503-1616

- Date: 2026-05-03 16:16
- Tiers: 64
- Reps per tier: 1
- Harness git SHA: 19afe47
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c7-20260503-1616.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=64

```
 Container test-test-run-9dd8848b7fd6 Creating 
 Container test-test-run-9dd8848b7fd6 Created 

=== cascade-eight (tier-64) ===
  claw: exit=1 elapsed=38409ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","i.js","run.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 4191; first 200 chars of body: {"error": {"message": "dictionary changed size during iteration\n\nTraceback (most recent call last):\n  File \"/usr/lib/python3.13/site-packages/litellm/litellm_core_utils/streaming_handler.py\", lin…

Run `claw --help` for usage.

  run.js: exists=true hash_ok=true (expected 266d53d066de, got 266d53d066de)
  node post-fix: exit=1 stdout= stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: contains: NaN must be findable (indexOf does not find NaN)

false !== true

    at file:///workspace/run.js:22:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async nod
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c7-20260503-1616.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-64)
  ✖ claw iterates fix/re-run until run.js exits clean (38454.483807ms)
✖ cascade-eight: 8 sequential failures, one runner (tier=tier-64) (38455.118679ms)

=== count-power-of-two (tier-64) ===
  claw: exit=0 elapsed=15324ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","count-power-of-two.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended count-power-of-two row → /workspace/.claw-runtime/run_registry.explore-c7-20260503-1616.jsonl
▶ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-64)
  ✔ claw solves the task (15364.047779ms)
✔ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-64) (15364.46786ms)

=== grade-school (tier-64) ===
  claw: exit=0 elapsed=13743ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","grade-school.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended grade-school row → /workspace/.claw-runtime/run_registry.explore-c7-20260503-1616.jsonl
▶ grade-school: roster with transfers and withdrawals (tier=tier-64)
  ✔ claw solves the task (13774.963835ms)
✔ grade-school: roster with transfers and withdrawals (tier=tier-64) (13775.520791ms)

=== ini-parser (tier-64) ===
  claw: exit=0 elapsed=12693ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","ini-parser.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended ini-parser row → /workspace/.claw-runtime/run_registry.explore-c7-20260503-1616.jsonl
▶ ini-parser: line-by-line config parser with section reentry (tier=tier-64)
  ✔ claw solves the task (12725.026783ms)
✔ ini-parser: line-by-line config parser with section reentry (tier=tier-64) (12725.500613ms)

=== needle-haystack (tier-64) ===
  needle: lib/handlers/auth.js = '2298e9'
  claw: exit=0 elapsed=5560ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
[run-registry] appended needle-haystack row → /workspace/.claw-runtime/run_registry.explore-c7-20260503-1616.jsonl
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-64)
  ✔ claw locates REGION_KEY and writes solve.js (5594.783513ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-64) (5595.272468ms)

=== twelve-file-refactor (tier-64) ===
  claw: exit=0 elapsed=44621ms files=[".claw",".claw-runtime",".clawd-todos.json",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c7-20260503-1616.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-64)
  ✔ claw threads two parameters through every caller (44667.83859ms)
✔ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-64) (44668.276879ms)

=== word-search (tier-64) ===
  claw: exit=0 elapsed=12750ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c7-20260503-1616.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-64)
  ✔ claw solves the task (12784.753782ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-64) (12785.254987ms)
ℹ tests 7
ℹ suites 7
ℹ pass 6
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 143552.817849

✖ failing tests:

test at __tests__/tier-eval/cascade-eight.test.js:126:3
✖ claw iterates fix/re-run until run.js exits clean (38454.483807ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/cascade-eight.test.js:170:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

```

Exit code: 1 (rep=1 tier=64)

