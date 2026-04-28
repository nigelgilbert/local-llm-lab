# Tier Eval Results — 2026-04-28 00:28

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-ad61b9948d84 Creating 
 Container test-test-run-ad61b9948d84 Created 

=== adversarial-input (tier-16) ===
  claw: exit=0 elapsed=107175ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:5
assert.equal(slugify('Hello World'),         'hello-world',   'basic two-word');
             ^

TypeError: slugify is not a function
    at file:///workspace/verify.js:5:14
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main
▶ adversarial inputs: slugify (tier=tier-16)
  ✖ claw implements slugify robustly enough for adversarial inputs (107195.355908ms)
✖ adversarial inputs: slugify (tier=tier-16) (107197.615985ms)

=== agent-parallel (tier-16) ===
  exit=0 elapsed=3075ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (3077.124593ms)
✔ agent: parallel file writes (tier=tier-16) (3078.281298ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1377ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (1378.479194ms)
✔ agent: single-file write (tier=tier-16) (1379.921523ms)

=== algorithm-intervals (tier-16) ===
  claw: exit=0 elapsed=49724ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-16)
  ✔ claw merges intervals across all edge cases (49750.01046ms)
✔ algorithm: merge intervals (tier=tier-16) (49750.648376ms)

=== api-evolution (tier-16) ===
  claw: exit=0 elapsed=24749ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-16)
  ✔ claw reorders the signature and updates the call site (24786.867083ms)
✔ api evolution: signature reorder across two files (tier=tier-16) (24787.400373ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=5211ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (5235.640237ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (5236.180111ms)

=== comment-spec (tier-16) ===
  claw: exit=0 elapsed=1440ms files=[".claw","collections.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: partition basic
+ actual - expected

+ undefined
- [
-   [
-     2,
-     4
-   ],
-   [
-     1,
-     3
-   ]
- ]

    at file:///workspace/verify.js:4:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRu
▶ comment-spec: implement from JSDoc (tier=tier-16)
  ✖ claw implements both functions per JSDoc (1485.167487ms)
✖ comment-spec: implement from JSDoc (tier=tier-16) (1486.038651ms)

=== deep-equal (tier-16) ===
  claw: exit=0 elapsed=44832ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=1 stderr=/workspace/verify.js:4
console.log(eq(1, 1)); // true
            ^

TypeError: eq is not a function
    at Object.<anonymous> (/workspace/verify.js:4:13)
    at Module._compile (node:internal/modules/cjs/loader:1830:14)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/loader:1553:32)
    at Module._load (node:internal/modules/cjs/loader:13
▶ deep-equal: structural equality (tier=tier-16)
  ✖ claw implements deep equality including NaN (44853.7715ms)
✖ deep-equal: structural equality (tier=tier-16) (44854.506665ms)

=== distractor (tier-16) ===
  claw: exit=0 elapsed=10394ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-16)
  ✔ claw fixes only the broken helper (10429.250851ms)
✔ distractor: one buggy helper among three (tier=tier-16) (10429.809182ms)
  [1/10] ttft=1752ms
  [2/10] ttft=142ms
  [3/10] ttft=139ms
  [4/10] ttft=141ms
  [5/10] ttft=140ms
  [6/10] ttft=139ms
  [7/10] ttft=139ms
  [8/10] ttft=141ms
  [9/10] ttft=143ms
  [10/10] ttft=139ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=139ms · median=141ms · p95=1752ms · mean=302ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4613.477457ms)
✔ TTFT — time to first token (tier=tier-16) (4615.965574ms)
  [1/20] ok=true stop=tool_use 479ms
  [2/20] ok=true stop=tool_use 383ms
  [3/20] ok=true stop=tool_use 391ms
  [4/20] ok=true stop=tool_use 393ms
  [5/20] ok=true stop=tool_use 403ms
  [6/20] ok=true stop=tool_use 389ms
  [7/20] ok=true stop=tool_use 403ms
  [8/20] ok=true stop=tool_use 417ms
  [9/20] ok=true stop=tool_use 412ms
  [10/20] ok=true stop=tool_use 404ms
  [11/20] ok=true stop=tool_use 404ms
  [12/20] ok=true stop=tool_use 409ms
  [13/20] ok=true stop=tool_use 407ms
  [14/20] ok=true stop=tool_use 399ms
  [15/20] ok=true stop=tool_use 403ms
  [16/20] ok=true stop=tool_use 400ms
  [17/20] ok=true stop=tool_use 393ms
  [18/20] ok=true stop=tool_use 401ms
  [19/20] ok=true stop=tool_use 416ms
  [20/20] ok=true stop=tool_use 399ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 383ms · median 403ms · p95 479ms · mean 405ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8109.158818ms)
