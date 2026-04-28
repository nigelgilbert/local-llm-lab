# Tier Eval Results — 2026-04-27 22:41

Tiers: 16

Models (per models.conf):
- 16GB → Qwen3-8B Q4_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-b83b692ce788 Creating 
 Container test-test-run-b83b692ce788 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=5144ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (5146.082027ms)
✔ agent: parallel file writes (tier=tier-16) (5146.795244ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1256ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (1258.883911ms)
✔ agent: single-file write (tier=tier-16) (1259.736755ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=4934ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (4959.664254ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (4960.302178ms)
  [1/10] ttft=1643ms
  [2/10] ttft=142ms
  [3/10] ttft=139ms
  [4/10] ttft=138ms
  [5/10] ttft=141ms
  [6/10] ttft=140ms
  [7/10] ttft=140ms
  [8/10] ttft=141ms
  [9/10] ttft=137ms
  [10/10] ttft=140ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=137ms · median=140ms · p95=1643ms · mean=290ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4478.827315ms)
✔ TTFT — time to first token (tier=tier-16) (4479.651283ms)
  [1/20] ok=true stop=tool_use 468ms
  [2/20] ok=true stop=tool_use 376ms
  [3/20] ok=true stop=tool_use 378ms
  [4/20] ok=true stop=tool_use 379ms
  [5/20] ok=true stop=tool_use 377ms
  [6/20] ok=true stop=tool_use 383ms
  [7/20] ok=true stop=tool_use 382ms
  [8/20] ok=true stop=tool_use 379ms
  [9/20] ok=true stop=tool_use 378ms
  [10/20] ok=true stop=tool_use 384ms
  [11/20] ok=true stop=tool_use 378ms
  [12/20] ok=true stop=tool_use 383ms
  [13/20] ok=true stop=tool_use 408ms
  [14/20] ok=true stop=tool_use 387ms
  [15/20] ok=true stop=tool_use 390ms
  [16/20] ok=true stop=tool_use 384ms
  [17/20] ok=true stop=tool_use 385ms
  [18/20] ok=true stop=tool_use 398ms
  [19/20] ok=true stop=tool_use 384ms
  [20/20] ok=true stop=tool_use 380ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 376ms · median 383ms · p95 468ms · mean 388ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (7765.887373ms)
✔ tool-call roundtrip latency (tier=tier-16) (7766.16996ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 2549ms textLen=1087 newlines=9 bullets=4
  [2/3] stop=end_turn 2693ms textLen=1144 newlines=10 bullets=4
  [3/3] stop=end_turn 2537ms textLen=1035 newlines=9 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable pieces of code that can render HTML or other UI elements. They are the building blocks of React applications, allowing developers to create complex user interfaces in a modular way. Here’s why and how they are used:\n\n- **Modularity**: Components break down la
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (7780.272713ms)
✔ prose quality via raw bridge (tier=tier-16) (7781.984816ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 12828ms rawLen=2824 cleanLen=2309 newlines=20 bullets=10
  [2/3] exit=0 10225ms rawLen=4327 cleanLen=3622 newlines=20 bullets=6
  [3/3] exit=0 9634ms rawLen=4145 cleanLen=3548 newlines=18 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n╭─ write_file ─╮\n│ ✏️ Writing /workspace/react-components-explainer.md (19 lines)\n╰──────────────────╯\n✓ ✏️ Wrote /workspace/react-components-explainer.md (19 lines)\nThe file `/workspace/react-components-explainer.md` has been successfully created with the following content:Introduction to React Co
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (32687.443036ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (32687.801666ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=6556ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (6600.089734ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (6600.737366ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 540ms
  [2/10] ok=true stop=tool_use tool_use=true 385ms
  [3/10] ok=true stop=tool_use tool_use=true 390ms
  [4/10] ok=true stop=tool_use tool_use=true 401ms
  [5/10] ok=true stop=tool_use tool_use=true 401ms
  [6/10] ok=true stop=tool_use tool_use=true 406ms
  [7/10] ok=true stop=tool_use tool_use=true 410ms
  [8/10] ok=true stop=tool_use tool_use=true 411ms
  [9/10] ok=true stop=tool_use tool_use=true 409ms
  [10/10] ok=true stop=tool_use tool_use=true 412ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 385ms · median 409ms · p95 540ms · mean 417ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4166.635316ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (4167.609703ms)
ℹ tests 9
ℹ suites 9
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 75083.329243
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 16GB | 0 |

