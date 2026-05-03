# Overnight Cross-Tier Screen — explore-c11-20260503-1712

- Date: 2026-05-03 17:12
- Tiers: 16
- Reps per tier: 1
- Harness git SHA: dfe7f7f
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c11-20260503-1712.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-b1a270c56b48 Creating 
 Container test-test-run-b1a270c56b48 Created 

=== needle-haystack v4 (tier-16) ===
  canonical bootstrap: lib/utils/format.js = 'f0'
  canonical map:       lib/handlers/session.js (MAP['f0'] = 22)
  canonical table:     lib/core/scheduler.js (TABLE[22] = 'de64cc')
  decoy bootstraps: lib/core/registry.js, data/seeds.js, config/routes.js
  decoy maps:       lib/utils/parse.js, data/presets.js, config/flags.js
  decoy tables:     lib/handlers/auth.js, data/fixtures.js, config/limits.js (lengths 10/14/16)
  claw: exit=1 elapsed=416631ms solve.js=true
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (39786 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended needle-haystack row → /workspace/.claw-runtime/run_registry.explore-c11-20260503-1712.jsonl
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16)
  ✖ claw locates REGION_KEY and writes solve.js (161553.801512ms)
✖ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16) (161555.376045ms)
ℹ tests 1
ℹ suites 1
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 161585.876474

✖ failing tests:

test at __tests__/tier-eval/needle-haystack.test.js:370:3
✖ claw locates REGION_KEY and writes solve.js (161553.801512ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/needle-haystack.test.js:404:12)
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

