# Tier Eval Results — 2026-04-27 23:09

Tiers: 16

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-66ee6040e45a Creating 
 Container test-test-run-66ee6040e45a Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=5200ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (5203.890656ms)
✔ agent: parallel file writes (tier=tier-16) (5204.528201ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1408ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (1412.22819ms)
✔ agent: single-file write (tier=tier-16) (1413.20432ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=6145ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (6168.516892ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (6169.137687ms)
  [1/10] ttft=1776ms
  [2/10] ttft=142ms
  [3/10] ttft=138ms
  [4/10] ttft=137ms
  [5/10] ttft=140ms
  [6/10] ttft=140ms
  [7/10] ttft=137ms
  [8/10] ttft=141ms
  [9/10] ttft=140ms
  [10/10] ttft=141ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=137ms · median=140ms · p95=1776ms · mean=303ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4624.03929ms)
✔ TTFT — time to first token (tier=tier-16) (4624.892753ms)
  [1/20] ok=true stop=tool_use 472ms
  [2/20] ok=true stop=tool_use 380ms
  [3/20] ok=true stop=tool_use 376ms
  [4/20] ok=true stop=tool_use 377ms
  [5/20] ok=true stop=tool_use 378ms
  [6/20] ok=true stop=tool_use 379ms
  [7/20] ok=true stop=tool_use 376ms
  [8/20] ok=true stop=tool_use 378ms
  [9/20] ok=true stop=tool_use 385ms
  [10/20] ok=true stop=tool_use 375ms
  [11/20] ok=true stop=tool_use 379ms
  [12/20] ok=true stop=tool_use 378ms
  [13/20] ok=true stop=tool_use 378ms
  [14/20] ok=true stop=tool_use 379ms
  [15/20] ok=true stop=tool_use 379ms
  [16/20] ok=true stop=tool_use 377ms
  [17/20] ok=true stop=tool_use 374ms
  [18/20] ok=true stop=tool_use 379ms
  [19/20] ok=true stop=tool_use 379ms
  [20/20] ok=true stop=tool_use 379ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 374ms · median 379ms · p95 472ms · mean 383ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (7668.491436ms)
✔ tool-call roundtrip latency (tier=tier-16) (7668.878855ms)

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=50365ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/index.js:3
import { transform } from './lib.js';
         ^^^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'transform'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPo
▶ multi-file rename + signature change (tier=tier-16)
  ✖ claw renames across files and updates the call site (50408.487819ms)
✖ multi-file rename + signature change (tier=tier-16) (50409.322449ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 2804ms textLen=1168 newlines=9 bullets=4
  [2/3] stop=end_turn 2549ms textLen=1020 newlines=9 bullets=4
  [3/3] stop=end_turn 2372ms textLen=987 newlines=9 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable pieces of code that represent parts of an application's UI. They encapsulate the logic and presentation of a specific part of the user interface, making it easier to manage and scale complex applications. Here are some key features and benefits of using React
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7726.797069ms)
✔ prose quality via raw bridge (tier=tier-16) (7727.656199ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 7154ms rawLen=3151 cleanLen=2686 newlines=15 bullets=3
  [2/3] exit=0 11616ms rawLen=4706 cleanLen=4034 newlines=27 bullets=10
  [3/3] exit=0 9207ms rawLen=2365 cleanLen=1487 newlines=28 bullets=2
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n╭─ SendUserMessage ─╮\n│ {"message":"# Introduction to React Components\nReact components are reusable pieces of code tha…\n╰───────────────────────╯\n✓ SendUserMessage\n{\n“attachments”: null,\n“message”: “# Introduction to React Components\nReact components are reusable pieces of code that encapsulate 
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (27979.107618ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (27979.456995ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=8825ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (8867.37206ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (8867.944771ms)

=== subtle-bug (tier-16) ===
  claw: exit=0 elapsed=60288ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
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
  ✖ claw fixes median.js so its assertions pass (60327.647576ms)
✖ subtle bug: default-sort lexicographic (tier=tier-16) (60328.515383ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 587ms
  [2/10] ok=true stop=tool_use tool_use=true 381ms
  [3/10] ok=true stop=tool_use tool_use=true 384ms
  [4/10] ok=true stop=tool_use tool_use=true 389ms
  [5/10] ok=true stop=tool_use tool_use=true 385ms
  [6/10] ok=true stop=tool_use tool_use=true 404ms
  [7/10] ok=true stop=tool_use tool_use=true 398ms
  [8/10] ok=true stop=tool_use tool_use=true 393ms
  [9/10] ok=true stop=tool_use tool_use=true 396ms
  [10/10] ok=true stop=tool_use tool_use=true 404ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 381ms · median 396ms · p95 587ms · mean 412ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4122.87164ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (4123.696814ms)
ℹ tests 11
ℹ suites 11
ℹ pass 9
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 184782.378873

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (50408.487819ms)
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

test at __tests__/tier-eval/subtle-bug.test.js:52:3
✖ claw fixes median.js so its assertions pass (60327.647576ms)
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

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 1 |

