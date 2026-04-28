# Tier Eval Results — 2026-04-27 22:22

Tiers: 16

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-ce7a0ca21366 Creating 
 Container test-test-run-ce7a0ca21366 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=5705ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (5706.832628ms)
✔ agent: parallel file writes (tier=tier-16) (5707.837656ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1252ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (1254.173055ms)
✔ agent: single-file write (tier=tier-16) (1254.930577ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=4573ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (4600.326224ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (4601.165039ms)
  [1/10] ttft=1840ms
  [2/10] ttft=149ms
  [3/10] ttft=142ms
  [4/10] ttft=145ms
  [5/10] ttft=144ms
  [6/10] ttft=144ms
  [7/10] ttft=143ms
  [8/10] ttft=146ms
  [9/10] ttft=144ms
  [10/10] ttft=144ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=142ms · median=144ms · p95=1840ms · mean=314ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4768.88313ms)
✔ TTFT — time to first token (tier=tier-16) (4769.59715ms)
  [1/20] ok=true stop=tool_use 471ms
  [2/20] ok=true stop=tool_use 374ms
  [3/20] ok=true stop=tool_use 376ms
  [4/20] ok=true stop=tool_use 373ms
  [5/20] ok=true stop=tool_use 374ms
  [6/20] ok=true stop=tool_use 373ms
  [7/20] ok=true stop=tool_use 376ms
  [8/20] ok=true stop=tool_use 375ms
  [9/20] ok=true stop=tool_use 377ms
  [10/20] ok=true stop=tool_use 375ms
  [11/20] ok=true stop=tool_use 376ms
  [12/20] ok=true stop=tool_use 375ms
  [13/20] ok=true stop=tool_use 375ms
  [14/20] ok=true stop=tool_use 375ms
  [15/20] ok=true stop=tool_use 376ms
  [16/20] ok=true stop=tool_use 374ms
  [17/20] ok=true stop=tool_use 376ms
  [18/20] ok=true stop=tool_use 374ms
  [19/20] ok=true stop=tool_use 375ms
  [20/20] ok=true stop=tool_use 373ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 373ms · median 375ms · p95 471ms · mean 380ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (7609.599628ms)
✔ tool-call roundtrip latency (tier=tier-16) (7609.901595ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 3020ms textLen=1419 newlines=13 bullets=4
  [2/3] stop=end_turn 3059ms textLen=1442 newlines=13 bullets=4
  [3/3] stop=end_turn 2581ms textLen=1265 newlines=11 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are the building blocks of a React application. They allow developers to create reusable UI elements that can be combined to build complex interfaces. Each component is a self-contained unit that manages its own logic and appearance.\n\nComponents can be either functional o
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8661.421411ms)
✔ prose quality via raw bridge (tier=tier-16) (8663.859645ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 2513ms rawLen=1133 cleanLen=981 newlines=5 bullets=3
  [2/3] exit=0 2772ms rawLen=1248 cleanLen=1096 newlines=5 bullets=3
  [3/3] exit=0 2507ms rawLen=1186 cleanLen=1034 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable building blocks in React applications that allow developers to create complex user interfaces by breaking them into smaller, manageable pieces. Each component encapsulates its own logic, rendering, and styling, making it easier to maintain and 
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (7792.954515ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (7793.547985ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=3624ms files=[".claw","buggy.js"]
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
  ✖ claw fixes buggy.js so its assertions pass (3668.502935ms)
✖ refactor: fix seeded off-by-one (tier=tier-16) (3669.427615ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 545ms
  [2/10] ok=true stop=tool_use tool_use=true 379ms
  [3/10] ok=true stop=tool_use tool_use=true 376ms
  [4/10] ok=true stop=tool_use tool_use=true 377ms
  [5/10] ok=true stop=tool_use tool_use=true 378ms
  [6/10] ok=true stop=tool_use tool_use=true 378ms
  [7/10] ok=true stop=tool_use tool_use=true 377ms
  [8/10] ok=true stop=tool_use tool_use=true 381ms
  [9/10] ok=true stop=tool_use tool_use=true 378ms
  [10/10] ok=true stop=tool_use tool_use=true 378ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 376ms · median 378ms · p95 545ms · mean 395ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (3948.566034ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (3949.658926ms)
ℹ tests 9
ℹ suites 9
ℹ pass 8
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 48256.383001

✖ failing tests:

test at __tests__/tier-eval/refactor.test.js:50:3
✖ claw fixes buggy.js so its assertions pass (3668.502935ms)
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

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 1 |

