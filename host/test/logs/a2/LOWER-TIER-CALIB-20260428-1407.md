# Lower-tier calibration: round-2 + round-3 evals
started 2026-04-28 14:07:37

Tiers: 32, 16
Tests (n=3 each): csv-parser lru-cache json-schema-validate cascading-bugs expression-eval mini-vm


## Tier 32GB (14:07:37)

### iter 1 — 14:07:42
```
 Container test-test-run-05b1b6bcd681 Creating 
 Container test-test-run-05b1b6bcd681 Created 

=== cascading-bugs (tier-32) ===
  claw: exit=0 elapsed=42344ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates run/fix until run.js exits clean (42390.328001ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-32) (42390.872669ms)

=== csv-parser (tier-32) ===
  claw: exit=0 elapsed=35285ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: embedded newline
+ actual - expected

  [
    [
      'a',
      'b'
    ],
    [
+     'line1'
-     'line1\nline2',
-     'x'
    ],
+   [
+     'line2,x'
+   ]
  ]

    at file:///workspace/verify.js:19:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:int
▶ csv-parser: RFC 4180-ish parser (tier=tier-32)
  ✖ claw implements parseCSV handling every quoting case (35319.314553ms)
✖ csv-parser: RFC 4180-ish parser (tier=tier-32) (35320.187638ms)

=== expression-eval (tier-32) ===
  claw: exit=0 elapsed=152486ms files=[".claw",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ expression-eval: recursive-descent parser (tier=tier-32)
  ✔ claw implements evaluate handling precedence, assoc, errors (152505.683344ms)
✔ expression-eval: recursive-descent parser (tier=tier-32) (152506.164803ms)

=== json-schema-validate (tier-32) ===
  claw: exit=0 elapsed=151772ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: valid minimal
+ actual - expected

  {
+   errors: [
+     {
+       message: 'Type mismatch: expected string, got undefined',
+       path: '.email'
+     },
+     {
+       message: 'Type mismatch: expected array, got undefined',
+       path: '.tags'
+     },
+     {
+       message: 'Type mi
▶ json-schema-validate: recursive validator (tier=tier-32)
  ✖ claw implements validate with recursive paths and error accumulation (151802.100637ms)
✖ json-schema-validate: recursive validator (tier=tier-32) (151803.070722ms)

=== lru-cache (tier-32) ===
  claw: exit=0 elapsed=94591ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-32)
  ✔ claw implements LRUCache satisfying every spec bullet (94621.368522ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-32) (94621.84094ms)

=== mini-vm (tier-32) ===
  claw: exit=0 elapsed=36454ms files=[".claw","verify.js","vm.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { run } from './vm.js';
         ^^^
SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './vm.js';
const { run } = pkg;

    at #asyncInstantiate (node:interna
▶ mini-vm: bytecode interpreter (tier=tier-32)
  ✖ claw implements run handling all 13 opcodes + error cases (36488.653564ms)
✖ mini-vm: bytecode interpreter (tier=tier-32) (36489.507899ms)
ℹ tests 6
ℹ suites 6
ℹ pass 3
ℹ fail 3
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 513277.325641

✖ failing tests:

test at __tests__/tier-eval/csv-parser.test.js:127:3
✖ claw implements parseCSV handling every quoting case (35319.314553ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: embedded newline
  + actual - expected
  
    [
      [
        'a',
        'b'
      ],
      [
  +     'line1'
  -     'line1\nline2',
  -     'x'
      ],
  +   [
  +     'line2,x'
  +   ]
    ]
  
      at file:///workspace/verify.js:19:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: [ [ 'a', 'b' ], [ 'line1' ], [ 'line2,x' ] ],
    expected: [ [ 'a', 'b' ], [ 'line1\nline2', 'x' ] ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/csv-parser.test.js:144:12)
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

test at __tests__/tier-eval/json-schema-validate.test.js:148:3
✖ claw implements validate with recursive paths and error accumulation (151802.100637ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: valid minimal
  + actual - expected
  
    {
  +   errors: [
  +     {
  +       message: 'Type mismatch: expected string, got undefined',
  +       path: '.email'
  +     },
  +     {
  +       message: 'Type mismatch: expected array, got undefined',
  +       path: '.tags'
  +     },
  +     {
  +       message: 'Type mismatch: expected object, got undefined',
  +       path: '.address'
  +     }
  +   ],
  +   valid: false
  -   errors: [],
  -   valid: true
    }
  
      at file:///workspace/verify.js:26:10
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/json-schema-validate.test.js:165:12)
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

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (36488.653564ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { run } from './vm.js';
           ^^^
  SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './vm.js';
  const { run } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/mini-vm.test.js:201:12)
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

  iter exited non-zero
```

