# Tier Eval Results — 2026-04-28 10:01

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-29def20b18d1 Creating 
 Container test-test-run-29def20b18d1 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=7559ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (7583.160424ms)
✔ adversarial inputs: slugify (tier=tier-64) (7583.670179ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2874ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2875.818236ms)
✔ agent: parallel file writes (tier=tier-64) (2876.737038ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=3157ms files=[".claw",".sandbox-home",".sandbox-tmp","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (3160.042544ms)
✔ agent: single-file write (tier=tier-64) (3160.761844ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5625ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (5650.016903ms)
✔ algorithm: merge intervals (tier=tier-64) (5650.508408ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=5917ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (5958.074594ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (5958.586016ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=19899ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (19936.86134ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (19937.320636ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5196ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5225.779845ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5226.277351ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9172ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9211.888215ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9212.399471ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=12976ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (13002.015339ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (13002.540845ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=7523ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (7546.905755ms)
✔ deep-equal: structural equality (tier=tier-64) (7547.404677ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=10368ms files=[".claw",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (10396.876877ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (10397.378841ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6901ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6938.063952ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6938.633208ms)

=== expression-eval (tier-64) ===
  claw: exit=1 elapsed=68963ms files=[".claw",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (32821 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✖ claw implements evaluate handling precedence, assoc, errors (68965.977898ms)
✖ expression-eval: recursive-descent parser (tier=tier-64) (68966.719656ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=38256ms files=[".claw",".sandbox-home",".sandbox-tmp","package.json","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (38281.502254ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (38282.034593ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=11599ms files=[".claw",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (11636.907576ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (11637.305788ms)
  [1/10] ttft=1507ms
  [2/10] ttft=148ms
  [3/10] ttft=138ms
  [4/10] ttft=148ms
  [5/10] ttft=137ms
  [6/10] ttft=138ms
  [7/10] ttft=137ms
  [8/10] ttft=137ms
  [9/10] ttft=138ms
  [10/10] ttft=136ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=136ms · median=138ms · p95=1507ms · mean=276ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4928.188381ms)
✔ TTFT — time to first token (tier=tier-64) (4929.213267ms)
  [1/20] ok=true stop=tool_use 657ms
  [2/20] ok=true stop=tool_use 512ms
  [3/20] ok=true stop=tool_use 511ms
  [4/20] ok=true stop=tool_use 515ms
  [5/20] ok=true stop=tool_use 511ms
  [6/20] ok=true stop=tool_use 512ms
  [7/20] ok=true stop=tool_use 513ms
  [8/20] ok=true stop=tool_use 512ms
  [9/20] ok=true stop=tool_use 512ms
  [10/20] ok=true stop=tool_use 512ms
  [11/20] ok=true stop=tool_use 511ms
  [12/20] ok=true stop=tool_use 513ms
  [13/20] ok=true stop=tool_use 515ms
  [14/20] ok=true stop=tool_use 511ms
  [15/20] ok=true stop=tool_use 512ms
  [16/20] ok=true stop=tool_use 510ms
  [17/20] ok=true stop=tool_use 511ms
  [18/20] ok=true stop=tool_use 510ms
  [19/20] ok=true stop=tool_use 512ms
  [20/20] ok=true stop=tool_use 512ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 510ms · median 512ms · p95 657ms · mean 519ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10396.429387ms)
✔ tool-call roundtrip latency (tier=tier-64) (10396.799474ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=18860ms files=[".claw",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (18904.699814ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (18905.24332ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=39801ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (39826.367939ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (39826.882736ms)

=== mini-vm (tier-64) ===
  claw: exit=1 elapsed=165626ms files=[".claw",".sandbox-home",".sandbox-tmp","package.json","verify.js","vm.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (32984 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (165627.402256ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (165628.033429ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=32239ms files=[".claw",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (32276.464538ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (32276.940252ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11797ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11833.525913ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11834.056211ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=6348ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (6387.963156ms)
✔ multi-file rename + signature change (tier=tier-64) (6388.467537ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=5850ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (5876.054632ms)
✔ null-default: missing vs falsy (tier=tier-64) (5876.554888ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4771ms textLen=2199 newlines=13 bullets=4
  [2/3] stop=end_turn 4777ms textLen=2289 newlines=13 bullets=4
  [3/3] stop=end_turn 4948ms textLen=2421 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## Understanding the Core Concept\n\nReact components are the fundamental building blocks of modern user interfaces, acting as independent, reusable pieces of code that encapsulate logic, structure, and styling. Think of them as custom HTML elements that you define yourself. Instead of writing one massive file for your e
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14498.005686ms)
✔ prose quality via raw bridge (tier=tier-64) (14498.752736ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4143ms rawLen=1816 cleanLen=1628 newlines=5 bullets=3
  [2/3] exit=0 4237ms rawLen=1918 cleanLen=1748 newlines=6 bullets=4
  [3/3] exit=0 5216ms rawLen=2475 cleanLen=2236 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate markup, styling, and behavior into a single unit. Think of them as custom HTML elements you define yourself — each one manages its own visual output and internal state. By breaking a user interfa
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13597.823999ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13598.102585ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6189ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6227.564841ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6228.131389ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=5556ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (5591.827035ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (5592.356124ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=7809ms files=[".claw",".sandbox-home",".sandbox-tmp","package.json","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (7835.409874ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (7835.944338ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6139ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6166.282207ms)
✔ state-machine: traffic light (tier=tier-64) (6166.83342ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=7351ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (7384.794652ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (7385.23049ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 741ms
  [2/10] ok=true stop=tool_use tool_use=true 516ms
  [3/10] ok=true stop=tool_use tool_use=true 513ms
  [4/10] ok=true stop=tool_use tool_use=true 513ms
  [5/10] ok=true stop=tool_use tool_use=true 512ms
  [6/10] ok=true stop=tool_use tool_use=true 514ms
  [7/10] ok=true stop=tool_use tool_use=true 513ms
  [8/10] ok=true stop=tool_use tool_use=true 513ms
  [9/10] ok=true stop=tool_use tool_use=true 512ms
  [10/10] ok=true stop=tool_use tool_use=true 512ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 512ms · median 513ms · p95 741ms · mean 536ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5361.262032ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5362.075416ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=11418ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (11461.788763ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (11462.353477ms)
ℹ tests 33
ℹ suites 33
ℹ pass 31
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 591343.908555

✖ failing tests:

test at __tests__/tier-eval/expression-eval.test.js:121:3
✖ claw implements evaluate handling precedence, assoc, errors (68965.977898ms)
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
✖ claw implements run handling all 13 opcodes + error cases (165627.402256ms)
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

