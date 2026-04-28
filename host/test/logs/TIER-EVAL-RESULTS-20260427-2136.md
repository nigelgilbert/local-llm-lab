# Tier Eval Results — 2026-04-27 21:36

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-7a9b35551697 Creating 
 Container test-test-run-7a9b35551697 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=19356ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (19357.556135ms)
✔ agent: parallel file writes (tier=tier-16) (19358.263882ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=10956ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (10957.940262ms)
✔ agent: single-file write (tier=tier-16) (10958.607967ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=39571ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (39596.068327ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (39596.522366ms)
  [1/10] ttft=3265ms
  [2/10] ttft=90ms
  [3/10] ttft=90ms
  [4/10] ttft=89ms
  [5/10] ttft=88ms
  [6/10] ttft=87ms
  [7/10] ttft=87ms
  [8/10] ttft=87ms
  [9/10] ttft=88ms
  [10/10] ttft=88ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=87ms · median=88ms · p95=3265ms · mean=406ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (30445.52179ms)
✔ TTFT — time to first token (tier=tier-16) (30446.237578ms)
  [1/20] ok=true stop=tool_use 2577ms
  [2/20] ok=true stop=tool_use 2467ms
  [3/20] ok=true stop=tool_use 2477ms
  [4/20] ok=true stop=tool_use 2211ms
  [5/20] ok=true stop=tool_use 2464ms
  [6/20] ok=true stop=tool_use 2468ms
  [7/20] ok=true stop=tool_use 2213ms
  [8/20] ok=true stop=tool_use 2206ms
  [9/20] ok=true stop=tool_use 2449ms
  [10/20] ok=true stop=tool_use 2202ms
  [11/20] ok=true stop=tool_use 2485ms
  [12/20] ok=true stop=tool_use 2447ms
  [13/20] ok=true stop=tool_use 2503ms
  [14/20] ok=true stop=tool_use 2194ms
  [15/20] ok=true stop=tool_use 2458ms
  [16/20] ok=true stop=tool_use 2203ms
  [17/20] ok=true stop=tool_use 2466ms
  [18/20] ok=true stop=tool_use 2450ms
  [19/20] ok=true stop=tool_use 2196ms
  [20/20] ok=true stop=tool_use 2202ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2194ms · median 2450ms · p95 2577ms · mean 2367ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (47345.206748ms)
✔ tool-call roundtrip latency (tier=tier-16) (47345.536289ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 4857ms textLen=1386 newlines=22 bullets=8
  [2/3] stop=end_turn 15880ms textLen=4053 newlines=42 bullets=16
  [3/3] stop=end_turn 16716ms textLen=4222 newlines=34 bullets=8
  sample[0] (first 320 chars, \n literal):
    moil\n\n</think>\n\n## What Are React Components?\n\nReact components are the building blocks of React applications. They allow developers to break down complex UIs into smaller, reusable pieces. Each component manages its own logic and rendering, making it easier to maintain and scale applications.\n\n- Components can be writ
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (37455.012136ms)
✔ prose quality via raw bridge (tier=tier-16) (37455.615009ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 19259ms rawLen=1795 cleanLen=1496 newlines=7 bullets=3
  [2/3] exit=0 14010ms rawLen=2052 cleanLen=1699 newlines=10 bullets=6
  [3/3] exit=0 16417ms rawLen=2176 cleanLen=1877 newlines=10 bullets=6
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They act as reusable, self-contained units of code that encapsulate logic, state, and rendering. Components can be as simple as a button or as complex as a dynamic form, an
  (informational only — claw's renderer strips header markers without preserving \n; see TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (49686.476465ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (49686.664923ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=30518ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (30549.107279ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (30549.595235ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 2671ms
  [2/10] ok=true stop=tool_use tool_use=true 2443ms
  [3/10] ok=true stop=tool_use tool_use=true 2439ms
  [4/10] ok=true stop=tool_use tool_use=true 2439ms
  [5/10] ok=true stop=tool_use tool_use=true 2438ms
  [6/10] ok=true stop=tool_use tool_use=true 2448ms
  [7/10] ok=true stop=tool_use tool_use=true 2506ms
  [8/10] ok=true stop=tool_use tool_use=true 2529ms
  [9/10] ok=true stop=tool_use tool_use=true 2518ms
  [10/10] ok=true stop=tool_use tool_use=true 2493ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2438ms · median 2493ms · p95 2671ms · mean 2492ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (24925.717694ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (24926.434399ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 290528.184888
```

Exit code: 0

## Tier 32GB

```
 Container test-test-run-40787d4c329e Creating 
 Container test-test-run-40787d4c329e Created 

=== agent-parallel (tier-32) ===
  exit=0 elapsed=5079ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (5080.820735ms)
✔ agent: parallel file writes (tier=tier-32) (5081.502108ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=1161ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (1163.202701ms)
✔ agent: single-file write (tier=tier-32) (1164.241988ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=6853ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (6879.340054ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (6879.913343ms)
  [1/10] ttft=1706ms
  [2/10] ttft=114ms
  [3/10] ttft=120ms
  [4/10] ttft=121ms
  [5/10] ttft=119ms
  [6/10] ttft=120ms
  [7/10] ttft=121ms
  [8/10] ttft=122ms
  [9/10] ttft=119ms
  [10/10] ttft=120ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=114ms · median=120ms · p95=1706ms · mean=278ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4095.160111ms)
✔ TTFT — time to first token (tier=tier-32) (4098.410512ms)
  [1/20] ok=true stop=tool_use 361ms
  [2/20] ok=true stop=tool_use 282ms
  [3/20] ok=true stop=tool_use 281ms
  [4/20] ok=true stop=tool_use 280ms
  [5/20] ok=true stop=tool_use 278ms
  [6/20] ok=true stop=tool_use 279ms
  [7/20] ok=true stop=tool_use 280ms
  [8/20] ok=true stop=tool_use 282ms
  [9/20] ok=true stop=tool_use 280ms
  [10/20] ok=true stop=tool_use 280ms
  [11/20] ok=true stop=tool_use 281ms
  [12/20] ok=true stop=tool_use 279ms
  [13/20] ok=true stop=tool_use 279ms
  [14/20] ok=true stop=tool_use 280ms
  [15/20] ok=true stop=tool_use 280ms
  [16/20] ok=true stop=tool_use 282ms
  [17/20] ok=true stop=tool_use 279ms
  [18/20] ok=true stop=tool_use 280ms
  [19/20] ok=true stop=tool_use 280ms
  [20/20] ok=true stop=tool_use 280ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 278ms · median 280ms · p95 361ms · mean 284ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (5686.079829ms)
✔ tool-call roundtrip latency (tier=tier-32) (5686.439494ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 2640ms textLen=1632 newlines=13 bullets=4
  [2/3] stop=end_turn 2499ms textLen=1595 newlines=13 bullets=4
  [3/3] stop=end_turn 2753ms textLen=1767 newlines=16 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable building blocks that define parts of a user interface. They encapsulate HTML, CSS, and JavaScript logic into self-contained units, making it easier to manage complex UIs by breaking them down into smaller, manageable pieces. Think of components as functions t
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7893.893542ms)
✔ prose quality via raw bridge (tier=tier-32) (7895.38741ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 3775ms rawLen=1893 cleanLen=1711 newlines=5 bullets=3
  [2/3] exit=0 3836ms rawLen=1967 cleanLen=1785 newlines=5 bullets=3
  [3/3] exit=0 3444ms rawLen=1777 cleanLen=1595 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the building blocks of user interfaces in React applications. They are reusable, self-contained pieces of code that encapsulate both the structure (UI) and behavior (logic) of a specific part of the application. Think of components as custom HTML-like e
  (informational only — claw's renderer strips header markers without preserving \n; see TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11055.560865ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (11055.86178ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=6177ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (6211.578048ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (6212.020464ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 441ms
  [2/10] ok=true stop=tool_use tool_use=true 284ms
  [3/10] ok=true stop=tool_use tool_use=true 284ms
  [4/10] ok=true stop=tool_use tool_use=true 282ms
  [5/10] ok=true stop=tool_use tool_use=true 283ms
  [6/10] ok=true stop=tool_use tool_use=true 283ms
  [7/10] ok=true stop=tool_use tool_use=true 285ms
  [8/10] ok=true stop=tool_use tool_use=true 282ms
  [9/10] ok=true stop=tool_use tool_use=true 283ms
  [10/10] ok=true stop=tool_use tool_use=true 278ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 278ms · median 283ms · p95 441ms · mean 299ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (2986.544777ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (2988.374559ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 51276.199602
```

Exit code: 0

## Tier 64GB

```
 Container test-test-run-1cc7de937f16 Creating 
 Container test-test-run-1cc7de937f16 Created 

=== agent-parallel (tier-64) ===
  exit=0 elapsed=7602ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (7603.258877ms)
✔ agent: parallel file writes (tier=tier-64) (7603.944332ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=932ms files=[".claw"]
▶ agent: single-file write (tier=tier-64)
  ✖ claw creates hello.py with the requested content (933.957704ms)
✖ agent: single-file write (tier=tier-64) (935.175907ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=11507ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (11526.401021ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (11526.939602ms)
  [1/10] ttft=2384ms
  [2/10] ttft=148ms
  [3/10] ttft=84ms
  [4/10] ttft=85ms
  [5/10] ttft=82ms
  [6/10] ttft=84ms
  [7/10] ttft=77ms
  [8/10] ttft=81ms
  [9/10] ttft=84ms
  [10/10] ttft=76ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=76ms · median=84ms · p95=2384ms · mean=319ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5480.691223ms)
✔ TTFT — time to first token (tier=tier-64) (5481.527677ms)
  [1/20] ok=true stop=tool_use 525ms
  [2/20] ok=true stop=tool_use 389ms
  [3/20] ok=true stop=tool_use 391ms
  [4/20] ok=true stop=tool_use 391ms
  [5/20] ok=true stop=tool_use 389ms
  [6/20] ok=true stop=tool_use 390ms
  [7/20] ok=true stop=tool_use 390ms
  [8/20] ok=true stop=tool_use 389ms
  [9/20] ok=true stop=tool_use 390ms
  [10/20] ok=true stop=tool_use 389ms
  [11/20] ok=true stop=tool_use 389ms
  [12/20] ok=true stop=tool_use 389ms
  [13/20] ok=true stop=tool_use 392ms
  [14/20] ok=true stop=tool_use 390ms
  [15/20] ok=true stop=tool_use 390ms
  [16/20] ok=true stop=tool_use 390ms
  [17/20] ok=true stop=tool_use 391ms
  [18/20] ok=true stop=tool_use 392ms
  [19/20] ok=true stop=tool_use 389ms
  [20/20] ok=true stop=tool_use 392ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 389ms · median 390ms · p95 525ms · mean 397ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (7939.316418ms)
✔ tool-call roundtrip latency (tier=tier-64) (7939.642916ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2743ms textLen=1443 newlines=14 bullets=4
  [2/3] stop=end_turn 2707ms textLen=1509 newlines=14 bullets=4
  [3/3] stop=end_turn 2863ms textLen=1579 newlines=14 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: The Building Blocks of Modern UI\n\nReact components are the fundamental units of any React application. They allow you to split your user interface into independent, reusable pieces that manage their own state and logic.\n\n## What Makes Components Special\n\n• **Reusable Code**: Components can be used m
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8314.816724ms)
✔ prose quality via raw bridge (tier=tier-64) (8315.821677ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 3252ms rawLen=1474 cleanLen=1304 newlines=5 bullets=3
  [2/3] exit=0 3582ms rawLen=1684 cleanLen=1478 newlines=2 bullets=0
  [3/3] exit=0 3497ms rawLen=1644 cleanLen=1474 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: Building Blocks of Modern Web AppsReact components are the fundamental units of user interfaces in React applications. They allow developers to break down complex UIs into reusable, self-contained pieces that manage their own state and rendering logic.What Are React Components?• Re
  (informational only — claw's renderer strips header markers without preserving \n; see TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (10332.282881ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (10332.67038ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=20359ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (20400.46693ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (20401.712508ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 612ms
  [2/10] ok=true stop=tool_use tool_use=true 395ms
  [3/10] ok=true stop=tool_use tool_use=true 394ms
  [4/10] ok=true stop=tool_use tool_use=true 395ms
  [5/10] ok=true stop=tool_use tool_use=true 394ms
  [6/10] ok=true stop=tool_use tool_use=true 394ms
  [7/10] ok=true stop=tool_use tool_use=true 394ms
  [8/10] ok=true stop=tool_use tool_use=true 393ms
  [9/10] ok=true stop=tool_use tool_use=true 395ms
  [10/10] ok=true stop=tool_use tool_use=true 393ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 393ms · median 394ms · p95 612ms · mean 416ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4160.984928ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4163.207293ms)
ℹ tests 9
ℹ suites 9
ℹ pass 8
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 76911.715292

✖ failing tests:

test at __tests__/tier-eval/agent-single.test.js:18:3
✖ claw creates hello.py with the requested content (933.957704ms)
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