✔ tool-call roundtrip latency (tier=tier-16) (8109.603441ms)

=== multi-bug (tier-16) ===
  claw: exit=0 elapsed=842ms files=[".claw","text.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: capitalize

'hello' !== 'Hello'

    at file:///workspace/text.js:15:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage:
▶ multi-bug: fix three independent bugs (tier=tier-16)
  ✖ claw fixes all three helpers (889.849995ms)
✖ multi-bug: fix three independent bugs (tier=tier-16) (890.756617ms)

=== multi-file-rename (tier-16) ===
  claw: exit=1 elapsed=21119ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (70073 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ multi-file rename + signature change (tier=tier-16)
  ✖ claw renames across files and updates the call site (21132.78484ms)
✖ multi-file rename + signature change (tier=tier-16) (21133.380838ms)

=== null-default (tier-16) ===
  claw: exit=0 elapsed=4246ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-16)
  ✔ claw distinguishes missing from falsy (4268.819319ms)
✔ null-default: missing vs falsy (tier=tier-16) (4269.375901ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 2558ms textLen=1001 newlines=9 bullets=4
  [2/3] stop=end_turn 2488ms textLen=1053 newlines=9 bullets=4
  [3/3] stop=end_turn 2639ms textLen=1116 newlines=12 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable pieces of code that help in building user interfaces. They encapsulate HTML, CSS, and JavaScript to create self-contained units which can be easily reused throughout an application. Here’s why they are so useful:\n\n- **Modularity**: Components break down the U
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7686.148912ms)
✔ prose quality via raw bridge (tier=tier-16) (7686.897119ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 12461ms rawLen=2710 cleanLen=2180 newlines=20 bullets=10
  [2/3] exit=0 12711ms rawLen=2650 cleanLen=2138 newlines=19 bullets=9
  [3/3] exit=0 11931ms rawLen=5138 cleanLen=4403 newlines=28 bullets=10
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n╭─ write_file ─╮\n│ ✏️ Writing /workspace/react-components-explainer.md (19 lines)\n╰──────────────────╯\n✓ ✏️ Wrote /workspace/react-components-explainer.md (19 lines)\nThe file `/workspace/react-components-explainer.md` has been created with the following content:Introduction to React ComponentsReact
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (37103.656282ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (37103.986614ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=9829ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (9875.186729ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (9875.785394ms)

=== spec-compliance (tier-16) ===
  claw: exit=0 elapsed=12885ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-16)
  ✔ claw implements formatPrice satisfying all four requirements (12913.062653ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-16) (12913.678027ms)

=== state-machine (tier-16) ===
  claw: exit=0 elapsed=46170ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-16)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (46200.057194ms)
✔ state-machine: traffic light (tier=tier-16) (46200.659985ms)

=== subtle-bug (tier-16) ===
  claw: exit=1 elapsed=117209ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33114 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ subtle bug: default-sort lexicographic (tier=tier-16)
  ✖ claw fixes median.js so its assertions pass (117221.985647ms)
✖ subtle bug: default-sort lexicographic (tier=tier-16) (117223.245144ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 705ms
  [2/10] ok=true stop=tool_use tool_use=true 381ms
  [3/10] ok=true stop=tool_use tool_use=true 380ms
  [4/10] ok=true stop=tool_use tool_use=true 380ms
  [5/10] ok=true stop=tool_use tool_use=true 380ms
  [6/10] ok=true stop=tool_use tool_use=true 378ms
  [7/10] ok=true stop=tool_use tool_use=true 379ms
  [8/10] ok=true stop=tool_use tool_use=true 380ms
  [9/10] ok=true stop=tool_use tool_use=true 380ms
  [10/10] ok=true stop=tool_use tool_use=true 384ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 378ms · median 380ms · p95 705ms · mean 413ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4128.543121ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (4129.79841ms)

=== two-step-refactor (tier-16) ===
  claw: exit=0 elapsed=15464ms files=[".claw","stats.js"]
  node post-fix: exit=1 stderr=file:///workspace/stats.js:15
export function sum(arr) {
       ^

SyntaxError: Identifier 'sum' has already been declared
    at compileSourceTextModule (node:internal/modules/esm/utils:318:16)
    at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:90:18)
    at #translate (node:internal/modules/esm/loader:451:20)
    at afterLoad (node:internal/modules/esm/loader:507:29)
    a
▶ two-step refactor: extract helper and fix latent bug (tier=tier-16)
  ✖ claw extracts the helper without copying the off-by-one (15510.111609ms)
✖ two-step refactor: extract helper and fix latent bug (tier=tier-16) (15510.977191ms)
ℹ tests 22
ℹ suites 22
ℹ pass 15
ℹ fail 7
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 538412.251593

✖ failing tests:

test at __tests__/tier-eval/adversarial-input.test.js:51:3
✖ claw implements slugify robustly enough for adversarial inputs (107195.355908ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:5
  assert.equal(slugify('Hello World'),         'hello-world',   'basic two-word');
               ^
  
  TypeError: slugify is not a function
      at file:///workspace/verify.js:5:14
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/adversarial-input.test.js:68:12)
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

test at __tests__/tier-eval/comment-spec.test.js:75:3
✖ claw implements both functions per JSDoc (1485.167487ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: partition basic
  + actual - expected
  
  + undefined
  - [
  -   [
  -     2,
  -     4
  -   ],
  -   [
  -     1,
  -     3
  -   ]
  - ]
  
      at file:///workspace/verify.js:4:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: undefined,
    expected: [ [ 2, 4 ], [ 1, 3 ] ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/comment-spec.test.js:97:12)
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

test at __tests__/tier-eval/deep-equal.test.js:50:3
✖ claw implements deep equality including NaN (44853.7715ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  /workspace/verify.js:4
  console.log(eq(1, 1)); // true
              ^
  
  TypeError: eq is not a function
      at Object.<anonymous> (/workspace/verify.js:4:13)
      at Module._compile (node:internal/modules/cjs/loader:1830:14)
      at Object..js (node:internal/modules/cjs/loader:1961:10)
      at Module.load (node:internal/modules/cjs/loader:1553:32)
      at Module._load (node:internal/modules/cjs/loader:1355:12)
      at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
      at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
      at node:internal/main/run_main_module:33:47
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/deep-equal.test.js:67:12)
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

test at __tests__/tier-eval/multi-bug.test.js:63:3
✖ claw fixes all three helpers (889.849995ms)
  AssertionError [ERR_ASSERTION]: text.js still fails:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: capitalize
  
  'hello' !== 'Hello'
  
      at file:///workspace/text.js:15:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 'hello',
    expected: 'Hello',
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-bug.test.js:85:12)
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

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (21132.78484ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:79:12)
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

test at __tests__/tier-eval/subtle-bug.test.js:52:3
✖ claw fixes median.js so its assertions pass (117221.985647ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/subtle-bug.test.js:65:12)
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

test at __tests__/tier-eval/two-step-refactor.test.js:65:3
✖ claw extracts the helper without copying the off-by-one (15510.111609ms)
  AssertionError [ERR_ASSERTION]: stats.js still fails:
  file:///workspace/stats.js:15
  export function sum(arr) {
         ^
  
  SyntaxError: Identifier 'sum' has already been declared
      at compileSourceTextModule (node:internal/modules/esm/utils:318:16)
      at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:90:18)
      at #translate (node:internal/modules/esm/loader:451:20)
      at afterLoad (node:internal/modules/esm/loader:507:29)
      at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:512:12)
      at #getOrCreateModuleJobAfterResolve (node:internal/modules/esm/loader:555:36)
      at afterResolve (node:internal/modules/esm/loader:603:52)
      at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:609:12)
      at node:internal/modules/esm/loader:628:32
      at TracingChannel.tracePromise (node:diagnostic
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/two-step-refactor.test.js:87:12)
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

Exit code: 1

## Tier 32GB

```
 Container test-test-run-29952b9acfb9 Creating 
 Container test-test-run-29952b9acfb9 Created 

=== adversarial-input (tier-32) ===
  claw: exit=0 elapsed=114916ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-32)
  ✔ claw implements slugify robustly enough for adversarial inputs (114935.897404ms)
✔ adversarial inputs: slugify (tier=tier-32) (114936.391737ms)

=== agent-parallel (tier-32) ===
  exit=0 elapsed=13940ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (13941.393751ms)
✔ agent: parallel file writes (tier=tier-32) (13941.995249ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=10941ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (10942.580097ms)
✔ agent: single-file write (tier=tier-32) (10943.216346ms)

=== algorithm-intervals (tier-32) ===
  claw: exit=0 elapsed=58894ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-32)
  ✔ claw merges intervals across all edge cases (58917.820077ms)
✔ algorithm: merge intervals (tier=tier-32) (58918.281784ms)

=== api-evolution (tier-32) ===
  claw: exit=0 elapsed=142794ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-32)
  ✔ claw reorders the signature and updates the call site (142821.960525ms)
✔ api evolution: signature reorder across two files (tier=tier-32) (142822.358191ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=32442ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (32458.351614ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (32458.72703ms)

=== comment-spec (tier-32) ===
  claw: exit=0 elapsed=100762ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-32)
  ✔ claw implements both functions per JSDoc (100792.936488ms)
✔ comment-spec: implement from JSDoc (tier=tier-32) (100793.326903ms)
▶ deep-equal: structural equality (tier=tier-32)
  ✖ claw implements deep equality including NaN (240072.19253ms)
✖ deep-equal: structural equality (tier=tier-32) (240073.553442ms)

=== distractor (tier-32) ===
  claw: exit=0 elapsed=64083ms files=[".claw","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-32)
  ✔ claw fixes only the broken helper (64121.309066ms)
✔ distractor: one buggy helper among three (tier=tier-32) (64121.807481ms)
  [1/10] ttft=3438ms
  [2/10] ttft=157ms
  [3/10] ttft=158ms
  [4/10] ttft=159ms
  [5/10] ttft=160ms
  [6/10] ttft=159ms
  [7/10] ttft=161ms
  [8/10] ttft=161ms
  [9/10] ttft=187ms
  [10/10] ttft=89ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=89ms · median=160ms · p95=3438ms · mean=483ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (47004.887274ms)
✔ TTFT — time to first token (tier=tier-32) (47005.864854ms)
  [1/20] ok=true stop=tool_use 2494ms
  [2/20] ok=true stop=tool_use 2511ms
  [3/20] ok=true stop=tool_use 2544ms
  [4/20] ok=true stop=tool_use 2509ms
  [5/20] ok=true stop=tool_use 2253ms
  [6/20] ok=true stop=tool_use 2236ms
  [7/20] ok=true stop=tool_use 2559ms
  [8/20] ok=true stop=tool_use 2538ms
  [9/20] ok=true stop=tool_use 2241ms
  [10/20] ok=true stop=tool_use 2496ms
  [11/20] ok=true stop=tool_use 2234ms
  [12/20] ok=true stop=tool_use 2485ms
  [13/20] ok=true stop=tool_use 2228ms
  [14/20] ok=true stop=tool_use 2500ms
  [15/20] ok=true stop=tool_use 2243ms
  [16/20] ok=true stop=tool_use 2252ms
  [17/20] ok=true stop=tool_use 2542ms
  [18/20] ok=true stop=tool_use 2241ms
  [19/20] ok=true stop=tool_use 2484ms
  [20/20] ok=true stop=tool_use 2230ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2228ms · median 2485ms · p95 2559ms · mean 2391ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (47825.946055ms)
✔ tool-call roundtrip latency (tier=tier-32) (47826.339553ms)

=== multi-bug (tier-32) ===
  claw: exit=0 elapsed=61056ms files=[".claw","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-32)
  ✔ claw fixes all three helpers (61089.630172ms)
✔ multi-bug: fix three independent bugs (tier=tier-32) (61090.080587ms)

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=60188ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-32)
  ✔ claw renames across files and updates the call site (60221.119405ms)
✔ multi-file rename + signature change (tier=tier-32) (60221.527362ms)

=== null-default (tier-32) ===
  claw: exit=0 elapsed=51013ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-32)
  ✔ claw distinguishes missing from falsy (51034.73129ms)
✔ null-default: missing vs falsy (tier=tier-32) (51035.185414ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 15225ms textLen=3895 newlines=39 bullets=11
  [2/3] stop=end_turn 12510ms textLen=3337 newlines=27 bullets=4
  [3/3] stop=end_turn 4566ms textLen=1308 newlines=21 bullets=8
  sample[0] (first 320 chars, \n literal):
    markdown\nOkay, the user wants me to write a short markdown explainer about React components. Let me start by understanding the requirements. They specified two headers in ## style and at least four bullet points, aiming for around 250 words. No tool calls, just the markdown response.\n\nFirst, I need to structure the con
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (32303.198566ms)
✔ prose quality via raw bridge (tier=tier-32) (32304.601186ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 14983ms rawLen=2072 cleanLen=1818 newlines=10 bullets=6
  [2/3] exit=0 15563ms rawLen=1825 cleanLen=1583 newlines=7 bullets=3
  [3/3] exit=0 14203ms rawLen=2044 cleanLen=1760 newlines=10 bullets=6
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They encapsulate reusable UI elements and logic, allowing developers to create complex interfaces by combining simpler components. Each component manages its own state and 
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (44749.244557ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (44749.469556ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=32316ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (32344.934725ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (32345.38314ms)

=== spec-compliance (tier-32) ===
  claw: exit=0 elapsed=65464ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-32)
  ✔ claw implements formatPrice satisfying all four requirements (65493.603707ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-32) (65494.873703ms)

=== state-machine (tier-32) ===
  claw: exit=0 elapsed=69901ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-32)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (69920.521644ms)
✔ state-machine: traffic light (tier=tier-32) (69920.927477ms)

=== subtle-bug (tier-32) ===
  claw: exit=0 elapsed=87047ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-32)
  ✔ claw fixes median.js so its assertions pass (87081.027585ms)
✔ subtle bug: default-sort lexicographic (tier=tier-32) (87081.502459ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 2687ms
  [2/10] ok=true stop=tool_use tool_use=true 2436ms
  [3/10] ok=true stop=tool_use tool_use=true 2437ms
  [4/10] ok=true stop=tool_use tool_use=true 2436ms
  [5/10] ok=true stop=tool_use tool_use=true 2436ms
  [6/10] ok=true stop=tool_use tool_use=true 2453ms
  [7/10] ok=true stop=tool_use tool_use=true 2470ms
  [8/10] ok=true stop=tool_use tool_use=true 2478ms
  [9/10] ok=true stop=tool_use tool_use=true 2485ms
  [10/10] ok=true stop=tool_use tool_use=true 2476ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2436ms · median 2470ms · p95 2687ms · mean 2479ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (24795.520178ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (24796.27228ms)

=== two-step-refactor (tier-32) ===
  claw: exit=0 elapsed=85768ms files=[".claw","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-32)
  ✔ claw extracts the helper without copying the off-by-one (85801.852785ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-32) (85802.764623ms)
ℹ tests 22
ℹ suites 22
ℹ pass 21
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1489178.430819

✖ failing tests:

test at __tests__/tier-eval/deep-equal.test.js:50:3
✖ claw implements deep equality including NaN (240072.19253ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

```

Exit code: 1

## Tier 64GB

```
 Container test-test-run-2eda2449131f Creating 
 Container test-test-run-2eda2449131f Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=26373ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (26396.969701ms)
✔ adversarial inputs: slugify (tier=tier-64) (26397.473088ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=3499ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (3501.895838ms)
✔ agent: parallel file writes (tier=tier-64) (3502.675947ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1792ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1794.76981ms)
✔ agent: single-file write (tier=tier-64) (1795.530544ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=43303ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (43334.101083ms)
✔ algorithm: merge intervals (tier=tier-64) (43334.728854ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=16373ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (16416.810621ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (16417.348014ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=7026ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (7054.243891ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (7055.140004ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=44658ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (44702.193535ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (44702.641789ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=36977ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (37003.719847ms)
✔ deep-equal: structural equality (tier=tier-64) (37004.235103ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=23708ms files=[".claw",".clawd-todos.json",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (23741.379327ms)
✔ distractor: one buggy helper among three (tier=tier-64) (23741.791794ms)
  [1/10] ttft=2428ms
  [2/10] ttft=75ms
  [3/10] ttft=70ms
  [4/10] ttft=72ms
  [5/10] ttft=76ms
  [6/10] ttft=83ms
  [7/10] ttft=70ms
  [8/10] ttft=79ms
  [9/10] ttft=84ms
  [10/10] ttft=85ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=70ms · median=79ms · p95=2428ms · mean=312ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5530.892457ms)
✔ TTFT — time to first token (tier=tier-64) (5531.66518ms)
  [1/20] ok=true stop=tool_use 539ms
  [2/20] ok=true stop=tool_use 395ms
  [3/20] ok=true stop=tool_use 399ms
  [4/20] ok=true stop=tool_use 410ms
  [5/20] ok=true stop=tool_use 404ms
  [6/20] ok=true stop=tool_use 405ms
  [7/20] ok=true stop=tool_use 398ms
  [8/20] ok=true stop=tool_use 445ms
  [9/20] ok=true stop=tool_use 438ms
  [10/20] ok=true stop=tool_use 407ms
  [11/20] ok=true stop=tool_use 402ms
  [12/20] ok=true stop=tool_use 409ms
  [13/20] ok=true stop=tool_use 405ms
  [14/20] ok=true stop=tool_use 400ms
  [15/20] ok=true stop=tool_use 396ms
  [16/20] ok=true stop=tool_use 407ms
  [17/20] ok=true stop=tool_use 401ms
  [18/20] ok=true stop=tool_use 401ms
  [19/20] ok=true stop=tool_use 398ms
  [20/20] ok=true stop=tool_use 397ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 395ms · median 404ms · p95 539ms · mean 413ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8264.858659ms)
✔ tool-call roundtrip latency (tier=tier-64) (8265.196124ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=21115ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (21157.363804ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (21157.945523ms)
▶ multi-file rename + signature change (tier=tier-64)
  ✖ claw renames across files and updates the call site (240033.153686ms)
✖ multi-file rename + signature change (tier=tier-64) (240035.157479ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=32530ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (32556.726883ms)
✔ null-default: missing vs falsy (tier=tier-64) (32558.118214ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2664ms textLen=1340 newlines=12 bullets=4
  [2/3] stop=end_turn 2713ms textLen=1455 newlines=14 bullets=4
  [3/3] stop=end_turn 2733ms textLen=1523 newlines=14 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: The Building Blocks of Modern UI\n\nReact components are the fundamental units of any React application. They allow you to split your user interface into independent, reusable pieces that manage their own state and logic.\n\n## What Makes React Components Special\n\n• **Reusable and Composable**: Componen
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8111.681049ms)
✔ prose quality via raw bridge (tier=tier-64) (8112.45463ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 3928ms rawLen=1666 cleanLen=1460 newlines=2 bullets=0
  [2/3] exit=0 4172ms rawLen=1833 cleanLen=1591 newlines=2 bullets=0
  [3/3] exit=0 4011ms rawLen=1685 cleanLen=1533 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: A Beginner’s GuideReact components are the fundamental building blocks of any React application. They allow you to split the UI into independent, reusable pieces, making your code more maintainable and easier to debug.What Are React Components?Components in React are small, reusabl
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (12111.346965ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (12111.632339ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=20273ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (20311.92146ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (20312.499082ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=38433ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (38471.668379ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (38472.225502ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=26778ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (26804.311119ms)
✔ state-machine: traffic light (tier=tier-64) (26805.512279ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=27261ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (27299.275803ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (27299.847009ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 612ms
  [2/10] ok=true stop=tool_use tool_use=true 398ms
  [3/10] ok=true stop=tool_use tool_use=true 396ms
  [4/10] ok=true stop=tool_use tool_use=true 398ms
  [5/10] ok=true stop=tool_use tool_use=true 398ms
  [6/10] ok=true stop=tool_use tool_use=true 398ms
  [7/10] ok=true stop=tool_use tool_use=true 398ms
  [8/10] ok=true stop=tool_use tool_use=true 399ms
  [9/10] ok=true stop=tool_use tool_use=true 395ms
  [10/10] ok=true stop=tool_use tool_use=true 401ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 395ms · median 398ms · p95 612ms · mean 419ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4194.810978ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4196.79926ms)
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✖ claw extracts the helper without copying the off-by-one (240042.452083ms)
✖ two-step refactor: extract helper and fix latent bug (tier=tier-64) (240043.892497ms)
ℹ tests 22
ℹ suites 22
ℹ pass 20
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 889420.730222

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (240033.153686ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/two-step-refactor.test.js:65:3
✖ claw extracts the helper without copying the off-by-one (240042.452083ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 1 |
| 32GB | 1 |
| 64GB | 1 |