### iter 2 — 14:16:16
```
 Container test-test-run-437e78bb7668 Creating 
 Container test-test-run-437e78bb7668 Created 

=== cascading-bugs (tier-32) ===
  claw: exit=0 elapsed=40195ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates run/fix until run.js exits clean (40241.259978ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-32) (40242.610689ms)

=== csv-parser (tier-32) ===
  claw: exit=0 elapsed=36039ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: embedded newline
+ actual - expected

  [
    [
      'a',
      'b'
    ],
    [
+     'line1'
-     'line1\nline2',
-     'x'
    ],
+   [
+     'line2,x'
+   ]
  ]

    at file:///workspace/verify.js:19:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:int
▶ csv-parser: RFC 4180-ish parser (tier=tier-32)
  ✖ claw implements parseCSV handling every quoting case (36069.53496ms)
✖ csv-parser: RFC 4180-ish parser (tier=tier-32) (36070.408634ms)

=== expression-eval (tier-32) ===
  claw: exit=1 elapsed=222296ms files=[".claw",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (35625 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ expression-eval: recursive-descent parser (tier=tier-32)
  ✖ claw implements evaluate handling precedence, assoc, errors (222297.341052ms)
✖ expression-eval: recursive-descent parser (tier=tier-32) (222297.89946ms)

=== json-schema-validate (tier-32) ===
  claw: exit=0 elapsed=22235ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { validate } from './validator.js';
         ^^^^^^^^
SyntaxError: Named export 'validate' not found. The requested module './validator.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './validator.js';
const { validate } = pkg
▶ json-schema-validate: recursive validator (tier=tier-32)
  ✖ claw implements validate with recursive paths and error accumulation (22264.713258ms)
✖ json-schema-validate: recursive validator (tier=tier-32) (22265.533185ms)

=== lru-cache (tier-32) ===
  claw: exit=1 elapsed=217580ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (32836 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ lru-cache: LRU + TTL + eviction callback (tier=tier-32)
  ✖ claw implements LRUCache satisfying every spec bullet (217583.279865ms)
✖ lru-cache: LRU + TTL + eviction callback (tier=tier-32) (217584.005081ms)

=== mini-vm (tier-32) ===
  claw: exit=0 elapsed=38256ms files=[".claw","verify.js","vm.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { run } from './vm.js';
         ^^^
SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './vm.js';
const { run } = pkg;

    at #asyncInstantiate (node:interna
▶ mini-vm: bytecode interpreter (tier=tier-32)
  ✖ claw implements run handling all 13 opcodes + error cases (38286.086262ms)
✖ mini-vm: bytecode interpreter (tier=tier-32) (38286.924813ms)
ℹ tests 6
ℹ suites 6
ℹ pass 1
ℹ fail 5
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 576895.382301

✖ failing tests:

test at __tests__/tier-eval/csv-parser.test.js:127:3
✖ claw implements parseCSV handling every quoting case (36069.53496ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: embedded newline
  + actual - expected
  
    [
      [
        'a',
        'b'
      ],
      [
  +     'line1'
  -     'line1\nline2',
  -     'x'
      ],
  +   [
  +     'line2,x'
  +   ]
    ]
  
      at file:///workspace/verify.js:19:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: [ [ 'a', 'b' ], [ 'line1' ], [ 'line2,x' ] ],
    expected: [ [ 'a', 'b' ], [ 'line1\nline2', 'x' ] ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/csv-parser.test.js:144:12)
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

test at __tests__/tier-eval/expression-eval.test.js:121:3
✖ claw implements evaluate handling precedence, assoc, errors (222297.341052ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/expression-eval.test.js:128:12)
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

test at __tests__/tier-eval/json-schema-validate.test.js:148:3
✖ claw implements validate with recursive paths and error accumulation (22264.713258ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { validate } from './validator.js';
           ^^^^^^^^
  SyntaxError: Named export 'validate' not found. The requested module './validator.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './validator.js';
  const { validate } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/json-schema-validate.test.js:165:12)
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

test at __tests__/tier-eval/lru-cache.test.js:158:3
✖ claw implements LRUCache satisfying every spec bullet (217583.279865ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/lru-cache.test.js:165:12)
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

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (38286.086262ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { run } from './vm.js';
           ^^^
  SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './vm.js';
  const { run } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/mini-vm.test.js:201:12)
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

  iter exited non-zero
```

