# Tier Eval Results — 2026-04-28 03:24

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-07ee0e721257 Creating 
 Container test-test-run-07ee0e721257 Created 

=== adversarial-input (tier-64) ===
  claw: exit=1 elapsed=4732ms files=[".claw","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ adversarial inputs: slugify (tier=tier-64)
  ✖ claw implements slugify robustly enough for adversarial inputs (4735.221825ms)
✖ adversarial inputs: slugify (tier=tier-64) (4736.321952ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=3426ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (3428.560628ms)
✔ agent: parallel file writes (tier=tier-64) (3429.14938ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=3846ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (3848.779314ms)
✔ agent: single-file write (tier=tier-64) (3849.381398ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=7906ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (7928.983329ms)
✔ algorithm: merge intervals (tier=tier-64) (7929.496371ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=8449ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (8484.323801ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (8484.804344ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=6508ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (6531.008729ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (6531.545147ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=17666ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (17698.308364ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (17698.78724ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=15212ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (15226.577355ms)
✔ deep-equal: structural equality (tier=tier-64) (15226.970481ms)

=== distractor (tier-64) ===
  claw: exit=1 elapsed=10402ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ distractor: one buggy helper among three (tier=tier-64)
  ✖ claw fixes only the broken helper (10415.362271ms)
✖ distractor: one buggy helper among three (tier=tier-64) (10416.854899ms)
  [1/10] ttft=1691ms
  [2/10] ttft=58ms
  [3/10] ttft=58ms
  [4/10] ttft=52ms
  [5/10] ttft=55ms
  [6/10] ttft=56ms
  [7/10] ttft=53ms
  [8/10] ttft=54ms
  [9/10] ttft=57ms
  [10/10] ttft=54ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=52ms · median=56ms · p95=1691ms · mean=219ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (9174.499581ms)
✔ TTFT — time to first token (tier=tier-64) (9175.607417ms)
  [1/20] ok=true stop=tool_use 1682ms
  [2/20] ok=true stop=tool_use 1958ms
  [3/20] ok=true stop=tool_use 1089ms
  [4/20] ok=true stop=tool_use 1553ms
  [5/20] ok=true stop=tool_use 1349ms
  [6/20] ok=true stop=tool_use 1225ms
  [7/20] ok=true stop=tool_use 1223ms
  [8/20] ok=true stop=tool_use 1194ms
  [9/20] ok=true stop=tool_use 1357ms
  [10/20] ok=true stop=tool_use 1293ms
  [11/20] ok=true stop=tool_use 1357ms
  [12/20] ok=true stop=tool_use 1561ms
  [13/20] ok=true stop=tool_use 1206ms
  [14/20] ok=true stop=tool_use 1096ms
  [15/20] ok=true stop=tool_use 1099ms
  [16/20] ok=true stop=tool_use 1364ms
  [17/20] ok=true stop=tool_use 1354ms
  [18/20] ok=true stop=tool_use 1435ms
  [19/20] ok=true stop=tool_use 1377ms
  [20/20] ok=true stop=tool_use 1493ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 1089ms · median 1357ms · p95 1958ms · mean 1363ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (27270.992791ms)
✔ tool-call roundtrip latency (tier=tier-64) (27271.288833ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=15388ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (15422.30783ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (15422.80804ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=9870ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (9901.282914ms)
✔ multi-file rename + signature change (tier=tier-64) (9901.760957ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=8516ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (8537.664439ms)
✔ null-default: missing vs falsy (tier=tier-64) (8538.172857ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=max_tokens 11999ms textLen=0 newlines=0 bullets=0
  [2/3] stop=max_tokens 11879ms textLen=0 newlines=0 bullets=0
  [3/3] stop=max_tokens 11943ms textLen=0 newlines=0 bullets=0
  sample[0] (first 320 chars, \n literal):
    
▶ prose quality via raw bridge (tier=tier-64)
  ✖ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (35822.762968ms)
✖ prose quality via raw bridge (tier=tier-64) (35823.483303ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 5156ms rawLen=1934 cleanLen=1749 newlines=7 bullets=3
  [2/3] exit=0 4004ms rawLen=1582 cleanLen=1382 newlines=7 bullets=3
  [3/3] exit=0 4204ms rawLen=1672 cleanLen=1472 newlines=7 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the building blocks of modern web applications built with the React library. Think of them as independent, reusable pieces of UI that encapsulate their own structure, behavior, and styling. Each component is essentially a JavaScript f
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13364.50354ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13364.713749ms)

=== refactor (tier-64) ===
  claw: exit=1 elapsed=5765ms files=[".claw","buggy.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✖ claw fixes buggy.js so its assertions pass (5778.802121ms)
✖ refactor: fix seeded off-by-one (tier=tier-64) (5781.298085ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=8943ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (8970.766574ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (8971.227908ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=6948ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (6973.33841ms)
✔ state-machine: traffic light (tier=tier-64) (6973.84741ms)

=== subtle-bug (tier-64) ===
  claw: exit=1 elapsed=5923ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✖ claw fixes median.js so its assertions pass (5940.045005ms)
✖ subtle bug: default-sort lexicographic (tier=tier-64) (5940.949048ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 1385ms
  [2/10] ok=true stop=tool_use tool_use=true 1149ms
  [3/10] ok=true stop=tool_use tool_use=true 1214ms
  [4/10] ok=true stop=tool_use tool_use=true 1354ms
  [5/10] ok=true stop=tool_use tool_use=true 1480ms
  [6/10] ok=true stop=tool_use tool_use=true 1239ms
  [7/10] ok=true stop=tool_use tool_use=true 1112ms
  [8/10] ok=true stop=tool_use tool_use=true 1113ms
  [9/10] ok=true stop=tool_use tool_use=true 1952ms
  [10/10] ok=true stop=tool_use tool_use=true 1539ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 1112ms · median 1354ms · p95 1952ms · mean 1354ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (13539.247995ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (13540.450622ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=15986ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (16019.457934ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (16019.991353ms)
ℹ tests 22
ℹ suites 22
ℹ pass 17
ℹ fail 5
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 255552.710825

✖ failing tests:

test at __tests__/tier-eval/adversarial-input.test.js:51:3
✖ claw implements slugify robustly enough for adversarial inputs (4735.221825ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/adversarial-input.test.js:58:12)
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

test at __tests__/tier-eval/distractor.test.js:72:3
✖ claw fixes only the broken helper (10415.362271ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/distractor.test.js:85:12)
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
✖ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (35822.762968ms)
  AssertionError [ERR_ASSERTION]: [1] response too short: textLen=0 < 600
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/prose-quality.test.js:91:16)
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

test at __tests__/tier-eval/refactor.test.js:51:3
✖ claw fixes buggy.js so its assertions pass (5778.802121ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/refactor.test.js:65:12)
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

test at __tests__/tier-eval/subtle-bug.test.js:52:3
✖ claw fixes median.js so its assertions pass (5940.045005ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/subtle-bug.test.js:65:12)
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

