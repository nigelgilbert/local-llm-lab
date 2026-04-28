# Tier Eval Results — 2026-04-27 22:11

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-079b991da104 Creating 
 Container test-test-run-079b991da104 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=11609ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (11611.02449ms)
✔ agent: parallel file writes (tier=tier-16) (11611.857539ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=5671ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (5673.656827ms)
✔ agent: single-file write (tier=tier-16) (5674.327583ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=27100ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (27120.577267ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (27121.034729ms)
  [1/10] ttft=1944ms
  [2/10] ttft=67ms
  [3/10] ttft=65ms
  [4/10] ttft=66ms
  [5/10] ttft=64ms
  [6/10] ttft=64ms
  [7/10] ttft=64ms
  [8/10] ttft=65ms
  [9/10] ttft=65ms
  [10/10] ttft=66ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=64ms · median=65ms · p95=1944ms · mean=253ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (19660.151808ms)
✔ TTFT — time to first token (tier=tier-16) (19660.757063ms)
  [1/20] ok=true stop=tool_use 1782ms
  [2/20] ok=true stop=tool_use 1668ms
  [3/20] ok=false stop=max_tokens 3142ms
  [4/20] ok=true stop=tool_use 1867ms
  [5/20] ok=false stop=max_tokens 3144ms
  [6/20] ok=true stop=tool_use 1866ms
  [7/20] ok=true stop=tool_use 1777ms
  [8/20] ok=true stop=tool_use 1800ms
  [9/20] ok=true stop=tool_use 1861ms
  [10/20] ok=true stop=tool_use 1568ms
  [11/20] ok=true stop=tool_use 1678ms
  [12/20] ok=true stop=tool_use 1677ms
  [13/20] ok=true stop=tool_use 1861ms
  [14/20] ok=true stop=tool_use 1862ms
  [15/20] ok=true stop=tool_use 1859ms
  [16/20] ok=true stop=tool_use 1860ms
  [17/20] ok=true stop=tool_use 1776ms
  [18/20] ok=true stop=tool_use 1860ms
  [19/20] ok=true stop=tool_use 1676ms
  [20/20] ok=true stop=tool_use 1858ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 18/20 = 0.90  (threshold 0.9)
  latency   = min 1568ms · median 1859ms · p95 3144ms · mean 1922ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (38449.626619ms)
✔ tool-call roundtrip latency (tier=tier-16) (38449.857705ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 3149ms textLen=1393 newlines=14 bullets=4
  [2/3] stop=end_turn 3030ms textLen=1396 newlines=14 bullets=4
  [3/3] stop=end_turn 3077ms textLen=1410 newlines=14 bullets=4
  sample[0] (first 320 chars, \n literal):
    .onerror\n</think>\n\n## What Are React Components?\n\nReact components are the building blocks of a React application. They allow developers to create reusable UI elements that can be combined to build complex interfaces. Each component is a self-contained unit that manages its own logic, state, and rendering. This modular
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (9258.039486ms)
✔ prose quality via raw bridge (tier=tier-16) (9259.019995ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 9335ms rawLen=1530 cleanLen=1327 newlines=13 bullets=6
  [2/3] exit=0 8484ms rawLen=1696 cleanLen=1445 newlines=11 bullets=4
  [3/3] exit=0 7235ms rawLen=1669 cleanLen=1409 newlines=7 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?\n\nReact components are reusable building blocks for creating user interfaces. They allow developers to break down complex UIs into smaller, manageable pieces. Each component encapsulates HTML, CSS, and JavaScript logic, making code modular and easier to m
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (25054.731432ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (25055.035226ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=29430ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (29459.10638ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (29459.528383ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=false stop=max_tokens tool_use=false 3244ms
  [2/10] ok=false stop=max_tokens tool_use=false 3075ms
  [3/10] ok=true stop=tool_use tool_use=true 1435ms
  [4/10] ok=true stop=tool_use tool_use=true 1432ms
  [5/10] ok=true stop=tool_use tool_use=true 1751ms
  [6/10] ok=true stop=tool_use tool_use=true 1752ms
  [7/10] ok=true stop=tool_use tool_use=true 1432ms
  [8/10] ok=true stop=tool_use tool_use=true 1667ms
  [9/10] ok=false stop=max_tokens tool_use=false 3049ms
  [10/10] ok=false stop=max_tokens tool_use=false 3062ms
  rate    = 6/10 = 0.60  (threshold 0.9)
  latency = min 1432ms · median 1752ms · p95 3244ms · mean 2190ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (21900.163198ms)
✖ tool-call wrapping (tier=tier-16, bridge=claw-llama) (21901.253958ms)
ℹ tests 9
ℹ suites 9
ℹ pass 8
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 188391.524734

✖ failing tests:

test at __tests__/tier-eval/tool-discipline.test.js:41:3
✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (21900.163198ms)
  AssertionError [ERR_ASSERTION]: wrap rate 0.60 below threshold 0.9
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

## Tier 32GB

```
 Container test-test-run-281c96c43c47 Creating 
 Container test-test-run-281c96c43c47 Created 

=== agent-parallel (tier-32) ===
  exit=0 elapsed=19392ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (19393.637334ms)
✔ agent: parallel file writes (tier=tier-32) (19394.16488ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=11014ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (11016.590105ms)
✔ agent: single-file write (tier=tier-32) (11017.247152ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=31812ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (31835.210141ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (31835.744271ms)
  [1/10] ttft=3103ms
  [2/10] ttft=90ms
  [3/10] ttft=88ms
  [4/10] ttft=87ms
  [5/10] ttft=88ms
  [6/10] ttft=87ms
  [7/10] ttft=98ms
  [8/10] ttft=87ms
  [9/10] ttft=88ms
  [10/10] ttft=86ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=86ms · median=88ms · p95=3103ms · mean=390ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (30088.569256ms)
✔ TTFT — time to first token (tier=tier-32) (30089.206971ms)
  [1/20] ok=true stop=tool_use 2627ms
  [2/20] ok=true stop=tool_use 2460ms
  [3/20] ok=true stop=tool_use 2472ms
  [4/20] ok=true stop=tool_use 2217ms
  [5/20] ok=true stop=tool_use 2218ms
  [6/20] ok=true stop=tool_use 2465ms
  [7/20] ok=true stop=tool_use 2466ms
  [8/20] ok=true stop=tool_use 2210ms
  [9/20] ok=true stop=tool_use 2463ms
  [10/20] ok=true stop=tool_use 2457ms
  [11/20] ok=true stop=tool_use 2205ms
  [12/20] ok=true stop=tool_use 2200ms
  [13/20] ok=true stop=tool_use 2451ms
  [14/20] ok=true stop=tool_use 2483ms
  [15/20] ok=true stop=tool_use 2521ms
  [16/20] ok=true stop=tool_use 2243ms
  [17/20] ok=true stop=tool_use 2242ms
  [18/20] ok=true stop=tool_use 2509ms
  [19/20] ok=true stop=tool_use 2242ms
  [20/20] ok=true stop=tool_use 2525ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2200ms · median 2460ms · p95 2627ms · mean 2384ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (47679.254082ms)
✔ tool-call roundtrip latency (tier=tier-32) (47683.227802ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 12024ms textLen=3078 newlines=28 bullets=8
  [2/3] stop=end_turn 14224ms textLen=3655 newlines=34 bullets=8
  [3/3] stop=end_turn 19069ms textLen=4767 newlines=42 bullets=14
  sample[0] (first 320 chars, \n literal):
    markdown\nOkay, the user wants me to write a short markdown explainer about React components. Let's see, they specified two headers in ## style and at least four bullet points. The goal is around 250 words, so I need to be concise.\n\nFirst, I should start with an introduction header. Maybe "## What Are React Components?"
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (45318.727744ms)
✔ prose quality via raw bridge (tier=tier-32) (45319.280739ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 13249ms rawLen=1775 cleanLen=1518 newlines=7 bullets=3
  [2/3] exit=0 11737ms rawLen=1608 cleanLen=1411 newlines=7 bullets=3
  [3/3] exit=0 14769ms rawLen=1983 cleanLen=1720 newlines=7 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat is a React Component?A React component is a reusable, self-contained unit of code that defines how a part of a user interface (UI) should look and behave. Components are the building blocks of React applications, allowing developers to break down complex UIs into smaller, man
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (39755.341832ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (39755.527295ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=32497ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (32526.574297ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (32526.983894ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 2697ms
  [2/10] ok=true stop=tool_use tool_use=true 2438ms
  [3/10] ok=true stop=tool_use tool_use=true 2438ms
  [4/10] ok=true stop=tool_use tool_use=true 2417ms
  [5/10] ok=true stop=tool_use tool_use=true 2448ms
  [6/10] ok=true stop=tool_use tool_use=true 2457ms
  [7/10] ok=true stop=tool_use tool_use=true 2461ms
  [8/10] ok=true stop=tool_use tool_use=true 2400ms
  [9/10] ok=true stop=tool_use tool_use=true 2460ms
  [10/10] ok=true stop=tool_use tool_use=true 2464ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2400ms · median 2457ms · p95 2697ms · mean 2468ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (24681.078061ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (24681.829428ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 282507.36764
```

Exit code: 0

## Tier 64GB

```
 Container test-test-run-9abc85dbd1ab Creating 
 Container test-test-run-9abc85dbd1ab Created 

=== agent-parallel (tier-64) ===
  exit=0 elapsed=7110ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (7112.457475ms)
✔ agent: parallel file writes (tier=tier-64) (7113.221427ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1961ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1963.599822ms)
✔ agent: single-file write (tier=tier-64) (1964.392859ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=7147ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (7175.964577ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (7176.621899ms)
  [1/10] ttft=2388ms
  [2/10] ttft=81ms
  [3/10] ttft=87ms
  [4/10] ttft=85ms
  [5/10] ttft=88ms
  [6/10] ttft=87ms
  [7/10] ttft=135ms
  [8/10] ttft=79ms
  [9/10] ttft=72ms
  [10/10] ttft=88ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=72ms · median=87ms · p95=2388ms · mean=319ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5498.549007ms)
✔ TTFT — time to first token (tier=tier-64) (5499.46784ms)
  [1/20] ok=true stop=tool_use 547ms
  [2/20] ok=true stop=tool_use 396ms
  [3/20] ok=true stop=tool_use 395ms
  [4/20] ok=true stop=tool_use 397ms
  [5/20] ok=true stop=tool_use 393ms
  [6/20] ok=true stop=tool_use 396ms
  [7/20] ok=true stop=tool_use 396ms
  [8/20] ok=true stop=tool_use 398ms
  [9/20] ok=true stop=tool_use 396ms
  [10/20] ok=true stop=tool_use 397ms
  [11/20] ok=true stop=tool_use 397ms
  [12/20] ok=true stop=tool_use 397ms
  [13/20] ok=true stop=tool_use 399ms
  [14/20] ok=true stop=tool_use 394ms
  [15/20] ok=true stop=tool_use 397ms
  [16/20] ok=true stop=tool_use 396ms
  [17/20] ok=true stop=tool_use 398ms
  [18/20] ok=true stop=tool_use 392ms
  [19/20] ok=true stop=tool_use 391ms
  [20/20] ok=true stop=tool_use 398ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 391ms · median 397ms · p95 547ms · mean 404ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8075.602494ms)
✔ tool-call roundtrip latency (tier=tier-64) (8076.191646ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2836ms textLen=1482 newlines=16 bullets=4
  [2/3] stop=end_turn 2771ms textLen=1489 newlines=14 bullets=4
  [3/3] stop=end_turn 2554ms textLen=1426 newlines=14 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: The Building Blocks of Modern UI\n\nReact components are the fundamental units that make up React applications. They allow developers to break down complex user interfaces into reusable, manageable pieces.\n\n## What Are React Components?\n\nComponents in React can be thought of as custom HTML elements th
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8162.602459ms)
✔ prose quality via raw bridge (tier=tier-64) (8163.538835ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 3667ms rawLen=1635 cleanLen=1429 newlines=2 bullets=0
  [2/3] exit=0 3841ms rawLen=1754 cleanLen=1602 newlines=2 bullets=0
  [3/3] exit=0 4054ms rawLen=1823 cleanLen=1617 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: A Beginner’s GuideReact components are the fundamental building blocks of any React application. They allow you to split the UI into independent, reusable pieces, making your code more maintainable and scalable.What Are React Components?Components in React are essentially JavaScrip
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11563.507826ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (11563.859592ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=23402ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (23444.052831ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (23444.975694ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 613ms
  [2/10] ok=true stop=tool_use tool_use=true 398ms
  [3/10] ok=true stop=tool_use tool_use=true 399ms
  [4/10] ok=true stop=tool_use tool_use=true 397ms
  [5/10] ok=true stop=tool_use tool_use=true 396ms
  [6/10] ok=true stop=tool_use tool_use=true 397ms
  [7/10] ok=true stop=tool_use tool_use=true 399ms
  [8/10] ok=true stop=tool_use tool_use=true 397ms
  [9/10] ok=true stop=tool_use tool_use=true 400ms
  [10/10] ok=true stop=tool_use tool_use=true 396ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 396ms · median 398ms · p95 613ms · mean 419ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4193.629955ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4195.398213ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 77434.569849
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 1 |
| 32GB | 0 |
| 64GB | 0 |

