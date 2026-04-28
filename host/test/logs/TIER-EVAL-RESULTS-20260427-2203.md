# Tier Eval Results — 2026-04-27 22:03

Tiers: 32

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 32GB

```
 Container test-test-run-31e27feafaf3 Creating 
 Container test-test-run-31e27feafaf3 Created 

=== agent-parallel (tier-32) ===
  exit=0 elapsed=4931ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (4932.191073ms)
✔ agent: parallel file writes (tier=tier-32) (4932.983081ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=1600ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (1602.623951ms)
✔ agent: single-file write (tier=tier-32) (1603.677002ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=5025ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (5044.825358ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (5045.314445ms)
  [1/10] ttft=1692ms
  [2/10] ttft=121ms
  [3/10] ttft=119ms
  [4/10] ttft=111ms
  [5/10] ttft=118ms
  [6/10] ttft=119ms
  [7/10] ttft=119ms
  [8/10] ttft=119ms
  [9/10] ttft=119ms
  [10/10] ttft=118ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=111ms · median=119ms · p95=1692ms · mean=276ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4066.226737ms)
✔ TTFT — time to first token (tier=tier-32) (4067.436538ms)
  [1/20] ok=true stop=tool_use 362ms
  [2/20] ok=true stop=tool_use 278ms
  [3/20] ok=true stop=tool_use 285ms
  [4/20] ok=true stop=tool_use 280ms
  [5/20] ok=true stop=tool_use 279ms
  [6/20] ok=true stop=tool_use 280ms
  [7/20] ok=true stop=tool_use 278ms
  [8/20] ok=true stop=tool_use 280ms
  [9/20] ok=true stop=tool_use 280ms
  [10/20] ok=true stop=tool_use 279ms
  [11/20] ok=true stop=tool_use 281ms
  [12/20] ok=true stop=tool_use 279ms
  [13/20] ok=true stop=tool_use 280ms
  [14/20] ok=true stop=tool_use 279ms
  [15/20] ok=true stop=tool_use 281ms
  [16/20] ok=true stop=tool_use 281ms
  [17/20] ok=true stop=tool_use 281ms
  [18/20] ok=true stop=tool_use 280ms
  [19/20] ok=true stop=tool_use 280ms
  [20/20] ok=true stop=tool_use 281ms

=== tool-roundtrip (tier-32) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 278ms · median 280ms · p95 362ms · mean 284ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (5690.433919ms)
✔ tool-call roundtrip latency (tier=tier-32) (5690.857381ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 2737ms textLen=1697 newlines=13 bullets=4
  [2/3] stop=end_turn 2898ms textLen=1803 newlines=13 bullets=4
  [3/3] stop=end_turn 3001ms textLen=1894 newlines=18 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable building blocks that define parts of a user interface. They encapsulate HTML, CSS, and JavaScript logic into self-contained units, making it easier to manage complex UIs by breaking them down into smaller, manageable pieces. Think of components as functions t
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (8637.964926ms)
✔ prose quality via raw bridge (tier=tier-32) (8638.773308ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 3764ms rawLen=1933 cleanLen=1751 newlines=5 bullets=3
  [2/3] exit=0 3974ms rawLen=1989 cleanLen=1810 newlines=5 bullets=3
  [3/3] exit=0 3618ms rawLen=1850 cleanLen=1683 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the building blocks of user interfaces in React applications. They are reusable, self-contained pieces of code that encapsulate both the structure (UI) and behavior (logic) of a part of the interface. Think of components as independent, modular function
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11357.770803ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (11358.160972ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=6075ms files=[".claw","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✔ claw fixes buggy.js so its assertions pass (6118.052437ms)
✔ refactor: fix seeded off-by-one (tier=tier-32) (6118.649275ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 470ms
  [2/10] ok=true stop=tool_use tool_use=true 284ms
  [3/10] ok=true stop=tool_use tool_use=true 283ms
  [4/10] ok=true stop=tool_use tool_use=true 282ms
  [5/10] ok=true stop=tool_use tool_use=true 281ms
  [6/10] ok=true stop=tool_use tool_use=true 282ms
  [7/10] ok=true stop=tool_use tool_use=true 283ms
  [8/10] ok=true stop=tool_use tool_use=true 282ms
  [9/10] ok=true stop=tool_use tool_use=true 280ms
  [10/10] ok=true stop=tool_use tool_use=true 281ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 280ms · median 282ms · p95 470ms · mean 301ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (3010.188601ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (3011.095775ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 50687.585055
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 32GB | 0 |

