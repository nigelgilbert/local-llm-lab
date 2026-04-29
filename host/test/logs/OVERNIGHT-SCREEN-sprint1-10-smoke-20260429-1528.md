# Overnight Cross-Tier Screen — sprint1-10-smoke-20260429-1528

- Date: 2026-04-29 15:28
- Tiers: 64
- Reps per tier: 1
- Harness git SHA: ab1e72a
- Registry: /Users/nigel/Desktop/bench/lab/host/test/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
- Hint file: present
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=64

```
 Container test-test-run-79cf03ffa2d9 Creating 
 Container test-test-run-79cf03ffa2d9 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=9719ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended adversarial-input row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (9759.181641ms)
✔ adversarial inputs: slugify (tier=tier-64) (9760.009508ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2864ms files=[".claw",".claw-runtime","a.py","b.py","c.py"]
[run-registry] appended agent-parallel row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2882.008299ms)
✔ agent: parallel file writes (tier=tier-64) (2882.559793ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1717ms files=[".claw",".claw-runtime","hello.py"]
[run-registry] appended agent-single row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1734.237279ms)
✔ agent: single-file write (tier=tier-64) (1734.808148ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5499ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended algorithm-intervals row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (5536.949969ms)
✔ algorithm: merge intervals (tier=tier-64) (5537.421048ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6825ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended api-evolution row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6871.626857ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6872.070936ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=19402ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascading-bugs row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (19452.595154ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (19453.023066ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5456ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout=All assertions passed. stderr=
[run-registry] appended code-self-test row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5492.90058ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5493.345367ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=9963ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended comment-spec row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (10014.670359ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (10015.047855ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=19560ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended csv-parser row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (19599.084053ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (19599.501965ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=9973ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended deep-equal row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (10008.699605ms)
✔ deep-equal: structural equality (tier=tier-64) (10009.133894ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=9766ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended dependency-graph row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (9808.963827ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (9809.452034ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=7736ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended distractor row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (7785.951587ms)
✔ distractor: one buggy helper among three (tier=tier-64) (7786.476918ms)

=== eight-functions (tier-64) ===
  claw: exit=0 elapsed=21513ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","chunk.js","clamp.js","compact.js","deepFlatten.js","flatten.js","formatHex.js","omit.js","pad.js","pick.js","safeIndex.js","sortedKeys.js","unique.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended eight-functions row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ eight-functions: 12 helpers with cross-file deps (tier=tier-64)
  ✔ claw implements all twelve helpers with correct cross-file imports (21548.124105ms)
✔ eight-functions: 12 helpers with cross-file deps (tier=tier-64) (21548.560188ms)

=== expression-eval (tier-64) ===
  claw: exit=0 elapsed=132703ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended expression-eval row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✔ claw implements evaluate handling precedence, assoc, errors (132740.457497ms)
✔ expression-eval: recursive-descent parser (tier=tier-64) (132740.870204ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=27192ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended json-schema-validate row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (27229.955552ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (27230.395426ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=11426ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended large-refactor row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (11476.857403ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (11477.274695ms)
  [1/10] ttft=1509ms
  [2/10] ttft=139ms
  [3/10] ttft=136ms
  [4/10] ttft=136ms
  [5/10] ttft=136ms
  [6/10] ttft=139ms
  [7/10] ttft=137ms
  [8/10] ttft=138ms
  [9/10] ttft=137ms
  [10/10] ttft=137ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=136ms · median=137ms · p95=1509ms · mean=274ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4914.675492ms)
✔ TTFT — time to first token (tier=tier-64) (4915.553201ms)
  [1/20] ok=true stop=tool_use 659ms
  [2/20] ok=true stop=tool_use 511ms
  [3/20] ok=true stop=tool_use 515ms
  [4/20] ok=true stop=tool_use 513ms
  [5/20] ok=true stop=tool_use 512ms
  [6/20] ok=true stop=tool_use 512ms
  [7/20] ok=true stop=tool_use 511ms
  [8/20] ok=true stop=tool_use 515ms
  [9/20] ok=true stop=tool_use 513ms
  [10/20] ok=true stop=tool_use 513ms
  [11/20] ok=true stop=tool_use 511ms
  [12/20] ok=true stop=tool_use 513ms
  [13/20] ok=true stop=tool_use 512ms
  [14/20] ok=true stop=tool_use 512ms
  [15/20] ok=true stop=tool_use 512ms
  [16/20] ok=true stop=tool_use 513ms
  [17/20] ok=true stop=tool_use 514ms
  [18/20] ok=true stop=tool_use 511ms
  [19/20] ok=true stop=tool_use 514ms
  [20/20] ok=true stop=tool_use 518ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 511ms · median 513ms · p95 659ms · mean 520ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10415.926077ms)
✔ tool-call roundtrip latency (tier=tier-64) (10416.245368ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=18072ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended long-horizon-bugs row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (18137.388506ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (18137.850465ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=36544ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended lru-cache row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (36585.826989ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (36586.215031ms)
▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (240037.272386ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (240039.73518ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=37122ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended multi-bug-decoy row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (37187.65792ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (37188.108155ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=12304ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended multi-bug row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (12357.436575ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (12358.257624ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=7297ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended multi-file-rename row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (7348.856599ms)
✔ multi-file rename + signature change (tier=tier-64) (7349.294541ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4980ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended null-default row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (5019.793844ms)
✔ null-default: missing vs falsy (tier=tier-64) (5020.232328ms)

=== parseISO-with-timezone (tier-64) ===
  claw: exit=0 elapsed=16483ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","iso.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended parseISO-with-timezone row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ parseISO-with-timezone: ISO 8601 parser (tier=tier-64)
  ✔ claw implements parseISO with offset handling and invalid-input throws (16531.235264ms)
✔ parseISO-with-timezone: ISO 8601 parser (tier=tier-64) (16531.639232ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4462ms textLen=2129 newlines=11 bullets=4
  [2/3] stop=end_turn 4573ms textLen=2158 newlines=13 bullets=4
  [3/3] stop=end_turn 4943ms textLen=2257 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## Understanding the Core Concept\n\nReact components are the fundamental building blocks of modern user interfaces, allowing developers to break down complex UIs into independent, reusable pieces of code. Think of them as custom HTML elements that encapsulate their own logic, structure, and styling. By treating parts of
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (13979.00401ms)
✔ prose quality via raw bridge (tier=tier-64) (13980.243302ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 5123ms rawLen=2413 cleanLen=2114 newlines=5 bullets=3
  [2/3] exit=0 4791ms rawLen=2241 cleanLen=2023 newlines=5 bullets=3
  [3/3] exit=0 4537ms rawLen=2182 cleanLen=1889 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate UI logic, presentation, and behavior into isolated pieces of code. Think of them as custom HTML elements — you define them once, then compose them together to construct entire user interfaces. Ea
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (14481.176012ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (14481.453262ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=5336ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended refactor row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (5387.325374ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (5387.829792ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=5465ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended spec-compliance row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (5512.147215ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (5512.573301ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6909ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended spec-precedence row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6948.401258ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6948.851679ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=10090ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","light.js","package.json","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended state-machine row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (10126.487719ms)
✔ state-machine: traffic light (tier=tier-64) (10127.40602ms)

=== subtle-broken-spec (tier-64) ===
  claw: exit=0 elapsed=13148ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","formatTime.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended subtle-broken-spec row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-64)
  ✔ claw implements formatTime to match verify (despite suggestive prompt) (13186.980414ms)
✔ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-64) (13187.415543ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=5460ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended subtle-bug row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (5509.164172ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (5509.58551ms)

=== tool-confusion-redundant-verifies (tier-64) ===
  claw: exit=0 elapsed=7767ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","check.js","parse.js","validate.js","verify.js"]
  node post-fix (verify.js): exit=0 stderr=
[run-registry] appended tool-confusion-redundant-verifies row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-64)
  ✔ claw implements parse against verify.js, ignoring red-herring verifiers (7804.864239ms)
✔ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-64) (7805.306952ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 735ms
  [2/10] ok=true stop=tool_use tool_use=true 519ms
  [3/10] ok=true stop=tool_use tool_use=true 512ms
  [4/10] ok=true stop=tool_use tool_use=true 514ms
  [5/10] ok=true stop=tool_use tool_use=true 528ms
  [6/10] ok=true stop=tool_use tool_use=true 509ms
  [7/10] ok=true stop=tool_use tool_use=true 516ms
  [8/10] ok=true stop=tool_use tool_use=true 527ms
  [9/10] ok=true stop=tool_use tool_use=true 523ms
  [10/10] ok=true stop=tool_use tool_use=true 523ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 509ms · median 523ms · p95 735ms · mean 541ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5407.039911ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5407.868129ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=8559ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended two-step-refactor row → /workspace/.claw-runtime/run_registry.sprint1-10-smoke-20260429-1528.jsonl
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (8612.50176ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (8613.029599ms)
ℹ tests 37
ℹ suites 37
ℹ pass 36
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 788394.98598

✖ failing tests:

test at __tests__/tier-eval/mini-vm.test.js:203:3
✖ claw implements run handling all 13 opcodes + error cases (240037.272386ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:149:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

```

Exit code: 1 (rep=1 tier=64)

