# Tier Eval Results — 2026-04-28 02:11

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-eb9fe9513c8f Creating 
 Container test-test-run-eb9fe9513c8f Created 

=== adversarial-input (tier-16) ===
  claw: exit=0 elapsed=189871ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:8
c
^

ReferenceError: c is not defined
    at file:///workspace/verify.js:8:1
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0
▶ adversarial inputs: slugify (tier=tier-16)
  ✖ claw implements slugify robustly enough for adversarial inputs (189899.650564ms)
✖ adversarial inputs: slugify (tier=tier-16) (189900.474806ms)

=== agent-parallel (tier-16) ===
  exit=0 elapsed=3243ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (3245.081006ms)
✔ agent: parallel file writes (tier=tier-16) (3245.819425ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1273ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (1275.949979ms)
✔ agent: single-file write (tier=tier-16) (1276.660434ms)

=== algorithm-intervals (tier-16) ===
  claw: exit=0 elapsed=12329ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-16)
  ✔ claw merges intervals across all edge cases (12357.116777ms)
✔ algorithm: merge intervals (tier=tier-16) (12357.757679ms)
▶ api evolution: signature reorder across two files (tier=tier-16)
  ✖ claw reorders the signature and updates the call site (240027.577061ms)
✖ api evolution: signature reorder across two files (tier=tier-16) (240029.842425ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=14839ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (14859.906707ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (14860.480868ms)

=== comment-spec (tier-16) ===
  claw: exit=1 elapsed=9279ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

▶ comment-spec: implement from JSDoc (tier=tier-16)
  ✖ claw implements both functions per JSDoc (9295.071075ms)
✖ comment-spec: implement from JSDoc (tier=tier-16) (9296.106804ms)

=== deep-equal (tier-16) ===
  claw: exit=0 elapsed=16832ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: NaN must equal NaN

false !== true

    at file:///workspace/verify.js:12:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMes
▶ deep-equal: structural equality (tier=tier-16)
  ✖ claw implements deep equality including NaN (16853.475431ms)
✖ deep-equal: structural equality (tier=tier-16) (16854.139053ms)

=== distractor (tier-16) ===
  claw: exit=0 elapsed=18822ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-16)
  ✔ claw fixes only the broken helper (18861.524059ms)
✔ distractor: one buggy helper among three (tier=tier-16) (18862.079968ms)
  [1/10] ttft=1905ms
  [2/10] ttft=155ms
  [3/10] ttft=145ms
  [4/10] ttft=147ms
  [5/10] ttft=148ms
  [6/10] ttft=150ms
  [7/10] ttft=154ms
  [8/10] ttft=150ms
  [9/10] ttft=153ms
  [10/10] ttft=155ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=145ms · median=153ms · p95=1905ms · mean=326ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4991.135342ms)
✔ TTFT — time to first token (tier=tier-16) (4991.984184ms)
  [1/20] ok=true stop=tool_use 511ms
  [2/20] ok=true stop=tool_use 417ms
  [3/20] ok=true stop=tool_use 421ms
  [4/20] ok=true stop=tool_use 414ms
  [5/20] ok=true stop=tool_use 419ms
  [6/20] ok=true stop=tool_use 422ms
  [7/20] ok=true stop=tool_use 426ms
  [8/20] ok=true stop=tool_use 428ms
  [9/20] ok=true stop=tool_use 420ms
  [10/20] ok=true stop=tool_use 425ms
  [11/20] ok=true stop=tool_use 424ms
  [12/20] ok=true stop=tool_use 425ms
  [13/20] ok=true stop=tool_use 421ms
  [14/20] ok=true stop=tool_use 413ms
  [15/20] ok=true stop=tool_use 413ms
  [16/20] ok=true stop=tool_use 414ms
  [17/20] ok=true stop=tool_use 421ms
  [18/20] ok=true stop=tool_use 425ms
  [19/20] ok=true stop=tool_use 420ms
  [20/20] ok=true stop=tool_use 418ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 413ms · median 421ms · p95 511ms · mean 425ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8497.062434ms)
✔ tool-call roundtrip latency (tier=tier-16) (8497.434874ms)

=== multi-bug (tier-16) ===
  claw: exit=0 elapsed=52818ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: reverseWords basic
+ actual - expected

