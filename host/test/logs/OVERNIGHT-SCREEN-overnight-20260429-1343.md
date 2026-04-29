# Overnight Cross-Tier Screen — overnight-20260429-1343

- Date: 2026-04-29 13:43
- Tiers: 16 32 64
- Reps per tier: 1
- Harness git SHA: 3ca50d5
- Registry: /Users/nigel/Desktop/bench/lab/host/test/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
- Hint file: present
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-17e4b1f630e2 Creating 
 Container test-test-run-17e4b1f630e2 Created 

=== adversarial-input (tier-16) ===
  claw: exit=0 elapsed=21951ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended adversarial-input row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ adversarial inputs: slugify (tier=tier-16)
  ✔ claw implements slugify robustly enough for adversarial inputs (21992.477817ms)
✔ adversarial inputs: slugify (tier=tier-16) (21992.933198ms)

=== agent-parallel (tier-16) ===
  exit=0 elapsed=2844ms files=[".claw",".claw-runtime","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (2855.623954ms)
✔ agent: parallel file writes (tier=tier-16) (2856.352035ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=1399ms files=[".claw",".claw-runtime","hello.py"]
[run-registry] appended agent-single row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (1412.453897ms)
✔ agent: single-file write (tier=tier-16) (1413.027521ms)

=== algorithm-intervals (tier-16) ===
  claw: exit=0 elapsed=21058ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-16)
  ✔ claw merges intervals across all edge cases (21096.258365ms)
✔ algorithm: merge intervals (tier=tier-16) (21096.828031ms)
▶ api evolution: signature reorder across two files (tier=tier-16)
  ✖ claw reorders the signature and updates the call site (240053.938852ms)
✖ api evolution: signature reorder across two files (tier=tier-16) (240055.069537ms)

=== cascading-bugs (tier-16) ===
  claw: exit=0 elapsed=78912ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=1 stdout= stderr=file:///workspace/run.js:10
assert.equal(inc(1),       2,    'inc(1) === 2');
             ^

TypeError: inc is not a function
    at file:///workspace/run.js:10:14
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async as
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-16)
  ✖ claw iterates run/fix until run.js exits clean (78957.808685ms)
