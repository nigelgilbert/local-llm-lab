# Overnight Cross-Tier Screen — explore-c1-20260502-1735

- Date: 2026-05-02 17:35
- Tiers: 32
- Reps per tier: 3
- Harness git SHA: 7ef53f3
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=32

```
 Container test-test-run-8615ae772914 Creating 
 Container test-test-run-8615ae772914 Created 

=== alphametics (tier-32) ===
  claw: exit=1 elapsed=82655ms files=[".claw",".claw-runtime","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

[run-registry] appended alphametics row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ alphametics: cryptarithmetic with + and * (tier=tier-32)
  ✖ claw solves the task (82670.768858ms)
✖ alphametics: cryptarithmetic with + and * (tier=tier-32) (82671.578937ms)

=== book-store (tier-32) ===
  claw: exit=1 elapsed=411170ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","book-store.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

[run-registry] appended book-store row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ book-store: minimum-cost partition with non-greedy trap (tier=tier-32)
  ✖ claw solves the task (241369.871886ms)
✖ book-store: minimum-cost partition with non-greedy trap (tier=tier-32) (241370.575053ms)

=== cascade-eight (tier-32) ===
  claw: exit=0 elapsed=392515ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates fix/re-run until run.js exits clean (98347.816443ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-32) (98348.279653ms)

=== count-power-of-two (tier-32) ===
  claw: exit=0 elapsed=22929ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","count-power-of-two.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended count-power-of-two row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-32)
  ✔ claw solves the task (22975.350179ms)
✔ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-32) (22975.795972ms)

=== forth (tier-32) ===
  claw: exit=1 elapsed=277418ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","forth.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

[run-registry] appended forth row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ forth: stack interpreter with def/end and parse-time binding (tier=tier-32)
  ✖ claw solves the task (178818.450578ms)
✖ forth: stack interpreter with def/end and parse-time binding (tier=tier-32) (178819.020955ms)

=== grade-school (tier-32) ===
  claw: exit=0 elapsed=37874ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","grade-school.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended grade-school row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ grade-school: roster with transfers and withdrawals (tier=tier-32)
  ✔ claw solves the task (37910.763185ms)
✔ grade-school: roster with transfers and withdrawals (tier=tier-32) (37911.211145ms)

=== ini-parser (tier-32) ===
  claw: exit=0 elapsed=64798ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","ini-parser.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended ini-parser row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ ini-parser: line-by-line config parser with section reentry (tier=tier-32)
  ✔ claw solves the task (31508.174475ms)
✔ ini-parser: line-by-line config parser with section reentry (tier=tier-32) (31508.527685ms)

=== semver-range (tier-32) ===
  claw: exit=1 elapsed=299435ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","semver-range.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

[run-registry] emit failed for /workspace/.claw-runtime/23f3416b-cd45-4dda-8d24-d8a6e8142a50: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/semver-range.test.js failed validation: field expected_tier_signature: value "ceiling_t16" not in enum [monotonic_improving, ceiling, floor, tier_insensitive, unknown, ]
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/semver-range.test.js:191:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
▶ semver-range: dense semver/range parser (tier=tier-32)
  ✖ claw solves the task (242060.956608ms)
✖ semver-range: dense semver/range parser (tier=tier-32) (242061.854944ms)

=== twelve-file-refactor (tier-32) ===
  claw: exit=0 elapsed=124857ms files=[".claw",".claw-runtime",".clawd-todos.json",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-32)
  ✔ claw threads two parameters through every caller (124914.540081ms)
✔ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-32) (124915.003292ms)

=== two-bucket (tier-32) ===
  claw: exit=0 elapsed=125729ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32)
  ✔ claw solves the task (125770.511662ms)
✔ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32) (125771.346415ms)

=== word-search (tier-32) ===
  claw: exit=0 elapsed=87483ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-32)
  ✔ claw solves the task (87531.172768ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-32) (87531.7014ms)

=== wordy (tier-32) ===
  claw: exit=0 elapsed=124232ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  verify: exit=0 stderr=
[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ wordy: arithmetic query parser (tier=tier-32)
  ✔ claw solves the task (102916.562144ms)
✔ wordy: arithmetic query parser (tier=tier-32) (102917.004731ms)
ℹ tests 12
ℹ suites 12
ℹ pass 8
ℹ fail 4
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1377121.021387

✖ failing tests:

test at __tests__/tier-eval/alphametics.test.js:205:3
✖ claw solves the task (82670.768858ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/alphametics.test.js:233:12)
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

test at __tests__/tier-eval/book-store.test.js:156:3
✖ claw solves the task (241369.871886ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/book-store.test.js:184:12)
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

test at __tests__/tier-eval/forth.test.js:153:3
✖ claw solves the task (178818.450578ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/forth.test.js:181:12)
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

test at __tests__/tier-eval/semver-range.test.js:173:3
✖ claw solves the task (242060.956608ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/semver-range.test.js:201:12)
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

Exit code: 1 (rep=1 tier=32)

## rep=2 tier=32

```
 Container test-test-run-a508ad10b0a4 Creating 
 Container test-test-run-a508ad10b0a4 Created 

