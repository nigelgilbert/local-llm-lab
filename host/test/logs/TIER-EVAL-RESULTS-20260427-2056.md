# Tier Eval Results — 2026-04-27 20:56

Tiers: 16

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-4607d62f459b Creating 
 Container test-test-run-4607d62f459b Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=7707ms files=[".claw"]
▶ agent: parallel file writes (tier=tier-16)
  ✖ claw creates a.py, b.py, c.py with matching contents (7708.79702ms)
✖ agent: parallel file writes (tier=tier-16) (7709.995315ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1081ms files=[".claw"]
▶ agent: single-file write (tier=tier-16)
  ✖ claw creates hello.py with the requested content (1085.308226ms)
✖ agent: single-file write (tier=tier-16) (1086.599541ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=4953ms files=[".claw"]
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✖ claw writes fib.js that passes its own assertions under node (4955.285182ms)
✖ code self-test: fibonacci implementation (tier=tier-16) (4956.488893ms)
  [1/10] ttft=2996ms
  [2/10] ttft=71ms
  [3/10] ttft=69ms
  [4/10] ttft=69ms
  [5/10] ttft=68ms
  [6/10] ttft=67ms
  [7/10] ttft=68ms
  [8/10] ttft=69ms
  [9/10] ttft=66ms
  [10/10] ttft=69ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=66ms · median=69ms · p95=2996ms · mean=361ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (10186.451716ms)
✔ TTFT — time to first token (tier=tier-16) (10187.55113ms)
  [1/20] ok=false stop=end_turn 970ms
  [2/20] ok=false stop=end_turn 823ms
  [3/20] ok=false stop=end_turn 825ms
  [4/20] ok=false stop=end_turn 820ms
  [5/20] ok=false stop=end_turn 826ms
  [6/20] ok=false stop=end_turn 818ms
  [7/20] ok=false stop=end_turn 821ms
  [8/20] ok=false stop=end_turn 781ms
  [9/20] ok=false stop=end_turn 817ms
  [10/20] ok=false stop=end_turn 820ms
  [11/20] ok=false stop=end_turn 817ms
  [12/20] ok=false stop=end_turn 779ms
  [13/20] ok=false stop=end_turn 818ms
  [14/20] ok=false stop=end_turn 817ms
  [15/20] ok=false stop=end_turn 779ms
  [16/20] ok=false stop=end_turn 779ms
  [17/20] ok=false stop=end_turn 819ms
  [18/20] ok=false stop=end_turn 819ms
  [19/20] ok=false stop=end_turn 783ms
  [20/20] ok=false stop=end_turn 776ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 0/20 = 0.00  (threshold 0.9)
  latency   = min 776ms · median 818ms · p95 970ms · mean 815ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (16312.663223ms)
✖ tool-call roundtrip latency (tier=tier-16) (16313.840315ms)

=== prose-quality (tier-16) ===
  [1/3] exit=0 9444ms rawLen=2441 cleanLen=2169 newlines=5 bullets=3
  [2/3] exit=0 10687ms rawLen=2880 cleanLen=2238 newlines=15 bullets=3
  [3/3] exit=0 10282ms rawLen=2576 cleanLen=2283 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n shown literal):
    7⠋ 🦀 Thinking...8React Components: Building Blocks of Modern Web ApplicationsReact components are the fundamental building blocks of React applications. They allow developers to break down the UI into reusable, isolated pieces, making the codebase easier to manage and maintain. Components can be composed of other co
▶ prose quality via claw (tier=tier-16)
  ✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (30414.887451ms)
✖ prose quality via claw (tier=tier-16) (30416.333574ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=1737ms files=[".claw","buggy.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: sum([1,2,3]) should be 6

NaN !== 6

    at file:///workspace/buggy.js:9:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMess
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✖ claw fixes buggy.js so its assertions pass (1782.669534ms)
✖ refactor: fix seeded off-by-one (tier=tier-16) (1783.527303ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=false stop=end_turn tool_use=false 1033ms
  [2/10] ok=false stop=end_turn tool_use=false 832ms
  [3/10] ok=false stop=end_turn tool_use=false 827ms
  [4/10] ok=false stop=end_turn tool_use=false 833ms
  [5/10] ok=false stop=end_turn tool_use=false 826ms
  [6/10] ok=false stop=end_turn tool_use=false 825ms
  [7/10] ok=false stop=end_turn tool_use=false 827ms
  [8/10] ok=false stop=end_turn tool_use=false 825ms
  [9/10] ok=false stop=end_turn tool_use=false 826ms
  [10/10] ok=false stop=end_turn tool_use=false 828ms
  rate    = 0/10 = 0.00  (threshold 0.9)
  latency = min 825ms · median 827ms · p95 1033ms · mean 848ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (8485.311465ms)
✖ tool-call wrapping (tier=tier-16, bridge=claw-llama) (8487.515961ms)
ℹ tests 8
ℹ suites 8
ℹ pass 1
ℹ fail 7
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 81176.058361

✖ failing tests:

test at __tests__/tier-eval/agent-parallel.test.js:32:3
✖ claw creates a.py, b.py, c.py with matching contents (7708.79702ms)
  AssertionError [ERR_ASSERTION]: expected a.py to exist
  
  false !== true
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/agent-parallel.test.js:41:14)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at __tests__/tier-eval/agent-single.test.js:18:3
✖ claw creates hello.py with the requested content (1085.308226ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  false !== true
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/agent-single.test.js:26:12)
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

test at __tests__/tier-eval/code-self-test.test.js:31:3
✖ claw writes fib.js that passes its own assertions under node (4955.285182ms)
  AssertionError [ERR_ASSERTION]: fib.js must be created
  
  false !== true
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/code-self-test.test.js:39:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at __tests__/tier-eval/latency.test.js:193:3
✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (16312.663223ms)
  AssertionError [ERR_ASSERTION]: wrap rate 0.00 below threshold 0.9 — grammar may have regressed
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/latency.test.js:226:14)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:831:7) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }

test at __tests__/tier-eval/prose-quality.test.js:31:3
✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (30414.887451ms)
  AssertionError [ERR_ASSERTION]: [3] markdown smush: 2 newlines in 2283 chars
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/prose-quality.test.js:58:16)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }

test at __tests__/tier-eval/refactor.test.js:50:3
✖ claw fixes buggy.js so its assertions pass (1782.669534ms)
  AssertionError [ERR_ASSERTION]: buggy.js still fails after claw's fix:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: sum([1,2,3]) should be 6
  
  NaN !== 6
  
      at file:///workspace/buggy.js:9:8
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
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/refactor.test.js:73:12)
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

test at __tests__/tier-eval/tool-discipline.test.js:41:3
✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (8485.311465ms)
  AssertionError [ERR_ASSERTION]: wrap rate 0.00 below threshold 0.9
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/tool-discipline.test.js:78:14)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 1 |