✖ cascading-bugs: 5 sequential failures, one runner (tier=tier-16) (78958.481832ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=6461ms files=[".claw",".claw-runtime","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (6494.87718ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (6495.401025ms)

=== comment-spec (tier-16) ===
  claw: exit=0 elapsed=14632ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-16)
  ✔ claw implements both functions per JSDoc (14680.675327ms)
✔ comment-spec: implement from JSDoc (tier=tier-16) (14681.180129ms)

=== csv-parser (tier-16) ===
  claw: exit=0 elapsed=174500ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=1 stderr=/workspace/verify.js:12
    { input: 'a,"b\r\nc",d', expected: [['a', 'b
                                              ^^

SyntaxError: Invalid or unexpected token
    at wrapSafe (node:internal/modules/cjs/loader:1763:18)
    at Module._compile (node:internal/modules/cjs/loader:1804:20)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/load
[run-registry] appended csv-parser row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ csv-parser: RFC 4180-ish parser (tier=tier-16)
  ✖ claw implements parseCSV handling every quoting case (174538.168005ms)
✖ csv-parser: RFC 4180-ish parser (tier=tier-16) (174539.783764ms)

=== deep-equal (tier-16) ===
  claw: exit=0 elapsed=130583ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=1 stderr=/workspace/verify.js:4
console.log(eq(1, 1)); // true
            ^

TypeError: eq is not a function
    at Object.<anonymous> (/workspace/verify.js:4:13)
    at Module._compile (node:internal/modules/cjs/loader:1830:14)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/loader:1553:32)
    at Module._load (node:internal/modules/cjs/loader:13
[run-registry] appended deep-equal row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ deep-equal: structural equality (tier=tier-16)
  ✖ claw implements deep equality including NaN (130620.460959ms)
✖ deep-equal: structural equality (tier=tier-16) (130621.065834ms)

=== dependency-graph (tier-16) ===
  claw: exit=0 elapsed=20496ms files=[".claw",".claw-runtime","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-16)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (20539.091058ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-16) (20539.556642ms)

=== distractor (tier-16) ===
  claw: exit=0 elapsed=12137ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-16)
  ✔ claw fixes only the broken helper (12188.147013ms)
✔ distractor: one buggy helper among three (tier=tier-16) (12188.660518ms)

=== eight-functions (tier-16) ===
  claw: exit=0 elapsed=21684ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","helpers","verify.js"]
  missing target files: ["pad.js","clamp.js","unique.js","chunk.js","flatten.js","omit.js","pick.js","compact.js","safeIndex.js","formatHex.js","sortedKeys.js","deepFlatten.js"]
[run-registry] appended eight-functions row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ eight-functions: 12 helpers with cross-file deps (tier=tier-16)
  ✖ claw implements all twelve helpers with correct cross-file imports (21697.383535ms)
✖ eight-functions: 12 helpers with cross-file deps (tier=tier-16) (21698.179999ms)

=== expression-eval (tier-16) ===
  claw: exit=0 elapsed=26535ms files=[".claw",".claw-runtime","expr.js","verify.js"]
  node post-fix: exit=1 stderr=/workspace/verify.js:4
console.log(evaluate('1 + 2 * 3')); // Should output 7
            ^

TypeError: evaluate is not a function
    at Object.<anonymous> (/workspace/verify.js:4:13)
    at Module._compile (node:internal/modules/cjs/loader:1830:14)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/loader:1553:32)
    at Module._load (node:
[run-registry] appended expression-eval row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ expression-eval: recursive-descent parser (tier=tier-16)
  ✖ claw implements evaluate handling precedence, assoc, errors (26591.510352ms)
✖ expression-eval: recursive-descent parser (tier=tier-16) (26592.247483ms)

=== json-schema-validate (tier-16) ===
  claw: exit=0 elapsed=19141ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: invalid: missing age

true !== false

    at file:///workspace/verify.js:32:10
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generated
▶ json-schema-validate: recursive validator (tier=tier-16)
  ✖ claw implements validate with recursive paths and error accumulation (19176.034122ms)
✖ json-schema-validate: recursive validator (tier=tier-16) (19176.76592ms)

=== large-refactor (tier-16) ===
  claw: exit=0 elapsed=55007ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=1 stderr=file:///workspace/format.js:5
  return '$' + amount.toFixed(2);
  ^^^^^^

SyntaxError: Illegal return statement
    at compileSourceTextModule (node:internal/modules/esm/utils:318:16)
    at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:90:18)
    at #translate (node:internal/modules/esm/loader:451:20)
    at afterLoad (node:internal/modules/esm/loader:507:29)
    at ModuleLoa
[run-registry] appended large-refactor row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ large-refactor: thread currency through 5 call sites (tier=tier-16)
  ✖ claw threads the new parameter through every caller (55068.643614ms)
✖ large-refactor: thread currency through 5 call sites (tier=tier-16) (55069.186744ms)
  [1/10] ttft=1913ms
  [2/10] ttft=160ms
  [3/10] ttft=139ms
  [4/10] ttft=138ms
  [5/10] ttft=142ms
  [6/10] ttft=140ms
  [7/10] ttft=143ms
  [8/10] ttft=144ms
  [9/10] ttft=142ms
  [10/10] ttft=142ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=138ms · median=142ms · p95=1913ms · mean=320ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4809.585091ms)
✔ TTFT — time to first token (tier=tier-16) (4812.745076ms)
  [1/20] ok=true stop=tool_use 472ms
  [2/20] ok=true stop=tool_use 381ms
  [3/20] ok=true stop=tool_use 394ms
  [4/20] ok=true stop=tool_use 390ms
  [5/20] ok=true stop=tool_use 391ms
  [6/20] ok=true stop=tool_use 396ms
  [7/20] ok=true stop=tool_use 401ms
  [8/20] ok=true stop=tool_use 414ms
  [9/20] ok=true stop=tool_use 419ms
  [10/20] ok=true stop=tool_use 406ms
  [11/20] ok=true stop=tool_use 414ms
  [12/20] ok=true stop=tool_use 407ms
  [13/20] ok=true stop=tool_use 400ms
  [14/20] ok=true stop=tool_use 413ms
  [15/20] ok=true stop=tool_use 399ms
  [16/20] ok=true stop=tool_use 407ms
  [17/20] ok=true stop=tool_use 384ms
  [18/20] ok=true stop=tool_use 453ms
  [19/20] ok=true stop=tool_use 395ms
  [20/20] ok=true stop=tool_use 395ms

=== tool-roundtrip (tier-16) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 381ms · median 401ms · p95 472ms · mean 407ms
▶ tool-call roundtrip latency (tier=tier-16)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (8151.454761ms)
✔ tool-call roundtrip latency (tier=tier-16) (8151.793181ms)

=== long-horizon-bugs (tier-16) ===
  claw: exit=1 elapsed=8164ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  claw stderr (tail):
[error-kind: unknown]
error: failed to parse Anthropic response for model anthropic/claw-llama: missing field `type` at line 1 column 4191; first 200 chars of body: {"error": {"message": "dictionary changed size during iteration\n\nTraceback (most recent call last):\n  File \"/usr/lib/python3.13/site-packages/litellm/litellm_core_utils/streaming_handler.py\", lin…

Run `claw --help` for usage.

▶ long-horizon: 4 bugs across 6 files (tier=tier-16)
  ✖ claw fixes every bug across the helper modules (8190.605665ms)
✖ long-horizon: 4 bugs across 6 files (tier=tier-16) (8191.461047ms)

=== lru-cache (tier-16) ===
  claw: exit=1 elapsed=134491ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (32953 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended lru-cache row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-16)
  ✖ claw implements LRUCache satisfying every spec bullet (134503.922943ms)
✖ lru-cache: LRU + TTL + eviction callback (tier=tier-16) (134504.493698ms)
▶ mini-vm: bytecode interpreter (tier=tier-16)
  ✖ claw implements run handling all 13 opcodes + error cases (240042.921234ms)
✖ mini-vm: bytecode interpreter (tier=tier-16) (240044.040451ms)

=== multi-bug-decoy (tier-16) ===
  claw: exit=0 elapsed=122218ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-16)
  ✔ claw fixes the bugs without breaking the decoy (122269.368828ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-16) (122270.073376ms)

=== multi-bug (tier-16) ===
  claw: exit=0 elapsed=15521ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-16)
  ✔ claw fixes all three helpers (15566.975955ms)
✔ multi-bug: fix three independent bugs (tier=tier-16) (15567.578626ms)

=== multi-file-rename (tier-16) ===
  claw: exit=1 elapsed=108365ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (36742 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ multi-file rename + signature change (tier=tier-16)
  ✖ claw renames across files and updates the call site (108386.512683ms)
✖ multi-file rename + signature change (tier=tier-16) (108387.139938ms)

=== null-default (tier-16) ===
  claw: exit=1 elapsed=32358ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (842673 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ null-default: missing vs falsy (tier=tier-16)
  ✖ claw distinguishes missing from falsy (32376.375261ms)
✖ null-default: missing vs falsy (tier=tier-16) (32377.03835ms)
▶ parseISO-with-timezone: ISO 8601 parser (tier=tier-16)
  ✖ claw implements parseISO with offset handling and invalid-input throws (180058.686369ms)
✖ parseISO-with-timezone: ISO 8601 parser (tier=tier-16) (180059.667127ms)

=== prose-quality:bridge (tier-16) ===
  [1/3] stop=end_turn 4546ms textLen=896 newlines=9 bullets=4
  [2/3] stop=end_turn 5285ms textLen=1103 newlines=11 bullets=4
  [3/3] stop=end_turn 5330ms textLen=1080 newlines=9 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are reusable pieces of code that help in building user interfaces. They encapsulate HTML, CSS, and JavaScript into a single unit, making it easier to manage complex UIs. Here’s why using components is beneficial:\n\n- **Encapsulation**: Components allow you to encapsulate t
▶ prose quality via raw bridge (tier=tier-16)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (15162.054799ms)
✔ prose quality via raw bridge (tier=tier-16) (15163.678354ms)

=== prose-quality:claw-renderer (tier-16) ===
  [1/3] exit=0 22393ms rawLen=4790 cleanLen=3930 newlines=33 bullets=4
  [2/3] exit=0 12439ms rawLen=5028 cleanLen=4257 newlines=18 bullets=5
  [3/3] exit=0 9850ms rawLen=4191 cleanLen=3516 newlines=16 bullets=4
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n╭─ StructuredOutput ─╮\n│ {"content":"# Introduction to React Components\nReact components are reusable pieces of code tha…\n╰────────────────────────╯\n✓ StructuredOutput\n{\n“data”: “Structured output provided successfully”,\n“structured_output”: {\n“content”: “# Introduction to React Components\nReact 
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-16, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (44711.992302ms)
✔ prose quality via claw renderer (tier=tier-16, informational) (44713.637645ms)

=== refactor (tier-16) ===
  claw: exit=0 elapsed=9305ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-16)
  ✔ claw fixes buggy.js so its assertions pass (9356.460366ms)
✔ refactor: fix seeded off-by-one (tier=tier-16) (9357.011485ms)

=== spec-compliance (tier-16) ===
  claw: exit=0 elapsed=60530ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=Assertion failed: Test case 1 failed
Assertion failed: Test case 2 failed
Assertion failed: Test case 3 failed
Assertion failed: Test case 4 failed
▶ spec compliance: multi-requirement formatPrice (tier=tier-16)
  ✔ claw implements formatPrice satisfying all four requirements (60564.749651ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-16) (60565.148563ms)

=== spec-precedence (tier-16) ===
  claw: exit=0 elapsed=4263ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-16)
  ✔ claw applies the rules in the specified order (4308.408574ms)
✔ spec-precedence: ordered transformation rules (tier=tier-16) (4308.895409ms)

=== state-machine (tier-16) ===
  claw: exit=0 elapsed=89632ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=invalid state
▶ state-machine: traffic light (tier=tier-16)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (89669.583437ms)
✔ state-machine: traffic light (tier=tier-16) (89669.997147ms)
▶ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-16)
  ✖ claw implements formatTime to match verify (despite suggestive prompt) (180031.588648ms)
✖ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-16) (180032.69061ms)

=== subtle-bug (tier-16) ===
  claw: exit=0 elapsed=140685ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: median of [1,100,2,50,3] should be 3

2 !== 3

    at file:///workspace/median.js:11:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  g
▶ subtle bug: default-sort lexicographic (tier=tier-16)
  ✖ claw fixes median.js so its assertions pass (140732.719497ms)
✖ subtle bug: default-sort lexicographic (tier=tier-16) (140733.416044ms)

=== tool-confusion-redundant-verifies (tier-16) ===
  claw: exit=0 elapsed=141045ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","check.js","parse.js","validate.js","verify.js"]
  node post-fix (verify.js): exit=1 stderr=/workspace/parse.js:7
    var result = {};
    ^^^

SyntaxError: Unexpected token 'var'
    at wrapSafe (node:internal/modules/cjs/loader:1763:18)
    at Module._compile (node:internal/modules/cjs/loader:1804:20)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/loader:1553:32)
    at Module._load (node:internal/modules/cjs/loader:1355:12)
