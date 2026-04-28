# Tier Eval Results — 2026-04-28 04:23

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-215b68a15a8d Creating 
 Container test-test-run-215b68a15a8d Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=7198ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (7222.517114ms)
✔ adversarial inputs: slugify (tier=tier-64) (7223.032365ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2827ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2829.358583ms)
✔ agent: parallel file writes (tier=tier-64) (2830.535835ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1270ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1272.929191ms)
✔ agent: single-file write (tier=tier-64) (1273.694318ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5662ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (5686.124885ms)
✔ algorithm: merge intervals (tier=tier-64) (5686.697303ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6233ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6275.639204ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6276.114039ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=4896ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (4917.202518ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (4917.749769ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9473ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9513.67356ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9514.249705ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=7759ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (7782.0434ms)
✔ deep-equal: structural equality (tier=tier-64) (7782.602199ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6877ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6916.313479ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6916.891111ms)
  [1/10] ttft=1590ms
  [2/10] ttft=142ms
  [3/10] ttft=137ms
  [4/10] ttft=136ms
  [5/10] ttft=136ms
  [6/10] ttft=135ms
  [7/10] ttft=136ms
  [8/10] ttft=137ms
  [9/10] ttft=136ms
  [10/10] ttft=136ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=136ms · p95=1590ms · mean=282ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4993.80545ms)
✔ TTFT — time to first token (tier=tier-64) (4994.87347ms)
  [1/20] ok=true stop=tool_use 660ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 529ms
  [4/20] ok=true stop=tool_use 521ms
  [5/20] ok=true stop=tool_use 518ms
  [6/20] ok=true stop=tool_use 513ms
  [7/20] ok=true stop=tool_use 512ms
  [8/20] ok=true stop=tool_use 514ms
  [9/20] ok=true stop=tool_use 515ms
  [10/20] ok=true stop=tool_use 515ms
  [11/20] ok=true stop=tool_use 514ms
  [12/20] ok=true stop=tool_use 531ms
  [13/20] ok=true stop=tool_use 527ms
  [14/20] ok=true stop=tool_use 524ms
  [15/20] ok=true stop=tool_use 515ms
  [16/20] ok=true stop=tool_use 513ms
  [17/20] ok=true stop=tool_use 517ms
  [18/20] ok=true stop=tool_use 512ms
  [19/20] ok=true stop=tool_use 512ms
  [20/20] ok=true stop=tool_use 512ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 512ms · median 515ms · p95 660ms · mean 524ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10496.874108ms)
✔ tool-call roundtrip latency (tier=tier-64) (10497.217255ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11111ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11149.557626ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11150.119634ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=6645ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (6683.621136ms)
✔ multi-file rename + signature change (tier=tier-64) (6684.130105ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4661ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (4686.282536ms)
✔ null-default: missing vs falsy (tier=tier-64) (4686.882ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 5550ms textLen=2609 newlines=13 bullets=4
  [2/3] stop=end_turn 5164ms textLen=2378 newlines=11 bullets=4
  [3/3] stop=end_turn 4561ms textLen=2094 newlines=15 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## Understanding React Components\n\nReact components are the fundamental building blocks of any React application. They allow developers to break down complex user interfaces into smaller, manageable, and reusable pieces of code. Think of a component as a custom HTML element that encapsulates its own structure, style, a
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (15276.343234ms)
✔ prose quality via raw bridge (tier=tier-64) (15277.166601ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 3643ms rawLen=1618 cleanLen=1436 newlines=5 bullets=3
  [2/3] exit=0 4382ms rawLen=2041 cleanLen=1787 newlines=5 bullets=3
  [3/3] exit=0 4404ms rawLen=2058 cleanLen=1876 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the fundamental building blocks of any React application. Think of them as independent, reusable pieces of UI — similar to how HTML elements work, but with far more power. Each component encapsulates its own structure, styling, and behavior, making your
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (12430.092939ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (12430.300016ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=5542ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (5581.549896ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (5582.057689ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=5618ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (5652.115363ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (5652.675321ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6247ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6272.575698ms)
✔ state-machine: traffic light (tier=tier-64) (6273.091366ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6700ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6740.113455ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6740.624247ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 745ms
  [2/10] ok=true stop=tool_use tool_use=true 516ms
  [3/10] ok=true stop=tool_use tool_use=true 513ms
  [4/10] ok=true stop=tool_use tool_use=true 513ms
  [5/10] ok=true stop=tool_use tool_use=true 513ms
  [6/10] ok=true stop=tool_use tool_use=true 515ms
  [7/10] ok=true stop=tool_use tool_use=true 513ms
  [8/10] ok=true stop=tool_use tool_use=true 516ms
  [9/10] ok=true stop=tool_use tool_use=true 507ms
  [10/10] ok=true stop=tool_use tool_use=true 507ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 507ms · median 513ms · p95 745ms · mean 536ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5360.207479ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5361.020689ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=17741ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (17779.040496ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (17779.611691ms)
ℹ tests 22
ℹ suites 22
ℹ pass 22
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 166065.894232
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 0 |

