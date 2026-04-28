# Tier Eval Results — 2026-04-28 01:19

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-e6d8a6ed42a5 Creating 
 Container test-test-run-e6d8a6ed42a5 Created 

=== adversarial-input (tier-16) ===
  claw: exit=1 elapsed=159947ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (32810 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ adversarial inputs: slugify (tier=tier-16)
  ✖ claw implements slugify robustly enough for adversarial inputs (159948.182786ms)
✖ adversarial inputs: slugify (tier=tier-16) (159949.107119ms)

=== agent-parallel (tier-16) ===
  exit=0 elapsed=2948ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (2950.393992ms)
✔ agent: parallel file writes (tier=tier-16) (2951.068741ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1260ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (1262.08832ms)
✔ agent: single-file write (tier=tier-16) (1263.213568ms)

=== algorithm-intervals (tier-16) ===
  claw: exit=0 elapsed=7753ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-16)
  ✔ claw merges intervals across all edge cases (7781.587554ms)
✔ algorithm: merge intervals (tier=tier-16) (7782.198637ms)

=== api-evolution (tier-16) ===
  claw: exit=0 elapsed=44630ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-16)
  ✔ claw reorders the signature and updates the call site (44672.663936ms)
✔ api evolution: signature reorder across two files (tier=tier-16) (44673.231394ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=5968ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (5992.239248ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (5992.817998ms)

=== comment-spec (tier-16) ===
  claw: exit=0 elapsed=19244ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-16)
  ✔ claw implements both functions per JSDoc (19285.837238ms)
✔ comment-spec: implement from JSDoc (tier=tier-16) (19286.393487ms)

=== deep-equal (tier-16) ===
  claw: exit=0 elapsed=103639ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=1 stderr=/workspace/verify.js:15
console.log(eq(1, 1)); // true
            ^

TypeError: eq is not a function
    at Object.<anonymous> (/workspace/verify.js:15:13)
    at Module._compile (node:internal/modules/cjs/loader:1830:14)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/loader:1553:32)
    at Module._load (node:internal/modules/cjs/loader:
▶ deep-equal: structural equality (tier=tier-16)
  ✖ claw implements deep equality including NaN (103657.662723ms)
✖ deep-equal: structural equality (tier=tier-16) (103658.357264ms)

=== distractor (tier-16) ===
  claw: exit=0 elapsed=20697ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","test.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-16)
  ✔ claw fixes only the broken helper (20734.995148ms)
✔ distractor: one buggy helper among three (tier=tier-16) (20735.590647ms)
  [1/10] ttft=1865ms
  [2/10] ttft=158ms
  [3/10] ttft=142ms
  [4/10] ttft=147ms
  [5/10] ttft=151ms
  [6/10] ttft=151ms
  [7/10] ttft=148ms
  [8/10] ttft=156ms
  [9/10] ttft=155ms
  [10/10] ttft=153ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=142ms · median=153ms · p95=1865ms · mean=323ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4984.144538ms)
✔ TTFT — time to first token (tier=tier-16) (4984.978954ms)
  [1/20] ok=true stop=tool_use 525ms
  [2/20] ok=true stop=tool_use 427ms
  [3/20] ok=true stop=tool_use 427ms
  [4/20] ok=true stop=tool_use 424ms
  [5/20] ok=true stop=tool_use 425ms
  [6/20] ok=true stop=tool_use 429ms
  [7/20] ok=true stop=tool_use 429ms
  [8/20] ok=true stop=tool_use 428ms
  [9/20] ok=true stop=tool_use 415ms
  [10/20] ok=true stop=tool_use 430ms
  [11/20] ok=true stop=tool_use 431ms
  [12/20] ok=true stop=tool_use 430ms
  [13/20] ok=true stop=tool_use 430ms
  [14/20] ok=true stop=tool_use 428ms
  [15/20] ok=true stop=tool_use 426ms
  [16/20] ok=true stop=tool_use 430ms
  [17/20] ok=true stop=tool_use 428ms
  [18/20] ok=true stop=tool_use 431ms
  [19/20] ok=true stop=tool_use 429ms
  [20/20] ok=true stop=tool_use 425ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 415ms · median 429ms · p95 525ms · mean 432ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8660.377623ms)
