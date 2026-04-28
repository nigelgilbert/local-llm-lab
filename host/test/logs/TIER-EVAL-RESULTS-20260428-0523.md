# Tier Eval Results — 2026-04-28 05:23

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-8ebf3e3191a4 Creating 
 Container test-test-run-8ebf3e3191a4 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=11068ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (11094.84508ms)
✔ adversarial inputs: slugify (tier=tier-64) (11095.359459ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2850ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2852.918604ms)
✔ agent: parallel file writes (tier=tier-64) (2853.810569ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=3140ms files=[".claw",".sandbox-home",".sandbox-tmp","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (3142.718373ms)
✔ agent: single-file write (tier=tier-64) (3143.521005ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5571ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (5598.716374ms)
✔ algorithm: merge intervals (tier=tier-64) (5599.274129ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6822ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6861.273171ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6861.775591ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=19848ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (19889.965317ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (19890.491101ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5309ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed. stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5334.421403ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5334.894183ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9601ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9645.230171ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9645.733158ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=23906ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (23932.803731ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (23933.309802ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=10027ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (10057.174729ms)
✔ deep-equal: structural equality (tier=tier-64) (10057.717757ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=10367ms files=[".claw",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (10393.732266ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (10394.31446ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6779ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6817.717605ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6818.254632ms)

=== expression-eval (tier-64) ===
  claw: exit=0 elapsed=73845ms files=[".claw",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✔ claw implements evaluate handling precedence, assoc, errors (73867.537161ms)
✔ expression-eval: recursive-descent parser (tier=tier-64) (73868.090494ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=15527ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (15554.521916ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (15555.030506ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=11428ms files=[".claw",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (11469.640262ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (11470.20431ms)
  [1/10] ttft=1511ms
  [2/10] ttft=143ms
  [3/10] ttft=136ms
  [4/10] ttft=138ms
  [5/10] ttft=137ms
  [6/10] ttft=134ms
  [7/10] ttft=135ms
  [8/10] ttft=135ms
  [9/10] ttft=136ms
  [10/10] ttft=136ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=134ms · median=136ms · p95=1511ms · mean=274ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4913.874174ms)
✔ TTFT — time to first token (tier=tier-64) (4914.962312ms)
  [1/20] ok=true stop=tool_use 661ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 512ms
  [4/20] ok=true stop=tool_use 516ms
  [5/20] ok=true stop=tool_use 511ms
  [6/20] ok=true stop=tool_use 513ms
  [7/20] ok=true stop=tool_use 512ms
  [8/20] ok=true stop=tool_use 514ms
  [9/20] ok=true stop=tool_use 511ms
  [10/20] ok=true stop=tool_use 512ms
  [11/20] ok=true stop=tool_use 510ms
  [12/20] ok=true stop=tool_use 512ms
  [13/20] ok=true stop=tool_use 513ms
  [14/20] ok=true stop=tool_use 511ms
  [15/20] ok=true stop=tool_use 510ms
  [16/20] ok=true stop=tool_use 512ms
  [17/20] ok=true stop=tool_use 514ms
  [18/20] ok=true stop=tool_use 513ms
  [19/20] ok=true stop=tool_use 511ms
  [20/20] ok=true stop=tool_use 510ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 510ms · median 512ms · p95 661ms · mean 520ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10392.690075ms)
✔ tool-call roundtrip latency (tier=tier-64) (10393.031246ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=16664ms files=[".claw",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (16710.089078ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (16710.651711ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=42493ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (42523.356044ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (42523.808467ms)
▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (240009.187063ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (240013.436452ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=31789ms files=[".claw",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (31830.237735ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (31830.727908ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11971ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (12007.407625ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (12007.954383ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=8109ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (8158.307943ms)
✔ multi-file rename + signature change (tier=tier-64) (8158.834866ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=5063ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (5089.949781ms)
✔ null-default: missing vs falsy (tier=tier-64) (5091.855305ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4753ms textLen=2151 newlines=13 bullets=4
  [2/3] stop=end_turn 5131ms textLen=2402 newlines=11 bullets=4
  [3/3] stop=end_turn 5096ms textLen=2327 newlines=15 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are the fundamental building blocks of modern web applications built with the React library. Think of them as reusable, independent pieces of UI that handle their own logic and rendering. Instead of writing one massive file containing all your HTML, CSS, and JavaScript, y
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14981.348608ms)
✔ prose quality via raw bridge (tier=tier-64) (14982.310662ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4220ms rawLen=1837 cleanLen=1568 newlines=5 bullets=3
  [2/3] exit=0 3351ms rawLen=1619 cleanLen=1437 newlines=5 bullets=3
  [3/3] exit=0 4181ms rawLen=2024 cleanLen=1716 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate both the structure (JSX markup) and behavior (logic, state, effects) of a user interface element. Think of them as custom HTML elements you define yourself — each one responsible for rendering a 
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11755.467198ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (11755.70391ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6412ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6450.034296ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6450.570345ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=6048ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (6085.436204ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (6085.944377ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6839ms files=[".claw",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6861.993752ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6862.538717ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=9437ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","package.json","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (9464.130632ms)
✔ state-machine: traffic light (tier=tier-64) (9464.661139ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6087ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6122.083844ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6122.469808ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 747ms
  [2/10] ok=true stop=tool_use tool_use=true 515ms
  [3/10] ok=true stop=tool_use tool_use=true 513ms
  [4/10] ok=true stop=tool_use tool_use=true 516ms
  [5/10] ok=true stop=tool_use tool_use=true 534ms
  [6/10] ok=true stop=tool_use tool_use=true 518ms
  [7/10] ok=true stop=tool_use tool_use=true 513ms
  [8/10] ok=true stop=tool_use tool_use=true 513ms
  [9/10] ok=true stop=tool_use tool_use=true 516ms
  [10/10] ok=true stop=tool_use tool_use=true 517ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 513ms · median 516ms · p95 747ms · mean 540ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5404.239222ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5404.981023ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=17096ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (17136.370661ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (17136.979293ms)
ℹ tests 33
ℹ suites 33
ℹ pass 32
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 673253.867394

✖ failing tests:

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (240009.187063ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 1 |

