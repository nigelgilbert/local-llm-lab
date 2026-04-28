# Tier Eval Results — 2026-04-28 04:16

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-589c78b32aa6 Creating 
 Container test-test-run-589c78b32aa6 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=7932ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (7955.755587ms)
✔ adversarial inputs: slugify (tier=tier-64) (7956.281505ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2846ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2848.776206ms)
✔ agent: parallel file writes (tier=tier-64) (2849.497665ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1268ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1270.440937ms)
✔ agent: single-file write (tier=tier-64) (1271.204689ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=11579ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (11606.939722ms)
✔ algorithm: merge intervals (tier=tier-64) (11607.467307ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6298ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6334.966655ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6335.464948ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=4977ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5000.111763ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5000.608555ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9834ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9873.140369ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9873.638412ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=10607ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (10631.384049ms)
✔ deep-equal: structural equality (tier=tier-64) (10631.911633ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6852ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6892.722207ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6893.253041ms)
  [1/10] ttft=1552ms
  [2/10] ttft=138ms
  [3/10] ttft=138ms
  [4/10] ttft=137ms
  [5/10] ttft=138ms
  [6/10] ttft=136ms
  [7/10] ttft=136ms
  [8/10] ttft=138ms
  [9/10] ttft=137ms
  [10/10] ttft=137ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=136ms · median=138ms · p95=1552ms · mean=279ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4949.842668ms)
✔ TTFT — time to first token (tier=tier-64) (4950.742087ms)
  [1/20] ok=true stop=tool_use 667ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 513ms
  [4/20] ok=true stop=tool_use 516ms
  [5/20] ok=true stop=tool_use 512ms
  [6/20] ok=true stop=tool_use 514ms
  [7/20] ok=true stop=tool_use 513ms
  [8/20] ok=true stop=tool_use 515ms
  [9/20] ok=true stop=tool_use 513ms
  [10/20] ok=true stop=tool_use 513ms
  [11/20] ok=true stop=tool_use 514ms
  [12/20] ok=true stop=tool_use 513ms
  [13/20] ok=true stop=tool_use 517ms
  [14/20] ok=true stop=tool_use 519ms
  [15/20] ok=true stop=tool_use 514ms
  [16/20] ok=true stop=tool_use 512ms
  [17/20] ok=true stop=tool_use 512ms
  [18/20] ok=true stop=tool_use 515ms
  [19/20] ok=true stop=tool_use 515ms
  [20/20] ok=true stop=tool_use 513ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 512ms · median 514ms · p95 667ms · mean 522ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10432.910813ms)
✔ tool-call roundtrip latency (tier=tier-64) (10433.326855ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11928ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11967.122843ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11967.650803ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=8217ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (8254.342998ms)
✔ multi-file rename + signature change (tier=tier-64) (8254.919498ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=5140ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (5164.001779ms)
✔ null-default: missing vs falsy (tier=tier-64) (5164.59253ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4923ms textLen=2169 newlines=13 bullets=4
  [2/3] stop=end_turn 4920ms textLen=2384 newlines=13 bullets=4
  [3/3] stop=end_turn 5050ms textLen=2362 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## The Building Blocks of Modern UIs\n\nReact components are the fundamental units that make up a React application. Think of them as independent, reusable pieces of code that act like JavaScript functions but work in isolation and return HTML via JSX. Instead of building a massive, monolithic file where everything is ta
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14894.994882ms)
✔ prose quality via raw bridge (tier=tier-64) (14895.677842ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4708ms rawLen=2162 cleanLen=1980 newlines=5 bullets=3
  [2/3] exit=0 4051ms rawLen=1887 cleanLen=1705 newlines=5 bullets=3
  [3/3] exit=0 4601ms rawLen=2198 cleanLen=1938 newlines=6 bullets=4
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate both structure and behavior within a web application. Each component manages its own UI fragment — typically a combination of HTML-like markup (JSX), JavaScript logic, CSS styling, and event hand
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13361.131753ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13361.364169ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6580ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6620.559681ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6621.215973ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=6432ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (6463.950719ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (6464.432137ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=7522ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (7547.06492ms)
✔ state-machine: traffic light (tier=tier-64) (7547.561337ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6892ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6931.378357ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6931.860358ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 765ms
  [2/10] ok=true stop=tool_use tool_use=true 519ms
  [3/10] ok=true stop=tool_use tool_use=true 514ms
  [4/10] ok=true stop=tool_use tool_use=true 513ms
  [5/10] ok=true stop=tool_use tool_use=true 514ms
  [6/10] ok=true stop=tool_use tool_use=true 511ms
  [7/10] ok=true stop=tool_use tool_use=true 512ms
  [8/10] ok=true stop=tool_use tool_use=true 518ms
  [9/10] ok=true stop=tool_use tool_use=true 557ms
  [10/10] ok=true stop=tool_use tool_use=true 525ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 511ms · median 518ms · p95 765ms · mean 545ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5451.221359ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5452.458319ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=19187ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (19226.647241ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (19227.205826ms)
ℹ tests 22
ℹ suites 22
ℹ pass 22
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 184240.127102
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 0 |