[run-registry] appended tool-confusion-redundant-verifies row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-16)
  ✖ claw implements parse against verify.js, ignoring red-herring verifiers (141085.52831ms)
✖ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-16) (141086.49065ms)

=== tool-discipline (tier-16) ===
  [1/10] ok=true stop=tool_use tool_use=true 679ms
  [2/10] ok=true stop=tool_use tool_use=true 386ms
  [3/10] ok=true stop=tool_use tool_use=true 390ms
  [4/10] ok=true stop=tool_use tool_use=true 394ms
  [5/10] ok=true stop=tool_use tool_use=true 394ms
  [6/10] ok=true stop=tool_use tool_use=true 400ms
  [7/10] ok=true stop=tool_use tool_use=true 389ms
  [8/10] ok=true stop=tool_use tool_use=true 400ms
  [9/10] ok=true stop=tool_use tool_use=true 393ms
  [10/10] ok=true stop=tool_use tool_use=true 420ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 386ms · median 394ms · p95 679ms · mean 425ms
▶ tool-call wrapping (tier=tier-16, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (4247.71679ms)
✔ tool-call wrapping (tier=tier-16, bridge=claw-llama) (4249.276217ms)

=== two-step-refactor (tier-16) ===
  claw: exit=0 elapsed=22227ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-16)
  ✔ claw extracts the helper without copying the off-by-one (22280.736598ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-16) (22281.286643ms)
ℹ tests 37
ℹ suites 37
ℹ pass 20
ℹ fail 17
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2415533.071693

✖ failing tests:

test at __tests__/tier-eval/api-evolution.test.js:77:3
✖ claw reorders the signature and updates the call site (240053.938852ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:149:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/cascading-bugs.test.js:101:3
✖ claw iterates run/fix until run.js exits clean (78957.808685ms)
  AssertionError [ERR_ASSERTION]: run.js still fails:
  file:///workspace/run.js:10
  assert.equal(inc(1),       2,    'inc(1) === 2');
               ^
  
  TypeError: inc is not a function
      at file:///workspace/run.js:10:14
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/cascading-bugs.test.js:123:12)
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

test at __tests__/tier-eval/csv-parser.test.js:145:3
✖ claw implements parseCSV handling every quoting case (174538.168005ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  /workspace/verify.js:12
      { input: 'a,"b\r\nc",d', expected: [['a', 'b
                                                ^^
  
  SyntaxError: Invalid or unexpected token
      at wrapSafe (node:internal/modules/cjs/loader:1763:18)
      at Module._compile (node:internal/modules/cjs/loader:1804:20)
      at Object..js (node:internal/modules/cjs/loader:1961:10)
      at Module.load (node:internal/modules/cjs/loader:1553:32)
      at Module._load (node:internal/modules/cjs/loader:1355:12)
      at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
      at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
      at node:internal/main/run_main_module:33:47
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/csv-parser.test.js:172:12)
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

test at __tests__/tier-eval/deep-equal.test.js:68:3
✖ claw implements deep equality including NaN (130620.460959ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  /workspace/verify.js:4
  console.log(eq(1, 1)); // true
              ^
  
  TypeError: eq is not a function
      at Object.<anonymous> (/workspace/verify.js:4:13)
      at Module._compile (node:internal/modules/cjs/loader:1830:14)
      at Object..js (node:internal/modules/cjs/loader:1961:10)
      at Module.load (node:internal/modules/cjs/loader:1553:32)
      at Module._load (node:internal/modules/cjs/loader:1355:12)
      at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
      at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
      at node:internal/main/run_main_module:33:47
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/deep-equal.test.js:95:12)
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

test at __tests__/tier-eval/eight-functions.test.js:143:3
✖ claw implements all twelve helpers with correct cross-file imports (21697.383535ms)
  AssertionError [ERR_ASSERTION]: missing target files: pad.js, clamp.js, unique.js, chunk.js, flatten.js, omit.js, pick.js, compact.js, safeIndex.js, formatHex.js, sortedKeys.js, deepFlatten.js
  
  false !== true
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/eight-functions.test.js:173:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at __tests__/tier-eval/expression-eval.test.js:141:3
✖ claw implements evaluate handling precedence, assoc, errors (26591.510352ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  /workspace/verify.js:4
  console.log(evaluate('1 + 2 * 3')); // Should output 7
              ^
  
  TypeError: evaluate is not a function
      at Object.<anonymous> (/workspace/verify.js:4:13)
      at Module._compile (node:internal/modules/cjs/loader:1830:14)
      at Object..js (node:internal/modules/cjs/loader:1961:10)
      at Module.load (node:internal/modules/cjs/loader:1553:32)
      at Module._load (node:internal/modules/cjs/loader:1355:12)
      at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
      at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
      at node:internal/main/run_main_module:33:47
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/expression-eval.test.js:168:12)
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

test at __tests__/tier-eval/json-schema-validate.test.js:167:3
✖ claw implements validate with recursive paths and error accumulation (19176.034122ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: invalid: missing age
  
  true !== false
  
      at file:///workspace/verify.js:32:10
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: true,
    expected: false,
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/json-schema-validate.test.js:184:12)
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

test at __tests__/tier-eval/large-refactor.test.js:122:3
✖ claw threads the new parameter through every caller (55068.643614ms)
  AssertionError [ERR_ASSERTION]: test.js still fails:
  file:///workspace/format.js:5
    return '$' + amount.toFixed(2);
    ^^^^^^
  
  SyntaxError: Illegal return statement
      at compileSourceTextModule (node:internal/modules/esm/utils:318:16)
      at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:90:18)
      at #translate (node:internal/modules/esm/loader:451:20)
      at afterLoad (node:internal/modules/esm/loader:507:29)
      at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:512:12)
      at #getOrCreateModuleJobAfterResolve (node:internal/modules/esm/loader:555:36)
      at afterResolve (node:internal/modules/esm/loader:603:52)
      at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:609:12)
      at ModuleJob.syncLink (node:internal/modules/esm/module_job:162:33)
      at ModuleJob.link (node:internal/
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/large-refactor.test.js:153:12)
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

test at __tests__/tier-eval/long-horizon-bugs.test.js:133:3
✖ claw fixes every bug across the helper modules (8190.605665ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/long-horizon-bugs.test.js:146:12)
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

test at __tests__/tier-eval/lru-cache.test.js:176:3
✖ claw implements LRUCache satisfying every spec bullet (134503.922943ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/lru-cache.test.js:201:12)
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

test at __tests__/tier-eval/mini-vm.test.js:203:3
✖ claw implements run handling all 13 opcodes + error cases (240042.921234ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:149:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/multi-file-rename.test.js:83:3
✖ claw renames across files and updates the call site (108386.512683ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:96:12)
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

test at __tests__/tier-eval/null-default.test.js:60:3
✖ claw distinguishes missing from falsy (32376.375261ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/null-default.test.js:67:12)
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

test at __tests__/tier-eval/parseISO-with-timezone.test.js:90:3
✖ claw implements parseISO with offset handling and invalid-input throws (180058.686369ms)
  Error: claw timed out after 180000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:149:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/subtle-broken-spec.test.js:97:3
✖ claw implements formatTime to match verify (despite suggestive prompt) (180031.588648ms)
  Error: claw timed out after 180000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:149:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/subtle-bug.test.js:69:3
✖ claw fixes median.js so its assertions pass (140732.719497ms)
  AssertionError [ERR_ASSERTION]: median.js still fails after claw's fix:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: median of [1,100,2,50,3] should be 3
  
  2 !== 3
  
      at file:///workspace/median.js:11:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 2,
    expected: 3,
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/subtle-bug.test.js:91:12)
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

