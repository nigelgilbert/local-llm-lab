# Tier Eval Results — 2026-04-28 04:31

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-3d5a7bf2acc0 Creating 
 Container test-test-run-3d5a7bf2acc0 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=6468ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (6494.052557ms)
✔ adversarial inputs: slugify (tier=tier-64) (6494.548764ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2847ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2848.945975ms)
✔ agent: parallel file writes (tier=tier-64) (2850.101931ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=3212ms files=[".claw",".sandbox-home",".sandbox-tmp","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (3215.248218ms)
✔ agent: single-file write (tier=tier-64) (3216.024508ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5366ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (5391.440499ms)
✔ algorithm: merge intervals (tier=tier-64) (5392.043248ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6029ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6066.563148ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6067.10369ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5198ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5223.471273ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5223.983648ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=8828ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (8868.32973ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (8868.827397ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=16903ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (16930.066451ms)
✔ deep-equal: structural equality (tier=tier-64) (16930.564534ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=7525ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (7563.717611ms)
✔ distractor: one buggy helper among three (tier=tier-64) (7564.285236ms)
  [1/10] ttft=1605ms
  [2/10] ttft=139ms
  [3/10] ttft=135ms
  [4/10] ttft=136ms
  [5/10] ttft=134ms
  [6/10] ttft=136ms
  [7/10] ttft=136ms
  [8/10] ttft=139ms
  [9/10] ttft=136ms
  [10/10] ttft=136ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=134ms · median=136ms · p95=1605ms · mean=283ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4995.992275ms)
✔ TTFT — time to first token (tier=tier-64) (4996.882777ms)
  [1/20] ok=true stop=tool_use 657ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 512ms
  [4/20] ok=true stop=tool_use 513ms
  [5/20] ok=true stop=tool_use 513ms
  [6/20] ok=true stop=tool_use 513ms
  [7/20] ok=true stop=tool_use 511ms
  [8/20] ok=true stop=tool_use 512ms
  [9/20] ok=true stop=tool_use 514ms
  [10/20] ok=true stop=tool_use 511ms
  [11/20] ok=true stop=tool_use 512ms
  [12/20] ok=true stop=tool_use 511ms
  [13/20] ok=true stop=tool_use 511ms
  [14/20] ok=true stop=tool_use 510ms
  [15/20] ok=true stop=tool_use 511ms
  [16/20] ok=true stop=tool_use 512ms
  [17/20] ok=true stop=tool_use 511ms
  [18/20] ok=true stop=tool_use 511ms
  [19/20] ok=true stop=tool_use 510ms
  [20/20] ok=true stop=tool_use 513ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 510ms · median 512ms · p95 657ms · mean 519ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10386.696036ms)
✔ tool-call roundtrip latency (tier=tier-64) (10387.083454ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11980ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (12020.339034ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (12020.960077ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=7806ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (7841.367779ms)
✔ multi-file rename + signature change (tier=tier-64) (7841.919613ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=5038ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (5062.552385ms)
✔ null-default: missing vs falsy (tier=tier-64) (5063.106553ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 5601ms textLen=2677 newlines=15 bullets=4
  [2/3] stop=end_turn 4343ms textLen=2110 newlines=13 bullets=4
  [3/3] stop=end_turn 4470ms textLen=2103 newlines=9 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## The Building Blocks of Modern Interfaces\n\nReact components are the fundamental units that make up a React application. Think of them as independent, reusable pieces of code that act like JavaScript functions but return HTML via JSX. This modular approach allows developers to break down complex user interfaces into m
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14415.680168ms)
✔ prose quality via raw bridge (tier=tier-64) (14416.458086ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4776ms rawLen=2085 cleanLen=1725 newlines=9 bullets=3
  [2/3] exit=0 3893ms rawLen=1809 cleanLen=1519 newlines=5 bullets=3
  [3/3] exit=0 4478ms rawLen=2094 cleanLen=1858 newlines=6 bullets=4
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate both the structure (JSX markup) and behavior (logic, state, effects) of a user interface. Think of them as custom HTML elements you define yourself — each one responsible for rendering a specific
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13148.12911ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13151.197782ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6337ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6375.935477ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6376.423061ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=5615ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (5651.360026ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (5651.846361ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=7201ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (7226.509135ms)
✔ state-machine: traffic light (tier=tier-64) (7227.032762ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6039ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6076.033105ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6076.579814ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 743ms
  [2/10] ok=true stop=tool_use tool_use=true 515ms
  [3/10] ok=true stop=tool_use tool_use=true 513ms
  [4/10] ok=true stop=tool_use tool_use=true 511ms
  [5/10] ok=true stop=tool_use tool_use=true 513ms
  [6/10] ok=true stop=tool_use tool_use=true 512ms
  [7/10] ok=true stop=tool_use tool_use=true 514ms
  [8/10] ok=true stop=tool_use tool_use=true 515ms
  [9/10] ok=true stop=tool_use tool_use=true 512ms
  [10/10] ok=true stop=tool_use tool_use=true 513ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 511ms · median 513ms · p95 743ms · mean 536ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5362.959341ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5363.918842ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=9103ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (9144.029645ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (9144.617021ms)
ℹ tests 22
ℹ suites 22
ℹ pass 22
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 170890.058374
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 0 |

