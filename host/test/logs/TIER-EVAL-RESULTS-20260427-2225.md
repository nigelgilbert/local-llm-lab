# Tier Eval Results — 2026-04-27 22:25

Tiers: 16

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-405b2eb8c048 Creating 
 Container test-test-run-405b2eb8c048 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=9059ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (9060.223113ms)
✔ agent: parallel file writes (tier=tier-16) (9060.869995ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=4466ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (4468.256897ms)
✔ agent: single-file write (tier=tier-16) (4468.958446ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=8207ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (8229.858102ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (8230.412066ms)
  [1/10] ttft=1773ms
  [2/10] ttft=66ms
  [3/10] ttft=62ms
  [4/10] ttft=63ms
  [5/10] ttft=64ms
  [6/10] ttft=71ms
  [7/10] ttft=63ms
  [8/10] ttft=65ms
  [9/10] ttft=63ms
  [10/10] ttft=66ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=62ms · median=65ms · p95=1773ms · mean=236ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (19000.788727ms)
✔ TTFT — time to first token (tier=tier-16) (19001.634735ms)
  [1/20] ok=false stop=null 2093ms
  [2/20] ok=false stop=null 1944ms
  [3/20] ok=true stop=tool_use 1800ms
  [4/20] ok=false stop=null 1965ms
  [5/20] ok=true stop=tool_use 1829ms
  [6/20] ok=true stop=tool_use 2000ms
  [7/20] ok=false stop=null 2004ms
  [8/20] ok=true stop=tool_use 2003ms
  [9/20] ok=true stop=tool_use 2004ms
  [10/20] ok=false stop=null 1968ms
  [11/20] ok=false stop=null 1971ms
  [12/20] ok=false stop=null 1970ms
  [13/20] ok=true stop=tool_use 1836ms
  [14/20] ok=false stop=null 1995ms
  [15/20] ok=false stop=null 1931ms
  [16/20] ok=false stop=null 1746ms
  [17/20] ok=true stop=tool_use 1970ms
  [18/20] ok=true stop=tool_use 1805ms
  [19/20] ok=false stop=null 1930ms
  [20/20] ok=true stop=tool_use 1968ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 9/20 = 0.45  (threshold 0.9)
  latency   = min 1746ms · median 1968ms · p95 2093ms · mean 1937ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (38743.11355ms)
✖ tool-call roundtrip latency (tier=tier-16) (38744.219811ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 2997ms textLen=1379 newlines=14 bullets=4
  [2/3] stop=end_turn 2863ms textLen=1347 newlines=14 bullets=4
  [3/3] stop=end_turn 3103ms textLen=1431 newlines=16 bullets=4
  sample[0] (first 320 chars, \n literal):
    .onerror\n</think>\n\n## What Are React Components?\n\nReact components are the building blocks of a React application. They allow developers to create reusable UI elements that can be combined to build complex interfaces. Each component is a self-contained unit that manages its own logic and appearance. This modular approa
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8965.063924ms)
✔ prose quality via raw bridge (tier=tier-16) (8966.055392ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 5487ms rawLen=1552 cleanLen=1355 newlines=7 bullets=3
  [2/3] exit=0 5152ms rawLen=1469 cleanLen=1317 newlines=7 bullets=3
  [3/3] exit=0 4987ms rawLen=1428 cleanLen=1261 newlines=7 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are reusable building blocks for creating user interfaces. They allow developers to break down complex UIs into smaller, manageable pieces. Each component is self-contained, encapsulating its own HTML, CSS, and logic. This modularity make
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (15627.089873ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (15627.374584ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=6468ms files=[".claw","buggy.js"]
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
  ✖ claw fixes buggy.js so its assertions pass (6502.457005ms)
✖ refactor: fix seeded off-by-one (tier=tier-16) (6503.175721ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 2101ms
  [2/10] ok=false stop=? tool_use=true 1951ms
  [3/10] ok=true stop=tool_use tool_use=true 1947ms
  [4/10] ok=false stop=? tool_use=true 1947ms
  [5/10] ok=true stop=tool_use tool_use=true 1951ms
  [6/10] ok=true stop=tool_use tool_use=true 1948ms
  [7/10] ok=true stop=tool_use tool_use=true 1431ms
  [8/10] ok=true stop=tool_use tool_use=true 1950ms
  [9/10] ok=true stop=tool_use tool_use=true 1433ms
  [10/10] ok=false stop=? tool_use=true 1953ms
  rate    = 7/10 = 0.70  (threshold 0.9)
  latency = min 1431ms · median 1950ms · p95 2101ms · mean 1861ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (18614.466476ms)
✖ tool-call wrapping (tier=tier-16, bridge=claw-llama) (18615.991617ms)
ℹ tests 9
ℹ suites 9
ℹ pass 6
ℹ fail 3
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 129427.115463

✖ failing tests:

test at __tests__/tier-eval/latency.test.js:193:3
✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (38743.11355ms)
  AssertionError [ERR_ASSERTION]: wrap rate 0.45 below threshold 0.9 — grammar may have regressed
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

test at __tests__/tier-eval/refactor.test.js:50:3
✖ claw fixes buggy.js so its assertions pass (6502.457005ms)
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
✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (18614.466476ms)
  AssertionError [ERR_ASSERTION]: wrap rate 0.70 below threshold 0.9
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