test at __tests__/tier-eval/tool-confusion-redundant-verifies.test.js:114:3
✖ claw implements parse against verify.js, ignoring red-herring verifiers (141085.52831ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  /workspace/parse.js:7
      var result = {};
      ^^^
  
  SyntaxError: Unexpected token 'var'
      at wrapSafe (node:internal/modules/cjs/loader:1763:18)
      at Module._compile (node:internal/modules/cjs/loader:1804:20)
      at Object..js (node:internal/modules/cjs/loader:1961:10)
      at Module.load (node:internal/modules/cjs/loader:1553:32)
      at Module._load (node:internal/modules/cjs/loader:1355:12)
      at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
      at loadCJSModuleWithModuleLoad (node:internal/modules/esm/translators:326:3)
      at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:231:7)
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/tool-confusion-redundant-verifies.test.js:141:12)
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

Exit code: 1 (rep=1 tier=16)

## rep=1 tier=32

```
 Container test-test-run-c2da7b0f12fb Creating 
 Container test-test-run-c2da7b0f12fb Created 

=== adversarial-input (tier-32) ===
  claw: exit=0 elapsed=12323ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { slugify } from './slugify.js';
         ^^^^^^^
SyntaxError: Named export 'slugify' not found. The requested module './slugify.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './slugify.js';
const { slugify } = pkg;

    at
[run-registry] appended adversarial-input row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ adversarial inputs: slugify (tier=tier-32)
  ✖ claw implements slugify robustly enough for adversarial inputs (12364.071871ms)
✖ adversarial inputs: slugify (tier=tier-32) (12364.707793ms)

=== agent-parallel (tier-32) ===
  exit=0 elapsed=4032ms files=[".claw",".claw-runtime","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-32)
  ✔ claw creates a.py, b.py, c.py with matching contents (4044.046925ms)
✔ agent: parallel file writes (tier=tier-32) (4044.693804ms)

=== agent-single (tier-32) ===
  exit=0 elapsed=2181ms files=[".claw",".claw-runtime","hello.py"]
[run-registry] appended agent-single row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ agent: single-file write (tier=tier-32)
  ✔ claw creates hello.py with the requested content (2198.091392ms)
✔ agent: single-file write (tier=tier-32) (2198.735938ms)

=== algorithm-intervals (tier-32) ===
  claw: exit=0 elapsed=10938ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: unsorted input
+ actual - expected

  [
    [
      1,
-     2
-   ],
-   [
-     3,
      5
    ]
  ]

    at file:///workspace/verify.js:7:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWi
▶ algorithm: merge intervals (tier=tier-32)
  ✖ claw merges intervals across all edge cases (10979.066719ms)
✖ algorithm: merge intervals (tier=tier-32) (10979.840264ms)

=== api-evolution (tier-32) ===
  claw: exit=0 elapsed=66141ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended api-evolution row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ api evolution: signature reorder across two files (tier=tier-32)
  ✔ claw reorders the signature and updates the call site (66206.509357ms)
✔ api evolution: signature reorder across two files (tier=tier-32) (66206.894401ms)

=== cascading-bugs (tier-32) ===
  claw: exit=0 elapsed=37890ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-32)
  ✔ claw iterates run/fix until run.js exits clean (37959.035199ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-32) (37959.537494ms)

=== code-self-test (tier-32) ===
  claw: exit=0 elapsed=5523ms files=[".claw",".claw-runtime","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-32)
  ✔ claw writes fib.js that passes its own assertions under node (5566.898959ms)
✔ code self-test: fibonacci implementation (tier=tier-32) (5567.639713ms)

=== comment-spec (tier-32) ===
  claw: exit=0 elapsed=25493ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: partition basic
+ actual - expected

+ undefined
- [
-   [
-     2,
-     4
-   ],
-   [
-     1,
-     3
-   ]
- ]

    at file:///workspace/verify.js:4:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRu
▶ comment-spec: implement from JSDoc (tier=tier-32)
  ✖ claw implements both functions per JSDoc (25548.013809ms)
✖ comment-spec: implement from JSDoc (tier=tier-32) (25548.702397ms)

=== csv-parser (tier-32) ===
  claw: exit=0 elapsed=58507ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: embedded newline
+ actual - expected

  [
    [
      'a',
      'b'
    ],
    [
+     'line1'
-     'line1\nline2',
-     'x'
    ],
+   [
+     'line2,x'
+   ]
  ]

    at file:///workspace/verify.js:19:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:int
[run-registry] appended csv-parser row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ csv-parser: RFC 4180-ish parser (tier=tier-32)
  ✖ claw implements parseCSV handling every quoting case (58550.827005ms)
✖ csv-parser: RFC 4180-ish parser (tier=tier-32) (58551.438218ms)

=== deep-equal (tier-32) ===
  claw: exit=0 elapsed=8841ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { isEqual } from './eq.js';
         ^^^^^^^
SyntaxError: Named export 'isEqual' not found. The requested module './eq.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './eq.js';
const { isEqual } = pkg;

    at #asyncInstantia
[run-registry] appended deep-equal row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ deep-equal: structural equality (tier=tier-32)
  ✖ claw implements deep equality including NaN (8881.486462ms)
✖ deep-equal: structural equality (tier=tier-32) (8882.226426ms)

=== dependency-graph (tier-32) ===
  claw: exit=0 elapsed=13670ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: returns a valid topo order
    at file:///workspace/verify.js:21:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: fal
▶ dependency-graph: topological sort with cycle detection (tier=tier-32)
  ✖ claw implements topoSort handling DAG, cycle, and disconnected (13707.872067ms)
✖ dependency-graph: topological sort with cycle detection (tier=tier-32) (13708.636823ms)

=== distractor (tier-32) ===
  claw: exit=0 elapsed=5308ms files=[".claw",".claw-runtime","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-32)
  ✔ claw fixes only the broken helper (5359.126213ms)
✔ distractor: one buggy helper among three (tier=tier-32) (5359.693425ms)

=== eight-functions (tier-32) ===
  claw: exit=0 elapsed=29548ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","helpers","verify.js"]
  missing target files: ["pad.js","clamp.js","unique.js","chunk.js","flatten.js","omit.js","pick.js","compact.js","safeIndex.js","formatHex.js","sortedKeys.js","deepFlatten.js"]
[run-registry] appended eight-functions row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ eight-functions: 12 helpers with cross-file deps (tier=tier-32)
  ✖ claw implements all twelve helpers with correct cross-file imports (29578.458323ms)
✖ eight-functions: 12 helpers with cross-file deps (tier=tier-32) (29579.254995ms)
▶ expression-eval: recursive-descent parser (tier=tier-32)
  ✖ claw implements evaluate handling precedence, assoc, errors (360056.717403ms)
✖ expression-eval: recursive-descent parser (tier=tier-32) (360057.93987ms)

=== json-schema-validate (tier-32) ===
  claw: exit=1 elapsed=222735ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (34411 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ json-schema-validate: recursive validator (tier=tier-32)
  ✖ claw implements validate with recursive paths and error accumulation (222741.662342ms)
✖ json-schema-validate: recursive validator (tier=tier-32) (222742.241548ms)

=== large-refactor (tier-32) ===
  claw: exit=0 elapsed=11993ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: cart total uses cart currency
+ actual - expected

+ '$15.50'
- 'GBP 15.50'

    at file:///workspace/test.js:9:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/mo
[run-registry] appended large-refactor row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ large-refactor: thread currency through 5 call sites (tier=tier-32)
  ✖ claw threads the new parameter through every caller (12054.505963ms)
✖ large-refactor: thread currency through 5 call sites (tier=tier-32) (12055.2004ms)
  [1/10] ttft=3134ms
  [2/10] ttft=220ms
  [3/10] ttft=213ms
  [4/10] ttft=214ms
  [5/10] ttft=213ms
  [6/10] ttft=215ms
  [7/10] ttft=216ms
  [8/10] ttft=208ms
  [9/10] ttft=214ms
  [10/10] ttft=214ms

=== TTFT (tier-32) ===
  n=10 errors=0
  min=208ms · median=214ms · p95=3134ms · mean=506ms
▶ TTFT — time to first token (tier=tier-32)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (7641.523362ms)
✔ TTFT — time to first token (tier=tier-32) (7641.924649ms)
  [1/20] ok=true stop=tool_use 757ms
  [2/20] ok=true stop=tool_use 590ms
  [3/20] ERROR: fetch failed
  [4/20] ERROR: fetch failed
  [5/20] ERROR: fetch failed
  [6/20] ERROR: fetch failed
  [7/20] ERROR: fetch failed
  [8/20] ERROR: fetch failed
  [9/20] ERROR: fetch failed
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

=== tool-roundtrip (tier-32) ===
  wrap rate = 2/20 = 0.10  (threshold 0.9)
  latency   = min 1ms · median 2ms · p95 757ms · mean 69ms
▶ tool-call roundtrip latency (tier=tier-32)
  ✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (1387.520065ms)
✖ tool-call roundtrip latency (tier=tier-32) (1388.003817ms)

=== long-horizon-bugs (tier-32) ===
  claw: exit=0 elapsed=26542ms files=[".claw",".claw-runtime","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: first

3 !== 1

    at file:///workspace/test.js:13:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
  code: '
▶ long-horizon: 4 bugs across 6 files (tier=tier-32)
  ✖ claw fixes every bug across the helper modules (26601.040806ms)
✖ long-horizon: 4 bugs across 6 files (tier=tier-32) (26601.67949ms)

=== lru-cache (tier-32) ===
  claw: exit=1 elapsed=211959ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (34752 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

[run-registry] appended lru-cache row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-32)
  ✖ claw implements LRUCache satisfying every spec bullet (211970.408554ms)
✖ lru-cache: LRU + TTL + eviction callback (tier=tier-32) (211970.970624ms)

=== mini-vm (tier-32) ===
  claw: exit=0 elapsed=55866ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","verify.js","vm.js"]
  node post-fix: exit=0 stderr=
▶ mini-vm: bytecode interpreter (tier=tier-32)
  ✔ claw implements run handling all 13 opcodes + error cases (55902.39008ms)
✔ mini-vm: bytecode interpreter (tier=tier-32) (55902.903722ms)

=== multi-bug-decoy (tier-32) ===
  claw: exit=1 elapsed=134248ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","helpers.js"]
  claw stderr (tail):
[error-kind: api_http_error]
error: api returned 400 Bad Request: {"error":{"message":"litellm.BadRequestError: OpenAIException - request (32828 tokens) exceeds the available context size (32768 tokens), try increasing it. Received Model Group=anthropic/claw-llama\nAvailable Model Group Fallbacks=None","type":null,"param":null,"code":"400"}}

Run `claw --help` for usage.

▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-32)
  ✖ claw fixes the bugs without breaking the decoy (134272.887251ms)
✖ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-32) (134273.469806ms)

=== multi-bug (tier-32) ===
  claw: exit=0 elapsed=47584ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-32)
  ✔ claw fixes all three helpers (47634.751953ms)
✔ multi-bug: fix three independent bugs (tier=tier-32) (47635.237334ms)

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=5862ms files=[".claw",".claw-runtime","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/service.js:1
import { compute } from './lib.js';
         ^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointW
▶ multi-file rename + signature change (tier=tier-32)
  ✖ claw renames across files and updates the call site (5913.269286ms)
✖ multi-file rename + signature change (tier=tier-32) (5914.200627ms)

=== null-default (tier-32) ===
  claw: exit=0 elapsed=4836ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-32)
  ✔ claw distinguishes missing from falsy (4873.75993ms)
✔ null-default: missing vs falsy (tier=tier-32) (4874.289726ms)

=== parseISO-with-timezone (tier-32) ===
  claw: exit=0 elapsed=7100ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","iso.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended parseISO-with-timezone row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ parseISO-with-timezone: ISO 8601 parser (tier=tier-32)
  ✔ claw implements parseISO with offset handling and invalid-input throws (7141.777554ms)
✔ parseISO-with-timezone: ISO 8601 parser (tier=tier-32) (7142.288017ms)

=== prose-quality:bridge (tier-32) ===
  [1/3] stop=end_turn 5341ms textLen=1509 newlines=13 bullets=4
  [2/3] stop=end_turn 4861ms textLen=1438 newlines=13 bullets=4
  [3/3] stop=end_turn 4830ms textLen=1381 newlines=18 bullets=8
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are the building blocks of React applications. They allow developers to split the UI into independent, reusable pieces, making it easier to manage and scale complex user interfaces. Each component is responsible for rendering a specific part of the application and can be 
▶ prose quality via raw bridge (tier=tier-32)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (15033.29429ms)
✔ prose quality via raw bridge (tier=tier-32) (15034.680594ms)

=== prose-quality:claw-renderer (tier-32) ===
  [1/3] exit=0 5154ms rawLen=1469 cleanLen=1317 newlines=5 bullets=3
  [2/3] exit=0 4776ms rawLen=1338 cleanLen=1186 newlines=5 bullets=3
  [3/3] exit=0 5272ms rawLen=1516 cleanLen=1334 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the building blocks of React applications. They allow developers to break down complex UIs into smaller, reusable pieces. Each component is responsible for rendering a specific part of the user interface and can be composed together to create more compl
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-32, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (15234.051972ms)
✔ prose quality via claw renderer (tier=tier-32, informational) (15234.391434ms)

=== refactor (tier-32) ===
  claw: exit=0 elapsed=4251ms files=[".claw",".claw-runtime","buggy.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: sum([1,2,3]) should be 6

NaN !== 6

    at file:///workspace/buggy.js:9:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMess
▶ refactor: fix seeded off-by-one (tier=tier-32)
  ✖ claw fixes buggy.js so its assertions pass (4306.425187ms)
✖ refactor: fix seeded off-by-one (tier=tier-32) (4307.221736ms)

=== spec-compliance (tier-32) ===
  claw: exit=0 elapsed=20965ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-32)
  ✔ claw implements formatPrice satisfying all four requirements (21001.88652ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-32) (21002.403066ms)

=== spec-precedence (tier-32) ===
  claw: exit=0 elapsed=8830ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=1 stderr=file:///workspace/verify.js:2
import { normalizePath } from './path.js';
         ^^^^^^^^^^^^^
SyntaxError: Named export 'normalizePath' not found. The requested module './path.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from './path.js';
const { normalizePath }
▶ spec-precedence: ordered transformation rules (tier=tier-32)
  ✖ claw applies the rules in the specified order (8866.565649ms)
✖ spec-precedence: ordered transformation rules (tier=tier-32) (8867.299322ms)

=== state-machine (tier-32) ===
  claw: exit=0 elapsed=37115ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-32)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (37143.619252ms)
✔ state-machine: traffic light (tier=tier-32) (37144.096338ms)

=== subtle-broken-spec (tier-32) ===
  claw: exit=0 elapsed=56067ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","formatTime.js","verify.js"]
  node post-fix: exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: exactly 1 minute (verbose form)

'1m' !== '1m 0s'

    at file:///workspace/verify.js:13:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
[run-registry] appended subtle-broken-spec row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-32)
  ✖ claw implements formatTime to match verify (despite suggestive prompt) (56126.966189ms)
✖ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-32) (56127.721652ms)

=== subtle-bug (tier-32) ===
  claw: exit=0 elapsed=14877ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-32)
  ✔ claw fixes median.js so its assertions pass (14924.362977ms)
✔ subtle bug: default-sort lexicographic (tier=tier-32) (14924.850522ms)

=== tool-confusion-redundant-verifies (tier-32) ===
  claw: exit=0 elapsed=6673ms files=[".claw",".claw-runtime","check.js","parse.js","validate.js","verify.js"]
  node post-fix (verify.js): exit=1 stderr=node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: splits on first =
+ actual - expected

  {
+   a: 'foo'
-   a: 'foo=bar'
  }

    at file:///workspace/verify.js:9:8
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal
[run-registry] appended tool-confusion-redundant-verifies row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-32)
  ✖ claw implements parse against verify.js, ignoring red-herring verifiers (6714.159592ms)
✖ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-32) (6715.175266ms)

=== tool-discipline (tier-32) ===
  [1/10] ok=true stop=tool_use tool_use=true 837ms
  [2/10] ok=true stop=tool_use tool_use=true 594ms
  [3/10] ok=true stop=tool_use tool_use=true 591ms
  [4/10] ok=true stop=tool_use tool_use=true 594ms
  [5/10] ok=true stop=tool_use tool_use=true 592ms
  [6/10] ok=true stop=tool_use tool_use=true 593ms
  [7/10] ok=true stop=tool_use tool_use=true 592ms
  [8/10] ok=true stop=tool_use tool_use=true 594ms
  [9/10] ok=true stop=tool_use tool_use=true 591ms
  [10/10] ok=true stop=tool_use tool_use=true 591ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 591ms · median 593ms · p95 837ms · mean 617ms
▶ tool-call wrapping (tier=tier-32, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (6170.513033ms)
✔ tool-call wrapping (tier=tier-32, bridge=claw-llama) (6171.341913ms)

=== two-step-refactor (tier-32) ===
  claw: exit=0 elapsed=13314ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-32)
  ✔ claw extracts the helper without copying the off-by-one (13368.28148ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-32) (13368.863068ms)
ℹ tests 37
ℹ suites 37
ℹ pass 18
ℹ fail 19
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1579010.946388

✖ failing tests:

test at __tests__/tier-eval/adversarial-input.test.js:69:3
✖ claw implements slugify robustly enough for adversarial inputs (12364.071871ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { slugify } from './slugify.js';
           ^^^^^^^
  SyntaxError: Named export 'slugify' not found. The requested module './slugify.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './slugify.js';
  const { slugify } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/adversarial-input.test.js:96:12)
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

test at __tests__/tier-eval/algorithm-intervals.test.js:67:3
✖ claw merges intervals across all edge cases (10979.066719ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: unsorted input
  + actual - expected
  
    [
      [
        1,
  -     2
  -   ],
  -   [
  -     3,
        5
      ]
    ]
  
      at file:///workspace/verify.js:7:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: [ [ 1, 5 ] ],
    expected: [ [ 1, 2 ], [ 3, 5 ] ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/algorithm-intervals.test.js:84:12)
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

test at __tests__/tier-eval/comment-spec.test.js:92:3
✖ claw implements both functions per JSDoc (25548.013809ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: partition basic
  + actual - expected
  
  + undefined
  - [
  -   [
  -     2,
  -     4
  -   ],
  -   [
  -     1,
  -     3
  -   ]
  - ]
  
      at file:///workspace/verify.js:4:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: undefined,
    expected: [ [ 2, 4 ], [ 1, 3 ] ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/comment-spec.test.js:114:12)
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

test at __tests__/tier-eval/csv-parser.test.js:145:3
✖ claw implements parseCSV handling every quoting case (58550.827005ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: embedded newline
  + actual - expected
  
    [
      [
        'a',
        'b'
      ],
      [
  +     'line1'
  -     'line1\nline2',
  -     'x'
      ],
  +   [
  +     'line2,x'
  +   ]
    ]
  
      at file:///workspace/verify.js:19:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: [ [ 'a', 'b' ], [ 'line1' ], [ 'line2,x' ] ],
    expected: [ [ 'a', 'b' ], [ 'line1\nline2', 'x' ] ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/csv-parser.test.js:172:12)
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

test at __tests__/tier-eval/deep-equal.test.js:68:3
✖ claw implements deep equality including NaN (8881.486462ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { isEqual } from './eq.js';
           ^^^^^^^
  SyntaxError: Named export 'isEqual' not found. The requested module './eq.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './eq.js';
  const { isEqual } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/deep-equal.test.js:95:12)
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

test at __tests__/tier-eval/dependency-graph.test.js:99:3
✖ claw implements topoSort handling DAG, cycle, and disconnected (13707.872067ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: returns a valid topo order
      at file:///workspace/verify.js:21:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/dependency-graph.test.js:116:12)
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

test at __tests__/tier-eval/eight-functions.test.js:143:3
✖ claw implements all twelve helpers with correct cross-file imports (29578.458323ms)
  AssertionError [ERR_ASSERTION]: missing target files: pad.js, clamp.js, unique.js, chunk.js, flatten.js, omit.js, pick.js, compact.js, safeIndex.js, formatHex.js, sortedKeys.js, deepFlatten.js
  
  false !== true
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/eight-functions.test.js:173:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at __tests__/tier-eval/expression-eval.test.js:141:3
✖ claw implements evaluate handling precedence, assoc, errors (360056.717403ms)
  Error: claw timed out after 360000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:149:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

test at __tests__/tier-eval/json-schema-validate.test.js:167:3
✖ claw implements validate with recursive paths and error accumulation (222741.662342ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/json-schema-validate.test.js:174:12)
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

test at __tests__/tier-eval/large-refactor.test.js:122:3
✖ claw threads the new parameter through every caller (12054.505963ms)
  AssertionError [ERR_ASSERTION]: test.js still fails:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: cart total uses cart currency
  + actual - expected
  
  + '$15.50'
  - 'GBP 15.50'
  
      at file:///workspace/test.js:9:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: '$15.50',
    expected: 'GBP 15.50',
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/large-refactor.test.js:153:12)
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

test at __tests__/tier-eval/latency.test.js:211:3
✖ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (1387.520065ms)
  AssertionError [ERR_ASSERTION]: wrap rate 0.10 below threshold 0.9 — grammar may have regressed
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

test at __tests__/tier-eval/long-horizon-bugs.test.js:133:3
✖ claw fixes every bug across the helper modules (26601.040806ms)
  AssertionError [ERR_ASSERTION]: test.js still fails:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: first
  
  3 !== 1
  
      at file:///workspace/test.js:13:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 3,
    expected: 1,
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/long-horizon-bugs.test.js:155:12)
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

test at __tests__/tier-eval/lru-cache.test.js:176:3
✖ claw implements LRUCache satisfying every spec bullet (211970.408554ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/lru-cache.test.js:201:12)
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

test at __tests__/tier-eval/multi-bug-decoy.test.js:133:3
✖ claw fixes the bugs without breaking the decoy (134272.887251ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-bug-decoy.test.js:146:12)
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

test at __tests__/tier-eval/multi-file-rename.test.js:83:3
✖ claw renames across files and updates the call site (5913.269286ms)
  AssertionError [ERR_ASSERTION]: index.js still fails after claw's edits:
  file:///workspace/service.js:1
  import { compute } from './lib.js';
           ^^^^^^^
  SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:105:12)
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

test at __tests__/tier-eval/refactor.test.js:68:3
✖ claw fixes buggy.js so its assertions pass (4306.425187ms)
  AssertionError [ERR_ASSERTION]: buggy.js still fails after claw's fix:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: sum([1,2,3]) should be 6
  
  NaN !== 6
  
      at file:///workspace/buggy.js:9:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: NaN,
    expected: 6,
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/refactor.test.js:91:12)
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

test at __tests__/tier-eval/spec-precedence.test.js:82:3
✖ claw applies the rules in the specified order (8866.565649ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  file:///workspace/verify.js:2
  import { normalizePath } from './path.js';
           ^^^^^^^^^^^^^
  SyntaxError: Named export 'normalizePath' not found. The requested module './path.js' is a CommonJS module, which may not support all module.exports as named exports.
  CommonJS modules can always be imported via the default export, for example using:
  
  import pkg from './path.js';
  const { normalizePath } = pkg;
  
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/spec-precedence.test.js:99:12)
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

test at __tests__/tier-eval/subtle-broken-spec.test.js:97:3
✖ claw implements formatTime to match verify (despite suggestive prompt) (56126.966189ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: exactly 1 minute (verbose form)
  
  '1m' !== '1m 0s'
  
      at file:///workspace/verify.js:13:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: '1m',
    expected: '1m 0s',
    operator: 'strictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/subtle-broken-spec.test.js:124:12)
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

test at __tests__/tier-eval/tool-confusion-redundant-verifies.test.js:114:3
✖ claw implements parse against verify.js, ignoring red-herring verifiers (6714.159592ms)
  AssertionError [ERR_ASSERTION]: verify.js failed:
  node:internal/modules/run_main:107
      triggerUncaughtException(
      ^
  
  AssertionError [ERR_ASSERTION]: splits on first =
  + actual - expected
  
    {
  +   a: 'foo'
  -   a: 'foo=bar'
    }
  
      at file:///workspace/verify.js:9:8
      at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: { a: 'foo' },
    expected: { a: 'foo=bar' },
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/tool-confusion-redundant-verifies.test.js:141:12)
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

Exit code: 1 (rep=1 tier=32)

## rep=1 tier=64

```
 Container test-test-run-0f9098815f42 Creating 
 Container test-test-run-0f9098815f42 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=7213ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended adversarial-input row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (7249.804387ms)
