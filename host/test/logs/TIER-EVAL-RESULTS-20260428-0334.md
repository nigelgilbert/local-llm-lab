# Tier Eval Results — 2026-04-28 03:34

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-2c8827853388 Creating 
 Container test-test-run-2c8827853388 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=13658ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (13680.724326ms)
✔ adversarial inputs: slugify (tier=tier-64) (13681.228212ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=3398ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (3400.021033ms)
✔ agent: parallel file writes (tier=tier-64) (3400.654392ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=2840ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (2842.906376ms)
✔ agent: single-file write (tier=tier-64) (2843.558154ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=10640ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (10663.38504ms)
✔ algorithm: merge intervals (tier=tier-64) (10663.872508ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=11175ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (11205.980862ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (11206.515335ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=6872ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (6893.670556ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (6894.114271ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=12263ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (12297.358414ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (12297.84084ms)

=== deep-equal (tier-64) ===
  claw: exit=1 elapsed=24854ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ deep-equal: structural equality (tier=tier-64)
  ✖ claw implements deep equality including NaN (24856.329556ms)
✖ deep-equal: structural equality (tier=tier-64) (24857.501202ms)

=== distractor (tier-64) ===
  claw: exit=1 elapsed=7360ms files=[".claw","geometry.js","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ distractor: one buggy helper among three (tier=tier-64)
  ✖ claw fixes only the broken helper (7380.083065ms)
✖ distractor: one buggy helper among three (tier=tier-64) (7381.404442ms)
  [1/10] ttft=1519ms
  [2/10] ttft=73ms
  [3/10] ttft=69ms
  [4/10] ttft=68ms
  [5/10] ttft=63ms
  [6/10] ttft=52ms
  [7/10] ttft=63ms
  [8/10] ttft=58ms
  [9/10] ttft=54ms
  [10/10] ttft=64ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=52ms · median=64ms · p95=1519ms · mean=208ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (10021.048388ms)
✔ TTFT — time to first token (tier=tier-64) (10021.98364ms)
  [1/20] ok=true stop=tool_use 1340ms
  [2/20] ok=true stop=tool_use 1235ms
  [3/20] ok=true stop=tool_use 1196ms
  [4/20] ok=true stop=tool_use 1162ms
  [5/20] ok=true stop=tool_use 1215ms
  [6/20] ok=true stop=tool_use 1529ms
  [7/20] ok=true stop=tool_use 1475ms
  [8/20] ok=true stop=tool_use 1291ms
  [9/20] ok=true stop=tool_use 1209ms
  [10/20] ok=true stop=tool_use 1212ms
  [11/20] ok=true stop=tool_use 1139ms
  [12/20] ok=true stop=tool_use 1118ms
  [13/20] ok=true stop=tool_use 1371ms
  [14/20] ok=true stop=tool_use 1340ms
  [15/20] ok=true stop=tool_use 1164ms
  [16/20] ok=true stop=tool_use 1104ms
  [17/20] ok=true stop=tool_use 1677ms
  [18/20] ok=true stop=tool_use 1164ms
  [19/20] ok=true stop=tool_use 1212ms
  [20/20] ok=true stop=tool_use 1104ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 1104ms · median 1212ms · p95 1677ms · mean 1263ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (25263.231822ms)
✔ tool-call roundtrip latency (tier=tier-64) (25263.536712ms)

=== multi-bug (tier-64) ===
  claw: exit=1 elapsed=11538ms files=[".claw","text.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✖ claw fixes all three helpers (11555.81456ms)
✖ multi-bug: fix three independent bugs (tier=tier-64) (11556.85613ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=9660ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (9695.949621ms)
✔ multi-file rename + signature change (tier=tier-64) (9696.481908ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=8306ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (8328.212579ms)
✔ null-default: missing vs falsy (tier=tier-64) (8328.703402ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=max_tokens 11992ms textLen=0 newlines=0 bullets=0
  [2/3] stop=max_tokens 11935ms textLen=0 newlines=0 bullets=0
  [3/3] stop=max_tokens 11952ms textLen=0 newlines=0 bullets=0
  sample[0] (first 320 chars, \n literal):
    
▶ prose quality via raw bridge (tier=tier-64)
  ✖ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (35880.686415ms)
✖ prose quality via raw bridge (tier=tier-64) (35881.454591ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 5349ms rawLen=2091 cleanLen=1879 newlines=7 bullets=3
  [2/3] exit=0 4402ms rawLen=1695 cleanLen=1543 newlines=7 bullets=3
  [3/3] exit=0 5008ms rawLen=2085 cleanLen=1810 newlines=8 bullets=4
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8\n▶ Thinking hidden\nWhat Are React Components?React components are the fundamental building blocks of any React application. Think of them as independent, reusable pieces of UI that encapsulate their own structure, behavior, and styling. Each component is essentially a JavaScript or TypeScript functi
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (14760.15206ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (14760.361783ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=8527ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (8557.734475ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (8558.213925ms)

=== spec-compliance (tier-64) ===
  claw: exit=1 elapsed=2157ms files=[".claw","verify.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✖ claw implements formatPrice satisfying all four requirements (2160.409613ms)
✖ spec compliance: multi-requirement formatPrice (tier=tier-64) (2161.381012ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=7325ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (7348.41478ms)
✔ state-machine: traffic light (tier=tier-64) (7348.946879ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=10342ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (10376.255601ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (10376.757561ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 2143ms
  [2/10] ok=true stop=tool_use tool_use=true 1306ms
  [3/10] ok=true stop=tool_use tool_use=true 1483ms
  [4/10] ok=true stop=tool_use tool_use=true 2024ms
  [5/10] ok=true stop=tool_use tool_use=true 1699ms
  [6/10] ok=true stop=tool_use tool_use=true 1603ms
  [7/10] ok=true stop=tool_use tool_use=true 1104ms
  [8/10] ok=true stop=tool_use tool_use=true 1266ms
  [9/10] ok=true stop=tool_use tool_use=true 1652ms
  [10/10] ok=true stop=tool_use tool_use=true 1139ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 1104ms · median 1603ms · p95 2143ms · mean 1542ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (15420.913523ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (15421.652084ms)

=== two-step-refactor (tier-64) ===
  claw: exit=1 elapsed=14184ms files=[".claw","stats.js"]
  claw stderr (tail):
[error-kind: unknown]
error: assistant stream produced no content

Run `claw --help` for usage.

▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✖ claw extracts the helper without copying the off-by-one (14201.302381ms)
✖ two-step refactor: extract helper and fix latent bug (tier=tier-64) (14202.14616ms)
ℹ tests 22
ℹ suites 22
ℹ pass 16
ℹ fail 6
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 267332.269881

✖ failing tests:

test at __tests__/tier-eval/deep-equal.test.js:50:3
✖ claw implements deep equality including NaN (24856.329556ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/deep-equal.test.js:57:12)
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
✖ claw fixes only the broken helper (7380.083065ms)
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

test at __tests__/tier-eval/multi-bug.test.js:63:3
✖ claw fixes all three helpers (11555.81456ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-bug.test.js:76:12)
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
✖ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (35880.686415ms)
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

test at __tests__/tier-eval/spec-compliance.test.js:52:3
✖ claw implements formatPrice satisfying all four requirements (2160.409613ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/spec-compliance.test.js:61:12)
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

test at __tests__/tier-eval/two-step-refactor.test.js:65:3
✖ claw extracts the helper without copying the off-by-one (14201.302381ms)
  AssertionError [ERR_ASSERTION]: claw must exit cleanly
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/two-step-refactor.test.js:78:12)
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

