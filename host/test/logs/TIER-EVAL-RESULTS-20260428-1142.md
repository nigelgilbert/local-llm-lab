# Tier Eval Results — 2026-04-28 11:42

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-43dd76804d50 Creating 
 Container test-test-run-43dd76804d50 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=10652ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (10676.843539ms)
✔ adversarial inputs: slugify (tier=tier-64) (10677.348204ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2843ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2845.204468ms)
✔ agent: parallel file writes (tier=tier-64) (2845.875881ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1277ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1280.419596ms)
✔ agent: single-file write (tier=tier-64) (1281.3063ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=6503ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (6528.659554ms)
✔ algorithm: merge intervals (tier=tier-64) (6529.240135ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=5697ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (5737.167021ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (5737.708184ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=19897ms files=[".claw",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (19936.51742ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (19937.020293ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5504ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed. stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5532.129779ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5532.624318ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9306ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (9338.838959ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (9339.280707ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=11566ms files=[".claw",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (11591.16921ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (11591.683458ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=10944ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (10968.605176ms)
✔ deep-equal: structural equality (tier=tier-64) (10969.144385ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=8731ms files=[".claw",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (8759.24853ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (8759.797698ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6716ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6757.248451ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6757.830285ms)

=== expression-eval (tier-64) ===
  claw: exit=0 elapsed=44651ms files=[".claw",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✔ claw implements evaluate handling precedence, assoc, errors (44675.133295ms)
✔ expression-eval: recursive-descent parser (tier=tier-64) (44675.627003ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=15107ms files=[".claw",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (15136.641178ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (15137.113221ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=11890ms files=[".claw",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (11929.120583ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (11929.615916ms)
  [1/10] ttft=1548ms
  [2/10] ttft=143ms
  [3/10] ttft=137ms
  [4/10] ttft=136ms
  [5/10] ttft=138ms
  [6/10] ttft=137ms
  [7/10] ttft=135ms
  [8/10] ttft=137ms
  [9/10] ttft=136ms
  [10/10] ttft=138ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=137ms · p95=1548ms · mean=279ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4950.010716ms)
✔ TTFT — time to first token (tier=tier-64) (4950.810426ms)
  [1/20] ok=true stop=tool_use 657ms
  [2/20] ok=true stop=tool_use 513ms
  [3/20] ok=true stop=tool_use 514ms
  [4/20] ok=true stop=tool_use 514ms
  [5/20] ok=true stop=tool_use 512ms
  [6/20] ok=true stop=tool_use 511ms
  [7/20] ok=true stop=tool_use 513ms
  [8/20] ok=true stop=tool_use 512ms
  [9/20] ok=true stop=tool_use 511ms
  [10/20] ok=true stop=tool_use 510ms
  [11/20] ok=true stop=tool_use 508ms
  [12/20] ok=true stop=tool_use 512ms
  [13/20] ok=true stop=tool_use 514ms
  [14/20] ok=true stop=tool_use 511ms
  [15/20] ok=true stop=tool_use 513ms
  [16/20] ok=true stop=tool_use 515ms
  [17/20] ok=true stop=tool_use 514ms
  [18/20] ok=true stop=tool_use 515ms
  [19/20] ok=true stop=tool_use 514ms
  [20/20] ok=true stop=tool_use 514ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 508ms · median 513ms · p95 657ms · mean 520ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10404.573373ms)
✔ tool-call roundtrip latency (tier=tier-64) (10404.988916ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=17160ms files=[".claw",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (17206.732124ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (17207.2985ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=45311ms files=[".claw",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (45338.211888ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (45338.741181ms)
▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (240025.16807ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (240026.804784ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=1 elapsed=15879ms files=[".claw",".sandbox-home",".sandbox-tmp","helpers.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 199; first 200 chars of body: {"error": {"message": "litellm.MidStreamFallbackError: litellm.APIConnectionError: APIConnectionError: OpenAIException - Context size has been exceeded.", "type": null, "param": null, "code": "500"}}

Run `claw --help` for usage.

▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✖ claw fixes the bugs without breaking the decoy (15898.058954ms)
✖ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (15899.180041ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11136ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11183.459368ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11184.030286ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=6757ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (6795.209035ms)
✔ multi-file rename + signature change (tier=tier-64) (6795.748078ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4573ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (4599.063133ms)
✔ null-default: missing vs falsy (tier=tier-64) (4599.658302ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4897ms textLen=2296 newlines=13 bullets=4
  [2/3] stop=end_turn 5109ms textLen=2490 newlines=13 bullets=4
  [3/3] stop=end_turn 4117ms textLen=1961 newlines=11 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## The Building Blocks of UI\n\nAt its core, a React component is an independent, reusable piece of code that returns HTML-like markup known as JSX. Think of it like a LEGO brick; you build small, manageable units that can be combined in countless ways to construct complex user interfaces. This modular approach allows de
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14124.682196ms)
✔ prose quality via raw bridge (tier=tier-64) (14125.456074ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4288ms rawLen=1858 cleanLen=1688 newlines=5 bullets=3
  [2/3] exit=0 3256ms rawLen=1606 cleanLen=1406 newlines=5 bullets=3
  [3/3] exit=0 4421ms rawLen=2119 cleanLen=1907 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate UI elements and their associated logic. Think of them as custom HTML tags you define yourself — each component manages its own structure, behavior, and visual output. React applications are essen
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (11965.496829ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (11965.736454ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6335ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6377.244323ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6377.827158ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=6200ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (6238.53017ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (6239.020422ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6547ms files=[".claw",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6573.156949ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6573.684284ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6750ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6775.087346ms)
✔ state-machine: traffic light (tier=tier-64) (6775.655723ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=7239ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (7279.181334ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (7279.691002ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 728ms
  [2/10] ok=true stop=tool_use tool_use=true 517ms
  [3/10] ok=true stop=tool_use tool_use=true 516ms
  [4/10] ok=true stop=tool_use tool_use=true 515ms
  [5/10] ok=true stop=tool_use tool_use=true 516ms
  [6/10] ok=true stop=tool_use tool_use=true 545ms
  [7/10] ok=true stop=tool_use tool_use=true 520ms
  [8/10] ok=true stop=tool_use tool_use=true 516ms
  [9/10] ok=true stop=tool_use tool_use=true 520ms
  [10/10] ok=true stop=tool_use tool_use=true 517ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 515ms · median 517ms · p95 728ms · mean 541ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5411.211073ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5412.84862ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=8690ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (8730.077851ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (8730.665019ms)
ℹ tests 33
ℹ suites 33
ℹ pass 31
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 602406.606522

✖ failing tests:

test at __tests__/tier-eval/mini-vm.test.js:184:3
✖ claw implements run handling all 13 opcodes + error cases (240025.16807ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:46:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/multi-bug-decoy.test.js:116:3
✖ claw fixes the bugs without breaking the decoy (15898.058954ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-bug-decoy.test.js:129:12)
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