### iter 3 — 14:25:53
```
 Container test-test-run-1050024e9c78 Creating 
 Container test-test-run-1050024e9c78 Created 

=== cascading-bugs (tier-32) ===
  claw: exit=0 elapsed=39223ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates run/fix until run.js exits clean (39264.270162ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-32) (39266.784925ms)

=== csv-parser (tier-32) ===
  claw: exit=0 elapsed=31514ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: embedded newline
+ actual - expected

  [
    [
      'a',
      'b'
    ],
    [
+     'line1'
-     'line1\nline2',
-     'x'
    ],
+   [
+     'line2,x'
+   ]
  ]

    at file:///workspace/verify.js:19:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:int
▶ csv-parser: RFC 4180-ish parser (tier=tier-32)
  ✖ claw implements parseCSV handling every quoting case (31543.012147ms)
✖ csv-parser: RFC 4180-ish parser (tier=tier-32) (31543.854443ms)
▶ expression-eval: recursive-descent parser (tier=tier-32)
  ✖ claw implements evaluate handling precedence, assoc, errors (240065.31338ms)
✖ expression-eval: recursive-descent parser (tier=tier-32) (240066.608429ms)

=== json-schema-validate (tier-32) ===
  claw: exit=1 elapsed=229246ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (34712 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ json-schema-validate: recursive validator (tier=tier-32)
  ✖ claw implements validate with recursive paths and error accumulation (229247.973527ms)
✖ json-schema-validate: recursive validator (tier=tier-32) (229248.664364ms)

=== lru-cache (tier-32) ===
  claw: exit=0 elapsed=155943ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: expired at 101ms

1 !== undefined

    at file:///workspace/verify.js:52:10
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMes
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-32)
  ✖ claw implements LRUCache satisfying every spec bullet (155972.032707ms)
✖ lru-cache: LRU + TTL + eviction callback (tier=tier-32) (155972.903296ms)

=== mini-vm (tier-32) ===
  claw: exit=0 elapsed=36433ms files=[".claw","verify.js","vm.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { run } from './vm.js';
         ^^^
SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './vm.js';
const { run } = pkg;

    at #asyncInstantiate (node:interna
▶ mini-vm: bytecode interpreter (tier=tier-32)
  ✖ claw implements run handling all 13 opcodes + error cases (36468.13028ms)
✖ mini-vm: bytecode interpreter (tier=tier-32) (36468.951952ms)
ℹ tests 6
ℹ suites 6
ℹ pass 1
ℹ fail 5
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 732726.639895

✖ failing tests:

test at __tests__/tier-eval/csv-parser.test.js:127:3
✖ claw implements parseCSV handling every quoting case (31543.012147ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: embedded newline
  + actual - expected
  
    [
      [
        'a',
        'b'
      ],
      [
  +     'line1'
  -     'line1\nline2',
  -     'x'
      ],
  +   [
  +     'line2,x'
  +   ]
    ]
  
      at file:///workspace/verify.js:19:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: [ [ 'a', 'b' ], [ 'line1' ], [ 'line2,x' ] ],
    expected: [ [ 'a', 'b' ], [ 'line1\nline2', 'x' ] ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/csv-parser.test.js:144:12)
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

test at __tests__/tier-eval/expression-eval.test.js:121:3
✖ claw implements evaluate handling precedence, assoc, errors (240065.31338ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/json-schema-validate.test.js:148:3
✖ claw implements validate with recursive paths and error accumulation (229247.973527ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/json-schema-validate.test.js:155:12)
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

test at __tests__/tier-eval/lru-cache.test.js:158:3
✖ claw implements LRUCache satisfying every spec bullet (155972.032707ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: expired at 101ms
  
  1 !== undefined
  
      at file:///workspace/verify.js:52:10
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: undefined,
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/lru-cache.test.js:175:12)
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

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (36468.13028ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { run } from './vm.js';
           ^^^
  SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './vm.js';
  const { run } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/mini-vm.test.js:201:12)
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

  iter exited non-zero
```

