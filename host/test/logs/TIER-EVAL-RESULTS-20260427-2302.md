# Tier Eval Results — 2026-04-27 23:02

Tiers: 16

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-9384ca0a1e4d Creating 
 Container test-test-run-9384ca0a1e4d Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=34487ms files=[".claw",".sandbox-home",".sandbox-tmp","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (34489.696143ms)
✔ agent: parallel file writes (tier=tier-16) (34490.311688ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=7687ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (7689.780165ms)
✔ agent: single-file write (tier=tier-16) (7690.459168ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=28676ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (28700.780128ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (28701.27513ms)
  [1/10] ttft=3597ms
  [2/10] ttft=98ms
  [3/10] ttft=97ms
  [4/10] ttft=91ms
  [5/10] ttft=94ms
  [6/10] ttft=95ms
  [7/10] ttft=102ms
  [8/10] ttft=95ms
  [9/10] ttft=95ms
  [10/10] ttft=96ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=91ms · median=96ms · p95=3597ms · mean=446ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (33329.592011ms)
✔ TTFT — time to first token (tier=tier-16) (33330.437308ms)
  [1/20] ok=true stop=tool_use 2616ms
  [2/20] ok=true stop=tool_use 2428ms
  [3/20] ok=true stop=tool_use 2657ms
  [4/20] ok=true stop=tool_use 2642ms
  [5/20] ok=true stop=tool_use 2647ms
  [6/20] ok=true stop=tool_use 2386ms
  [7/20] ok=true stop=tool_use 2668ms
  [8/20] ok=true stop=tool_use 2410ms
  [9/20] ok=true stop=tool_use 2713ms
  [10/20] ok=true stop=tool_use 2383ms
  [11/20] ok=true stop=tool_use 2380ms
  [12/20] ok=true stop=tool_use 2680ms
  [13/20] ok=true stop=tool_use 2629ms
  [14/20] ok=true stop=tool_use 2349ms
  [15/20] ok=true stop=tool_use 2378ms
  [16/20] ok=true stop=tool_use 2607ms
  [17/20] ok=true stop=tool_use 2308ms
  [18/20] ok=true stop=tool_use 2311ms
  [19/20] ok=true stop=tool_use 2322ms
  [20/20] ok=true stop=tool_use 2313ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2308ms · median 2428ms · p95 2713ms · mean 2491ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (49832.896286ms)
✔ tool-call roundtrip latency (tier=tier-16) (49833.201412ms)

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=51657ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/service.js:1
import { compute } from './lib.js';
         ^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointW
▶ multi-file rename + signature change (tier=tier-16)
  ✖ claw renames across files and updates the call site (51686.2985ms)
✖ multi-file rename + signature change (tier=tier-16) (51686.89167ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 4681ms textLen=1284 newlines=22 bullets=8
  [2/3] stop=end_turn 4644ms textLen=1314 newlines=21 bullets=8
  [3/3] stop=end_turn 16460ms textLen=4128 newlines=42 bullets=16
  sample[0] (first 320 chars, \n literal):
    moil\n\n</think>\n\n## What Are React Components?\n\nReact components are the building blocks of React applications. They allow developers to break down complex UIs into smaller, reusable pieces. Each component is responsible for rendering a part of the user interface and can manage its own state and logic.\n\n- Components can
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (25788.2612ms)
✔ prose quality via raw bridge (tier=tier-16) (25788.819286ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 12452ms rawLen=1632 cleanLen=1450 newlines=7 bullets=3
  [2/3] exit=0 13422ms rawLen=2130 cleanLen=1801 newlines=10 bullets=6
  [3/3] exit=0 16458ms rawLen=2150 cleanLen=1881 newlines=12 bullets=7
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They act as independent, reusable pieces of code that encapsulate specific functionality or UI elements. Components can range from simple elements like buttons or text fiel
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (42332.763693ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (42332.944028ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=35095ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (35130.087959ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (35130.600671ms)

=== subtle-bug (tier-16) ===
  claw: exit=0 elapsed=54558ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-16)
  ✔ claw fixes median.js so its assertions pass (54590.106601ms)
✔ subtle bug: default-sort lexicographic (tier=tier-16) (54590.561062ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 2714ms
  [2/10] ok=true stop=tool_use tool_use=true 2473ms
  [3/10] ok=true stop=tool_use tool_use=true 2473ms
  [4/10] ok=true stop=tool_use tool_use=true 2467ms
  [5/10] ok=true stop=tool_use tool_use=true 2471ms
  [6/10] ok=true stop=tool_use tool_use=true 2483ms
  [7/10] ok=true stop=tool_use tool_use=true 2461ms
  [8/10] ok=true stop=tool_use tool_use=true 2462ms
  [9/10] ok=true stop=tool_use tool_use=true 2466ms
  [10/10] ok=true stop=tool_use tool_use=true 2474ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2461ms · median 2473ms · p95 2714ms · mean 2494ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (24945.773475ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (24946.553188ms)
ℹ tests 11
ℹ suites 11
ℹ pass 10
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 388758.911563

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (51686.2985ms)
  AssertionError [ERR_ASSERTION]: index.js still fails after claw's edits:
  file:///workspace/service.js:1
  import { compute } from './lib.js';
           ^^^^^^^
  SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
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

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 1 |

