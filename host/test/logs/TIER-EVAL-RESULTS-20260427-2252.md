# Tier Eval Results — 2026-04-27 22:52

Tiers: 16

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-80be9fa9b817 Creating 
 Container test-test-run-80be9fa9b817 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=4961ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (4963.284741ms)
✔ agent: parallel file writes (tier=tier-16) (4964.002323ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1193ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (1195.985942ms)
✔ agent: single-file write (tier=tier-16) (1196.783441ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=4829ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (4854.830318ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (4855.429067ms)
  [1/10] ttft=1638ms
  [2/10] ttft=143ms
  [3/10] ttft=140ms
  [4/10] ttft=141ms
  [5/10] ttft=139ms
  [6/10] ttft=138ms
  [7/10] ttft=139ms
  [8/10] ttft=141ms
  [9/10] ttft=138ms
  [10/10] ttft=140ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=138ms · median=140ms · p95=1638ms · mean=290ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4493.089297ms)
✔ TTFT — time to first token (tier=tier-16) (4494.124044ms)
  [1/20] ok=true stop=tool_use 468ms
  [2/20] ok=true stop=tool_use 378ms
  [3/20] ok=true stop=tool_use 380ms
  [4/20] ok=true stop=tool_use 378ms
  [5/20] ok=true stop=tool_use 375ms
  [6/20] ok=true stop=tool_use 380ms
  [7/20] ok=true stop=tool_use 381ms
  [8/20] ok=true stop=tool_use 378ms
  [9/20] ok=true stop=tool_use 381ms
  [10/20] ok=true stop=tool_use 377ms
  [11/20] ok=true stop=tool_use 377ms
  [12/20] ok=true stop=tool_use 379ms
  [13/20] ok=true stop=tool_use 378ms
  [14/20] ok=true stop=tool_use 376ms
  [15/20] ok=true stop=tool_use 380ms
  [16/20] ok=true stop=tool_use 379ms
  [17/20] ok=true stop=tool_use 379ms
  [18/20] ok=true stop=tool_use 380ms
  [19/20] ok=true stop=tool_use 383ms
  [20/20] ok=true stop=tool_use 396ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 375ms · median 379ms · p95 468ms · mean 384ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (7692.285537ms)
✔ tool-call roundtrip latency (tier=tier-16) (7692.738327ms)

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=15724ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-16)
  ✔ claw renames across files and updates the call site (15768.290005ms)
✔ multi-file rename + signature change (tier=tier-16) (15768.987961ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 2327ms textLen=966 newlines=9 bullets=4
  [2/3] stop=end_turn 2346ms textLen=1017 newlines=9 bullets=4
  [3/3] stop=end_turn 2474ms textLen=1074 newlines=9 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable pieces of code that represent parts of the user interface in a React application. They help in breaking down the UI into smaller, manageable, and more organized pieces. Here’s why and how they are used:\n\n- **Modularity**: Components allow you to split your UI
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7149.497796ms)
✔ prose quality via raw bridge (tier=tier-16) (7150.420211ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 11318ms rawLen=4996 cleanLen=4195 newlines=18 bullets=5
  [2/3] exit=0 9735ms rawLen=4310 cleanLen=3599 newlines=18 bullets=5
  [3/3] exit=0 8667ms rawLen=3614 cleanLen=2844 newlines=29 bullets=6
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n╭─ SendUserMessage ─╮\n│ {"message":"# Introduction to React Components\nReact components are reusable pieces of code tha…\n╰───────────────────────╯\n✓ SendUserMessage\n{\n“attachments”: null,\n“message”: “# Introduction to React Components\nReact components are reusable pieces of code that represent pa
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (29720.982427ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (29721.373304ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=9131ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (9172.965552ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (9173.541682ms)

=== subtle-bug (tier-16) ===
  claw: exit=0 elapsed=132470ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-16)
  ✔ claw fixes median.js so its assertions pass (132511.777202ms)
✔ subtle bug: default-sort lexicographic (tier=tier-16) (132512.359625ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 630ms
  [2/10] ok=true stop=tool_use tool_use=true 384ms
  [3/10] ok=true stop=tool_use tool_use=true 385ms
  [4/10] ok=true stop=tool_use tool_use=true 381ms
  [5/10] ok=true stop=tool_use tool_use=true 390ms
  [6/10] ok=true stop=tool_use tool_use=true 392ms
  [7/10] ok=true stop=tool_use tool_use=true 394ms
  [8/10] ok=true stop=tool_use tool_use=true 395ms
  [9/10] ok=true stop=tool_use tool_use=true 396ms
  [10/10] ok=true stop=tool_use tool_use=true 396ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 381ms · median 394ms · p95 630ms · mean 414ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4144.984583ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (4147.375944ms)
ℹ tests 11
ℹ suites 11
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 221958.522818
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 0 |