## Tier 16GB (14:38:06)

### iter 1 — 14:38:09
```
 Container test-test-run-7680855a471e Creating 
 Container test-test-run-7680855a471e Created 

=== cascading-bugs (tier-16) ===
  claw: exit=0 elapsed=51080ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates run/fix until run.js exits clean (51122.682019ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-16) (51123.170271ms)

=== csv-parser (tier-16) ===
  claw: exit=0 elapsed=125747ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:7
  parseCSV('a,b,c\n1,2,3'),
  ^

TypeError: parseCSV is not a function
    at file:///workspace/verify.js:7:3
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0
▶ csv-parser: RFC 4180-ish parser (tier=tier-16)
  ✖ claw implements parseCSV handling every quoting case (125772.234061ms)
✖ csv-parser: RFC 4180-ish parser (tier=tier-16) (125773.305443ms)

=== expression-eval (tier-16) ===
  claw: exit=0 elapsed=21238ms files=[".claw","expr.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { evaluate } from './expr.js';
         ^^^^^^^^
SyntaxError: Named export 'evaluate' not found. The requested module './expr.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './expr.js';
const { evaluate } = pkg;

    at #asyn
▶ expression-eval: recursive-descent parser (tier=tier-16)
  ✖ claw implements evaluate handling precedence, assoc, errors (21267.634444ms)
✖ expression-eval: recursive-descent parser (tier=tier-16) (21268.444657ms)

=== json-schema-validate (tier-16) ===
  claw: exit=0 elapsed=44627ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:28
  const r = validate({ name: 'Ada', age: 30 }, userSchema);
            ^

TypeError: validate is not a function
    at file:///workspace/verify.js:28:13
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v2
▶ json-schema-validate: recursive validator (tier=tier-16)
  ✖ claw implements validate with recursive paths and error accumulation (44651.517248ms)
✖ json-schema-validate: recursive validator (tier=tier-16) (44652.150335ms)

=== lru-cache (tier-16) ===
  claw: exit=0 elapsed=32273ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-16)
  ✔ claw implements LRUCache satisfying every spec bullet (32295.964929ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-16) (32296.541808ms)

=== mini-vm (tier-16) ===
  claw: exit=0 elapsed=170120ms files=[".claw",".sandbox-home",".sandbox-tmp","verify.js","vm.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { run } from './vm.js';
         ^^^
SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './vm.js';
const { run } = pkg;

    at #asyncInstantiate (node:interna
▶ mini-vm: bytecode interpreter (tier=tier-16)
  ✖ claw implements run handling all 13 opcodes + error cases (170140.995122ms)
✖ mini-vm: bytecode interpreter (tier=tier-16) (170141.815961ms)
ℹ tests 6
ℹ suites 6
ℹ pass 2
ℹ fail 4
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 445397.760385

✖ failing tests:

test at __tests__/tier-eval/csv-parser.test.js:127:3
✖ claw implements parseCSV handling every quoting case (125772.234061ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:7
    parseCSV('a,b,c\n1,2,3'),
    ^
  
  TypeError: parseCSV is not a function
      at file:///workspace/verify.js:7:3
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/csv-parser.test.js:144:12)
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

test at __tests__/tier-eval/expression-eval.test.js:121:3
✖ claw implements evaluate handling precedence, assoc, errors (21267.634444ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { evaluate } from './expr.js';
           ^^^^^^^^
  SyntaxError: Named export 'evaluate' not found. The requested module './expr.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './expr.js';
  const { evaluate } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/expression-eval.test.js:138:12)
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

test at __tests__/tier-eval/json-schema-validate.test.js:148:3
✖ claw implements validate with recursive paths and error accumulation (44651.517248ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:28
    const r = validate({ name: 'Ada', age: 30 }, userSchema);
              ^
  
  TypeError: validate is not a function
      at file:///workspace/verify.js:28:13
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/json-schema-validate.test.js:165:12)
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

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (170140.995122ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { run } from './vm.js';
           ^^^
  SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './vm.js';
  const { run } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/mini-vm.test.js:201:12)
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

  iter exited non-zero
```