=== alphametics (tier-32) ===
  claw: exit=null elapsed=285013ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","alphametics.js","verify.js"]
  claw stderr (tail):

[run-registry] appended alphametics row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ alphametics: cryptarithmetic with + and * (tier=tier-32)
  ✖ claw solves the task (285048.543032ms)
✖ alphametics: cryptarithmetic with + and * (tier=tier-32) (285049.503253ms)

=== book-store (tier-32) ===
  claw: exit=0 elapsed=126468ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","book-store.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended book-store row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ book-store: minimum-cost partition with non-greedy trap (tier=tier-32)
  ✔ claw solves the task (126516.628239ms)
✔ book-store: minimum-cost partition with non-greedy trap (tier=tier-32) (126517.045829ms)

=== cascade-eight (tier-32) ===
  claw: exit=0 elapsed=45124ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates fix/re-run until run.js exits clean (45172.556592ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-32) (45173.026846ms)

=== count-power-of-two (tier-32) ===
  claw: exit=0 elapsed=17457ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","count-power-of-two.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended count-power-of-two row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-32)
  ✔ claw solves the task (17507.218727ms)
✔ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-32) (17507.639602ms)

=== forth (tier-32) ===
  claw: exit=null elapsed=285041ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","forth.js","verify.js"]
  claw stderr (tail):

[run-registry] appended forth row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ forth: stack interpreter with def/end and parse-time binding (tier=tier-32)
  ✖ claw solves the task (285061.795929ms)
✖ forth: stack interpreter with def/end and parse-time binding (tier=tier-32) (285062.624224ms)

=== grade-school (tier-32) ===
  claw: exit=1 elapsed=73831ms files=[".claw",".claw-runtime","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

[run-registry] appended grade-school row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ grade-school: roster with transfers and withdrawals (tier=tier-32)
  ✖ claw solves the task (73846.647143ms)
✖ grade-school: roster with transfers and withdrawals (tier=tier-32) (73847.39878ms)

=== ini-parser (tier-32) ===
  claw: exit=1 elapsed=67461ms files=[".claw",".claw-runtime","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

[run-registry] appended ini-parser row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ ini-parser: line-by-line config parser with section reentry (tier=tier-32)
  ✖ claw solves the task (67470.021777ms)
✖ ini-parser: line-by-line config parser with section reentry (tier=tier-32) (67471.262256ms)

=== semver-range (tier-32) ===
  claw: exit=1 elapsed=266609ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","parse-range.js","parse.js","semver-range.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (69264 tokens) exceeds the available context size (65536 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] emit failed for /workspace/.claw-runtime/960a8c6e-aea0-4f36-9ec0-b1e7364e6c1f: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/semver-range.test.js failed validation: field expected_tier_signature: value "ceiling_t16" not in enum [monotonic_improving, ceiling, floor, tier_insensitive, unknown, ]
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/semver-range.test.js:191:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
▶ semver-range: dense semver/range parser (tier=tier-32)
  ✖ claw solves the task (231368.765784ms)
✖ semver-range: dense semver/range parser (tier=tier-32) (231369.503085ms)

=== twelve-file-refactor (tier-32) ===
  claw: exit=0 elapsed=65993ms files=[".claw",".claw-runtime",".clawd-todos.json",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-32)
  ✔ claw threads two parameters through every caller (66054.20503ms)
✔ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-32) (66054.629087ms)

=== two-bucket (tier-32) ===
  claw: exit=0 elapsed=75632ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32)
  ✔ claw solves the task (75681.883957ms)
