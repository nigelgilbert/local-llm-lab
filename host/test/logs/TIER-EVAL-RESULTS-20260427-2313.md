# Tier Eval Results — 2026-04-27 23:13

Tiers: 32 64

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 32GB

```
 Container test-test-run-a96ff7065799 Creating 
 Container test-test-run-a96ff7065799 Created 

=== agent-parallel (tier-32) ===
  exit=0 elapsed=18576ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (18577.881826ms)
✔ agent: parallel file writes (tier=tier-32) (18578.476135ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=7965ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (7967.551908ms)
✔ agent: single-file write (tier=tier-32) (7968.670612ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=30469ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (30495.563869ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (30495.991612ms)
  [1/10] ttft=3114ms
  [2/10] ttft=90ms
  [3/10] ttft=88ms
  [4/10] ttft=87ms
  [5/10] ttft=88ms
  [6/10] ttft=87ms
  [7/10] ttft=87ms
  [8/10] ttft=92ms
  [9/10] ttft=88ms
  [10/10] ttft=87ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=87ms · median=88ms · p95=3114ms · mean=391ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (30520.445475ms)
✔ TTFT — time to first token (tier=tier-32) (30521.196294ms)
  [1/20] ok=true stop=tool_use 2690ms
  [2/20] ok=true stop=tool_use 2220ms
  [3/20] ok=true stop=tool_use 2218ms
  [4/20] ok=true stop=tool_use 2209ms
  [5/20] ok=true stop=tool_use 2212ms
  [6/20] ok=true stop=tool_use 2457ms
  [7/20] ok=true stop=tool_use 2464ms
  [8/20] ok=true stop=tool_use 2458ms
  [9/20] ok=true stop=tool_use 2455ms
  [10/20] ok=true stop=tool_use 2449ms
  [11/20] ok=true stop=tool_use 2203ms
  [12/20] ok=true stop=tool_use 2202ms
  [13/20] ok=true stop=tool_use 2200ms
  [14/20] ok=true stop=tool_use 2453ms
  [15/20] ok=true stop=tool_use 2194ms
  [16/20] ok=true stop=tool_use 2198ms
  [17/20] ok=true stop=tool_use 2447ms
  [18/20] ok=true stop=tool_use 2447ms
  [19/20] ok=true stop=tool_use 2194ms
  [20/20] ok=true stop=tool_use 2195ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2194ms · median 2220ms · p95 2690ms · mean 2328ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (46576.250418ms)
✔ tool-call roundtrip latency (tier=tier-32) (46576.563578ms)

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=68673ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-32)
  ✔ claw renames across files and updates the call site (68703.782609ms)
✔ multi-file rename + signature change (tier=tier-32) (68704.217315ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 14815ms textLen=3721 newlines=31 bullets=8
  [2/3] stop=end_turn 13127ms textLen=3386 newlines=32 bullets=8
  [3/3] stop=end_turn 10363ms textLen=2722 newlines=26 bullets=8
  sample[0] (first 320 chars, \n literal):
    -text\n\nOkay, the user wants me to write a short markdown explainer about React components. Let me start by understanding the requirements. They specified two headers in ## style, at least four bullet points, around 250 words, and no tool calls.\n\nFirst, I need to structure the markdown with two sections. Maybe start wit
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (38306.42379ms)
✔ prose quality via raw bridge (tier=tier-32) (38307.122368ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 18657ms rawLen=2123 cleanLen=1833 newlines=14 bullets=8
  [2/3] exit=0 14470ms rawLen=2193 cleanLen=1876 newlines=10 bullets=6
  [3/3] exit=0 16432ms rawLen=2199 cleanLen=1915 newlines=10 bullets=6
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They act as reusable, self-contained units that encapsulate logic, state, and rendering. Components can represent anything from a simple button to complex forms or entire p
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (49559.778254ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (49559.979293ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=38981ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (39008.323606ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (39008.737519ms)

=== subtle-bug (tier-32) ===
  claw: exit=0 elapsed=59517ms files=[".claw","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-32)
  ✔ claw fixes median.js so its assertions pass (59548.898437ms)
✔ subtle bug: default-sort lexicographic (tier=tier-32) (59549.288061ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 2698ms
  [2/10] ok=true stop=tool_use tool_use=true 2400ms
  [3/10] ok=true stop=tool_use tool_use=true 2455ms
  [4/10] ok=true stop=tool_use tool_use=true 2444ms
  [5/10] ok=true stop=tool_use tool_use=true 2449ms
  [6/10] ok=true stop=tool_use tool_use=true 2465ms
  [7/10] ok=true stop=tool_use tool_use=true 2482ms
  [8/10] ok=true stop=tool_use tool_use=true 2480ms
  [9/10] ok=true stop=tool_use tool_use=true 2422ms
  [10/10] ok=true stop=tool_use tool_use=true 2513ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2400ms · median 2465ms · p95 2698ms · mean 2481ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (24809.589639ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (24810.236765ms)
ℹ tests 11
ℹ suites 11
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 414319.608161
```