### iter 2 — 14:45:35
```
 Container test-test-run-209ab2021900 Creating 
 Container test-test-run-209ab2021900 Created 

=== cascading-bugs (tier-16) ===
  claw: exit=0 elapsed=33953ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates run/fix until run.js exits clean (33996.457498ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-16) (33996.974584ms)

=== csv-parser (tier-16) ===
  claw: exit=1 elapsed=171418ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33012 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ csv-parser: RFC 4180-ish parser (tier=tier-16)
  ✖ claw implements parseCSV handling every quoting case (171419.91007ms)
✖ csv-parser: RFC 4180-ish parser (tier=tier-16) (171420.491324ms)
▶ expression-eval: recursive-descent parser (tier=tier-16)
  ✖ claw implements evaluate handling precedence, assoc, errors (240020.594802ms)
✖ expression-eval: recursive-descent parser (tier=tier-16) (240023.161776ms)

=== json-schema-validate (tier-16) ===
  claw: exit=1 elapsed=171881ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (32954 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ json-schema-validate: recursive validator (tier=tier-16)
  ✖ claw implements validate with recursive paths and error accumulation (171883.007137ms)
✖ json-schema-validate: recursive validator (tier=tier-16) (171883.664515ms)

=== lru-cache (tier-16) ===
  claw: exit=0 elapsed=128220ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:9
  const c = new LRUCache({ capacity: 3 });
            ^

TypeError: LRUCache is not a constructor
    at file:///workspace/verify.js:9:13
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-16)
  ✖ claw implements LRUCache satisfying every spec bullet (128239.60749ms)
✖ lru-cache: LRU + TTL + eviction callback (tier=tier-16) (128240.169286ms)

=== mini-vm (tier-16) ===
  claw: exit=0 elapsed=50164ms files=[".claw","verify.js","vm.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { run } from './vm.js';
         ^^^
SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './vm.js';
const { run } = pkg;

    at #asyncInstantiate (node:interna
▶ mini-vm: bytecode interpreter (tier=tier-16)
  ✖ claw implements run handling all 13 opcodes + error cases (50183.33056ms)
✖ mini-vm: bytecode interpreter (tier=tier-16) (50183.871523ms)
ℹ tests 6
ℹ suites 6
ℹ pass 1
ℹ fail 5
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 795893.832476

✖ failing tests:

test at __tests__/tier-eval/csv-parser.test.js:127:3
✖ claw implements parseCSV handling every quoting case (171419.91007ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/csv-parser.test.js:134:12)
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

test at __tests__/tier-eval/expression-eval.test.js:121:3
✖ claw implements evaluate handling precedence, assoc, errors (240020.594802ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/json-schema-validate.test.js:148:3
✖ claw implements validate with recursive paths and error accumulation (171883.007137ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/json-schema-validate.test.js:155:12)
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

test at __tests__/tier-eval/lru-cache.test.js:158:3
✖ claw implements LRUCache satisfying every spec bullet (128239.60749ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:9
    const c = new LRUCache({ capacity: 3 });
              ^
  
  TypeError: LRUCache is not a constructor
      at file:///workspace/verify.js:9:13
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/lru-cache.test.js:175:12)
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

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (50183.33056ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { run } from './vm.js';
           ^^^
  SyntaxError: Named export 'run' not found. The requested module './vm.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './vm.js';
  const { run } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/mini-vm.test.js:201:12)
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

  iter exited non-zero
```