+ 'eno owt'
- 'two one'

    at file:///workspace/text.js:20:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_m
▶ multi-bug: fix three independent bugs (tier=tier-16)
  ✖ claw fixes all three helpers (52861.477123ms)
✖ multi-bug: fix three independent bugs (tier=tier-16) (52862.351407ms)

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=29713ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/index.js:3
import { transform } from './lib.js';
         ^^^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'transform'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPo
▶ multi-file rename + signature change (tier=tier-16)
  ✖ claw renames across files and updates the call site (29753.4902ms)
✖ multi-file rename + signature change (tier=tier-16) (29754.208679ms)

=== null-default (tier-16) ===
  claw: exit=0 elapsed=3240ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-16)
  ✔ claw distinguishes missing from falsy (3267.576383ms)
✔ null-default: missing vs falsy (tier=tier-16) (3268.129399ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 2637ms textLen=1040 newlines=13 bullets=5
  [2/3] stop=end_turn 2819ms textLen=1152 newlines=9 bullets=4
  [3/3] stop=end_turn 1855ms textLen=764 newlines=9 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable pieces of code that represent parts of a user interface. They help in breaking down complex UIs into smaller, manageable, and maintainable pieces. Here’s why using components is beneficial:\n\n- **Reusability**: Components can be used multiple times within an a
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7313.358807ms)
✔ prose quality via raw bridge (tier=tier-16) (7316.160344ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 10833ms rawLen=4506 cleanLen=3616 newlines=29 bullets=6
  [2/3] exit=0 11384ms rawLen=4778 cleanLen=3632 newlines=31 bullets=7
  [3/3] exit=0 16555ms rawLen=4002 cleanLen=2385 newlines=55 bullets=4
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n╭─ StructuredOutput ─╮\n│ {"content":"# Introduction to React Components\n\nReact components are reusable pieces of code t…\n╰────────────────────────╯\n✓ StructuredOutput\n{\n“data”: “Structured output provided successfully”,\n“structured_output”: {\n“content”: “# Introduction to React Components\n\nReac
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (38772.336735ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (38772.576116ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=9249ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (9286.478863ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (9286.943787ms)

=== spec-compliance (tier-16) ===
  claw: exit=0 elapsed=14025ms files=[".claw","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-16)
  ✔ claw implements formatPrice satisfying all four requirements (14051.666573ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-16) (14052.231205ms)

=== state-machine (tier-16) ===
  claw: exit=0 elapsed=74341ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
const TrafficLight = require('./light.js').default;
                     ^

ReferenceError: require is not defined in ES module scope, you can use import instead
    at file:///workspace/verify.js:2:22
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (no
▶ state-machine: traffic light (tier=tier-16)
  ✖ claw implements the FSM with valid transitions and rejection of invalid ones (74363.576734ms)
✖ state-machine: traffic light (tier=tier-16) (74364.515996ms)

=== subtle-bug (tier-16) ===
  claw: exit=0 elapsed=48427ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: median of [1,100,2,50,3] should be 3

2 !== 3

    at file:///workspace/median.js:11:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  g
▶ subtle bug: default-sort lexicographic (tier=tier-16)
  ✖ claw fixes median.js so its assertions pass (48456.735876ms)
✖ subtle bug: default-sort lexicographic (tier=tier-16) (48457.431049ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 577ms
  [2/10] ok=true stop=tool_use tool_use=true 389ms
  [3/10] ok=true stop=tool_use tool_use=true 411ms
  [4/10] ok=true stop=tool_use tool_use=true 401ms
  [5/10] ok=true stop=tool_use tool_use=true 405ms
  [6/10] ok=true stop=tool_use tool_use=true 410ms
  [7/10] ok=true stop=tool_use tool_use=true 407ms
  [8/10] ok=true stop=tool_use tool_use=true 402ms
  [9/10] ok=true stop=tool_use tool_use=true 403ms
  [10/10] ok=true stop=tool_use tool_use=true 409ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 389ms · median 407ms · p95 577ms · mean 421ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4215.757881ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (4218.140027ms)

=== two-step-refactor (tier-16) ===
  claw: exit=0 elapsed=11996ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-16)
  ✔ claw extracts the helper without copying the off-by-one (12029.443025ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-16) (12029.887487ms)
ℹ tests 22
ℹ suites 22
ℹ pass 14
ℹ fail 8
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 815115.216835

✖ failing tests:

test at __tests__/tier-eval/adversarial-input.test.js:51:3
✖ claw implements slugify robustly enough for adversarial inputs (189899.650564ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:8
  c
  ^
  
  ReferenceError: c is not defined
      at file:///workspace/verify.js:8:1
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

test at __tests__/tier-eval/api-evolution.test.js:57:3
✖ claw reorders the signature and updates the call site (240027.577061ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/comment-spec.test.js:75:3
✖ claw implements both functions per JSDoc (9295.071075ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/comment-spec.test.js:88:12)
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
✖ claw implements deep equality including NaN (16853.475431ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: NaN must equal NaN
  
  false !== true
  
      at file:///workspace/verify.js:12:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: 'strictEqual',
    diff: 'simple'
  }
  
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
✖ claw fixes all three helpers (52861.477123ms)
  AssertionError [ERR_ASSERTION]: text.js still fails:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: reverseWords basic
  + actual - expected
  
  + 'eno owt'
  - 'two one'
  
      at file:///workspace/text.js:20:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 'eno owt',
    expected: 'two one',
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
✖ claw renames across files and updates the call site (29753.4902ms)
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

test at __tests__/tier-eval/state-machine.test.js:66:3
✖ claw implements the FSM with valid transitions and rejection of invalid ones (74363.576734ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  const TrafficLight = require('./light.js').default;
                       ^
  
  ReferenceError: require is not defined in ES module scope, you can use import instead
      at file:///workspace/verify.js:2:22
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
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

test at __tests__/tier-eval/subtle-bug.test.js:52:3
✖ claw fixes median.js so its assertions pass (48456.735876ms)
  AssertionError [ERR_ASSERTION]: median.js still fails after claw's fix:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: median of [1,100,2,50,3] should be 3
  
  2 !== 3
  
      at file:///workspace/median.js:11:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 2,
    expected: 3,
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/subtle-bug.test.js:74:12)
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
 Container test-test-run-839a3ec0b247 Creating 
 Container test-test-run-839a3ec0b247 Created 

=== adversarial-input (tier-32) ===
  claw: exit=0 elapsed=120730ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-32)
  ✔ claw implements slugify robustly enough for adversarial inputs (120744.645193ms)
✔ adversarial inputs: slugify (tier=tier-32) (120745.038781ms)

=== agent-parallel (tier-32) ===
  exit=0 elapsed=19160ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (19162.139405ms)
✔ agent: parallel file writes (tier=tier-32) (19162.665038ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=8534ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (8536.200063ms)
✔ agent: single-file write (tier=tier-32) (8536.841198ms)

=== algorithm-intervals (tier-32) ===
  claw: exit=0 elapsed=48058ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-32)
  ✔ claw merges intervals across all edge cases (48081.10946ms)
✔ algorithm: merge intervals (tier=tier-32) (48081.581217ms)

=== api-evolution (tier-32) ===
  claw: exit=0 elapsed=106302ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-32)
  ✔ claw reorders the signature and updates the call site (106330.705075ms)
✔ api evolution: signature reorder across two files (tier=tier-32) (106331.05883ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=26151ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (26173.451496ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (26173.879669ms)

=== comment-spec (tier-32) ===
  claw: exit=0 elapsed=52262ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-32)
  ✔ claw implements both functions per JSDoc (52294.95668ms)
✔ comment-spec: implement from JSDoc (tier=tier-32) (52295.363102ms)

=== deep-equal (tier-32) ===
  claw: exit=0 elapsed=227841ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-32)
  ✔ claw implements deep equality including NaN (227857.174025ms)
✔ deep-equal: structural equality (tier=tier-32) (227857.589574ms)

=== distractor (tier-32) ===
  claw: exit=0 elapsed=50361ms files=[".claw","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-32)
  ✔ claw fixes only the broken helper (50389.98903ms)
✔ distractor: one buggy helper among three (tier=tier-32) (50390.377161ms)
  [1/10] ttft=3350ms
  [2/10] ttft=102ms
  [3/10] ttft=95ms
  [4/10] ttft=93ms
  [5/10] ttft=94ms
  [6/10] ttft=91ms
  [7/10] ttft=89ms
  [8/10] ttft=92ms
  [9/10] ttft=91ms
  [10/10] ttft=93ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=89ms · median=93ms · p95=3350ms · mean=419ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (32793.794675ms)
✔ TTFT — time to first token (tier=tier-32) (32794.534978ms)
  [1/20] ok=true stop=tool_use 2872ms
  [2/20] ok=true stop=tool_use 2694ms
  [3/20] ok=true stop=tool_use 2432ms
  [4/20] ok=true stop=tool_use 2332ms
  [5/20] ok=true stop=tool_use 2388ms
  [6/20] ok=true stop=tool_use 2646ms
  [7/20] ok=true stop=tool_use 2667ms
  [8/20] ok=true stop=tool_use 2659ms
  [9/20] ok=true stop=tool_use 2397ms
  [10/20] ok=true stop=tool_use 2685ms
  [11/20] ok=true stop=tool_use 2414ms
  [12/20] ok=true stop=tool_use 2397ms
  [13/20] ok=true stop=tool_use 2691ms
  [14/20] ok=true stop=tool_use 2402ms
  [15/20] ok=true stop=tool_use 2658ms
  [16/20] ok=true stop=tool_use 2425ms
  [17/20] ok=true stop=tool_use 2438ms
  [18/20] ok=true stop=tool_use 2428ms
  [19/20] ok=true stop=tool_use 2434ms
  [20/20] ok=true stop=tool_use 2443ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2332ms · median 2438ms · p95 2872ms · mean 2525ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (50504.877583ms)
✔ tool-call roundtrip latency (tier=tier-32) (50505.158129ms)

=== multi-bug (tier-32) ===
  claw: exit=0 elapsed=71703ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-32)
  ✔ claw fixes all three helpers (71742.341686ms)
✔ multi-bug: fix three independent bugs (tier=tier-32) (71743.554872ms)

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=73865ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-32)
  ✔ claw renames across files and updates the call site (73894.729974ms)
✔ multi-file rename + signature change (tier=tier-32) (73895.121589ms)

=== null-default (tier-32) ===
  claw: exit=0 elapsed=79449ms files=[".claw","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-32)
  ✔ claw distinguishes missing from falsy (79469.261762ms)
✔ null-default: missing vs falsy (tier=tier-32) (79470.139531ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 18683ms textLen=4244 newlines=38 bullets=12
  [2/3] stop=end_turn 13443ms textLen=3232 newlines=27 bullets=8
  [3/3] stop=end_turn 13190ms textLen=3117 newlines=30 bullets=8
  sample[0] (first 320 chars, \n literal):
    .mvp\n\nOkay, the user wants a short markdown explainer about React components. Let me start by understanding the requirements. They specified two headers in ## style, at least four bullet points, around 250 words, and no tool calls. Alright.\n\nFirst, I need to structure the markdown. The main headers would be "What Are R
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (45318.150878ms)
✔ prose quality via raw bridge (tier=tier-32) (45318.814394ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 17986ms rawLen=2002 cleanLen=1673 newlines=10 bullets=6
  [2/3] exit=0 13866ms rawLen=1742 cleanLen=1530 newlines=7 bullets=3
  [3/3] exit=0 17878ms rawLen=1843 cleanLen=1646 newlines=7 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They encapsulate reusable UI elements and logic, allowing developers to break down complex interfaces into manageable pieces. Components can be as simple as a button or as 
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (49731.195968ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (49731.399858ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=33593ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (33626.52144ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (33627.117028ms)

=== spec-compliance (tier-32) ===
  claw: exit=0 elapsed=100953ms files=[".claw","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-32)
  ✔ claw implements formatPrice satisfying all four requirements (100982.283765ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-32) (100982.672022ms)

=== state-machine (tier-32) ===
  claw: exit=0 elapsed=23850ms files=[".claw","light.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { TrafficLight } from './light.js';
         ^^^^^^^^^^^^
SyntaxError: Named export 'TrafficLight' not found. The requested module './light.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './light.js';
const { TrafficLight } =
▶ state-machine: traffic light (tier=tier-32)
  ✖ claw implements the FSM with valid transitions and rejection of invalid ones (23872.425758ms)
✖ state-machine: traffic light (tier=tier-32) (23873.009305ms)

=== subtle-bug (tier-32) ===
  claw: exit=0 elapsed=76552ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-32)
  ✔ claw fixes median.js so its assertions pass (76583.763966ms)
✔ subtle bug: default-sort lexicographic (tier=tier-32) (76584.163663ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 2845ms
  [2/10] ok=true stop=tool_use tool_use=true 2655ms
  [3/10] ok=true stop=tool_use tool_use=true 2648ms
  [4/10] ok=true stop=tool_use tool_use=true 2629ms
  [5/10] ok=true stop=tool_use tool_use=true 2653ms
  [6/10] ok=true stop=tool_use tool_use=true 2645ms
  [7/10] ok=true stop=tool_use tool_use=true 2648ms
  [8/10] ok=true stop=tool_use tool_use=true 2649ms
  [9/10] ok=true stop=tool_use tool_use=true 2638ms
  [10/10] ok=true stop=tool_use tool_use=true 2616ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2616ms · median 2648ms · p95 2845ms · mean 2663ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (26626.914114ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (26627.323651ms)

=== two-step-refactor (tier-32) ===
  claw: exit=0 elapsed=199801ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-32)
  ✔ claw extracts the helper without copying the off-by-one (199826.735949ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-32) (199827.154535ms)
ℹ tests 22
ℹ suites 22
ℹ pass 21
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1524992.674574

✖ failing tests:

test at __tests__/tier-eval/state-machine.test.js:66:3
✖ claw implements the FSM with valid transitions and rejection of invalid ones (23872.425758ms)
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
 Container test-test-run-3e6c9fed65cb Creating 
 Container test-test-run-3e6c9fed65cb Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=25205ms files=[".claw",".clawd-todos.json",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (25229.95462ms)
✔ adversarial inputs: slugify (tier=tier-64) (25230.470754ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=3872ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (3875.069573ms)
✔ agent: parallel file writes (tier=tier-64) (3875.814126ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=930ms files=[".claw"]
▶ agent: single-file write (tier=tier-64)
  ✖ claw creates hello.py with the requested content (932.17657ms)
✖ agent: single-file write (tier=tier-64) (933.126961ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=34246ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (34264.660496ms)
✔ algorithm: merge intervals (tier=tier-64) (34265.173795ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=29893ms files=[".claw",".clawd-todos.json",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (29924.171545ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (29924.597135ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=8088ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (8114.290408ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (8114.848996ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=35422ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (35463.195144ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (35463.714397ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=29986ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","test.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (30011.648608ms)
✔ deep-equal: structural equality (tier=tier-64) (30012.212527ms)
▶ distractor: one buggy helper among three (tier=tier-64)
  ✖ claw fixes only the broken helper (240033.585836ms)
✖ distractor: one buggy helper among three (tier=tier-64) (240035.139176ms)
  [1/10] ttft=3086ms
  [2/10] ttft=108ms
  [3/10] ttft=110ms
  [4/10] ttft=111ms
  [5/10] ttft=111ms
  [6/10] ttft=109ms
  [7/10] ttft=109ms
  [8/10] ttft=111ms
  [9/10] ttft=110ms
  [10/10] ttft=111ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=108ms · median=111ms · p95=3086ms · mean=408ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (9637.808358ms)
✔ TTFT — time to first token (tier=tier-64) (9638.716987ms)
  [1/20] ok=true stop=tool_use 1106ms
  [2/20] ok=true stop=tool_use 556ms
  [3/20] ok=true stop=tool_use 400ms
  [4/20] ok=true stop=tool_use 399ms
  [5/20] ok=true stop=tool_use 399ms
  [6/20] ok=true stop=tool_use 401ms
  [7/20] ok=true stop=tool_use 399ms
  [8/20] ok=true stop=tool_use 401ms
  [9/20] ok=true stop=tool_use 401ms
  [10/20] ok=true stop=tool_use 402ms
  [11/20] ok=true stop=tool_use 400ms
  [12/20] ok=true stop=tool_use 400ms
  [13/20] ok=true stop=tool_use 400ms
  [14/20] ok=true stop=tool_use 401ms
  [15/20] ok=true stop=tool_use 401ms
  [16/20] ok=true stop=tool_use 402ms
  [17/20] ok=true stop=tool_use 402ms
  [18/20] ok=true stop=tool_use 402ms
  [19/20] ok=true stop=tool_use 400ms
  [20/20] ok=true stop=tool_use 399ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 399ms · median 401ms · p95 1106ms · mean 444ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8874.976614ms)
✔ tool-call roundtrip latency (tier=tier-64) (8875.323616ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=4855ms files=[".claw","text.js"]
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
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✖ claw fixes all three helpers (4902.082029ms)
✖ multi-bug: fix three independent bugs (tier=tier-64) (4903.0227ms)
▶ multi-file rename + signature change (tier=tier-64)
  ✖ claw renames across files and updates the call site (240047.994183ms)
✖ multi-file rename + signature change (tier=tier-64) (240049.39744ms)

=== null-default (tier-64) ===
  claw: exit=1 elapsed=11447ms files=[".claw","lookup.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

▶ null-default: missing vs falsy (tier=tier-64)
  ✖ claw distinguishes missing from falsy (11448.942675ms)
✖ null-default: missing vs falsy (tier=tier-64) (11450.221306ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2855ms textLen=1478 newlines=14 bullets=4
  [2/3] stop=end_turn 2779ms textLen=1496 newlines=14 bullets=4
  [3/3] stop=end_turn 2633ms textLen=1425 newlines=14 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: The Building Blocks of Modern UI\n\nReact components are the fundamental units that make up React applications. They allow developers to create reusable, self-contained pieces of code that manage their own state and rendering logic.\n\n## What Makes React Components Special\n\n• **Reusable and Composable*
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8269.684706ms)
✔ prose quality via raw bridge (tier=tier-64) (8270.607627ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 8188ms rawLen=1858 cleanLen=1706 newlines=2 bullets=0
  [2/3] exit=0 3651ms rawLen=1629 cleanLen=1477 newlines=2 bullets=0
  [3/3] exit=0 4043ms rawLen=1829 cleanLen=1659 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: Building Blocks of Modern UIReact components are the fundamental building blocks of user interfaces in modern web development. They allow developers to create reusable, self-contained pieces of code that manage their own state and rendering logic.What Are React Components?React com
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (15884.115829ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (15884.432081ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=38339ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (38375.676949ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (38376.246035ms)
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✖ claw implements formatPrice satisfying all four requirements (240036.604955ms)
✖ spec compliance: multi-requirement formatPrice (tier=tier-64) (240038.023754ms)
▶ state-machine: traffic light (tier=tier-64)
  ✖ claw implements the FSM with valid transitions and rejection of invalid ones (240006.494154ms)
✖ state-machine: traffic light (tier=tier-64) (240010.505288ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=42107ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (42152.782094ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (42153.333624ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 626ms
  [2/10] ok=true stop=tool_use tool_use=true 399ms
  [3/10] ok=true stop=tool_use tool_use=true 395ms
  [4/10] ok=true stop=tool_use tool_use=true 400ms
  [5/10] ok=true stop=tool_use tool_use=true 395ms
  [6/10] ok=true stop=tool_use tool_use=true 396ms
  [7/10] ok=true stop=tool_use tool_use=true 397ms
  [8/10] ok=true stop=tool_use tool_use=true 397ms
  [9/10] ok=true stop=tool_use tool_use=true 396ms
  [10/10] ok=true stop=tool_use tool_use=true 394ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 394ms · median 397ms · p95 626ms · mean 420ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4196.795862ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4198.045554ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=16591ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (16629.839852ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (16630.395095ms)
ℹ tests 22
ℹ suites 22
ℹ pass 15
ℹ fail 7
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1288928.379229

✖ failing tests:

test at __tests__/tier-eval/agent-single.test.js:26:3
✖ claw creates hello.py with the requested content (932.17657ms)
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

test at __tests__/tier-eval/distractor.test.js:72:3
✖ claw fixes only the broken helper (240033.585836ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/multi-bug.test.js:63:3
✖ claw fixes all three helpers (4902.082029ms)
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
✖ claw renames across files and updates the call site (240047.994183ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/null-default.test.js:45:3
✖ claw distinguishes missing from falsy (11448.942675ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/null-default.test.js:52:12)
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
✖ claw implements formatPrice satisfying all four requirements (240036.604955ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/state-machine.test.js:66:3
✖ claw implements the FSM with valid transitions and rejection of invalid ones (240006.494154ms)
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

