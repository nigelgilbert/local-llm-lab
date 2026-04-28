# Tier Eval Results — 2026-04-28 11:29

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-a786671915d0 Creating 
 Container test-test-run-a786671915d0 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=10680ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (10705.225671ms)
✔ adversarial inputs: slugify (tier=tier-64) (10705.74258ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2855ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2857.751798ms)
✔ agent: parallel file writes (tier=tier-64) (2858.502871ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=3151ms files=[".claw",".sandbox-home",".sandbox-tmp","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (3152.85163ms)
✔ agent: single-file write (tier=tier-64) (3153.64212ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5658ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (5684.070035ms)
✔ algorithm: merge intervals (tier=tier-64) (5684.722985ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6638ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6677.360773ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6677.899141ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=20570ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (20614.244931ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (20614.740383ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=4998ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5027.584504ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5028.099664ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=10005ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (10044.673962ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (10045.181038ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=10281ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (10315.219936ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (10315.791637ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=6691ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (6721.378076ms)
✔ deep-equal: structural equality (tier=tier-64) (6721.94386ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=6198ms files=[".claw",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (6227.131198ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (6227.702731ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=7216ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (7259.039223ms)
✔ distractor: one buggy helper among three (tier=tier-64) (7259.588549ms)

=== expression-eval (tier-64) ===
  claw: exit=0 elapsed=49887ms files=[".claw",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✔ claw implements evaluate handling precedence, assoc, errors (49911.974709ms)
✔ expression-eval: recursive-descent parser (tier=tier-64) (49912.468577ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=49492ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (49518.35348ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (49518.816245ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=11388ms files=[".claw",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (11426.557725ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (11427.044558ms)
  [1/10] ttft=1517ms
  [2/10] ttft=141ms
  [3/10] ttft=140ms
  [4/10] ttft=138ms
  [5/10] ttft=136ms
  [6/10] ttft=135ms
  [7/10] ttft=138ms
  [8/10] ttft=136ms
  [9/10] ttft=136ms
  [10/10] ttft=137ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=138ms · p95=1517ms · mean=275ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4927.974889ms)
✔ TTFT — time to first token (tier=tier-64) (4928.834224ms)
  [1/20] ok=true stop=tool_use 669ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 513ms
  [4/20] ok=true stop=tool_use 514ms
  [5/20] ok=true stop=tool_use 510ms
  [6/20] ok=true stop=tool_use 510ms
  [7/20] ok=true stop=tool_use 512ms
  [8/20] ok=true stop=tool_use 514ms
  [9/20] ok=true stop=tool_use 512ms
  [10/20] ok=true stop=tool_use 513ms
  [11/20] ok=true stop=tool_use 513ms
  [12/20] ok=true stop=tool_use 518ms
  [13/20] ok=true stop=tool_use 517ms
  [14/20] ok=true stop=tool_use 515ms
  [15/20] ok=true stop=tool_use 514ms
  [16/20] ok=true stop=tool_use 513ms
  [17/20] ok=true stop=tool_use 515ms
  [18/20] ok=true stop=tool_use 512ms
  [19/20] ok=true stop=tool_use 512ms
  [20/20] ok=true stop=tool_use 515ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 510ms · median 513ms · p95 669ms · mean 521ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10437.035538ms)
✔ tool-call roundtrip latency (tier=tier-64) (10437.423462ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=16692ms files=[".claw",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (16739.931413ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (16740.504733ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=21053ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (21077.460464ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (21077.955092ms)
▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (240016.250057ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (240018.271052ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=28020ms files=[".claw",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (28064.858222ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (28065.958665ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=12055ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (12094.111521ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (12094.639366ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=8252ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (8291.373171ms)
✔ multi-file rename + signature change (tier=tier-64) (8291.895889ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=5202ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (5229.397353ms)
✔ null-default: missing vs falsy (tier=tier-64) (5229.923905ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 5743ms textLen=2684 newlines=15 bullets=4
  [2/3] stop=end_turn 5105ms textLen=2351 newlines=11 bullets=4
  [3/3] stop=end_turn 6117ms textLen=2939 newlines=15 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## Understanding React Components\n\nReact components are the fundamental building blocks of modern web applications. Think of them as independent, reusable pieces of UI, similar to how HTML tags work but with much more power. Just as a car is made up of engines, wheels, and seats, a complex website is constructed from n
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (16966.428927ms)
✔ prose quality via raw bridge (tier=tier-64) (16967.000651ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4730ms rawLen=2132 cleanLen=1884 newlines=5 bullets=3
  [2/3] exit=0 4305ms rawLen=2019 cleanLen=1801 newlines=5 bullets=3
  [3/3] exit=0 4584ms rawLen=2158 cleanLen=1940 newlines=6 bullets=4
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the fundamental building blocks of every React application. Think of them as independent, reusable LEGO bricks that each handle a specific piece of UI — a button, a navigation bar, a form, or an entire page. Under the hood, a component is simply a JavaS
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13619.657292ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13619.867302ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=5537ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (5582.367709ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (5582.921142ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=6215ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (6252.238212ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (6252.702892ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6186ms files=[".claw",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6213.383078ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6213.933094ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6625ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6651.872538ms)
✔ state-machine: traffic light (tier=tier-64) (6652.401345ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6399ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6438.0383ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6438.450854ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 755ms
  [2/10] ok=true stop=tool_use tool_use=true 513ms
  [3/10] ok=true stop=tool_use tool_use=true 513ms
  [4/10] ok=true stop=tool_use tool_use=true 510ms
  [5/10] ok=true stop=tool_use tool_use=true 511ms
  [6/10] ok=true stop=tool_use tool_use=true 512ms
  [7/10] ok=true stop=tool_use tool_use=true 512ms
  [8/10] ok=true stop=tool_use tool_use=true 512ms
  [9/10] ok=true stop=tool_use tool_use=true 512ms
  [10/10] ok=true stop=tool_use tool_use=true 510ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 510ms · median 512ms · p95 755ms · mean 536ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5362.267495ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5364.609731ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=10241ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (10285.875234ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (10286.434708ms)
ℹ tests 33
ℹ suites 33
ℹ pass 32
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 631230.872999

✖ failing tests:

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (240016.250057ms)
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

