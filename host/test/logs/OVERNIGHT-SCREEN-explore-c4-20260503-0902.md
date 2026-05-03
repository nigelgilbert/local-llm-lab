# Overnight Cross-Tier Screen — explore-c4-20260503-0902

- Date: 2026-05-03 09:02
- Tiers: 16 32
- Reps per tier: 3
- Harness git SHA: 726b3c6
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-1af77673477d Creating 
 Container test-test-run-1af77673477d Created 

=== cascade-eight (tier-16) ===
  claw: exit=0 elapsed=36174ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates fix/re-run until run.js exits clean (36230.365067ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-16) (36230.860561ms)

=== two-bucket (tier-16) ===
  claw: exit=1 elapsed=94230ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (34264 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16)
  ✖ claw solves the task (94242.082012ms)
✖ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16) (94242.713586ms)

=== word-search (tier-16) ===
  claw: exit=0 elapsed=15618ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-16)
  ✔ claw solves the task (15654.575918ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-16) (15655.327491ms)

=== wordy (tier-16) ===
  claw: exit=1 elapsed=101596ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (36967 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ wordy: arithmetic query parser (tier=tier-16)
  ✖ claw solves the task (101610.030814ms)
✖ wordy: arithmetic query parser (tier=tier-16) (101610.562182ms)
ℹ tests 4
ℹ suites 4
ℹ pass 2
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 247843.882079

✖ failing tests:

test at __tests__/tier-eval/two-bucket.test.js:197:3
✖ claw solves the task (94242.082012ms)
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

test at __tests__/tier-eval/wordy.test.js:103:3
✖ claw solves the task (101610.030814ms)
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

## rep=1 tier=32

```
 Container test-test-run-f65c567c3e8b Creating 
 Container test-test-run-f65c567c3e8b Created 

=== cascade-eight (tier-32) ===
  claw: exit=0 elapsed=44431ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates fix/re-run until run.js exits clean (44483.286748ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-32) (44483.70041ms)

=== two-bucket (tier-32) ===
  claw: exit=0 elapsed=101377ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32)
  ✔ claw solves the task (101421.99141ms)
✔ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32) (101422.509237ms)

=== word-search (tier-32) ===
  claw: exit=0 elapsed=23727ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-32)
  ✔ claw solves the task (23757.021541ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-32) (23757.47741ms)

=== wordy (tier-32) ===
  claw: exit=null elapsed=285012ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  claw stderr (tail):

[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ wordy: arithmetic query parser (tier=tier-32)
  ✖ claw solves the task (285037.787281ms)
✖ wordy: arithmetic query parser (tier=tier-32) (285038.582492ms)
ℹ tests 4
ℹ suites 4
ℹ pass 3
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 454809.09646

✖ failing tests:

test at __tests__/tier-eval/wordy.test.js:103:3
✖ claw solves the task (285037.787281ms)
  AssertionError [ERR_ASSERTION]: claw timed out after 285012ms
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/wordy.test.js:130:49)
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

Exit code: 1 (rep=1 tier=32)

## rep=2 tier=16

```
 Container test-test-run-5dbd71a8c38e Creating 
 Container test-test-run-5dbd71a8c38e Created 

=== cascade-eight (tier-16) ===
  claw: exit=0 elapsed=45473ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates fix/re-run until run.js exits clean (45526.315747ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-16) (45526.785012ms)

=== two-bucket (tier-16) ===
  claw: exit=0 elapsed=114326ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16)
  ✔ claw solves the task (114370.357341ms)
✔ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16) (114370.808159ms)

=== word-search (tier-16) ===
  claw: exit=0 elapsed=30839ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-16)
  ✔ claw solves the task (30876.189331ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-16) (30876.674113ms)

=== wordy (tier-16) ===
  claw: exit=1 elapsed=146364ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33069 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ wordy: arithmetic query parser (tier=tier-16)
  ✖ claw solves the task (146384.202357ms)
✖ wordy: arithmetic query parser (tier=tier-16) (146384.81597ms)
ℹ tests 4
ℹ suites 4
ℹ pass 3
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 337261.626537

✖ failing tests:

test at __tests__/tier-eval/wordy.test.js:103:3
✖ claw solves the task (146384.202357ms)
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

## rep=2 tier=32