✔ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32) (75682.312437ms)

=== word-search (tier-32) ===
  claw: exit=0 elapsed=19583ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-32)
  ✔ claw solves the task (19619.845421ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-32) (19620.359901ms)

=== wordy (tier-32) ===
  claw: exit=0 elapsed=99915ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  verify: exit=0 stderr=
[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ wordy: arithmetic query parser (tier=tier-32)
  ✔ claw solves the task (99960.823868ms)
✔ wordy: arithmetic query parser (tier=tier-32) (99961.299357ms)
ℹ tests 12
ℹ suites 12
ℹ pass 7
ℹ fail 5
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1393652.537179

✖ failing tests:

test at __tests__/tier-eval/alphametics.test.js:205:3
✖ claw solves the task (285048.543032ms)
  AssertionError [ERR_ASSERTION]: claw timed out after 285013ms
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/alphametics.test.js:231:49)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: undefined,
    expected: undefined,
    operator: 'fail',
    diff: 'simple'
  }

test at __tests__/tier-eval/forth.test.js:153:3
✖ claw solves the task (285061.795929ms)
  AssertionError [ERR_ASSERTION]: claw timed out after 285041ms
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/forth.test.js:179:49)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: undefined,
    expected: undefined,
    operator: 'fail',
    diff: 'simple'
  }

test at __tests__/tier-eval/grade-school.test.js:189:3
✖ claw solves the task (73846.647143ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/grade-school.test.js:217:12)
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

test at __tests__/tier-eval/ini-parser.test.js:234:3
✖ claw solves the task (67470.021777ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/ini-parser.test.js:262:12)
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

test at __tests__/tier-eval/semver-range.test.js:173:3
✖ claw solves the task (231368.765784ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/semver-range.test.js:201:12)
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

Exit code: 1 (rep=2 tier=32)

## rep=3 tier=32

