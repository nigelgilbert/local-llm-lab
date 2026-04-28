# Tier Eval Results — 2026-04-27 21:27

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-b64afd1ff5a8 Creating 
 Container test-test-run-b64afd1ff5a8 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=16499ms files=[".claw","CLAUDE.md","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (16500.590513ms)
✔ agent: parallel file writes (tier=tier-16) (16501.188262ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=7391ms files=[".claw","CLAUDE.md","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (7393.730809ms)
✔ agent: single-file write (tier=tier-16) (7394.676641ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=32281ms files=[".claw","CLAUDE.md","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (32306.046179ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (32306.629804ms)
  [1/10] ttft=3197ms
  [2/10] ttft=89ms
  [3/10] ttft=88ms
  [4/10] ttft=88ms
  [5/10] ttft=88ms
  [6/10] ttft=89ms
  [7/10] ttft=87ms
  [8/10] ttft=87ms
  [9/10] ttft=87ms
  [10/10] ttft=93ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=87ms · median=88ms · p95=3197ms · mean=399ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (30584.129344ms)
✔ TTFT — time to first token (tier=tier-16) (30586.14909ms)
  [1/20] ok=true stop=tool_use 2407ms
  [2/20] ok=true stop=tool_use 2445ms
  [3/20] ok=true stop=tool_use 2198ms
  [4/20] ok=true stop=tool_use 2447ms
  [5/20] ok=true stop=tool_use 2445ms
  [6/20] ok=true stop=tool_use 2444ms
  [7/20] ok=true stop=tool_use 2441ms
  [8/20] ok=true stop=tool_use 2444ms
  [9/20] ok=true stop=tool_use 2194ms
  [10/20] ok=true stop=tool_use 2192ms
  [11/20] ok=true stop=tool_use 2439ms
  [12/20] ok=true stop=tool_use 2437ms
  [13/20] ok=true stop=tool_use 2426ms
  [14/20] ok=true stop=tool_use 2492ms
  [15/20] ok=true stop=tool_use 2438ms
  [16/20] ok=true stop=tool_use 2189ms
  [17/20] ok=true stop=tool_use 2437ms
  [18/20] ok=true stop=tool_use 2191ms
  [19/20] ok=true stop=tool_use 2437ms
  [20/20] ok=true stop=tool_use 2434ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2189ms · median 2437ms · p95 2492ms · mean 2379ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (47584.916006ms)
✔ tool-call roundtrip latency (tier=tier-16) (47585.21113ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 17058ms textLen=4333 newlines=44 bullets=16
  [2/3] stop=end_turn 12338ms textLen=3231 newlines=32 bullets=8
  [3/3] stop=end_turn 4822ms textLen=1321 newlines=21 bullets=8
  sample[0] (first 320 chars, \n literal):
    markdown\nOkay, the user wants me to write a short markdown explainer about React components. Let me start by understanding the requirements. They specified two headers in ## style and at least four bullet points, aiming for around 250 words. No tool calls, just the markdown response.\n\nFirst, I need to structure the con
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (34219.622419ms)
✔ prose quality via raw bridge (tier=tier-16) (34220.656706ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 14833ms rawLen=1783 cleanLen=1556 newlines=7 bullets=3
  [2/3] exit=0 13643ms rawLen=1775 cleanLen=1530 newlines=7 bullets=3
  [3/3] exit=0 13108ms rawLen=1822 cleanLen=1580 newlines=7 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They act as reusable, self-contained units of code that encapsulate logic, state, and UI elements. Components can range from simple elements like buttons or text fields to 
  (informational only — claw's renderer strips header markers without preserving \n; see TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (41584.660914ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (41584.916121ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=34205ms files=[".claw","CLAUDE.md","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (34236.999642ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (34237.465474ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 2675ms
  [2/10] ok=true stop=tool_use tool_use=true 2460ms
  [3/10] ok=true stop=tool_use tool_use=true 2454ms
  [4/10] ok=true stop=tool_use tool_use=true 2460ms
  [5/10] ok=true stop=tool_use tool_use=true 2466ms
  [6/10] ok=true stop=tool_use tool_use=true 2504ms
  [7/10] ok=true stop=tool_use tool_use=true 2489ms
  [8/10] ok=true stop=tool_use tool_use=true 2492ms
  [9/10] ok=true stop=tool_use tool_use=true 2494ms
  [10/10] ok=true stop=tool_use tool_use=true 2483ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2454ms · median 2489ms · p95 2675ms · mean 2498ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (24977.388439ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (24978.160143ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 269589.11571
```

Exit code: 0

## Tier 32GB

```
 Container test-test-run-7efaf8774c89 Creating 
 Container test-test-run-7efaf8774c89 Created 

=== agent-parallel (tier-32) ===
  exit=0 elapsed=4763ms files=[".claw","CLAUDE.md","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (4765.24894ms)
✔ agent: parallel file writes (tier=tier-32) (4767.07939ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=826ms files=[".claw","CLAUDE.md","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (829.542328ms)
✔ agent: single-file write (tier=tier-32) (830.320324ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=3607ms files=[".claw","CLAUDE.md","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (3635.055318ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (3635.623815ms)
  [1/10] ttft=1703ms
  [2/10] ttft=122ms
  [3/10] ttft=119ms
  [4/10] ttft=122ms
  [5/10] ttft=120ms
  [6/10] ttft=119ms
  [7/10] ttft=118ms
  [8/10] ttft=118ms
  [9/10] ttft=118ms
  [10/10] ttft=119ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=118ms · median=119ms · p95=1703ms · mean=278ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4090.69934ms)
✔ TTFT — time to first token (tier=tier-32) (4091.78246ms)
  [1/20] ok=true stop=tool_use 371ms
  [2/20] ok=true stop=tool_use 278ms
  [3/20] ok=true stop=tool_use 278ms
  [4/20] ok=true stop=tool_use 279ms
  [5/20] ok=true stop=tool_use 280ms
  [6/20] ok=true stop=tool_use 281ms
  [7/20] ok=true stop=tool_use 279ms
  [8/20] ok=true stop=tool_use 281ms
  [9/20] ok=true stop=tool_use 282ms
  [10/20] ok=true stop=tool_use 277ms
  [11/20] ok=true stop=tool_use 280ms
  [12/20] ok=true stop=tool_use 278ms
  [13/20] ok=true stop=tool_use 279ms
  [14/20] ok=true stop=tool_use 279ms
  [15/20] ok=true stop=tool_use 278ms
  [16/20] ok=true stop=tool_use 278ms
  [17/20] ok=true stop=tool_use 294ms
  [18/20] ok=true stop=tool_use 281ms
  [19/20] ok=true stop=tool_use 280ms
  [20/20] ok=true stop=tool_use 283ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 277ms · median 280ms · p95 371ms · mean 285ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (5697.541173ms)
✔ tool-call roundtrip latency (tier=tier-32) (5697.796797ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 3146ms textLen=1855 newlines=15 bullets=4
  [2/3] stop=end_turn 2693ms textLen=1668 newlines=11 bullets=4
  [3/3] stop=end_turn 2438ms textLen=1546 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are the building blocks of React applications. They are reusable, self-contained pieces of code that encapsulate both the UI logic and behavior for a specific part of a web page. Think of them as custom HTML-like elements that can accept inputs (called "props") and return
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8280.094731ms)
✔ prose quality via raw bridge (tier=tier-32) (8280.999685ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 3412ms rawLen=1672 cleanLen=1505 newlines=5 bullets=3
  [2/3] exit=0 4427ms rawLen=2249 cleanLen=2022 newlines=5 bullets=3
  [3/3] exit=0 4066ms rawLen=2111 cleanLen=1917 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the building blocks of user interfaces in React applications. They are reusable, self-contained pieces of code that encapsulate both the structure (UI) and behavior (logic) of a part of the interface. Think of them as custom HTML elements with dynamic c
  (informational only — claw's renderer strips header markers without preserving \n; see TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11907.230963ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (11907.536504ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=5463ms files=[".claw","CLAUDE.md","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (5502.280354ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (5502.873226ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 486ms
  [2/10] ok=true stop=tool_use tool_use=true 284ms
  [3/10] ok=true stop=tool_use tool_use=true 280ms
  [4/10] ok=true stop=tool_use tool_use=true 279ms
  [5/10] ok=true stop=tool_use tool_use=true 283ms
  [6/10] ok=true stop=tool_use tool_use=true 281ms
  [7/10] ok=true stop=tool_use tool_use=true 281ms
  [8/10] ok=true stop=tool_use tool_use=true 285ms
  [9/10] ok=true stop=tool_use tool_use=true 282ms
  [10/10] ok=true stop=tool_use tool_use=true 284ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 279ms · median 283ms · p95 486ms · mean 303ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (3027.04572ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (3027.889799ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 47962.680565
```

Exit code: 0

## Tier 64GB

```
 Container test-test-run-8a63828c635e Creating 
 Container test-test-run-8a63828c635e Created 

=== agent-parallel (tier-64) ===
  exit=0 elapsed=4937ms files=[".claw","CLAUDE.md"]
▶ agent: parallel file writes (tier=tier-64)
  ✖ claw creates a.py, b.py, c.py with matching contents (4940.248361ms)
✖ agent: parallel file writes (tier=tier-64) (4941.612228ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=673ms files=[".claw","CLAUDE.md"]
▶ agent: single-file write (tier=tier-64)
  ✖ claw creates hello.py with the requested content (676.607797ms)
✖ agent: single-file write (tier=tier-64) (677.947541ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5714ms files=[".claw","CLAUDE.md","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5744.494898ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5745.05977ms)
  [1/10] ttft=2446ms
  [2/10] ttft=87ms
  [3/10] ttft=74ms
  [4/10] ttft=86ms
  [5/10] ttft=86ms
  [6/10] ttft=72ms
  [7/10] ttft=83ms
  [8/10] ttft=73ms
  [9/10] ttft=75ms
  [10/10] ttft=71ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=71ms · median=83ms · p95=2446ms · mean=315ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5465.430746ms)
✔ TTFT — time to first token (tier=tier-64) (5466.271491ms)
  [1/20] ok=true stop=tool_use 528ms
  [2/20] ok=true stop=tool_use 399ms
  [3/20] ok=true stop=tool_use 397ms
  [4/20] ok=true stop=tool_use 397ms
  [5/20] ok=true stop=tool_use 402ms
  [6/20] ok=true stop=tool_use 396ms
  [7/20] ok=true stop=tool_use 396ms
  [8/20] ok=true stop=tool_use 397ms
  [9/20] ok=true stop=tool_use 397ms
  [10/20] ok=true stop=tool_use 397ms
  [11/20] ok=true stop=tool_use 396ms
  [12/20] ok=true stop=tool_use 395ms
  [13/20] ok=true stop=tool_use 396ms
  [14/20] ok=true stop=tool_use 397ms
  [15/20] ok=true stop=tool_use 400ms
  [16/20] ok=true stop=tool_use 396ms
  [17/20] ok=true stop=tool_use 391ms
  [18/20] ok=true stop=tool_use 395ms
  [19/20] ok=true stop=tool_use 396ms
  [20/20] ok=true stop=tool_use 395ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 391ms · median 397ms · p95 528ms · mean 403ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8067.775539ms)
✔ tool-call roundtrip latency (tier=tier-64) (8068.040162ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2760ms textLen=1453 newlines=14 bullets=4
  [2/3] stop=end_turn 2711ms textLen=1537 newlines=14 bullets=4
  [3/3] stop=end_turn 2319ms textLen=1253 newlines=12 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: Building Blocks of Modern UI\n\nReact components are the fundamental units of any React application. They allow developers to create reusable UI elements that can be composed together to build complex user interfaces.\n\n## What Makes React Components Special\n\n• **Reusable and Composable**: Components c
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7791.422581ms)
✔ prose quality via raw bridge (tier=tier-64) (7792.186036ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4437ms rawLen=1933 cleanLen=1781 newlines=2 bullets=0
  [2/3] exit=0 3890ms rawLen=1734 cleanLen=1564 newlines=2 bullets=0
  [3/3] exit=0 4039ms rawLen=1798 cleanLen=1610 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: Building Blocks of Modern UIReact components are the fundamental building blocks of user interfaces in modern web development. They allow developers to create reusable, self-contained pieces of code that manage their own state and rendering logic.What Are React Components?React com
  (informational only — claw's renderer strips header markers without preserving \n; see TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (12367.17084ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (12367.520046ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=11827ms files=[".claw",".sandbox-home",".sandbox-tmp","CLAUDE.md","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (11857.593764ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (11858.014595ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 593ms
  [2/10] ok=true stop=tool_use tool_use=true 403ms
  [3/10] ok=true stop=tool_use tool_use=true 396ms
  [4/10] ok=true stop=tool_use tool_use=true 402ms
  [5/10] ok=true stop=tool_use tool_use=true 404ms
  [6/10] ok=true stop=tool_use tool_use=true 397ms
  [7/10] ok=true stop=tool_use tool_use=true 399ms
  [8/10] ok=true stop=tool_use tool_use=true 396ms
  [9/10] ok=true stop=tool_use tool_use=true 403ms
  [10/10] ok=true stop=tool_use tool_use=true 400ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 396ms · median 402ms · p95 593ms · mean 419ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4194.656646ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4196.671053ms)
ℹ tests 9
ℹ suites 9
ℹ pass 7
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 61324.975669

✖ failing tests:

test at __tests__/tier-eval/agent-parallel.test.js:32:3
✖ claw creates a.py, b.py, c.py with matching contents (4940.248361ms)
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
✖ claw creates hello.py with the requested content (676.607797ms)
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

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 0 |
| 32GB | 0 |
| 64GB | 1 |