Exit code: 0

## Tier 64GB

```
 Container test-test-run-5fec68cc5f48 Creating 
 Container test-test-run-5fec68cc5f48 Created 

=== agent-parallel (tier-64) ===
  exit=0 elapsed=7474ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (7476.193323ms)
✔ agent: parallel file writes (tier=tier-64) (7476.925157ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1777ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1779.648875ms)
✔ agent: single-file write (tier=tier-64) (1780.336708ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=6992ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (7017.343393ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (7017.903769ms)
  [1/10] ttft=2388ms
  [2/10] ttft=86ms
  [3/10] ttft=73ms
  [4/10] ttft=87ms
  [5/10] ttft=150ms
  [6/10] ttft=74ms
  [7/10] ttft=74ms
  [8/10] ttft=86ms
  [9/10] ttft=72ms
  [10/10] ttft=77ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=72ms · median=86ms · p95=2388ms · mean=317ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5478.341153ms)
✔ TTFT — time to first token (tier=tier-64) (5479.34407ms)
  [1/20] ok=true stop=tool_use 529ms
  [2/20] ok=true stop=tool_use 398ms
  [3/20] ok=true stop=tool_use 395ms
  [4/20] ok=true stop=tool_use 395ms
  [5/20] ok=true stop=tool_use 393ms
  [6/20] ok=true stop=tool_use 392ms
  [7/20] ok=true stop=tool_use 398ms
  [8/20] ok=true stop=tool_use 400ms
  [9/20] ok=true stop=tool_use 400ms
  [10/20] ok=true stop=tool_use 413ms
  [11/20] ok=true stop=tool_use 392ms
  [12/20] ok=true stop=tool_use 397ms
  [13/20] ok=true stop=tool_use 395ms
  [14/20] ok=true stop=tool_use 393ms
  [15/20] ok=true stop=tool_use 394ms
  [16/20] ok=true stop=tool_use 393ms
  [17/20] ok=true stop=tool_use 393ms
  [18/20] ok=true stop=tool_use 394ms
  [19/20] ok=true stop=tool_use 394ms
  [20/20] ok=true stop=tool_use 393ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 392ms · median 395ms · p95 529ms · mean 403ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8055.971196ms)
✔ tool-call roundtrip latency (tier=tier-64) (8056.452488ms)
▶ multi-file rename + signature change (tier=tier-64)
  ✖ claw renames across files and updates the call site (240039.040182ms)
✖ multi-file rename + signature change (tier=tier-64) (240043.226122ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2874ms textLen=1300 newlines=12 bullets=4
  [2/3] stop=end_turn 2855ms textLen=1511 newlines=14 bullets=4
  [3/3] stop=end_turn 2682ms textLen=1412 newlines=14 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: The Building Blocks of Modern UI\n\nReact components are the fundamental units that make up React applications. They allow developers to create reusable, self-contained pieces of user interface that can be composed together to build complex applications.\n\n## What Makes React Components Special\n\n• **Re
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8413.283209ms)
✔ prose quality via raw bridge (tier=tier-64) (8414.27184ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 3759ms rawLen=1624 cleanLen=1418 newlines=2 bullets=0
  [2/3] exit=0 3883ms rawLen=1697 cleanLen=1545 newlines=2 bullets=0
  [3/3] exit=0 3819ms rawLen=1789 cleanLen=1583 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: A Beginner’s GuideReact components are the fundamental building blocks of any React application. They allow you to split the UI into independent, reusable pieces, making your code more modular and maintainable.What Are React Components?Components in React are small, self-contained 
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11464.291926ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (11464.679095ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=17628ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (17668.122641ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (17668.656143ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=21057ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (21092.890528ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (21093.375488ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 610ms
  [2/10] ok=true stop=tool_use tool_use=true 398ms
  [3/10] ok=true stop=tool_use tool_use=true 398ms
  [4/10] ok=true stop=tool_use tool_use=true 394ms
  [5/10] ok=true stop=tool_use tool_use=true 395ms
  [6/10] ok=true stop=tool_use tool_use=true 396ms
  [7/10] ok=true stop=tool_use tool_use=true 395ms
  [8/10] ok=true stop=tool_use tool_use=true 389ms
  [9/10] ok=true stop=tool_use tool_use=true 391ms
  [10/10] ok=true stop=tool_use tool_use=true 393ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 389ms · median 395ms · p95 610ms · mean 416ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4161.5316ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4162.400812ms)
ℹ tests 11
ℹ suites 11
ℹ pass 10
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 332936.79927

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (240039.040182ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 32GB | 0 |
| 64GB | 1 |

