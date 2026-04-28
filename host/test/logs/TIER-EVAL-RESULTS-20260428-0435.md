# Tier Eval Results — 2026-04-28 04:35

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-14a57b24bb2f Creating 
 Container test-test-run-14a57b24bb2f Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=9403ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (9432.87568ms)
✔ adversarial inputs: slugify (tier=tier-64) (9433.374471ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2837ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2839.279581ms)
✔ agent: parallel file writes (tier=tier-64) (2840.005372ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=3115ms files=[".claw",".sandbox-home",".sandbox-tmp","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (3118.288123ms)
✔ agent: single-file write (tier=tier-64) (3119.032454ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=6003ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (6030.168048ms)
✔ algorithm: merge intervals (tier=tier-64) (6030.760922ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6491ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6528.300573ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6528.839364ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5021ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5047.432984ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5047.981899ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9111ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9147.106052ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9147.624259ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=64300ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (64326.384048ms)
✔ deep-equal: structural equality (tier=tier-64) (64327.137629ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=11023ms files=[".claw",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (11049.619382ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (11050.123714ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6172ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6213.693079ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6214.179494ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=10544ms files=[".claw",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (10584.599676ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (10585.121758ms)
  [1/10] ttft=1529ms
  [2/10] ttft=139ms
  [3/10] ttft=136ms
  [4/10] ttft=136ms
  [5/10] ttft=136ms
  [6/10] ttft=136ms
  [7/10] ttft=137ms
  [8/10] ttft=136ms
  [9/10] ttft=137ms
  [10/10] ttft=136ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=136ms · median=136ms · p95=1529ms · mean=276ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4916.421064ms)
✔ TTFT — time to first token (tier=tier-64) (4917.28398ms)
  [1/20] ok=true stop=tool_use 661ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 510ms
  [4/20] ok=true stop=tool_use 511ms
  [5/20] ok=true stop=tool_use 509ms
  [6/20] ok=true stop=tool_use 511ms
  [7/20] ok=true stop=tool_use 510ms
  [8/20] ok=true stop=tool_use 512ms
  [9/20] ok=true stop=tool_use 510ms
  [10/20] ok=true stop=tool_use 510ms
  [11/20] ok=true stop=tool_use 510ms
  [12/20] ok=true stop=tool_use 510ms
  [13/20] ok=true stop=tool_use 512ms
  [14/20] ok=true stop=tool_use 511ms
  [15/20] ok=true stop=tool_use 510ms
  [16/20] ok=true stop=tool_use 510ms
  [17/20] ok=true stop=tool_use 509ms
  [18/20] ok=true stop=tool_use 513ms
  [19/20] ok=true stop=tool_use 512ms
  [20/20] ok=true stop=tool_use 510ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 509ms · median 510ms · p95 661ms · mean 518ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10368.891869ms)
✔ tool-call roundtrip latency (tier=tier-64) (10369.32416ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=16540ms files=[".claw",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (16587.245123ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (16587.855205ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=32248ms files=[".claw",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (32282.800259ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (32283.323758ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11315ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11355.941173ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11356.472256ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=7264ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (7303.295078ms)
✔ multi-file rename + signature change (tier=tier-64) (7303.791243ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4743ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (4769.542618ms)
✔ null-default: missing vs falsy (tier=tier-64) (4770.065951ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4512ms textLen=2079 newlines=13 bullets=4
  [2/3] stop=end_turn 4727ms textLen=2260 newlines=13 bullets=4
  [3/3] stop=end_turn 4637ms textLen=2238 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are the fundamental building blocks of any modern React application. Think of them as independent, reusable pieces of UI that encapsulate their own logic, structure, and styling. Instead of writing one massive file containing all your HTML and JavaScript, you break your i
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (13876.185331ms)
✔ prose quality via raw bridge (tier=tier-64) (13876.629413ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 3546ms rawLen=1543 cleanLen=1391 newlines=5 bullets=3
  [2/3] exit=0 4210ms rawLen=1988 cleanLen=1710 newlines=5 bullets=3
  [3/3] exit=0 3992ms rawLen=1921 cleanLen=1700 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the building blocks of user interfaces in a React application. They allow developers to split the UI into independent, reusable pieces, thinking about each piece in isolation. Conceptually, components are like JavaScript functions that accept inputs cal
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11749.327332ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (11749.511874ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=5399ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (5437.648256ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (5438.268713ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=5942ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (5978.346402ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (5978.891983ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6682ms files=[".claw",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6709.527808ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6710.020473ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6332ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6359.699213ms)
✔ state-machine: traffic light (tier=tier-64) (6360.225045ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6031ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6075.045883ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6075.487673ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 746ms
  [2/10] ok=true stop=tool_use tool_use=true 519ms
  [3/10] ok=true stop=tool_use tool_use=true 515ms
  [4/10] ok=true stop=tool_use tool_use=true 513ms
  [5/10] ok=true stop=tool_use tool_use=true 512ms
  [6/10] ok=true stop=tool_use tool_use=true 513ms
  [7/10] ok=true stop=tool_use tool_use=true 511ms
  [8/10] ok=true stop=tool_use tool_use=true 515ms
  [9/10] ok=true stop=tool_use tool_use=true 512ms
  [10/10] ok=true stop=tool_use tool_use=true 512ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 511ms · median 513ms · p95 746ms · mean 537ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5369.748416ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5371.159871ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=11065ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (11105.753262ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (11106.343095ms)
ℹ tests 27
ℹ suites 27
ℹ pass 27
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 295241.865626
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 0 |