✔ adversarial inputs: slugify (tier=tier-64) (7250.224098ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2870ms files=[".claw",".claw-runtime","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2883.363508ms)
✔ agent: parallel file writes (tier=tier-64) (2884.010763ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1306ms files=[".claw",".claw-runtime","hello.py"]
[run-registry] appended agent-single row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1322.755855ms)
✔ agent: single-file write (tier=tier-64) (1323.346235ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=6321ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (6359.441036ms)
✔ algorithm: merge intervals (tier=tier-64) (6359.924164ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=6156ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended api-evolution row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (6207.348623ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (6207.803003ms)

=== cascading-bugs (tier-64) ===
  claw: exit=0 elapsed=39214ms files=[".claw",".claw-runtime",".clawd-todos.json",".sandbox-home",".sandbox-tmp","a.js","b.js","c.js","d.js","e.js","run.js"]
  node post-fix: exit=0 stdout=all-pass stderr=
▶ cascading-bugs: 5 sequential failures, one runner (tier=tier-64)
  ✔ claw iterates run/fix until run.js exits clean (39263.386484ms)
✔ cascading-bugs: 5 sequential failures, one runner (tier=tier-64) (39263.837823ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5049ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5085.260797ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5085.739385ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=8580ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (8628.498143ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (8628.97444ms)

=== csv-parser (tier-64) ===
  claw: exit=0 elapsed=12102ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","csv.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended csv-parser row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ csv-parser: RFC 4180-ish parser (tier=tier-64)
  ✔ claw implements parseCSV handling every quoting case (12148.733406ms)
✔ csv-parser: RFC 4180-ish parser (tier=tier-64) (12149.176162ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=7377ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended deep-equal row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (7416.043854ms)
✔ deep-equal: structural equality (tier=tier-64) (7416.467651ms)

=== dependency-graph (tier-64) ===
  claw: exit=0 elapsed=17386ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","graph.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ dependency-graph: topological sort with cycle detection (tier=tier-64)
  ✔ claw implements topoSort handling DAG, cycle, and disconnected (17420.895358ms)
✔ dependency-graph: topological sort with cycle detection (tier=tier-64) (17421.349238ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6494ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (6539.285668ms)
✔ distractor: one buggy helper among three (tier=tier-64) (6539.726173ms)

=== eight-functions (tier-64) ===
  claw: exit=0 elapsed=22011ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","chunk.js","clamp.js","compact.js","deepFlatten.js","flatten.js","formatHex.js","omit.js","pad.js","pick.js","safeIndex.js","sortedKeys.js","unique.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended eight-functions row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ eight-functions: 12 helpers with cross-file deps (tier=tier-64)
  ✔ claw implements all twelve helpers with correct cross-file imports (22046.732709ms)
✔ eight-functions: 12 helpers with cross-file deps (tier=tier-64) (22047.166589ms)

=== expression-eval (tier-64) ===
  claw: exit=0 elapsed=48802ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","expr.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended expression-eval row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ expression-eval: recursive-descent parser (tier=tier-64)
  ✔ claw implements evaluate handling precedence, assoc, errors (48841.48595ms)
✔ expression-eval: recursive-descent parser (tier=tier-64) (48841.902162ms)

=== json-schema-validate (tier-64) ===
  claw: exit=0 elapsed=15802ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","validator.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ json-schema-validate: recursive validator (tier=tier-64)
  ✔ claw implements validate with recursive paths and error accumulation (15839.244693ms)
✔ json-schema-validate: recursive validator (tier=tier-64) (15839.706115ms)

=== large-refactor (tier-64) ===
  claw: exit=0 elapsed=12007ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","cart.js","format.js","receipt.js","report.js","test.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended large-refactor row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ large-refactor: thread currency through 5 call sites (tier=tier-64)
  ✔ claw threads the new parameter through every caller (12055.5059ms)
✔ large-refactor: thread currency through 5 call sites (tier=tier-64) (12055.932072ms)
  [1/10] ttft=1506ms
  [2/10] ttft=153ms
  [3/10] ttft=137ms
  [4/10] ttft=136ms
  [5/10] ttft=136ms
  [6/10] ttft=136ms
  [7/10] ttft=139ms
  [8/10] ttft=139ms
  [9/10] ttft=137ms
  [10/10] ttft=135ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=137ms · p95=1506ms · mean=275ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4914.752491ms)
✔ TTFT — time to first token (tier=tier-64) (4916.811346ms)
  [1/20] ok=true stop=tool_use 655ms
  [2/20] ok=true stop=tool_use 514ms
  [3/20] ok=true stop=tool_use 512ms
  [4/20] ok=true stop=tool_use 515ms
  [5/20] ok=true stop=tool_use 510ms
  [6/20] ok=true stop=tool_use 510ms
  [7/20] ok=true stop=tool_use 509ms
  [8/20] ok=true stop=tool_use 514ms
  [9/20] ok=true stop=tool_use 509ms
  [10/20] ok=true stop=tool_use 510ms
  [11/20] ok=true stop=tool_use 510ms
  [12/20] ok=true stop=tool_use 510ms
  [13/20] ok=true stop=tool_use 514ms
  [14/20] ok=true stop=tool_use 513ms
  [15/20] ok=true stop=tool_use 514ms
  [16/20] ok=true stop=tool_use 513ms
  [17/20] ok=true stop=tool_use 516ms
  [18/20] ok=true stop=tool_use 511ms
  [19/20] ok=true stop=tool_use 513ms
  [20/20] ok=true stop=tool_use 514ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 509ms · median 513ms · p95 655ms · mean 519ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10392.664554ms)
✔ tool-call roundtrip latency (tier=tier-64) (10393.035724ms)

=== long-horizon-bugs (tier-64) ===
  claw: exit=0 elapsed=17295ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","README.md","arrays.js","math.js","objects.js","strings.js","test.js"]
  node post-fix: exit=0 stderr=
▶ long-horizon: 4 bugs across 6 files (tier=tier-64)
  ✔ claw fixes every bug across the helper modules (17348.197202ms)
✔ long-horizon: 4 bugs across 6 files (tier=tier-64) (17348.728042ms)

=== lru-cache (tier-64) ===
  claw: exit=0 elapsed=22054ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lru.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended lru-cache row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ lru-cache: LRU + TTL + eviction callback (tier=tier-64)
  ✔ claw implements LRUCache satisfying every spec bullet (22096.451843ms)
✔ lru-cache: LRU + TTL + eviction callback (tier=tier-64) (22096.896098ms)
▶ mini-vm: bytecode interpreter (tier=tier-64)
  ✖ claw implements run handling all 13 opcodes + error cases (240041.83759ms)
✖ mini-vm: bytecode interpreter (tier=tier-64) (240042.918477ms)

=== multi-bug-decoy (tier-64) ===
  claw: exit=0 elapsed=37200ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","helpers.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64)
  ✔ claw fixes the bugs without breaking the decoy (37245.339803ms)
✔ multi-bug-decoy: 5 bugs + 1 correct helper (tier=tier-64) (37245.8051ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11505ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11554.717019ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11555.242734ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=7980ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (8027.054794ms)
✔ multi-file rename + signature change (tier=tier-64) (8027.524424ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4766ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (4805.253224ms)
✔ null-default: missing vs falsy (tier=tier-64) (4805.727396ms)

=== parseISO-with-timezone (tier-64) ===
  claw: exit=0 elapsed=14957ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","iso.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended parseISO-with-timezone row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ parseISO-with-timezone: ISO 8601 parser (tier=tier-64)
  ✔ claw implements parseISO with offset handling and invalid-input throws (14997.074444ms)
✔ parseISO-with-timezone: ISO 8601 parser (tier=tier-64) (14997.525656ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 4757ms textLen=2286 newlines=11 bullets=4
  [2/3] stop=end_turn 5121ms textLen=2430 newlines=13 bullets=4
  [3/3] stop=end_turn 4979ms textLen=2302 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are the fundamental building blocks of modern user interfaces built with the React library. Think of them as independent, reusable pieces of code that encapsulate specific functionality and visual output. Just like how LEGO bricks can be combined to create complex structu
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14857.481678ms)
✔ prose quality via raw bridge (tier=tier-64) (14858.251853ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 5141ms rawLen=2308 cleanLen=2156 newlines=5 bullets=3
  [2/3] exit=0 4119ms rawLen=1979 cleanLen=1779 newlines=5 bullets=3
  [3/3] exit=0 4049ms rawLen=1904 cleanLen=1668 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are the fundamental building blocks of every React application. Think of them as independent, reusable Lego bricks that each handle a specific piece of UI — a button, a navigation bar, a card, or an entire page. Each component encapsulates its own structure
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13338.613767ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13338.885229ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6269ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6317.513355ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6318.081819ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=6251ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (6295.402864ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (6295.888828ms)

=== spec-precedence (tier-64) ===
  claw: exit=0 elapsed=9304ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","path.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec-precedence: ordered transformation rules (tier=tier-64)
  ✔ claw applies the rules in the specified order (9340.615101ms)
✔ spec-precedence: ordered transformation rules (tier=tier-64) (9341.057438ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=7684ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (7719.418996ms)
✔ state-machine: traffic light (tier=tier-64) (7719.884875ms)

=== subtle-broken-spec (tier-64) ===
  claw: exit=0 elapsed=29838ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","formatTime.js","verify.js"]
  node post-fix: exit=0 stderr=
[run-registry] appended subtle-broken-spec row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-64)
  ✔ claw implements formatTime to match verify (despite suggestive prompt) (29883.491619ms)
✔ subtle-broken-spec: formatTime with prompt/verify mismatch (tier=tier-64) (29883.910832ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6662ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6720.228943ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6720.695364ms)

=== tool-confusion-redundant-verifies (tier-64) ===
  claw: exit=0 elapsed=7239ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","check.js","parse.js","validate.js","verify.js"]
  node post-fix (verify.js): exit=0 stderr=
[run-registry] appended tool-confusion-redundant-verifies row → /workspace/.claw-runtime/run_registry.overnight-20260429-1343.jsonl
▶ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-64)
  ✔ claw implements parse against verify.js, ignoring red-herring verifiers (7276.030687ms)
✔ tool-confusion-redundant-verifies: parse() with red-herring verifiers (tier=tier-64) (7276.474484ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 720ms
  [2/10] ok=true stop=tool_use tool_use=true 514ms
  [3/10] ok=true stop=tool_use tool_use=true 519ms
  [4/10] ok=true stop=tool_use tool_use=true 511ms
  [5/10] ok=true stop=tool_use tool_use=true 511ms
  [6/10] ok=true stop=tool_use tool_use=true 509ms
  [7/10] ok=true stop=tool_use tool_use=true 512ms
  [8/10] ok=true stop=tool_use tool_use=true 510ms
  [9/10] ok=true stop=tool_use tool_use=true 511ms
  [10/10] ok=true stop=tool_use tool_use=true 512ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 509ms · median 512ms · p95 720ms · mean 533ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (5331.385734ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (5334.830188ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=8704ms files=[".claw",".claw-runtime",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (8757.853947ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (8758.399536ms)
ℹ tests 37
ℹ suites 37
ℹ pass 36
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 707563.604101

✖ failing tests:

test at __tests__/tier-eval/mini-vm.test.js:203:3
✖ claw implements run handling all 13 opcodes + error cases (240041.83759ms)
  Error: claw timed out after 240000ms
  stderr:
  
      at ChildProcess.<anonymous> (file:///test/lib/claw.js:149:16)
      at ChildProcess.emit (node:events:509:28)
      at maybeClose (node:internal/child_process:1124:16)
      at ChildProcess._handle.onexit (node:internal/child_process:306:5)

```

Exit code: 1 (rep=1 tier=64)

