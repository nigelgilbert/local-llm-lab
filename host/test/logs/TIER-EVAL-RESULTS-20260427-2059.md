# Tier Eval Results — 2026-04-27 20:59

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-3b883a919add Creating 
 Container test-test-run-3b883a919add Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=27590ms files=[".claw",".sandbox-home",".sandbox-tmp","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (27591.512142ms)
✔ agent: parallel file writes (tier=tier-16) (27592.113285ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=10858ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (10862.05709ms)
✔ agent: single-file write (tier=tier-16) (10862.732673ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=45027ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (45048.203073ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (45048.657033ms)
  [1/10] ttft=3029ms
  [2/10] ttft=96ms
  [3/10] ttft=88ms
  [4/10] ttft=92ms
  [5/10] ttft=88ms
  [6/10] ttft=86ms
  [7/10] ttft=86ms
  [8/10] ttft=87ms
  [9/10] ttft=87ms
  [10/10] ttft=87ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=86ms · median=88ms · p95=3029ms · mean=383ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (29950.085332ms)
✔ TTFT — time to first token (tier=tier-16) (29950.773478ms)
  [1/20] ok=true stop=tool_use 2623ms
  [2/20] ok=true stop=tool_use 2454ms
  [3/20] ok=true stop=tool_use 2442ms
  [4/20] ok=true stop=tool_use 2441ms
  [5/20] ok=true stop=tool_use 2441ms
  [6/20] ok=true stop=tool_use 2442ms
  [7/20] ok=true stop=tool_use 2193ms
  [8/20] ok=true stop=tool_use 2192ms
  [9/20] ok=true stop=tool_use 2440ms
  [10/20] ok=true stop=tool_use 2191ms
  [11/20] ok=true stop=tool_use 2494ms
  [12/20] ok=true stop=tool_use 2437ms
  [13/20] ok=true stop=tool_use 2437ms
  [14/20] ok=true stop=tool_use 2438ms
  [15/20] ok=true stop=tool_use 2436ms
  [16/20] ok=true stop=tool_use 2494ms
  [17/20] ok=true stop=tool_use 2436ms
  [18/20] ok=true stop=tool_use 2435ms
  [19/20] ok=true stop=tool_use 2190ms
  [20/20] ok=true stop=tool_use 2436ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2190ms · median 2438ms · p95 2623ms · mean 2405ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (48095.909167ms)
✔ tool-call roundtrip latency (tier=tier-16) (48096.183656ms)

=== prose-quality (tier-16) ===
  [1/3] exit=0 14770ms rawLen=1932 cleanLen=1675 newlines=8 bullets=4
  [2/3] exit=0 16987ms rawLen=2215 cleanLen=1841 newlines=10 bullets=6
  [3/3] exit=0 15009ms rawLen=2159 cleanLen=1830 newlines=10 bullets=6
  sample[0] (first 320 chars, ANSI stripped, \n shown literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They act as independent, reusable pieces of code that encapsulate specific functionality or UI elements. Components can range from simple elements like buttons or text fiel
▶ prose quality via claw (tier=tier-16)
  ✔ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (46767.657093ms)
✔ prose quality via claw (tier=tier-16) (46768.182832ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=29945ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (29980.331143ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (29980.761635ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 2680ms
  [2/10] ok=true stop=tool_use tool_use=true 2443ms
  [3/10] ok=true stop=tool_use tool_use=true 2437ms
  [4/10] ok=true stop=tool_use tool_use=true 2439ms
  [5/10] ok=true stop=tool_use tool_use=true 2439ms
  [6/10] ok=true stop=tool_use tool_use=true 2470ms
  [7/10] ok=true stop=tool_use tool_use=true 2462ms
  [8/10] ok=true stop=tool_use tool_use=true 2458ms
  [9/10] ok=true stop=tool_use tool_use=true 2454ms
  [10/10] ok=true stop=tool_use tool_use=true 2469ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2437ms · median 2458ms · p95 2680ms · mean 2475ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (24752.314364ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (24753.023849ms)
ℹ tests 8
ℹ suites 8
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 263255.229664
```

Exit code: 0

## Tier 32GB

```
 Container test-test-run-129fb2e9eb02 Creating 
 Container test-test-run-129fb2e9eb02 Created 

=== agent-parallel (tier-32) ===
  exit=0 elapsed=4837ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (4838.908596ms)
✔ agent: parallel file writes (tier=tier-32) (4839.615289ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=1406ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (1409.421039ms)
✔ agent: single-file write (tier=tier-32) (1410.277021ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=6205ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (6230.477844ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (6231.031333ms)
  [1/10] ttft=1707ms
  [2/10] ttft=123ms
  [3/10] ttft=118ms
  [4/10] ttft=117ms
  [5/10] ttft=118ms
  [6/10] ttft=117ms
  [7/10] ttft=120ms
  [8/10] ttft=118ms
  [9/10] ttft=119ms
  [10/10] ttft=119ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=117ms · median=119ms · p95=1707ms · mean=278ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4081.169131ms)
✔ TTFT — time to first token (tier=tier-32) (4082.070569ms)
  [1/20] ok=true stop=tool_use 368ms
  [2/20] ok=true stop=tool_use 277ms
  [3/20] ok=true stop=tool_use 278ms
  [4/20] ok=true stop=tool_use 277ms
  [5/20] ok=true stop=tool_use 278ms
  [6/20] ok=true stop=tool_use 277ms
  [7/20] ok=true stop=tool_use 281ms
  [8/20] ok=true stop=tool_use 278ms
  [9/20] ok=true stop=tool_use 276ms
  [10/20] ok=true stop=tool_use 279ms
  [11/20] ok=true stop=tool_use 278ms
  [12/20] ok=true stop=tool_use 276ms
  [13/20] ok=true stop=tool_use 277ms
  [14/20] ok=true stop=tool_use 278ms
  [15/20] ok=true stop=tool_use 279ms
  [16/20] ok=true stop=tool_use 276ms
  [17/20] ok=true stop=tool_use 278ms
  [18/20] ok=true stop=tool_use 279ms
  [19/20] ok=true stop=tool_use 278ms
  [20/20] ok=true stop=tool_use 276ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 276ms · median 278ms · p95 368ms · mean 282ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (5646.051504ms)
✔ tool-call roundtrip latency (tier=tier-32) (5646.454835ms)

=== prose-quality (tier-32) ===
  [1/3] exit=0 4016ms rawLen=1982 cleanLen=1782 newlines=5 bullets=3
  [2/3] exit=0 3585ms rawLen=1898 cleanLen=1686 newlines=2 bullets=0
  [3/3] exit=0 3911ms rawLen=2024 cleanLen=1797 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n shown literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the building blocks of user interfaces in React applications. They are reusable, self-contained pieces of code that encapsulate both the structure (UI) and behavior (logic) of a specific part of the interface. Think of them as custom HTML elements with 
▶ prose quality via claw (tier=tier-32)
  ✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (11514.360911ms)
✖ prose quality via claw (tier=tier-32) (11515.57862ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=8052ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (8094.413235ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (8094.985819ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 493ms
  [2/10] ok=true stop=tool_use tool_use=true 284ms
  [3/10] ok=true stop=tool_use tool_use=true 282ms
  [4/10] ok=true stop=tool_use tool_use=true 282ms
  [5/10] ok=true stop=tool_use tool_use=true 283ms
  [6/10] ok=true stop=tool_use tool_use=true 286ms
  [7/10] ok=true stop=tool_use tool_use=true 282ms
  [8/10] ok=true stop=tool_use tool_use=true 283ms
  [9/10] ok=true stop=tool_use tool_use=true 282ms
  [10/10] ok=true stop=tool_use tool_use=true 281ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 281ms · median 283ms · p95 493ms · mean 304ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (3040.11711ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (3041.010193ms)
ℹ tests 8
ℹ suites 8
ℹ pass 7
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 45077.739946

✖ failing tests:

test at __tests__/tier-eval/prose-quality.test.js:31:3
✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (11514.360911ms)
  AssertionError [ERR_ASSERTION]: [2] markdown smush: 2 newlines in 1686 chars
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

```

Exit code: 1

## Tier 64GB

```
 Container test-test-run-12330e356538 Creating 
 Container test-test-run-12330e356538 Created 

=== agent-parallel (tier-64) ===
  exit=0 elapsed=7452ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (7454.554499ms)
✔ agent: parallel file writes (tier=tier-64) (7455.25425ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1850ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1851.987779ms)
✔ agent: single-file write (tier=tier-64) (1852.682112ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=8024ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (8051.023103ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (8051.604061ms)
  [1/10] ttft=2390ms
  [2/10] ttft=90ms
  [3/10] ttft=75ms
  [4/10] ttft=73ms
  [5/10] ttft=85ms
  [6/10] ttft=73ms
  [7/10] ttft=84ms
  [8/10] ttft=90ms
  [9/10] ttft=73ms
  [10/10] ttft=74ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=73ms · median=84ms · p95=2390ms · mean=311ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5451.000153ms)
✔ TTFT — time to first token (tier=tier-64) (5452.147027ms)
  [1/20] ok=true stop=tool_use 549ms
  [2/20] ok=true stop=tool_use 393ms
  [3/20] ok=true stop=tool_use 393ms
  [4/20] ok=true stop=tool_use 395ms
  [5/20] ok=true stop=tool_use 394ms
  [6/20] ok=true stop=tool_use 397ms
  [7/20] ok=true stop=tool_use 394ms
  [8/20] ok=true stop=tool_use 397ms
  [9/20] ok=true stop=tool_use 394ms
  [10/20] ok=true stop=tool_use 396ms
  [11/20] ok=true stop=tool_use 392ms
  [12/20] ok=true stop=tool_use 390ms
  [13/20] ok=true stop=tool_use 395ms
  [14/20] ok=true stop=tool_use 395ms
  [15/20] ok=true stop=tool_use 394ms
  [16/20] ok=true stop=tool_use 395ms
  [17/20] ok=true stop=tool_use 394ms
  [18/20] ok=true stop=tool_use 394ms
  [19/20] ok=true stop=tool_use 392ms
  [20/20] ok=true stop=tool_use 393ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 390ms · median 394ms · p95 549ms · mean 402ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8047.949311ms)
✔ tool-call roundtrip latency (tier=tier-64) (8048.33577ms)

=== prose-quality (tier-64) ===
  [1/3] exit=0 3650ms rawLen=1586 cleanLen=1434 newlines=2 bullets=0
  [2/3] exit=0 4214ms rawLen=1911 cleanLen=1669 newlines=2 bullets=0
  [3/3] exit=0 4066ms rawLen=1898 cleanLen=1587 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n shown literal):
    7⠋ 🦀 Thinking...8React Components: Building Blocks of Modern Web AppsReact components are the fundamental building blocks of React applications. They allow developers to create reusable UI elements that manage their own state and render output to the screen.What Are React Components?• Reusable Pieces: Components let
▶ prose quality via claw (tier=tier-64)
  ✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (11934.214276ms)
✖ prose quality via claw (tier=tier-64) (11935.329318ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=12808ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (12850.792726ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (12851.364018ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 611ms
  [2/10] ok=true stop=tool_use tool_use=true 399ms
  [3/10] ok=true stop=tool_use tool_use=true 397ms
  [4/10] ok=true stop=tool_use tool_use=true 397ms
  [5/10] ok=true stop=tool_use tool_use=true 397ms
  [6/10] ok=true stop=tool_use tool_use=true 397ms
  [7/10] ok=true stop=tool_use tool_use=true 395ms
  [8/10] ok=true stop=tool_use tool_use=true 395ms
  [9/10] ok=true stop=tool_use tool_use=true 398ms
  [10/10] ok=true stop=tool_use tool_use=true 395ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 395ms · median 397ms · p95 611ms · mean 418ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4183.335433ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4184.601267ms)
ℹ tests 8
ℹ suites 8
ℹ pass 7
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 60055.887655

✖ failing tests:

test at __tests__/tier-eval/prose-quality.test.js:31:3
✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (11934.214276ms)
  AssertionError [ERR_ASSERTION]: [1] markdown smush: 2 newlines in 1434 chars
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

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 0 |
| 32GB | 1 |
| 64GB | 1 |

