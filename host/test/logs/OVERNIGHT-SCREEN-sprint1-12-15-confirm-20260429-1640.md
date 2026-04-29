# Overnight Cross-Tier Screen — sprint1-12-15-confirm-20260429-1640

- Date: 2026-04-29 16:40
- Tiers: 64
- Reps per tier: 1
- Harness git SHA: 53a6910
- Registry: /Users/nigel/Desktop/bench/lab/host/test/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
- Hint file: present
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=64

```
 Container test-test-run-c198aadb74e0 Creating 
 Container test-test-run-c198aadb74e0 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=9347ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended adversarial-input row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (9390.27179ms)
✔ adversarial inputs: slugify (tier=tier-64) (9390.703209ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2867ms files=[".claw",".claw-runtime","a.py","b.py","c.py"]
[run-registry] appended agent-parallel row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2883.211032ms)
✔ agent: parallel file writes (tier=tier-64) (2883.761577ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1509ms files=[".claw",".claw-runtime","hello.py"]
[run-registry] appended agent-single row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1525.796176ms)
✔ agent: single-file write (tier=tier-64) (1526.543013ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5966ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended algorithm-intervals row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (6006.292035ms)
✔ algorithm: merge intervals (tier=tier-64) (6006.745495ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6668ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended api-evolution row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6718.872236ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6719.302655ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=19911ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
[run-registry] appended cascading-bugs row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (19967.252314ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (19967.666524ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5097ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
[run-registry] appended code-self-test row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5133.83677ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5134.273439ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=8907ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended comment-spec row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (8957.173863ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (8957.625949ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=118758ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended csv-parser row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (118803.088709ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (118803.515753ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=12916ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended deep-equal row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (12955.852395ms)
✔ deep-equal: structural equality (tier=tier-64) (12956.277813ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=9948ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended dependency-graph row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (9987.845945ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (9988.289112ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6628ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended distractor row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6677.850525ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6678.276651ms)

=== eight-functions (tier-64) ===
  claw: exit=0 elapsed=35445ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","chunk.js","clamp.js","compact.js","deepFlatten.js","flatten.js","formatHex.js","omit.js","pad.js","pick.js","safeIndex.js","sortedKeys.js","unique.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended eight-functions row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ eight-functions: 12 helpers with cross-file deps (tier=tier-64)
  ✔ claw implements all twelve helpers with correct cross-file imports (35481.637056ms)
✔ eight-functions: 12 helpers with cross-file deps (tier=tier-64) (35482.038183ms)

=== expression-eval (tier-64) ===
  claw: exit=0 elapsed=77131ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended expression-eval row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✔ claw implements evaluate handling precedence, assoc, errors (77166.527018ms)
✔ expression-eval: recursive-descent parser (tier=tier-64) (77166.923145ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=17583ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended json-schema-validate row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (17622.563744ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (17622.991121ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=11238ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (11289.539816ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (11289.978736ms)
[run-registry] appended large-refactor row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
  [1/10] ttft=1560ms
  [2/10] ttft=148ms
  [3/10] ttft=138ms
  [4/10] ttft=137ms
  [5/10] ttft=137ms
  [6/10] ttft=137ms
  [7/10] ttft=135ms
  [8/10] ttft=137ms
  [9/10] ttft=137ms
  [10/10] ttft=138ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=137ms · p95=1560ms · mean=280ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4975.907776ms)
✔ TTFT — time to first token (tier=tier-64) (4976.902867ms)
  [1/20] ok=true stop=tool_use 652ms
  [2/20] ok=true stop=tool_use 517ms
  [3/20] ok=true stop=tool_use 513ms
  [4/20] ok=true stop=tool_use 514ms
  [5/20] ok=true stop=tool_use 515ms
  [6/20] ok=true stop=tool_use 514ms
  [7/20] ok=true stop=tool_use 511ms
  [8/20] ok=true stop=tool_use 514ms
  [9/20] ok=true stop=tool_use 518ms
  [10/20] ERROR: fetch failed
  [11/20] ERROR: fetch failed
  [12/20] ERROR: fetch failed
  [13/20] ERROR: fetch failed
  [14/20] ERROR: fetch failed
  [15/20] ERROR: fetch failed
  [16/20] ERROR: fetch failed
  [17/20] ERROR: fetch failed
  [18/20] ERROR: fetch failed
  [19/20] ERROR: fetch failed
  [20/20] ERROR: fetch failed

=== tool-roundtrip (tier-64) ===
  wrap rate = 9/20 = 0.45  (threshold 0.9)
  latency   = min 1ms · median 5ms · p95 652ms · mean 240ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (4796.8408ms)
✖ tool-call roundtrip latency (tier=tier-64) (4797.422929ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=23945ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended long-horizon-bugs row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (24000.964465ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (24001.462135ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=21268ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended lru-cache row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (21309.405384ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (21309.813845ms)

=== mini-vm (tier-64) ===
  claw: exit=null elapsed=240018ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","vm.js"]
  claw stderr (tail):

  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: jmp_if taken

undefined !== 2

    at file:///workspace/verify.js:42:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage:
[run-registry] appended mini-vm row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (240078.835737ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (240079.56895ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=45856ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended multi-bug-decoy row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (45911.890887ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (45912.286848ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=12170ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended multi-bug row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (12218.356991ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (12218.78562ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=7511ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended multi-file-rename row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (7562.789155ms)
✔ multi-file rename + signature change (tier=tier-64) (7563.23445ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4800ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended null-default row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (4837.352251ms)
✔ null-default: missing vs falsy (tier=tier-64) (4837.827504ms)

=== parseISO-with-timezone (tier-64) ===
  claw: exit=0 elapsed=15749ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","iso.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended parseISO-with-timezone row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ parseISO-with-timezone: ISO 8601 parser (tier=tier-64)
  ✔ claw implements parseISO with offset handling and invalid-input throws (15789.621975ms)
✔ parseISO-with-timezone: ISO 8601 parser (tier=tier-64) (15790.059395ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 5365ms textLen=2437 newlines=13 bullets=4
  [2/3] stop=end_turn 4678ms textLen=2162 newlines=11 bullets=4
  [3/3] stop=end_turn 4586ms textLen=2201 newlines=11 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## Understanding the Core Concept\n\nAt its heart, React is built on the idea of breaking down complex user interfaces into small, reusable, and independent pieces called components. Think of a component as a custom HTML tag that you define yourself. Instead of writing one massive block of code to describe an entire webp
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14629.582793ms)
✔ prose quality via raw bridge (tier=tier-64) (14630.299423ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 4479ms rawLen=2016 cleanLen=1729 newlines=6 bullets=4
  [2/3] exit=0 4702ms rawLen=2254 cleanLen=2069 newlines=5 bullets=3
  [3/3] exit=0 4193ms rawLen=1956 cleanLen=1753 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate markup, styling, and behavior into single, composable units. Think of them as custom HTML elements — each one handles its own rendering logic and can accept inputs called props to customize its o
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13408.417455ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13408.673083ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6017ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended refactor row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6078.33202ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6078.796357ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=5547ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended spec-compliance row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (5596.914815ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (5597.356026ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=6914ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended spec-precedence row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (6950.01941ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (6950.438246ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6300ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended state-machine row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6331.42544ms)
✔ state-machine: traffic light (tier=tier-64) (6331.815859ms)

=== subtle-broken-spec (tier-64) ===
  claw: exit=0 elapsed=8029ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","formatTime.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended subtle-broken-spec row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-64)
  ✔ claw implements formatTime to match verify (despite suggestive prompt) (8068.994345ms)
✔ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-64) (8069.446182ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6533ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended subtle-bug row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6583.372768ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6583.810146ms)

=== tool-confusion-redundant-verifies (tier-64) ===
  claw: exit=0 elapsed=7531ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","check.js","parse.js","validate.js","verify.js"]
  node post-fix (verify.js): exit=0 stderr=
[run-registry] appended tool-confusion-redundant-verifies row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-64)
  ✔ claw implements parse against verify.js, ignoring red-herring verifiers (7567.236829ms)
✔ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-64) (7567.720249ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 760ms
  [2/10] ok=true stop=tool_use tool_use=true 518ms
  [3/10] ok=true stop=tool_use tool_use=true 516ms
  [4/10] ok=true stop=tool_use tool_use=true 515ms
  [5/10] ok=true stop=tool_use tool_use=true 516ms
  [6/10] ok=true stop=tool_use tool_use=true 516ms
  [7/10] ok=true stop=tool_use tool_use=true 517ms
  [8/10] ok=true stop=tool_use tool_use=true 515ms
  [9/10] ok=true stop=tool_use tool_use=true 517ms
  [10/10] ok=true stop=tool_use tool_use=true 515ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 515ms · median 516ms · p95 760ms · mean 541ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5406.936134ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5407.97735ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=9529ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended two-step-refactor row → /workspace/.claw-runtime/run_registry.sprint1-12-15-confirm-20260429-1640.jsonl
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (9585.529516ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (9586.016186ms)
ℹ tests 37
ℹ suites 37
ℹ pass 35
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 823206.391544

✖ failing tests:

test at __tests__/tier-eval/latency.test.js:211:3
✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (4796.8408ms)
  AssertionError [ERR_ASSERTION]: wrap rate 0.45 below threshold 0.9 — grammar may have regressed
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/latency.test.js:244:14)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:831:7) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }

test at __tests__/tier-eval/mini-vm.test.js:203:3
✖ claw implements run handling all 13 opcodes + error cases (240078.835737ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  null !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/mini-vm.test.js:226:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: null,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

```

Exit code: 1 (rep=1 tier=64)

