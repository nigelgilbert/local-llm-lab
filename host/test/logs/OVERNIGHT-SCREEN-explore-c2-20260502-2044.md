# Overnight Cross-Tier Screen — explore-c2-20260502-2044

- Date: 2026-05-02 20:44
- Tiers: 16
- Reps per tier: 2
- Harness git SHA: 7ef53f3
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-04f7c521ce07 Creating 
 Container test-test-run-04f7c521ce07 Created 

=== alphametics (tier-16) ===
  claw: exit=1 elapsed=97806ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","alphametics.js","parser.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (36806 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended alphametics row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ alphametics: cryptarithmetic with + and * (tier=tier-16)
  ✖ claw solves the task (97815.774226ms)
✖ alphametics: cryptarithmetic with + and * (tier=tier-16) (97816.372483ms)

=== book-store (tier-16) ===
  claw: exit=1 elapsed=74433ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","book-store.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33133 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended book-store row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ book-store: minimum-cost partition with non-greedy trap (tier=tier-16)
  ✖ claw solves the task (74449.849005ms)
✖ book-store: minimum-cost partition with non-greedy trap (tier=tier-16) (74450.49947ms)

=== cascade-eight (tier-16) ===
  claw: exit=0 elapsed=44854ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates fix/re-run until run.js exits clean (44903.70853ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-16) (44904.114825ms)

=== count-power-of-two (tier-16) ===
  claw: exit=0 elapsed=12094ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","count-power-of-two.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended count-power-of-two row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-16)
  ✔ claw solves the task (12133.503862ms)
✔ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-16) (12133.964534ms)

=== forth (tier-16) ===
  claw: exit=1 elapsed=562502ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","forth.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (40218 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended forth row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ forth: stack interpreter with def/end and parse-time binding (tier=tier-16)
  ✖ claw solves the task (98728.060941ms)
✖ forth: stack interpreter with def/end and parse-time binding (tier=tier-16) (98728.665489ms)

=== grade-school (tier-16) ===
  claw: exit=0 elapsed=13054ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","grade-school.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended grade-school row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ grade-school: roster with transfers and withdrawals (tier=tier-16)
  ✔ claw solves the task (13093.406522ms)
✔ grade-school: roster with transfers and withdrawals (tier=tier-16) (13093.830235ms)

=== ini-parser (tier-16) ===
  claw: exit=0 elapsed=35982ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","ini-parser.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended ini-parser row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ ini-parser: line-by-line config parser with section reentry (tier=tier-16)
  ✔ claw solves the task (36018.985223ms)
✔ ini-parser: line-by-line config parser with section reentry (tier=tier-16) (36019.455102ms)

=== semver-range (tier-16) ===
  claw: exit=1 elapsed=90157ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","semver-range.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33348 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended semver-range row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ semver-range: dense semver/range parser (tier=tier-16)
  ✖ claw solves the task (90170.250825ms)
✖ semver-range: dense semver/range parser (tier=tier-16) (90170.765664ms)

=== twelve-file-refactor (tier-16) ===
  claw: exit=0 elapsed=65147ms files=[".claw",".claw-runtime",".clawd-todos.json",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-16)
  ✔ claw threads two parameters through every caller (65212.082852ms)
✔ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-16) (65212.466981ms)

=== two-bucket (tier-16) ===
  claw: exit=1 elapsed=107971ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (37396 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16)
  ✖ claw solves the task (107985.047033ms)
✖ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16) (107985.598288ms)

=== word-search (tier-16) ===
  claw: exit=1 elapsed=86902ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33195 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-16)
  ✖ claw solves the task (86917.769424ms)
✖ word-search: 4-direction grid search with named axes (tier=tier-16) (86918.355429ms)

