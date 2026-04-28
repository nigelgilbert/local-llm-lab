# Tier Eval Results — 2026-04-27 22:43

Tiers: 16

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-bf9d6d0f6241 Creating 
 Container test-test-run-bf9d6d0f6241 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=19283ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (19284.298807ms)
✔ agent: parallel file writes (tier=tier-16) (19285.587655ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=8951ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (8953.013371ms)
✔ agent: single-file write (tier=tier-16) (8954.0688ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=27894ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (27925.179511ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (27925.669684ms)
  [1/10] ttft=3354ms
  [2/10] ttft=90ms
  [3/10] ttft=88ms
  [4/10] ttft=88ms
  [5/10] ttft=88ms
  [6/10] ttft=87ms
  [7/10] ttft=87ms
  [8/10] ttft=86ms
  [9/10] ttft=87ms
  [10/10] ttft=88ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=86ms · median=88ms · p95=3354ms · mean=414ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (30688.999613ms)
✔ TTFT — time to first token (tier=tier-16) (30689.76026ms)
  [1/20] ok=true stop=tool_use 2394ms
  [2/20] ok=true stop=tool_use 2220ms
  [3/20] ok=true stop=tool_use 2196ms
  [4/20] ok=true stop=tool_use 2460ms
  [5/20] ok=true stop=tool_use 2209ms
  [6/20] ok=true stop=tool_use 2457ms
  [7/20] ok=true stop=tool_use 2454ms
  [8/20] ok=true stop=tool_use 2452ms
  [9/20] ok=true stop=tool_use 2451ms
  [10/20] ok=true stop=tool_use 2201ms
  [11/20] ok=true stop=tool_use 2451ms
  [12/20] ok=true stop=tool_use 2206ms
  [13/20] ok=true stop=tool_use 2452ms
  [14/20] ok=true stop=tool_use 2450ms
  [15/20] ok=true stop=tool_use 2203ms
  [16/20] ok=true stop=tool_use 2444ms
  [17/20] ok=true stop=tool_use 2195ms
  [18/20] ok=true stop=tool_use 2441ms
  [19/20] ok=true stop=tool_use 2439ms
  [20/20] ok=true stop=tool_use 2442ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 2195ms · median 2442ms · p95 2460ms · mean 2361ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (47223.07186ms)
✔ tool-call roundtrip latency (tier=tier-16) (47223.426989ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 15962ms textLen=3975 newlines=44 bullets=16
  [2/3] stop=end_turn 14301ms textLen=3642 newlines=30 bullets=8
  [3/3] stop=end_turn 4510ms textLen=1316 newlines=22 bullets=8
  sample[0] (first 320 chars, \n literal):
    markdown\nOkay, the user wants me to write a short markdown explainer about React components. Let me start by understanding the requirements. They specified two headers using the ## style, at least four bullet points, around 250 words, and no tool calls.\n\nFirst, I need to structure the content. The main sections would b
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (34775.286913ms)
✔ prose quality via raw bridge (tier=tier-16) (34776.289693ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 16427ms rawLen=2054 cleanLen=1755 newlines=12 bullets=7
  [2/3] exit=0 17893ms rawLen=1946 cleanLen=1599 newlines=7 bullets=3
  [3/3] exit=0 14629ms rawLen=1692 cleanLen=1480 newlines=7 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of user interfaces in React applications. They act as independent, reusable pieces of code that encapsulate logic, state, and rendering. Components allow developers to break down complex UIs into smaller, manageabl
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (48950.310798ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (48950.572123ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=36445ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (36476.184025ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (36476.585084ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 2683ms
  [2/10] ok=true stop=tool_use tool_use=true 2439ms
  [3/10] ok=true stop=tool_use tool_use=true 2440ms
  [4/10] ok=true stop=tool_use tool_use=true 2437ms
  [5/10] ok=true stop=tool_use tool_use=true 2439ms
  [6/10] ok=true stop=tool_use tool_use=true 2437ms
  [7/10] ok=true stop=tool_use tool_use=true 2438ms
  [8/10] ok=true stop=tool_use tool_use=true 2439ms
  [9/10] ok=true stop=tool_use tool_use=true 2437ms
  [10/10] ok=true stop=tool_use tool_use=true 2438ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 2437ms · median 2439ms · p95 2683ms · mean 2463ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (24628.053094ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (24628.824922ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 279119.152564
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 0 |