```
 Container test-test-run-af9268a3dd3b Creating 
 Container test-test-run-af9268a3dd3b Created 

=== cascade-eight (tier-32) ===
  claw: exit=0 elapsed=64731ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates fix/re-run until run.js exits clean (64786.323236ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-32) (64786.832855ms)

=== two-bucket (tier-32) ===
  claw: exit=0 elapsed=1532651ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32)
  ✔ claw solves the task (114442.743448ms)
✔ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32) (114443.182905ms)

=== word-search (tier-32) ===
  claw: exit=0 elapsed=16680ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-32)
  ✔ claw solves the task (16716.874825ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-32) (16717.349659ms)

=== wordy (tier-32) ===
  claw: exit=null elapsed=285008ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  claw stderr (tail):

[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ wordy: arithmetic query parser (tier=tier-32)
  ✖ claw solves the task (285032.685816ms)
✖ wordy: arithmetic query parser (tier=tier-32) (285033.702733ms)
ℹ tests 4
ℹ suites 4
ℹ pass 3
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 481084.793225

✖ failing tests:

test at __tests__/tier-eval/wordy.test.js:103:3
✖ claw solves the task (285032.685816ms)
  AssertionError [ERR_ASSERTION]: claw timed out after 285008ms
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/wordy.test.js:130:49)
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

Exit code: 1 (rep=2 tier=32)

## rep=3 tier=16

```
 Container test-test-run-00f33f9b4afe Creating 
 Container test-test-run-00f33f9b4afe Created 

=== cascade-eight (tier-16) ===
  claw: exit=0 elapsed=2232236ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates fix/re-run until run.js exits clean (41248.352593ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-16) (41249.539843ms)

=== two-bucket (tier-16) ===
  claw: exit=1 elapsed=117926ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (38809 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16)
  ✖ claw solves the task (117937.050123ms)
✖ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-16) (117937.69554ms)

=== word-search (tier-16) ===
  claw: exit=0 elapsed=231176ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-16)
  ✔ claw solves the task (19890.065198ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-16) (19890.530698ms)

=== wordy (tier-16) ===
  claw: exit=1 elapsed=6069099ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (37899 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ wordy: arithmetic query parser (tier=tier-16)
  ✖ claw solves the task (173965.541974ms)
✖ wordy: arithmetic query parser (tier=tier-16) (173966.218599ms)
ℹ tests 4
ℹ suites 4
ℹ pass 2
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 353142.170049

✖ failing tests:

test at __tests__/tier-eval/two-bucket.test.js:197:3
✖ claw solves the task (117937.050123ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/two-bucket.test.js:225:12)
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
✖ claw solves the task (173965.541974ms)
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

Exit code: 1 (rep=3 tier=16)

## rep=3 tier=32

```
 Container test-test-run-5fe525890489 Creating 
 Container test-test-run-5fe525890489 Created 

=== cascade-eight (tier-32) ===
  claw: exit=0 elapsed=54495ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","f.js","g.js","h.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascade-eight row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ cascade-eight: 8 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates fix/re-run until run.js exits clean (54552.351231ms)
✔ cascade-eight: 8 sequential failures, one runner (tier=tier-32) (54552.796982ms)

=== two-bucket (tier-32) ===
  claw: exit=0 elapsed=2483052ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","two-bucket.js","verify.js"]
  verify: exit=0 stderr=
[run-registry] appended two-bucket row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32)
  ✔ claw solves the task (99952.996426ms)
✔ two-bucket: shortest-path BFS with explicit path reconstruction (tier=tier-32) (99953.399135ms)

=== word-search (tier-32) ===
  claw: exit=0 elapsed=83608ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","word-search.js"]
  verify: exit=0 stderr=
[run-registry] appended word-search row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ word-search: 4-direction grid search with named axes (tier=tier-32)
  ✔ claw solves the task (83666.393732ms)
✔ word-search: 4-direction grid search with named axes (tier=tier-32) (83667.051149ms)

=== wordy (tier-32) ===
  claw: exit=null elapsed=515849ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","wordy.js"]
  claw stderr (tail):

[run-registry] appended wordy row → /workspace/.claw-runtime/run_registry.explore-c4-20260503-0902.jsonl
▶ wordy: arithmetic query parser (tier=tier-32)
  ✖ claw solves the task (285030.356147ms)
✖ wordy: arithmetic query parser (tier=tier-32) (285031.363022ms)
ℹ tests 4
ℹ suites 4
ℹ pass 3
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 523307.191909

✖ failing tests:

test at __tests__/tier-eval/wordy.test.js:103:3
✖ claw solves the task (285030.356147ms)
  AssertionError [ERR_ASSERTION]: claw timed out after 515849ms
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/wordy.test.js:130:49)
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