=== wordy (tier-16) ===
  claw: exit=1 elapsed=248492ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (35376 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ wordy: arithmetic query parser (tier=tier-16)
  ✖ claw solves the task (115247.829459ms)
✖ wordy: arithmetic query parser (tier=tier-16) (115248.750424ms)
ℹ tests 12
ℹ suites 12
ℹ pass 5
ℹ fail 7
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 842979.14792

✖ failing tests:

test at __tests__/tier-eval/alphametics.test.js:205:3
✖ claw solves the task (97815.774226ms)
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
✖ claw solves the task (74449.849005ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/book-store.test.js:184:12)
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

test at __tests__/tier-eval/forth.test.js:153:3
✖ claw solves the task (98728.060941ms)
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
✖ claw solves the task (90170.250825ms)
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

test at __tests__/tier-eval/two-bucket.test.js:197:3
✖ claw solves the task (107985.047033ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/two-bucket.test.js:225:12)
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

test at __tests__/tier-eval/word-search.test.js:174:3
✖ claw solves the task (86917.769424ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/word-search.test.js:202:12)
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

test at __tests__/tier-eval/wordy.test.js:103:3
✖ claw solves the task (115247.829459ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/wordy.test.js:132:12)
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

## rep=2 tier=16

```
 Container test-test-run-bb767a8de464 Creating 
 Container test-test-run-bb767a8de464 Created 

=== alphametics (tier-16) ===
  claw: exit=1 elapsed=92580ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","alphametics.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (36296 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended alphametics row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ alphametics: cryptarithmetic with + and * (tier=tier-16)
  ✖ claw solves the task (92593.720208ms)
✖ alphametics: cryptarithmetic with + and * (tier=tier-16) (92594.258003ms)

=== book-store (tier-16) ===
  claw: exit=1 elapsed=2439200ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","book-store.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (37093 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended book-store row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ book-store: minimum-cost partition with non-greedy trap (tier=tier-16)
  ✖ claw solves the task (116276.826618ms)
✖ book-store: minimum-cost partition with non-greedy trap (tier=tier-16) (116277.358039ms)

=== cascade-eight (tier-16) ===
  claw: exit=0 elapsed=38927ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates fix/re-run until run.js exits clean (38976.221342ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-16) (38976.811596ms)

=== count-power-of-two (tier-16) ===
  claw: exit=0 elapsed=11227ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","count-power-of-two.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended count-power-of-two row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-16)
  ✔ claw solves the task (11268.298063ms)
✔ count-power-of-two: subarray power-of-two count with BigInt (tier=tier-16) (11268.748025ms)

=== forth (tier-16) ===
  claw: exit=1 elapsed=81181ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","forth.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (34538 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended forth row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ forth: stack interpreter with def/end and parse-time binding (tier=tier-16)
  ✖ claw solves the task (81195.852144ms)
✖ forth: stack interpreter with def/end and parse-time binding (tier=tier-16) (81196.490982ms)

=== grade-school (tier-16) ===
  claw: exit=0 elapsed=12139ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","grade-school.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended grade-school row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ grade-school: roster with transfers and withdrawals (tier=tier-16)
  ✔ claw solves the task (12182.037491ms)
✔ grade-school: roster with transfers and withdrawals (tier=tier-16) (12182.446326ms)

=== ini-parser (tier-16) ===
  claw: exit=0 elapsed=33052ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","ini-parser.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended ini-parser row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ ini-parser: line-by-line config parser with section reentry (tier=tier-16)
  ✔ claw solves the task (33091.917059ms)
✔ ini-parser: line-by-line config parser with section reentry (tier=tier-16) (33092.406855ms)

=== semver-range (tier-16) ===
  claw: exit=1 elapsed=62034ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","semver-range.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33787 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended semver-range row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ semver-range: dense semver/range parser (tier=tier-16)
  ✖ claw solves the task (62053.369129ms)
✖ semver-range: dense semver/range parser (tier=tier-16) (62054.007091ms)

=== twelve-file-refactor (tier-16) ===
  claw: exit=0 elapsed=58605ms files=[".claw",".claw-runtime",".clawd-todos.json",".sandbox-home",".sandbox-tmp","audit.js","cart.js","constants.js","format.js","helper.js","invoice.js","notify.js","receipt.js","report.js","summary.js","taxes.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended twelve-file-refactor row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-16)
  ✔ claw threads two parameters through every caller (58658.301719ms)
✔ twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=tier-16) (58658.953057ms)

=== two-bucket (tier-16) ===
  claw: exit=0 elapsed=21647ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","node","two-bucket.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16)
  ✔ claw solves the task (21683.604922ms)
✔ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16) (21684.0663ms)

=== word-search (tier-16) ===
  claw: exit=0 elapsed=17846ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-16)
  ✔ claw solves the task (17893.17838ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-16) (17893.736384ms)

=== wordy (tier-16) ===
  claw: exit=1 elapsed=746473ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (38300 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c2-20260502-2044.jsonl
▶ wordy: arithmetic query parser (tier=tier-16)
  ✖ claw solves the task (157373.278524ms)
✖ wordy: arithmetic query parser (tier=tier-16) (157373.841983ms)
ℹ tests 12
ℹ suites 12
ℹ pass 7
ℹ fail 5
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 703548.176192

✖ failing tests:

test at __tests__/tier-eval/alphametics.test.js:205:3
✖ claw solves the task (92593.720208ms)
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
✖ claw solves the task (116276.826618ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/book-store.test.js:184:12)
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

test at __tests__/tier-eval/forth.test.js:153:3
✖ claw solves the task (81195.852144ms)
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
✖ claw solves the task (62053.369129ms)
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

test at __tests__/tier-eval/wordy.test.js:103:3
✖ claw solves the task (157373.278524ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/wordy.test.js:132:12)
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

Exit code: 1 (rep=2 tier=16)

