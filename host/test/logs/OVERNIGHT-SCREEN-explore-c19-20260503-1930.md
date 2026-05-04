# Overnight Cross-Tier Screen — explore-c19-20260503-1930

- Date: 2026-05-03 19:30
- Tiers: 16
- Reps per tier: 1
- Harness git SHA: e8e946d
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c19-20260503-1930.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-fb4faeea2db6 Creating 
 Container test-test-run-fb4faeea2db6 Created 

=== twelve-file-refactor (tier-16) ===
  claw: exit=1 elapsed=103899ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","currency-config.js","format-config.js","format-parse.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33010 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c19-20260503-1930.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-16)
  ✖ claw threads two parameters through every caller (103927.714597ms)
✖ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-16) (103928.654758ms)
ℹ tests 1
ℹ suites 1
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 103956.067578

✖ failing tests:

test at __tests__/tier-eval/twelve-file-refactor.test.js:456:3
✖ claw threads two parameters through every caller (103927.714597ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/twelve-file-refactor.test.js:490:12)
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

Exit code: 1 (rep=1 tier=16)