✔ tool-call roundtrip latency (tier=tier-16) (8660.75054ms)

=== multi-bug (tier-16) ===
  claw: exit=0 elapsed=19461ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-16)
  ✔ claw fixes all three helpers (19505.64872ms)
✔ multi-bug: fix three independent bugs (tier=tier-16) (19506.296095ms)

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=9049ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/index.js:3
import { transform } from './lib.js';
         ^^^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'transform'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPo
▶ multi-file rename + signature change (tier=tier-16)
  ✖ claw renames across files and updates the call site (9087.088267ms)
✖ multi-file rename + signature change (tier=tier-16) (9087.897516ms)

=== null-default (tier-16) ===
  claw: exit=0 elapsed=5091ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-16)
  ✔ claw distinguishes missing from falsy (5118.880897ms)
✔ null-default: missing vs falsy (tier=tier-16) (5119.419064ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 2634ms textLen=1024 newlines=9 bullets=4
  [2/3] stop=end_turn 3175ms textLen=1223 newlines=9 bullets=4
  [3/3] stop=end_turn 2328ms textLen=892 newlines=9 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable pieces of code that represent parts of a user interface. They are one of the core concepts in React and play a crucial role in building dynamic and interactive web applications. Here’s an overview of what you need to know about React components:\n\n- **Self-Con
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8139.031048ms)
✔ prose quality via raw bridge (tier=tier-16) (8139.830131ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 13643ms rawLen=2707 cleanLen=2162 newlines=22 bullets=10
  [2/3] exit=0 11973ms rawLen=2347 cleanLen=1880 newlines=21 bullets=9
  [3/3] exit=0 9216ms rawLen=4371 cleanLen=2935 newlines=23 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n╭─ write_file ─╮\n│ ✏️ Writing /workspace/react-components-explainer.md (20 lines)\n╰──────────────────╯\n✓ ✏️ Wrote /workspace/react-components-explainer.md (20 lines)\nThe file `/workspace/react-components-explainer.md` has been created with the following content:Introduction to React Components\n\nRea
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (34833.366677ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (34833.695594ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=8118ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (8161.02907ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (8161.591945ms)

=== spec-compliance (tier-16) ===
  claw: exit=0 elapsed=26266ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: basic USD
+ actual - expected

+ 'USD 1.00'
- '$1.00'

    at file:///workspace/verify.js:4:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5
▶ spec compliance: multi-requirement formatPrice (tier=tier-16)
  ✖ claw implements formatPrice satisfying all four requirements (26292.982211ms)
✖ spec compliance: multi-requirement formatPrice (tier=tier-16) (26293.778211ms)

=== state-machine (tier-16) ===
  claw: exit=0 elapsed=8377ms files=[".claw","light.js","verify.js"]
  node post-fix: exit=0 stderr=TrafficLight is not a constructor
▶ state-machine: traffic light (tier=tier-16)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (8407.855472ms)
✔ state-machine: traffic light (tier=tier-16) (8408.393305ms)

=== subtle-bug (tier-16) ===
  claw: exit=0 elapsed=23954ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-16)
  ✔ claw fixes median.js so its assertions pass (23994.525072ms)
✔ subtle bug: default-sort lexicographic (tier=tier-16) (23995.072612ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 576ms
  [2/10] ok=true stop=tool_use tool_use=true 430ms
  [3/10] ok=true stop=tool_use tool_use=true 409ms
  [4/10] ok=true stop=tool_use tool_use=true 432ms
  [5/10] ok=true stop=tool_use tool_use=true 430ms
  [6/10] ok=true stop=tool_use tool_use=true 431ms
  [7/10] ok=true stop=tool_use tool_use=true 432ms
  [8/10] ok=true stop=tool_use tool_use=true 434ms
  [9/10] ok=true stop=tool_use tool_use=true 430ms
  [10/10] ok=true stop=tool_use tool_use=true 432ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 409ms · median 432ms · p95 576ms · mean 444ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4438.02023ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (4440.147061ms)

=== two-step-refactor (tier-16) ===
  claw: exit=0 elapsed=15587ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=1 stderr=file:///workspace/stats.js:12
module.exports.sum = function sum(arr) {
^

ReferenceError: module is not defined in ES module scope
    at file:///workspace/stats.js:12:1
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0
▶ two-step refactor: extract helper and fix latent bug (tier=tier-16)
  ✖ claw extracts the helper without copying the off-by-one (15632.619232ms)
✖ two-step refactor: extract helper and fix latent bug (tier=tier-16) (15633.56069ms)
ℹ tests 22
ℹ suites 22
ℹ pass 17
ℹ fail 5
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 544111.086082

✖ failing tests:

test at __tests__/tier-eval/adversarial-input.test.js:51:3
✖ claw implements slugify robustly enough for adversarial inputs (159948.182786ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/adversarial-input.test.js:58:12)
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
✖ claw implements deep equality including NaN (103657.662723ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  /workspace/verify.js:15
  console.log(eq(1, 1)); // true
              ^
  
  TypeError: eq is not a function
      at Object.<anonymous> (/workspace/verify.js:15:13)
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

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (9087.088267ms)
  AssertionError [ERR_ASSERTION]: index.js still fails after claw's edits:
  file:///workspace/index.js:3
  import { transform } from './lib.js';
           ^^^^^^^^^
  SyntaxError: The requested module './lib.js' does not provide an export named 'transform'
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:88:12)
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

test at __tests__/tier-eval/spec-compliance.test.js:52:3
✖ claw implements formatPrice satisfying all four requirements (26292.982211ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: basic USD
  + actual - expected
  
  + 'USD 1.00'
  - '$1.00'
  
      at file:///workspace/verify.js:4:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 'USD 1.00',
    expected: '$1.00',
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/spec-compliance.test.js:71:12)
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
✖ claw extracts the helper without copying the off-by-one (15632.619232ms)
  AssertionError [ERR_ASSERTION]: stats.js still fails:
  file:///workspace/stats.js:12
  module.exports.sum = function sum(arr) {
  ^
  
  ReferenceError: module is not defined in ES module scope
      at file:///workspace/stats.js:12:1
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
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
 Container test-test-run-f977aaaddd75 Creating 
 Container test-test-run-f977aaaddd75 Created 
▶ adversarial inputs: slugify (tier=tier-32)
  ✖ claw implements slugify robustly enough for adversarial inputs (240059.383132ms)
✖ adversarial inputs: slugify (tier=tier-32) (240060.805923ms)

=== agent-parallel (tier-32) ===
  exit=0 elapsed=25130ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (25131.769062ms)
✔ agent: parallel file writes (tier=tier-32) (25132.39727ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=9610ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (9611.374792ms)
✔ agent: single-file write (tier=tier-32) (9612.017083ms)

=== algorithm-intervals (tier-32) ===
  claw: exit=0 elapsed=53673ms files=[".claw","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-32)
  ✔ claw merges intervals across all edge cases (53694.2913ms)
✔ algorithm: merge intervals (tier=tier-32) (53694.687488ms)

=== api-evolution (tier-32) ===
  claw: exit=0 elapsed=172890ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-32)
  ✔ claw reorders the signature and updates the call site (172923.978883ms)
✔ api evolution: signature reorder across two files (tier=tier-32) (172924.368112ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=34131ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (34152.016583ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (34152.44234ms)

=== comment-spec (tier-32) ===
  claw: exit=0 elapsed=85606ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-32)
  ✔ claw implements both functions per JSDoc (85634.145923ms)
✔ comment-spec: implement from JSDoc (tier=tier-32) (85634.509717ms)
▶ deep-equal: structural equality (tier=tier-32)
  ✖ claw implements deep equality including NaN (240017.627278ms)
✖ deep-equal: structural equality (tier=tier-32) (240020.15759ms)

=== distractor (tier-32) ===
  claw: exit=0 elapsed=78561ms files=[".claw","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-32)
  ✔ claw fixes only the broken helper (78596.975788ms)
✔ distractor: one buggy helper among three (tier=tier-32) (78597.435ms)
  [1/10] ttft=3509ms
  [2/10] ttft=96ms
  [3/10] ttft=96ms
  [4/10] ttft=95ms
  [5/10] ttft=94ms
  [6/10] ttft=94ms
  [7/10] ttft=95ms
  [8/10] ttft=95ms
  [9/10] ttft=96ms
  [10/10] ttft=96ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=94ms · median=96ms · p95=3509ms · mean=437ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (33139.129157ms)
✔ TTFT — time to first token (tier=tier-32) (33139.811371ms)
  [1/20] ok=true stop=tool_use 2936ms
  [2/20] ok=true stop=tool_use 2749ms
  [3/20] ok=true stop=tool_use 2749ms
  [4/20] ok=true stop=tool_use 2745ms
  [5/20] ok=true stop=tool_use 2737ms
  [6/20] ok=true stop=tool_use 2811ms
  [7/20] ok=true stop=tool_use 2461ms
  [8/20] ok=true stop=tool_use 2792ms
  [9/20] ok=true stop=tool_use 2782ms
  [10/20] ok=true stop=tool_use 2704ms
  [11/20] ok=true stop=tool_use 2445ms
  [12/20] ok=true stop=tool_use 2432ms
  [13/20] ok=true stop=tool_use 2447ms
  [14/20] ok=true stop=tool_use 2415ms
  [15/20] ok=true stop=tool_use 2696ms
  [16/20] ok=true stop=tool_use 2409ms
  [17/20] ok=true stop=tool_use 2650ms
  [18/20] ok=true stop=tool_use 2649ms
  [19/20] ok=true stop=tool_use 2377ms
  [20/20] ok=true stop=tool_use 2670ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2377ms · median 2696ms · p95 2936ms · mean 2633ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (52658.297048ms)
✔ tool-call roundtrip latency (tier=tier-32) (52658.595426ms)

=== multi-bug (tier-32) ===
  claw: exit=0 elapsed=65876ms files=[".claw","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-32)
  ✔ claw fixes all three helpers (65908.938536ms)
✔ multi-bug: fix three independent bugs (tier=tier-32) (65909.775418ms)

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=122539ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-32)
  ✔ claw renames across files and updates the call site (122571.558351ms)
✔ multi-file rename + signature change (tier=tier-32) (122571.962396ms)

=== null-default (tier-32) ===
  claw: exit=0 elapsed=97384ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-32)
  ✔ claw distinguishes missing from falsy (97405.263626ms)
✔ null-default: missing vs falsy (tier=tier-32) (97405.873048ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 5362ms textLen=1343 newlines=21 bullets=8
  [2/3] stop=end_turn 4920ms textLen=1295 newlines=14 bullets=4
  [3/3] stop=max_tokens 21987ms textLen=5200 newlines=44 bullets=14
  sample[0] (first 320 chars, \n literal):
    -text\n</think>\n\n## What Are React Components?\n\nReact components are the building blocks of React applications. They allow developers to split complex UIs into smaller, reusable pieces. Each component manages its own logic and rendering, making it easier to maintain and scale applications.\n\n- Components can be written a
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (32270.211546ms)
✔ prose quality via raw bridge (tier=tier-32) (32270.852218ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 20485ms rawLen=1854 cleanLen=1630 newlines=10 bullets=6
  [2/3] exit=0 21096ms rawLen=2236 cleanLen=1871 newlines=12 bullets=7
  [3/3] exit=0 15632ms rawLen=2107 cleanLen=1778 newlines=10 bullets=6
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They allow developers to break down complex UIs into smaller, reusable pieces. Each component manages its own logic and rendering, making code more modular and easier to ma
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (57213.420734ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (57213.674736ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=39763ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (39792.636699ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (39793.08387ms)

=== spec-compliance (tier-32) ===
  claw: exit=0 elapsed=162085ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-32)
  ✔ claw implements formatPrice satisfying all four requirements (162106.758874ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-32) (162107.174253ms)

=== state-machine (tier-32) ===
  claw: exit=0 elapsed=34880ms files=[".claw","light.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { TrafficLight } from './light.js';
         ^^^^^^^^^^^^
SyntaxError: Named export 'TrafficLight' not found. The requested module './light.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './light.js';
const { TrafficLight } =
▶ state-machine: traffic light (tier=tier-32)
  ✖ claw implements the FSM with valid transitions and rejection of invalid ones (34902.326375ms)
✖ state-machine: traffic light (tier=tier-32) (34902.938547ms)

=== subtle-bug (tier-32) ===
  claw: exit=0 elapsed=83847ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-32)
  ✔ claw fixes median.js so its assertions pass (83878.368184ms)
✔ subtle bug: default-sort lexicographic (tier=tier-32) (83878.765604ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 2962ms
  [2/10] ok=true stop=tool_use tool_use=true 2744ms
  [3/10] ok=true stop=tool_use tool_use=true 2738ms
  [4/10] ok=true stop=tool_use tool_use=true 2732ms
  [5/10] ok=true stop=tool_use tool_use=true 2707ms
  [6/10] ok=true stop=tool_use tool_use=true 2700ms
  [7/10] ok=true stop=tool_use tool_use=true 2700ms
  [8/10] ok=true stop=tool_use tool_use=true 2713ms
  [9/10] ok=true stop=tool_use tool_use=true 2710ms
  [10/10] ok=true stop=tool_use tool_use=true 2677ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2677ms · median 2713ms · p95 2962ms · mean 2738ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (27384.348452ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (27385.052042ms)

=== two-step-refactor (tier-32) ===
  claw: exit=0 elapsed=111911ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-32)
  ✔ claw extracts the helper without copying the off-by-one (111940.291753ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-32) (111941.445804ms)
ℹ tests 22
ℹ suites 22
ℹ pass 19
ℹ fail 3
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1861518.097255

✖ failing tests:

test at __tests__/tier-eval/adversarial-input.test.js:51:3
✖ claw implements slugify robustly enough for adversarial inputs (240059.383132ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/deep-equal.test.js:50:3
✖ claw implements deep equality including NaN (240017.627278ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/state-machine.test.js:66:3
✖ claw implements the FSM with valid transitions and rejection of invalid ones (34902.326375ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { TrafficLight } from './light.js';
           ^^^^^^^^^^^^
  SyntaxError: Named export 'TrafficLight' not found. The requested module './light.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './light.js';
  const { TrafficLight } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/state-machine.test.js:83:12)
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

## Tier 64GB

```
 Container test-test-run-f63b6c8496a8 Creating 
 Container test-test-run-f63b6c8496a8 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=40611ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (40636.005514ms)
✔ adversarial inputs: slugify (tier=tier-64) (40636.493393ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=3370ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (3371.976374ms)
✔ agent: parallel file writes (tier=tier-64) (3372.623672ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=938ms files=[".claw"]
▶ agent: single-file write (tier=tier-64)
  ✖ claw creates hello.py with the requested content (941.14919ms)
✖ agent: single-file write (tier=tier-64) (942.951123ms)
▶ algorithm: merge intervals (tier=tier-64)
  ✖ claw merges intervals across all edge cases (240013.652382ms)
✖ algorithm: merge intervals (tier=tier-64) (240016.960995ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=30113ms files=[".claw",".clawd-todos.json",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (30159.243492ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (30159.82483ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=7366ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (7393.924212ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (7394.536676ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=48064ms files=[".claw",".clawd-todos.json",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (48104.554066ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (48105.087111ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=31625ms files=[".claw",".clawd-todos.json",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (31651.825066ms)
✔ deep-equal: structural equality (tier=tier-64) (31652.398779ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=24635ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (24675.247606ms)
✔ distractor: one buggy helper among three (tier=tier-64) (24675.759985ms)
  [1/10] ttft=2483ms
  [2/10] ttft=75ms
  [3/10] ttft=79ms
  [4/10] ttft=81ms
  [5/10] ttft=80ms
  [6/10] ttft=83ms
  [7/10] ttft=86ms
  [8/10] ttft=77ms
  [9/10] ttft=88ms
  [10/10] ttft=78ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=75ms · median=81ms · p95=2483ms · mean=321ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5553.389223ms)
✔ TTFT — time to first token (tier=tier-64) (5554.101438ms)
  [1/20] ok=true stop=tool_use 530ms
  [2/20] ok=true stop=tool_use 396ms
  [3/20] ok=true stop=tool_use 396ms
  [4/20] ok=true stop=tool_use 396ms
  [5/20] ok=true stop=tool_use 396ms
  [6/20] ok=true stop=tool_use 397ms
  [7/20] ok=true stop=tool_use 395ms
  [8/20] ok=true stop=tool_use 396ms
  [9/20] ok=true stop=tool_use 397ms
  [10/20] ok=true stop=tool_use 397ms
  [11/20] ok=true stop=tool_use 395ms
  [12/20] ok=true stop=tool_use 397ms
  [13/20] ok=true stop=tool_use 395ms
  [14/20] ok=true stop=tool_use 392ms
  [15/20] ok=true stop=tool_use 397ms
  [16/20] ok=true stop=tool_use 394ms
  [17/20] ok=true stop=tool_use 396ms
  [18/20] ok=true stop=tool_use 396ms
  [19/20] ok=true stop=tool_use 397ms
  [20/20] ok=true stop=tool_use 396ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 392ms · median 396ms · p95 530ms · mean 403ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8052.044595ms)
✔ tool-call roundtrip latency (tier=tier-64) (8052.355598ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=16215ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (16258.415799ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (16259.009013ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=26879ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (26920.573783ms)
✔ multi-file rename + signature change (tier=tier-64) (26921.084913ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=16138ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (16166.938327ms)
✔ null-default: missing vs falsy (tier=tier-64) (16167.482582ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2993ms textLen=1523 newlines=14 bullets=4
  [2/3] stop=end_turn 2699ms textLen=1464 newlines=14 bullets=4
  [3/3] stop=end_turn 2377ms textLen=1218 newlines=12 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: The Building Blocks of Modern UI\n\nReact components are the fundamental units that make up React applications. Think of them as reusable pieces that define what should appear on the screen and how it should behave.\n\n## What Makes React Components Special\n\n• **Reusable and Composable**: Components can
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8070.902636ms)
✔ prose quality via raw bridge (tier=tier-64) (8071.675393ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 3563ms rawLen=1611 cleanLen=1459 newlines=2 bullets=0
  [2/3] exit=0 3884ms rawLen=1702 cleanLen=1550 newlines=2 bullets=0
  [3/3] exit=0 3989ms rawLen=1859 cleanLen=1653 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: Building Blocks of Modern UIReact components are the fundamental building blocks of React applications. They allow developers to create reusable, self-contained pieces of code that manage their own state and render HTML elements.What Are React Components?React components are JavaSc
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11436.834209ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (11437.161088ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=16799ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (16835.326958ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (16835.832129ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=30238ms files=[".claw",".clawd-todos.json",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (30284.866876ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (30285.321755ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=28133ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (28157.015818ms)
✔ state-machine: traffic light (tier=tier-64) (28157.57899ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=34262ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (34301.310008ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (34301.804137ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 624ms
  [2/10] ok=true stop=tool_use tool_use=true 399ms
  [3/10] ok=true stop=tool_use tool_use=true 395ms
  [4/10] ok=true stop=tool_use tool_use=true 396ms
  [5/10] ok=true stop=tool_use tool_use=true 395ms
  [6/10] ok=true stop=tool_use tool_use=true 397ms
  [7/10] ok=true stop=tool_use tool_use=true 396ms
  [8/10] ok=true stop=tool_use tool_use=true 397ms
  [9/10] ok=true stop=tool_use tool_use=true 397ms
  [10/10] ok=true stop=tool_use tool_use=true 395ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 395ms · median 397ms · p95 624ms · mean 419ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4192.471825ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4193.503584ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=1115ms files=[".claw","stats.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: sum mismatch

NaN !== 6

    at file:///workspace/stats.js:19:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✖ claw extracts the helper without copying the off-by-one (1162.630682ms)
✖ two-step refactor: extract helper and fix latent bug (tier=tier-64) (1163.600774ms)
ℹ tests 22
ℹ suites 22
ℹ pass 19
ℹ fail 3
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 634926.127175

✖ failing tests:

test at __tests__/tier-eval/agent-single.test.js:26:3
✖ claw creates hello.py with the requested content (941.14919ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  false !== true
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/agent-single.test.js:34:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at __tests__/tier-eval/algorithm-intervals.test.js:50:3
✖ claw merges intervals across all edge cases (240013.652382ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/two-step-refactor.test.js:65:3
✖ claw extracts the helper without copying the off-by-one (1162.630682ms)
  AssertionError [ERR_ASSERTION]: stats.js still fails:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: sum mismatch
  
  NaN !== 6
  
      at file:///workspace/stats.js:19:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: NaN,
    expected: 6,
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
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

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 1 |
| 32GB | 1 |
| 64GB | 1 |

