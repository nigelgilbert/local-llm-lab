# Tier Eval Results — 2026-04-27 21:48

Tiers: 64

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-a2fc987c5a50 Creating 
 Container test-test-run-a2fc987c5a50 Created 

=== agent-parallel (tier-64) ===
  exit=0 elapsed=7304ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (7305.369798ms)
✔ agent: parallel file writes (tier=tier-64) (7306.066504ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1812ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1813.648416ms)
✔ agent: single-file write (tier=tier-64) (1814.877702ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=9578ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed! stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (9605.076831ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (9605.645662ms)
  [1/10] ttft=2377ms
  [2/10] ttft=84ms
  [3/10] ttft=79ms
  [4/10] ttft=84ms
  [5/10] ttft=149ms
  [6/10] ttft=85ms
  [7/10] ttft=81ms
  [8/10] ttft=88ms
  [9/10] ttft=82ms
  [10/10] ttft=137ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=79ms · median=85ms · p95=2377ms · mean=325ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (5506.025898ms)
✔ TTFT — time to first token (tier=tier-64) (5506.878144ms)
  [1/20] ok=true stop=tool_use 525ms
  [2/20] ok=true stop=tool_use 394ms
  [3/20] ok=true stop=tool_use 395ms
  [4/20] ok=true stop=tool_use 394ms
  [5/20] ok=true stop=tool_use 392ms
  [6/20] ok=true stop=tool_use 395ms
  [7/20] ok=true stop=tool_use 395ms
  [8/20] ok=true stop=tool_use 393ms
  [9/20] ok=true stop=tool_use 394ms
  [10/20] ok=true stop=tool_use 393ms
  [11/20] ok=true stop=tool_use 393ms
  [12/20] ok=true stop=tool_use 396ms
  [13/20] ok=true stop=tool_use 393ms
  [14/20] ok=true stop=tool_use 392ms
  [15/20] ok=true stop=tool_use 391ms
  [16/20] ok=true stop=tool_use 393ms
  [17/20] ok=true stop=tool_use 394ms
  [18/20] ok=true stop=tool_use 392ms
  [19/20] ok=true stop=tool_use 392ms
  [20/20] ok=true stop=tool_use 395ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 391ms · median 394ms · p95 525ms · mean 400ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8007.156561ms)
✔ tool-call roundtrip latency (tier=tier-64) (8007.51635ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 2760ms textLen=1406 newlines=12 bullets=4
  [2/3] stop=end_turn 2490ms textLen=1372 newlines=12 bullets=4
  [3/3] stop=end_turn 2602ms textLen=1442 newlines=14 bullets=4
  sample[0] (first 320 chars, \n literal):
    # React Components: The Building Blocks of Modern UI\n\nReact components are the fundamental units that make up React applications. They allow developers to create reusable, self-contained pieces of user interface that can be composed together to build complex applications.\n\n## What Makes React Components Special\n\n• **Re
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7854.051493ms)
✔ prose quality via raw bridge (tier=tier-64) (7855.044864ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 3782ms rawLen=1691 cleanLen=1485 newlines=2 bullets=0
  [2/3] exit=0 3910ms rawLen=1771 cleanLen=1619 newlines=5 bullets=3
  [3/3] exit=0 3970ms rawLen=1731 cleanLen=1615 newlines=2 bullets=0
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8React Components: A Beginner’s GuideReact components are the building blocks of any React application. They allow you to split the UI into independent, reusable pieces, making your code more modular and maintainable.What Are React Components?React components are self-contained units that return JSX 
  (informational only — claw's renderer strips header markers without preserving \n; see TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11663.785751ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (11664.123724ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=27824ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (27867.656094ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (27868.227209ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 627ms
  [2/10] ok=true stop=tool_use tool_use=true 394ms
  [3/10] ok=true stop=tool_use tool_use=true 391ms
  [4/10] ok=true stop=tool_use tool_use=true 392ms
  [5/10] ok=true stop=tool_use tool_use=true 391ms
  [6/10] ok=true stop=tool_use tool_use=true 392ms
  [7/10] ok=true stop=tool_use tool_use=true 394ms
  [8/10] ok=true stop=tool_use tool_use=true 394ms
  [9/10] ok=true stop=tool_use tool_use=true 393ms
  [10/10] ok=true stop=tool_use tool_use=true 394ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 391ms · median 394ms · p95 627ms · mean 416ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4163.601639ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (4165.714844ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 84022.897967
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 0 |