```
 Container test-test-run-ea42cf4fed78 Creating 
 Container test-test-run-ea42cf4fed78 Created 

=== alphametics (tier-32) ===
  claw: exit=null elapsed=1226811ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","alphametics.js","verify.js"]
  claw stderr (tail):

[run-registry] appended alphametics row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ alphametics: cryptarithmetic with + and * (tier=tier-32)
  ✖ claw solves the task (292449.165869ms)
✖ alphametics: cryptarithmetic with + and * (tier=tier-32) (292450.081125ms)

=== book-store (tier-32) ===
  claw: exit=0 elapsed=56738ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","book-store.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended book-store row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ book-store: minimum-cost partition with non-greedy trap (tier=tier-32)
  ✔ claw solves the task (56798.308416ms)
✔ book-store: minimum-cost partition with non-greedy trap (tier=tier-32) (56798.81638ms)

=== cascade-eight (tier-32) ===
  claw: exit=0 elapsed=37314ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates fix/re-run until run.js exits clean (37371.193121ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-32) (37371.641917ms)

=== count-power-of-two (tier-32) ===
  claw: exit=0 elapsed=17838ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","count-power-of-two.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended count-power-of-two row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-32)
  ✔ claw solves the task (17875.636619ms)
✔ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-32) (17876.072707ms)

=== forth (tier-32) ===
  claw: exit=1 elapsed=61461ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","forth.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 4191; first 200 chars of body: {"error": {"message": "dictionary changed size during iteration\n\nTraceback (most recent call last):\n  File \"/usr/lib/python3.13/site-packages/litellm/litellm_core_utils/streaming_handler.py\", lin…

Run `claw --help` for usage.

[run-registry] appended forth row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ forth: stack interpreter with def/end and parse-time binding (tier=tier-32)
  ✖ claw solves the task (61481.216213ms)
✖ forth: stack interpreter with def/end and parse-time binding (tier=tier-32) (61481.877637ms)

=== grade-school (tier-32) ===
  claw: exit=0 elapsed=11835ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","grade-school.js","verify.js"]
  verify: exit=0 stderr=
▶ grade-school: roster with transfers and withdrawals (tier=tier-32)
  ✔ claw solves the task (11876.14034ms)
✔ grade-school: roster with transfers and withdrawals (tier=tier-32) (11876.563053ms)
[run-registry] appended grade-school row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl

=== ini-parser (tier-32) ===
  claw: exit=0 elapsed=18012ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","ini-parser.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended ini-parser row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ ini-parser: line-by-line config parser with section reentry (tier=tier-32)
  ✔ claw solves the task (18047.472582ms)
✔ ini-parser: line-by-line config parser with section reentry (tier=tier-32) (18047.975795ms)

=== semver-range (tier-32) ===
  claw: exit=null elapsed=401545ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","semver-range.js","verify.js"]
  claw stderr (tail):

[run-registry] emit failed for /workspace/.claw-runtime/c04bddc8-4da4-4686-b268-ca07ddde56a6: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/semver-range.test.js failed validation: field expected_tier_signature: value "ceiling_t16" not in enum [monotonic_improving, ceiling, floor, tier_insensitive, unknown, ]
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/semver-range.test.js:191:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
▶ semver-range: dense semver/range parser (tier=tier-32)
  ✖ claw solves the task (285051.212508ms)
✖ semver-range: dense semver/range parser (tier=tier-32) (285052.108435ms)

=== twelve-file-refactor (tier-32) ===
  claw: exit=0 elapsed=42309ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-32)
  ✔ claw threads two parameters through every caller (42375.469515ms)
✔ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-32) (42375.903895ms)

=== two-bucket (tier-32) ===
  claw: exit=0 elapsed=600245ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32)
  ✔ claw solves the task (81426.121614ms)
✔ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32) (81426.518451ms)

=== word-search (tier-32) ===
  claw: exit=0 elapsed=20016ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-32)
  ✔ claw solves the task (20057.697777ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-32) (20058.128698ms)

=== wordy (tier-32) ===
  claw: exit=0 elapsed=637687ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  verify: exit=0 stderr=
[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c1-20260502-1735.jsonl
▶ wordy: arithmetic query parser (tier=tier-32)
  ✔ claw solves the task (248460.716036ms)
✔ wordy: arithmetic query parser (tier=tier-32) (248461.224208ms)
ℹ tests 12
ℹ suites 12
ℹ pass 9
ℹ fail 3
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1173623.326589

✖ failing tests:

test at __tests__/tier-eval/alphametics.test.js:205:3
✖ claw solves the task (292449.165869ms)
  AssertionError [ERR_ASSERTION]: claw timed out after 1226811ms
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/alphametics.test.js:231:49)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: undefined,
    expected: undefined,
    operator: 'fail',
    diff: 'simple'
  }

test at __tests__/tier-eval/forth.test.js:153:3
✖ claw solves the task (61481.216213ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/forth.test.js:181:12)
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

test at __tests__/tier-eval/semver-range.test.js:173:3
✖ claw solves the task (285051.212508ms)
  AssertionError [ERR_ASSERTION]: claw timed out after 401545ms
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/semver-range.test.js:199:49)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: undefined,
    expected: undefined,
    operator: 'fail',
    diff: 'simple'
  }

```

Exit code: 1 (rep=3 tier=32)

