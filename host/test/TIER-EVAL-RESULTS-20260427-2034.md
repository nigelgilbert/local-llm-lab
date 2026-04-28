# Tier Eval Results — 2026-04-27 20:34

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-19a72c724d12 Creating 
 Container test-test-run-19a72c724d12 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=33022ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (33023.388319ms)
✔ agent: parallel file writes (tier=tier-16) (33023.932745ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=19763ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (19765.656543ms)
✔ agent: single-file write (tier=tier-16) (19766.24822ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=66659ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (66678.53934ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (66679.032012ms)
  [1/10] ttft=3347ms
  [2/10] ttft=192ms
  [3/10] ttft=192ms
  [4/10] ttft=186ms
  [5/10] ttft=185ms
  [6/10] ttft=186ms
  [7/10] ttft=189ms
  [8/10] ttft=189ms
  [9/10] ttft=157ms
  [10/10] ttft=172ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=157ms · median=189ms · p95=3347ms · mean=500ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (61645.567775ms)
✔ TTFT — time to first token (tier=tier-16) (61646.253157ms)
  [1/20] ok=false stop=max_tokens 10931ms
  [2/20] ok=false stop=max_tokens 10655ms
  [3/20] ok=false stop=max_tokens 11675ms
  [4/20] ok=false stop=max_tokens 10713ms
  [5/20] ok=false stop=max_tokens 9640ms
  [6/20] ok=true stop=tool_use 5059ms
  [7/20] ok=false stop=max_tokens 9660ms
  [8/20] ok=false stop=max_tokens 9654ms
  [9/20] ok=false stop=max_tokens 9634ms
  [10/20] ok=false stop=max_tokens 9659ms
  [11/20] ok=true stop=tool_use 6051ms
  [12/20] ok=false stop=max_tokens 9696ms
  [13/20] ok=false stop=max_tokens 9657ms
  [14/20] ok=false stop=max_tokens 9661ms
  [15/20] ok=false stop=max_tokens 8620ms
  [16/20] ok=false stop=max_tokens 6935ms
  [17/20] ok=false stop=max_tokens 6948ms
  [18/20] ok=false stop=max_tokens 10239ms
  [19/20] ok=false stop=max_tokens 7482ms
  [20/20] ok=false stop=max_tokens 7498ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 2/20 = 0.10  (threshold 0.9)
  latency   = min 5059ms · median 9657ms · p95 11675ms · mean 9003ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (180069.280821ms)
✖ tool-call roundtrip latency (tier=tier-16) (180070.285454ms)

=== prose-quality (tier-16) ===
  [1/3] exit=0 17237ms rawLen=2827 cleanLen=1484 newlines=17 bullets=4
  [2/3] exit=0 14334ms rawLen=2126 cleanLen=1779 newlines=10 bullets=6
  [3/3] exit=0 15417ms rawLen=1909 cleanLen=1634 newlines=4 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n shown literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\n╭─ markdown\n## What Are React Components?\n\nReact components are the building blocks of user interfaces in React applications. They act as independent, reusable pieces of code that encapsulate logic, styling, and rendering functionality. Think of them as "custom HTML elements" that
▶ prose quality via claw (tier=tier-16)
  ✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (46991.355241ms)
✖ prose quality via claw (tier=tier-16) (46992.11283ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=27982ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (28014.289064ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (28014.677484ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=false stop=max_tokens tool_use=false 4997ms
  [2/10] ok=false stop=max_tokens tool_use=false 4964ms
  [3/10] ok=false stop=max_tokens tool_use=false 4952ms
  [4/10] ok=false stop=max_tokens tool_use=false 4988ms
  [5/10] ok=false stop=max_tokens tool_use=false 4993ms
  [6/10] ok=false stop=max_tokens tool_use=false 4985ms
  [7/10] ok=false stop=max_tokens tool_use=false 5016ms
  [8/10] ok=false stop=max_tokens tool_use=false 5055ms
  [9/10] ok=false stop=max_tokens tool_use=false 4978ms
  [10/10] ok=false stop=max_tokens tool_use=false 4980ms
  rate    = 0/10 = 0.00  (threshold 0.9)
  latency = min 4952ms · median 4988ms · p95 5055ms · mean 4991ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (49912.762528ms)
✖ tool-call wrapping (tier=tier-16, bridge=claw-llama) (49913.842285ms)
ℹ tests 8
ℹ suites 8
ℹ pass 5
ℹ fail 3
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 486299.591312

✖ failing tests:

test at __tests__/tier-eval/latency.test.js:193:3
✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (180069.280821ms)
  AssertionError [ERR_ASSERTION]: wrap rate 0.10 below threshold 0.9 — grammar may have regressed
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
✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (46991.355241ms)
  AssertionError [ERR_ASSERTION]: [3] markdown smush: 4 newlines in 1634 chars
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

test at __tests__/tier-eval/tool-discipline.test.js:41:3
✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (49912.762528ms)
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

Exit code: 0

## Tier 32GB

```
 Container test-test-run-26db020688dc Creating 
 Container test-test-run-26db020688dc Created 

=== agent-parallel (tier-32) ===
  exit=0 elapsed=5077ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (5079.08738ms)
✔ agent: parallel file writes (tier=tier-32) (5079.735302ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=1361ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (1362.484649ms)
✔ agent: single-file write (tier=tier-32) (1363.30203ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=6897ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (6923.815058ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (6924.360354ms)
  [1/10] ttft=1713ms
  [2/10] ttft=131ms
  [3/10] ttft=119ms
  [4/10] ttft=122ms
  [5/10] ttft=120ms
  [6/10] ttft=122ms
  [7/10] ttft=112ms
  [8/10] ttft=122ms
  [9/10] ttft=120ms
  [10/10] ttft=120ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=112ms · median=122ms · p95=1713ms · mean=280ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4108.451567ms)
✔ TTFT — time to first token (tier=tier-32) (4111.028586ms)
  [1/20] ok=true stop=tool_use 363ms
  [2/20] ok=true stop=tool_use 281ms
  [3/20] ok=true stop=tool_use 282ms
  [4/20] ok=true stop=tool_use 280ms
  [5/20] ok=true stop=tool_use 282ms
  [6/20] ok=true stop=tool_use 279ms
  [7/20] ok=true stop=tool_use 279ms
  [8/20] ok=true stop=tool_use 282ms
  [9/20] ok=true stop=tool_use 279ms
  [10/20] ok=true stop=tool_use 286ms
  [11/20] ok=true stop=tool_use 282ms
  [12/20] ok=true stop=tool_use 282ms
  [13/20] ok=true stop=tool_use 282ms
  [14/20] ok=true stop=tool_use 281ms
  [15/20] ok=true stop=tool_use 279ms
  [16/20] ok=true stop=tool_use 281ms
  [17/20] ok=true stop=tool_use 284ms
  [18/20] ok=true stop=tool_use 283ms
  [19/20] ok=true stop=tool_use 282ms
  [20/20] ok=true stop=tool_use 280ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 279ms · median 282ms · p95 363ms · mean 285ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (5723.786237ms)
✔ tool-call roundtrip latency (tier=tier-32) (5724.147073ms)

=== prose-quality (tier-32) ===
  [1/3] exit=0 3777ms rawLen=1956 cleanLen=1747 newlines=2 bullets=0
  [2/3] exit=0 3714ms rawLen=1986 cleanLen=1777 newlines=2 bullets=0
  [3/3] exit=0 4022ms rawLen=2146 cleanLen=1949 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n shown literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable building blocks that define parts of a user interface in JavaScript or JSX. They encapsulate HTML-like syntax along with logic to manage state and interactions, making UI development modular and maintainable. Think of them as self-contained fun
▶ prose quality via claw (tier=tier-32)
  ✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (11516.182958ms)
✖ prose quality via claw (tier=tier-32) (11517.215341ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=5818ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (5861.273915ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (5861.866961ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 476ms
  [2/10] ok=true stop=tool_use tool_use=true 284ms
  [3/10] ok=true stop=tool_use tool_use=true 282ms
  [4/10] ok=true stop=tool_use tool_use=true 281ms
  [5/10] ok=true stop=tool_use tool_use=true 281ms
  [6/10] ok=true stop=tool_use tool_use=true 283ms
  [7/10] ok=true stop=tool_use tool_use=true 283ms
  [8/10] ok=true stop=tool_use tool_use=true 282ms
  [9/10] ok=true stop=tool_use tool_use=true 281ms
  [10/10] ok=true stop=tool_use tool_use=true 280ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 280ms · median 282ms · p95 476ms · mean 301ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (3015.129605ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (3016.242614ms)
ℹ tests 8
ℹ suites 8
ℹ pass 7
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 43818.882329

✖ failing tests:

test at __tests__/tier-eval/prose-quality.test.js:31:3
✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (11516.182958ms)
  AssertionError [ERR_ASSERTION]: [1] markdown smush: 2 newlines in 1747 chars
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

Exit code: 0

## Tier 64GB

```
 Container test-test-run-2bd57fdf45b8 Creating 
 Container test-test-run-2bd57fdf45b8 Created 

=== agent-parallel (tier-64) ===
  exit=0 elapsed=7355ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (7356.832667ms)
✔ agent: parallel file writes (tier=tier-64) (7357.487256ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=2064ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (2066.881172ms)
✔ agent: single-file write (tier=tier-64) (2067.633261ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=8152ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (8178.108378ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (8178.708132ms)
  [1/10] ttft=2393ms
  [2/10] ttft=85ms
  [3/10] ttft=65ms
  [4/10] ttft=74ms
  [5/10] ttft=82ms
  [6/10] ttft=148ms
  [7/10] ttft=74ms
  [8/10] ttft=85ms
  [9/10] ttft=75ms
  [10/10] ttft=78ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=65ms · median=82ms · p95=2393ms · mean=316ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5695.319143ms)
✔ TTFT — time to first token (tier=tier-64) (5697.109074ms)
  [1/20] ok=true stop=tool_use 545ms
  [2/20] ok=true stop=tool_use 390ms
  [3/20] ok=true stop=tool_use 389ms
  [4/20] ok=true stop=tool_use 394ms
  [5/20] ok=true stop=tool_use 389ms
  [6/20] ok=false stop=end_turn 296ms
  [7/20] ok=true stop=tool_use 395ms
  [8/20] ok=true stop=tool_use 397ms
  [9/20] ok=true stop=tool_use 397ms
  [10/20] ok=true stop=tool_use 396ms
  [11/20] ok=true stop=tool_use 403ms
  [12/20] ok=true stop=tool_use 397ms
  [13/20] ok=true stop=tool_use 393ms
  [14/20] ok=true stop=tool_use 399ms
  [15/20] ok=true stop=tool_use 396ms
  [16/20] ok=true stop=tool_use 394ms
  [17/20] ok=true stop=tool_use 403ms
  [18/20] ok=true stop=tool_use 394ms
  [19/20] ok=true stop=tool_use 394ms
  [20/20] ok=true stop=tool_use 404ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 19/20 = 0.95  (threshold 0.9)
  latency   = min 296ms · median 396ms · p95 545ms · mean 398ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (7970.1047ms)
✔ tool-call roundtrip latency (tier=tier-64) (7970.465454ms)

=== prose-quality (tier-64) ===
  [1/3] exit=0 3292ms rawLen=1478 cleanLen=1326 newlines=2 bullets=0
  [2/3] exit=0 3275ms rawLen=1520 cleanLen=1368 newlines=5 bullets=3
  [3/3] exit=0 3673ms rawLen=1661 cleanLen=1494 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n shown literal):
    7⠋ 🦀 Thinking...8React Components ExplainedReact components are the fundamental building blocks of any React application. They allow developers to create reusable UI elements that manage their own state and render themselves to the screen.What Are React Components?• Components are functions or classes - React compon
▶ prose quality via claw (tier=tier-64)
  ✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (10243.503288ms)
✖ prose quality via claw (tier=tier-64) (10244.604088ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=16242ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (16279.96663ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (16280.66701ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 606ms
  [2/10] ok=true stop=tool_use tool_use=true 395ms
  [3/10] ok=true stop=tool_use tool_use=true 398ms
  [4/10] ok=true stop=tool_use tool_use=true 400ms
  [5/10] ok=true stop=tool_use tool_use=true 391ms
  [6/10] ok=true stop=tool_use tool_use=true 392ms
  [7/10] ok=true stop=tool_use tool_use=true 392ms
  [8/10] ok=true stop=tool_use tool_use=true 397ms
  [9/10] ok=true stop=tool_use tool_use=true 394ms
  [10/10] ok=true stop=tool_use tool_use=true 397ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 391ms · median 397ms · p95 606ms · mean 416ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4164.274494ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4165.141793ms)
ℹ tests 8
ℹ suites 8
ℹ pass 7
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 62187.838258

✖ failing tests:

test at __tests__/tier-eval/prose-quality.test.js:31:3
✖ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (10243.503288ms)
  AssertionError [ERR_ASSERTION]: [1] markdown smush: 2 newlines in 1326 chars
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

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 0 |
| 32GB | 0 |
| 64GB | 0 |