### iter 3 — 14:58:51
```
 Container test-test-run-256436257dd1 Creating 
 Container test-test-run-256436257dd1 Created 

=== cascading-bugs (tier-16) ===
  claw: exit=0 elapsed=45447ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-16)
  ✔ claw iterates run/fix until run.js exits clean (45491.932861ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-16) (45492.40678ms)
▶ csv-parser: RFC 4180-ish parser (tier=tier-16)
  ✖ claw implements parseCSV handling every quoting case (240011.348224ms)
✖ csv-parser: RFC 4180-ish parser (tier=tier-16) (240012.613983ms)
▶ expression-eval: recursive-descent parser (tier=tier-16)
  ✖ claw implements evaluate handling precedence, assoc, errors (240131.522729ms)
✖ expression-eval: recursive-descent parser (tier=tier-16) (240133.529034ms)

=== json-schema-validate (tier-16) ===
  claw: exit=0 elapsed=35273ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=1 stderr=/workspace/validator.js:20
      if (properties[key]) {
                    ^

TypeError: Cannot read properties of undefined (reading '0')
    at /workspace/validator.js:20:21
    at Array.forEach (<anonymous>)
    at checkProperties (/workspace/validator.js:19:24)
    at validate (/workspace/validator.js:56:3)
    at /workspace/validator.js:22:9
    at Array.forEach (<anonymous>)
    at checkPro
▶ json-schema-validate: recursive validator (tier=tier-16)
  ✖ claw implements validate with recursive paths and error accumulation (35295.063431ms)
✖ json-schema-validate: recursive validator (tier=tier-16) (35295.858352ms)

=== lru-cache (tier-16) ===
  claw: exit=1 elapsed=57129ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

▶ lru-cache: LRU + TTL + eviction callback (tier=tier-16)
  ✖ claw implements LRUCache satisfying every spec bullet (57131.088636ms)
✖ lru-cache: LRU + TTL + eviction callback (tier=tier-16) (57131.947892ms)

=== mini-vm (tier-16) ===
  claw: exit=0 elapsed=32665ms files=[".claw",".sandbox-home",".sandbox-tmp","verify.js","vm.js"]
  node post-fix: exit=0 stderr=
▶ mini-vm: bytecode interpreter (tier=tier-16)
  ✔ claw implements run handling all 13 opcodes + error cases (32691.023722ms)
✔ mini-vm: bytecode interpreter (tier=tier-16) (32691.617476ms)
ℹ tests 6
ℹ suites 6
ℹ pass 2
ℹ fail 4
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 650936.528578

✖ failing tests:

test at __tests__/tier-eval/csv-parser.test.js:127:3
✖ claw implements parseCSV handling every quoting case (240011.348224ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/expression-eval.test.js:121:3
✖ claw implements evaluate handling precedence, assoc, errors (240131.522729ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/json-schema-validate.test.js:148:3
✖ claw implements validate with recursive paths and error accumulation (35295.063431ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  /workspace/validator.js:20
        if (properties[key]) {
                      ^
  
  TypeError: Cannot read properties of undefined (reading '0')
      at /workspace/validator.js:20:21
      at Array.forEach (<anonymous>)
      at checkProperties (/workspace/validator.js:19:24)
      at validate (/workspace/validator.js:56:3)
      at /workspace/validator.js:22:9
      at Array.forEach (<anonymous>)
      at checkProperties (/workspace/validator.js:19:24)
      at validate (/workspace/validator.js:56:3)
      at file:///workspace/verify.js:25:13
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/json-schema-validate.test.js:165:12)
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

test at __tests__/tier-eval/lru-cache.test.js:158:3
✖ claw implements LRUCache satisfying every spec bullet (57131.088636ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/lru-cache.test.js:165:12)
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

  iter exited non-zero
```

completed 2026-04-28 15:09:42
