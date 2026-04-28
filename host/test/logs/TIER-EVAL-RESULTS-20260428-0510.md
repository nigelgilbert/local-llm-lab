# Tier Eval Results — 2026-04-28 05:10

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-7f7c7bf6186d Creating 
 Container test-test-run-7f7c7bf6186d Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=7691ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (7718.028244ms)
✔ adversarial inputs: slugify (tier=tier-64) (7718.55712ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2872ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2875.349515ms)
✔ agent: parallel file writes (tier=tier-64) (2876.334141ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1802ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1805.447466ms)
✔ agent: single-file write (tier=tier-64) (1806.222175ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=11190ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (11218.749064ms)
✔ algorithm: merge intervals (tier=tier-64) (11219.28844ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=5949ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (5986.403985ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (5986.969152ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=19888ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (19933.9661ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (19934.464185ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=4993ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5019.958417ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5020.468333ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9303ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9338.480867ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9338.993534ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=89013ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (89037.372747ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (89037.923817ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=10977ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (11000.370907ms)
✔ deep-equal: structural equality (tier=tier-64) (11000.869836ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=10736ms files=[".claw",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (10761.406575ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (10761.901336ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6816ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6855.530234ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6856.065462ms)

=== expression-eval (tier-64) ===
  claw: exit=1 elapsed=78843ms files=[".claw",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (32890 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✖ claw implements evaluate handling precedence, assoc, errors (78845.151791ms)
✖ expression-eval: recursive-descent parser (tier=tier-64) (78845.817451ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=15050ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (15077.486264ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (15078.319639ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=10548ms files=[".claw",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (10592.653605ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (10593.172614ms)
  [1/10] ttft=1542ms
  [2/10] ttft=140ms
  [3/10] ttft=137ms
  [4/10] ttft=136ms
  [5/10] ttft=138ms
  [6/10] ttft=136ms
  [7/10] ttft=136ms
  [8/10] ttft=135ms
  [9/10] ttft=137ms
  [10/10] ttft=137ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=137ms · p95=1542ms · mean=277ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4940.838504ms)
✔ TTFT — time to first token (tier=tier-64) (4941.952136ms)
  [1/20] ok=true stop=tool_use 688ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 513ms
  [4/20] ok=true stop=tool_use 513ms
  [5/20] ok=true stop=tool_use 514ms
  [6/20] ok=true stop=tool_use 514ms
  [7/20] ok=true stop=tool_use 513ms
  [8/20] ok=true stop=tool_use 513ms
  [9/20] ok=true stop=tool_use 514ms
  [10/20] ok=true stop=tool_use 512ms
  [11/20] ok=true stop=tool_use 512ms
  [12/20] ok=true stop=tool_use 512ms
  [13/20] ok=true stop=tool_use 512ms
  [14/20] ok=true stop=tool_use 515ms
  [15/20] ok=true stop=tool_use 512ms
  [16/20] ok=true stop=tool_use 512ms
  [17/20] ok=true stop=tool_use 512ms
  [18/20] ok=true stop=tool_use 513ms
  [19/20] ok=true stop=tool_use 513ms
  [20/20] ok=true stop=tool_use 514ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 512ms · median 513ms · p95 688ms · mean 522ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10440.804744ms)
✔ tool-call roundtrip latency (tier=tier-64) (10441.146255ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=16519ms files=[".claw",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (16562.024507ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (16563.581497ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=20105ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (20132.747905ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (20133.281321ms)

=== mini-vm (tier-64) ===
  claw: exit=1 elapsed=233724ms files=[".claw",".sandbox-home",".sandbox-tmp","verify.js","vm.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (33081 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (233726.276274ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (233726.937607ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=29415ms files=[".claw",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (29450.689473ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (29451.204694ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11474ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11512.896361ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11513.396915ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=6419ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (6458.13451ms)
✔ multi-file rename + signature change (tier=tier-64) (6458.664899ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=5281ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (5306.132598ms)
✔ null-default: missing vs falsy (tier=tier-64) (5307.670679ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4893ms textLen=2248 newlines=13 bullets=4
  [2/3] stop=end_turn 5833ms textLen=2759 newlines=11 bullets=4
  [3/3] stop=end_turn 4539ms textLen=2164 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are the fundamental building blocks of any React application. Think of them as independent, reusable pieces of code that act like JavaScript functions but return HTML-like markup known as JSX. This modular approach allows developers to break down complex user interfaces i
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (15266.823859ms)
✔ prose quality via raw bridge (tier=tier-64) (15267.678506ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 5102ms rawLen=2278 cleanLen=2000 newlines=6 bullets=4
  [2/3] exit=0 4421ms rawLen=2096 cleanLen=1884 newlines=5 bullets=3
  [3/3] exit=0 4508ms rawLen=2083 cleanLen=1916 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the fundamental building blocks of any React application. Think of them as independent, reusable pieces of UI — much like LEGO bricks that you can snap together to build something larger. Each component encapsulates its own structure, behavior, and styl
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (14032.620655ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (14032.893036ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6354ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6392.060877ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6392.600974ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=6795ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (6823.568527ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (6824.105201ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6762ms files=[".claw",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6786.613615ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6787.122662ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6527ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6551.170477ms)
✔ state-machine: traffic light (tier=tier-64) (6551.720732ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=7021ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (7058.491023ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (7059.024528ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 764ms
  [2/10] ok=true stop=tool_use tool_use=true 513ms
  [3/10] ok=true stop=tool_use tool_use=true 512ms
  [4/10] ok=true stop=tool_use tool_use=true 517ms
  [5/10] ok=true stop=tool_use tool_use=true 514ms
  [6/10] ok=true stop=tool_use tool_use=true 517ms
  [7/10] ok=true stop=tool_use tool_use=true 513ms
  [8/10] ok=true stop=tool_use tool_use=true 514ms
  [9/10] ok=true stop=tool_use tool_use=true 514ms
  [10/10] ok=true stop=tool_use tool_use=true 513ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 512ms · median 514ms · p95 764ms · mean 539ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5393.87279ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5395.586637ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=8895ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (8939.823486ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (8940.375574ms)
ℹ tests 33
ℹ suites 33
ℹ pass 31
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 702671.53285

✖ failing tests:

test at __tests__/tier-eval/expression-eval.test.js:121:3
✖ claw implements evaluate handling precedence, assoc, errors (78845.151791ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/expression-eval.test.js:128:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (233726.276274ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/mini-vm.test.js:191:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 1 |

