# Tier Eval Results — 2026-04-28 04:19

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-c4fe7426c61b Creating 
 Container test-test-run-c4fe7426c61b Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=11340ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (11363.616712ms)
✔ adversarial inputs: slugify (tier=tier-64) (11364.412881ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2848ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2851.114666ms)
✔ agent: parallel file writes (tier=tier-64) (2851.882668ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=4155ms files=[".claw",".sandbox-home",".sandbox-tmp","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (4157.058128ms)
✔ agent: single-file write (tier=tier-64) (4157.850088ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=6233ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (6259.887884ms)
✔ algorithm: merge intervals (tier=tier-64) (6260.47626ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6390ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6428.334909ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6428.863993ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5122ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed. stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5146.562993ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5147.062661ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=8949ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (8986.140648ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (8986.634273ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=10947ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (10970.797347ms)
✔ deep-equal: structural equality (tier=tier-64) (10971.321765ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=8209ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (8248.21409ms)
✔ distractor: one buggy helper among three (tier=tier-64) (8248.703715ms)
  [1/10] ttft=1535ms
  [2/10] ttft=138ms
  [3/10] ttft=136ms
  [4/10] ttft=135ms
  [5/10] ttft=138ms
  [6/10] ttft=136ms
  [7/10] ttft=136ms
  [8/10] ttft=136ms
  [9/10] ttft=138ms
  [10/10] ttft=136ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=136ms · p95=1535ms · mean=276ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4937.6146ms)
✔ TTFT — time to first token (tier=tier-64) (4938.710268ms)
  [1/20] ok=true stop=tool_use 656ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 511ms
  [4/20] ok=true stop=tool_use 512ms
  [5/20] ok=true stop=tool_use 513ms
  [6/20] ok=true stop=tool_use 513ms
  [7/20] ok=true stop=tool_use 511ms
  [8/20] ok=true stop=tool_use 513ms
  [9/20] ok=true stop=tool_use 511ms
  [10/20] ok=true stop=tool_use 513ms
  [11/20] ok=true stop=tool_use 512ms
  [12/20] ok=true stop=tool_use 512ms
  [13/20] ok=true stop=tool_use 513ms
  [14/20] ok=true stop=tool_use 513ms
  [15/20] ok=true stop=tool_use 512ms
  [16/20] ok=true stop=tool_use 512ms
  [17/20] ok=true stop=tool_use 514ms
  [18/20] ok=true stop=tool_use 512ms
  [19/20] ok=true stop=tool_use 512ms
  [20/20] ok=true stop=tool_use 513ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 511ms · median 512ms · p95 656ms · mean 520ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10408.01637ms)
✔ tool-call roundtrip latency (tier=tier-64) (10408.372453ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11124ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11165.848174ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11166.439258ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=20494ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (7986.433513ms)
✔ multi-file rename + signature change (tier=tier-64) (7986.836514ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=9502ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (9532.506979ms)
✔ null-default: missing vs falsy (tier=tier-64) (9533.297716ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 6042ms textLen=2730 newlines=15 bullets=4
  [2/3] stop=end_turn 5214ms textLen=2503 newlines=13 bullets=4
  [3/3] stop=end_turn 5287ms textLen=2489 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## Understanding the Core Concept of React Components\n\nReact components are the fundamental building blocks of modern user interfaces built with the React library. Think of them as reusable, independent pieces of code that encapsulate logic, structure, and styling for specific parts of an application. Instead of writin
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (16544.653631ms)
✔ prose quality via raw bridge (tier=tier-64) (16545.61182ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4657ms rawLen=2074 cleanLen=1886 newlines=5 bullets=3
  [2/3] exit=0 4434ms rawLen=1975 cleanLen=1739 newlines=5 bullets=3
  [3/3] exit=0 4319ms rawLen=2036 cleanLen=1782 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the fundamental building blocks of any React application. They let you split the user interface into independent, reusable pieces, much like how JavaScript functions work in isolation to return data. Each component controls its own section of the DOM an
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13410.69678ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13410.968108ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=5792ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (5831.541408ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (5832.111813ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=6297ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (6332.446758ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (6332.935207ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6327ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6352.830216ms)
✔ state-machine: traffic light (tier=tier-64) (6353.339248ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=7886ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (7920.793393ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (7921.312674ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 748ms
  [2/10] ok=true stop=tool_use tool_use=true 514ms
  [3/10] ok=true stop=tool_use tool_use=true 517ms
  [4/10] ok=true stop=tool_use tool_use=true 514ms
  [5/10] ok=true stop=tool_use tool_use=true 515ms
  [6/10] ok=true stop=tool_use tool_use=true 523ms
  [7/10] ok=true stop=tool_use tool_use=true 516ms
  [8/10] ok=true stop=tool_use tool_use=true 515ms
  [9/10] ok=true stop=tool_use tool_use=true 513ms
  [10/10] ok=true stop=tool_use tool_use=true 517ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 513ms · median 516ms · p95 748ms · mean 539ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5393.728394ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5395.113574ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=10694ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (10732.310498ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (10732.884485ms)
ℹ tests 22
ℹ suites 22
ℹ pass 22
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 181507.592999
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 0 |

