# Tier Eval Results — 2026-04-28 09:51

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-0fffcd26060f Creating 
 Container test-test-run-0fffcd26060f Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=11119ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (11143.305605ms)
✔ adversarial inputs: slugify (tier=tier-64) (11143.816697ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2851ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2852.83197ms)
✔ agent: parallel file writes (tier=tier-64) (2853.724486ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1270ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1272.906497ms)
✔ agent: single-file write (tier=tier-64) (1273.833348ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5773ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (5800.088219ms)
✔ algorithm: merge intervals (tier=tier-64) (5800.658855ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6223ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6263.328209ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6263.816218ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=19707ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (19747.207454ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (19747.720839ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5193ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed. stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5222.178168ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5222.668552ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9298ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9336.289969ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9336.785852ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=11994ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (12021.116794ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (12021.646054ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=7521ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (7547.662413ms)
✔ deep-equal: structural equality (tier=tier-64) (7548.143713ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=9108ms files=[".claw",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (9140.479284ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (9140.991584ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6458ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6497.850966ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6498.383183ms)

=== expression-eval (tier-64) ===
  claw: exit=1 elapsed=84253ms files=[".claw",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (36096 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✖ claw implements evaluate handling precedence, assoc, errors (84254.563015ms)
✖ expression-eval: recursive-descent parser (tier=tier-64) (84255.18073ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=30309ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (30334.504606ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (30335.014444ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=11279ms files=[".claw",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (11318.919128ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (11319.754386ms)
  [1/10] ttft=1503ms
  [2/10] ttft=139ms
  [3/10] ttft=137ms
  [4/10] ttft=137ms
  [5/10] ttft=154ms
  [6/10] ttft=136ms
  [7/10] ttft=135ms
  [8/10] ttft=137ms
  [9/10] ttft=138ms
  [10/10] ttft=138ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=138ms · p95=1503ms · mean=275ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4921.297539ms)
✔ TTFT — time to first token (tier=tier-64) (4922.167559ms)
  [1/20] ok=true stop=tool_use 658ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 511ms
  [4/20] ok=true stop=tool_use 514ms
  [5/20] ok=true stop=tool_use 511ms
  [6/20] ok=true stop=tool_use 513ms
  [7/20] ok=true stop=tool_use 513ms
  [8/20] ok=true stop=tool_use 512ms
  [9/20] ok=true stop=tool_use 512ms
  [10/20] ok=true stop=tool_use 511ms
  [11/20] ok=true stop=tool_use 511ms
  [12/20] ok=true stop=tool_use 515ms
  [13/20] ok=true stop=tool_use 512ms
  [14/20] ok=true stop=tool_use 515ms
  [15/20] ok=true stop=tool_use 514ms
  [16/20] ok=true stop=tool_use 512ms
  [17/20] ok=true stop=tool_use 514ms
  [18/20] ok=true stop=tool_use 513ms
  [19/20] ok=true stop=tool_use 513ms
  [20/20] ok=true stop=tool_use 517ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 511ms · median 513ms · p95 658ms · mean 520ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10414.331901ms)
✔ tool-call roundtrip latency (tier=tier-64) (10415.259619ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=17711ms files=[".claw",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (17756.975611ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (17757.544049ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=26254ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (26277.362324ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (26277.877028ms)

=== mini-vm (tier-64) ===
  claw: exit=1 elapsed=112972ms files=[".claw",".sandbox-home",".sandbox-tmp","verify.js","vm.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (35704 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (112974.610011ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (112975.469562ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=29254ms files=[".claw",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (29294.402506ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (29295.808189ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=10296ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (10338.00581ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (10338.530317ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=6605ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (6640.570197ms)
✔ multi-file rename + signature change (tier=tier-64) (6641.139287ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4755ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (4781.207399ms)
✔ null-default: missing vs falsy (tier=tier-64) (4781.70228ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4938ms textLen=2283 newlines=13 bullets=4
  [2/3] stop=end_turn 4994ms textLen=2421 newlines=13 bullets=4
  [3/3] stop=end_turn 4364ms textLen=2160 newlines=6 bullets=0
  sample[0] (first 320 chars, \n literal):
    ## The Building Blocks of User Interfaces\n\nReact is fundamentally built on the concept of components, which serve as the independent, reusable building blocks of a user interface. Think of a component like a Lego brick; each piece has its own specific shape and function, but when combined with others, they create compl
▶ prose quality via raw bridge (tier=tier-64)
  ✖ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14298.576491ms)
✖ prose quality via raw bridge (tier=tier-64) (14299.978632ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 5457ms rawLen=2451 cleanLen=2140 newlines=5 bullets=3
  [2/3] exit=0 4752ms rawLen=2243 cleanLen=1995 newlines=5 bullets=3
  [3/3] exit=0 3926ms rawLen=1889 cleanLen=1626 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the building blocks of every React application. Think of them as reusable, self-contained pieces of UI — like individual LEGO bricks that you can snap together to build an entire house. Each component encapsulates its own structure, styling, and behavio
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (14136.430787ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (14136.815458ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6047ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6088.504484ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6089.054323ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=5427ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (5461.746593ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (5462.250265ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6636ms files=[".claw",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6661.656074ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6662.085454ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6739ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6764.438709ms)
✔ state-machine: traffic light (tier=tier-64) (6764.970715ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6093ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6130.255205ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6130.798294ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 720ms
  [2/10] ok=true stop=tool_use tool_use=true 519ms
  [3/10] ok=true stop=tool_use tool_use=true 516ms
  [4/10] ok=true stop=tool_use tool_use=true 515ms
  [5/10] ok=true stop=tool_use tool_use=true 514ms
  [6/10] ok=true stop=tool_use tool_use=true 516ms
  [7/10] ok=true stop=tool_use tool_use=true 515ms
  [8/10] ok=true stop=tool_use tool_use=true 516ms
  [9/10] ok=true stop=tool_use tool_use=true 514ms
  [10/10] ok=true stop=tool_use tool_use=true 513ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 513ms · median 516ms · p95 720ms · mean 536ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5360.341535ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5362.445892ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=7902ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (7941.973923ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (7942.536971ms)
ℹ tests 33
ℹ suites 33
ℹ pass 30
ℹ fail 3
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 519802.999534

✖ failing tests:

test at __tests__/tier-eval/expression-eval.test.js:121:3
✖ claw implements evaluate handling precedence, assoc, errors (84254.563015ms)
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
✖ claw implements run handling all 13 opcodes + error cases (112974.610011ms)
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

test at __tests__/tier-eval/prose-quality.test.js:55:3
✖ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14298.576491ms)
  AssertionError [ERR_ASSERTION]: [3] missing bullet structure: 0 bullet-lines
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/prose-quality.test.js:95:16)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }

```

Exit code: 1

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 1 |

