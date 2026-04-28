# Tier Eval Results — 2026-04-27 21:44

Tiers: 64

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-fc2f00657037 Creating 
 Container test-test-run-fc2f00657037 Created 

=== agent-parallel (tier-64) ===
  exit=0 elapsed=6986ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (6988.21142ms)
✔ agent: parallel file writes (tier=tier-64) (6988.983958ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=938ms files=[".claw"]
▶ agent: single-file write (tier=tier-64)
  ✖ claw creates hello.py with the requested content (941.886916ms)
✖ agent: single-file write (tier=tier-64) (943.238535ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=6691ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (6717.16308ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (6717.755744ms)
  [1/10] ttft=2373ms
  [2/10] ttft=78ms
  [3/10] ttft=82ms
  [4/10] ttft=139ms
  [5/10] ttft=73ms
  [6/10] ttft=85ms
  [7/10] ttft=83ms
  [8/10] ttft=82ms
  [9/10] ttft=73ms
  [10/10] ttft=74ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=73ms · median=82ms · p95=2373ms · mean=314ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5443.637276ms)
✔ TTFT — time to first token (tier=tier-64) (5444.729439ms)
  [1/20] ok=true stop=tool_use 526ms
  [2/20] ok=true stop=tool_use 393ms
  [3/20] ok=true stop=tool_use 395ms
  [4/20] ok=true stop=tool_use 393ms
  [5/20] ok=true stop=tool_use 393ms
  [6/20] ok=true stop=tool_use 393ms
  [7/20] ok=true stop=tool_use 394ms
  [8/20] ok=true stop=tool_use 395ms
  [9/20] ok=true stop=tool_use 393ms
  [10/20] ok=true stop=tool_use 395ms
  [11/20] ok=true stop=tool_use 394ms
  [12/20] ok=true stop=tool_use 393ms
  [13/20] ok=true stop=tool_use 400ms
  [14/20] ok=true stop=tool_use 393ms
  [15/20] ok=true stop=tool_use 398ms
  [16/20] ok=true stop=tool_use 394ms
  [17/20] ok=true stop=tool_use 395ms
  [18/20] ok=true stop=tool_use 397ms
  [19/20] ok=true stop=tool_use 394ms
  [20/20] ok=true stop=tool_use 395ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 393ms · median 394ms · p95 526ms · mean 401ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8028.027128ms)
✔ tool-call roundtrip latency (tier=tier-64) (8028.381377ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2775ms textLen=1525 newlines=16 bullets=4
  [2/3] stop=end_turn 2612ms textLen=1420 newlines=12 bullets=4
  [3/3] stop=end_turn 2518ms textLen=1333 newlines=12 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: The Building Blocks of Modern UI\n\nReact components are the fundamental units that make up React applications. They allow developers to break down complex user interfaces into reusable, manageable pieces.\n\n## What Are React Components?\n\nComponents in React can be thought of as custom HTML elements th
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7905.795749ms)
✔ prose quality via raw bridge (tier=tier-64) (7906.756869ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4041ms rawLen=1756 cleanLen=1586 newlines=2 bullets=0
  [2/3] exit=0 3756ms rawLen=1712 cleanLen=1560 newlines=2 bullets=0
  [3/3] exit=0 3909ms rawLen=1721 cleanLen=1569 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: Building Blocks of Modern Web AppsReact components are the fundamental building blocks of user interfaces in modern web development. They allow developers to create reusable, self-contained pieces of code that manage their own state and rendering logic.What Are React Components?Rea
  (informational only — claw's renderer strips header markers without preserving \n; see TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11706.982466ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (11707.343589ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=26237ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (26278.416082ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (26279.232745ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 624ms
  [2/10] ok=true stop=tool_use tool_use=true 395ms
  [3/10] ok=true stop=tool_use tool_use=true 391ms
  [4/10] ok=true stop=tool_use tool_use=true 395ms
  [5/10] ok=true stop=tool_use tool_use=true 394ms
  [6/10] ok=true stop=tool_use tool_use=true 395ms
  [7/10] ok=true stop=tool_use tool_use=true 394ms
  [8/10] ok=true stop=tool_use tool_use=true 396ms
  [9/10] ok=true stop=tool_use tool_use=true 395ms
  [10/10] ok=true stop=tool_use tool_use=true 394ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 391ms · median 395ms · p95 624ms · mean 417ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4175.804402ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4176.933105ms)
ℹ tests 9
ℹ suites 9
ℹ pass 8
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 78430.162074

✖ failing tests:

test at __tests__/tier-eval/agent-single.test.js:18:3
✖ claw creates hello.py with the requested content (941.886916ms)
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
| 64GB | 1 |

