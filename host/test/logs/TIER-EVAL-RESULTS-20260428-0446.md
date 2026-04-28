# Tier Eval Results — 2026-04-28 04:46

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-2e8a2d5740a4 Creating 
 Container test-test-run-2e8a2d5740a4 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=7280ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (7307.822475ms)
✔ adversarial inputs: slugify (tier=tier-64) (7308.331495ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2876ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2877.698073ms)
✔ agent: parallel file writes (tier=tier-64) (2878.953207ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1280ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1282.697768ms)
✔ agent: single-file write (tier=tier-64) (1283.630471ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=6647ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (6674.230418ms)
✔ algorithm: merge intervals (tier=tier-64) (6674.783607ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6568ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6605.808972ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6606.32927ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=19920ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (19961.77457ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (19962.269284ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5181ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5204.352983ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5204.857076ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9406ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9450.343244ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9450.805295ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=11104ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (11129.166031ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (11129.751209ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=7171ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (7195.665598ms)
✔ deep-equal: structural equality (tier=tier-64) (7196.199275ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=9161ms files=[".claw",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (9186.69279ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (9187.221134ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6471ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6512.492597ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6512.99944ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=36479ms files=[".claw",".sandbox-home",".sandbox-tmp","package.json","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (36501.772988ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (36502.289998ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=11042ms files=[".claw",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (11080.348284ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (11080.84171ms)
  [1/10] ttft=1572ms
  [2/10] ttft=149ms
  [3/10] ttft=137ms
  [4/10] ttft=135ms
  [5/10] ttft=136ms
  [6/10] ttft=136ms
  [7/10] ttft=135ms
  [8/10] ttft=135ms
  [9/10] ttft=136ms
  [10/10] ttft=138ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=136ms · p95=1572ms · mean=281ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4982.138757ms)
✔ TTFT — time to first token (tier=tier-64) (4982.944024ms)
  [1/20] ok=true stop=tool_use 672ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 511ms
  [4/20] ok=true stop=tool_use 514ms
  [5/20] ok=true stop=tool_use 510ms
  [6/20] ok=true stop=tool_use 512ms
  [7/20] ok=true stop=tool_use 510ms
  [8/20] ok=true stop=tool_use 511ms
  [9/20] ok=true stop=tool_use 510ms
  [10/20] ok=true stop=tool_use 511ms
  [11/20] ok=true stop=tool_use 511ms
  [12/20] ok=true stop=tool_use 510ms
  [13/20] ok=true stop=tool_use 510ms
  [14/20] ok=true stop=tool_use 509ms
  [15/20] ok=true stop=tool_use 510ms
  [16/20] ok=true stop=tool_use 511ms
  [17/20] ok=true stop=tool_use 511ms
  [18/20] ok=true stop=tool_use 510ms
  [19/20] ok=true stop=tool_use 511ms
  [20/20] ok=true stop=tool_use 512ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 509ms · median 511ms · p95 672ms · mean 519ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10382.839169ms)
✔ tool-call roundtrip latency (tier=tier-64) (10385.941188ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=15674ms files=[".claw",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (15720.060668ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (15720.605674ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=19985ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (20010.302694ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (20010.780655ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=29512ms files=[".claw",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (29547.637348ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (29548.139476ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11799ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11835.991114ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11836.47395ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=7235ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (7273.337897ms)
✔ multi-file rename + signature change (tier=tier-64) (7273.864108ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4414ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (4439.522867ms)
✔ null-default: missing vs falsy (tier=tier-64) (4440.07137ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 6068ms textLen=2793 newlines=15 bullets=4
  [2/3] stop=end_turn 4809ms textLen=2382 newlines=11 bullets=4
  [3/3] stop=end_turn 4870ms textLen=2311 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## Understanding the Building Blocks of Modern UIs\n\nReact components are the fundamental building blocks of user interfaces in the React library. Think of them as independent, reusable pieces of code that encapsulate their own structure, behavior, and styling. Instead of writing monolithic scripts that manage the entir
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (15749.077461ms)
✔ prose quality via raw bridge (tier=tier-64) (15749.8463ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4345ms rawLen=1964 cleanLen=1767 newlines=5 bullets=3
  [2/3] exit=0 4290ms rawLen=1975 cleanLen=1775 newlines=5 bullets=3
  [3/3] exit=0 4451ms rawLen=2139 cleanLen=1894 newlines=6 bullets=4
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate markup, logic, and styling into a single unit of code. Think of them like custom HTML elements — you define them once and render them anywhere in your application. Each component manages its own 
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13088.031491ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13088.350326ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6208ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6243.920082ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6244.495252ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=5590ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (5624.44664ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (5624.977185ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6360ms files=[".claw",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6388.298855ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6388.830398ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6356ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6381.200543ms)
✔ state-machine: traffic light (tier=tier-64) (6381.738751ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6166ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6209.204236ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6209.75107ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 751ms
  [2/10] ok=true stop=tool_use tool_use=true 513ms
  [3/10] ok=true stop=tool_use tool_use=true 515ms
  [4/10] ok=true stop=tool_use tool_use=true 513ms
  [5/10] ok=true stop=tool_use tool_use=true 514ms
  [6/10] ok=true stop=tool_use tool_use=true 510ms
  [7/10] ok=true stop=tool_use tool_use=true 512ms
  [8/10] ok=true stop=tool_use tool_use=true 512ms
  [9/10] ok=true stop=tool_use tool_use=true 514ms
  [10/10] ok=true stop=tool_use tool_use=true 510ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 510ms · median 513ms · p95 751ms · mean 536ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5366.291067ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5367.263484ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=8365ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (8405.446331ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (8406.039915ms)
ℹ tests 31
ℹ suites 31
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 319398.070716
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 0 |

