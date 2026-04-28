# Tier Eval Results — 2026-04-28 03:41

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-66b299c10fa9 Creating 
 Container test-test-run-66b299c10fa9 Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=7406ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (7431.454352ms)
✔ adversarial inputs: slugify (tier=tier-64) (7431.942899ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2865ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2866.968935ms)
✔ agent: parallel file writes (tier=tier-64) (2867.675817ms)

=== agent-single (tier-64) ===
  exit=0 elapsed=1433ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-64)
  ✔ claw creates hello.py with the requested content (1436.447392ms)
✔ agent: single-file write (tier=tier-64) (1437.270483ms)

=== algorithm-intervals (tier-64) ===
  claw: exit=0 elapsed=5684ms files=[".claw",".sandbox-home",".sandbox-tmp","intervals.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ algorithm: merge intervals (tier=tier-64)
  ✔ claw merges intervals across all edge cases (5709.888261ms)
✔ algorithm: merge intervals (tier=tier-64) (5710.4966ms)

=== api-evolution (tier-64) ===
  claw: exit=0 elapsed=5783ms files=[".claw",".sandbox-home",".sandbox-tmp","app.js","pricing.js"]
  node post-fix: exit=0 stderr=
▶ api evolution: signature reorder across two files (tier=tier-64)
  ✔ claw reorders the signature and updates the call site (5824.514462ms)
✔ api evolution: signature reorder across two files (tier=tier-64) (5825.037176ms)

=== code-self-test (tier-64) ===
  claw: exit=0 elapsed=5294ms files=[".claw",".sandbox-home",".sandbox-tmp","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-64)
  ✔ claw writes fib.js that passes its own assertions under node (5321.482221ms)
✔ code self-test: fibonacci implementation (tier=tier-64) (5321.984392ms)

=== comment-spec (tier-64) ===
  claw: exit=0 elapsed=8630ms files=[".claw",".sandbox-home",".sandbox-tmp","collections.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ comment-spec: implement from JSDoc (tier=tier-64)
  ✔ claw implements both functions per JSDoc (8667.427288ms)
✔ comment-spec: implement from JSDoc (tier=tier-64) (8667.975585ms)

=== deep-equal (tier-64) ===
  claw: exit=0 elapsed=7988ms files=[".claw",".sandbox-home",".sandbox-tmp","eq.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ deep-equal: structural equality (tier=tier-64)
  ✔ claw implements deep equality including NaN (8014.422249ms)
✔ deep-equal: structural equality (tier=tier-64) (8014.945296ms)

=== distractor (tier-64) ===
  claw: exit=0 elapsed=6967ms files=[".claw",".sandbox-home",".sandbox-tmp","geometry.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ distractor: one buggy helper among three (tier=tier-64)
  ✔ claw fixes only the broken helper (7004.917315ms)
✔ distractor: one buggy helper among three (tier=tier-64) (7005.429654ms)
  [1/10] ttft=1597ms
  [2/10] ttft=141ms
  [3/10] ttft=136ms
  [4/10] ttft=138ms
  [5/10] ttft=138ms
  [6/10] ttft=137ms
  [7/10] ttft=136ms
  [8/10] ttft=137ms
  [9/10] ttft=136ms
  [10/10] ttft=135ms

=== TTFT (tier-64) ===
  n=10 errors=0
  min=135ms · median=137ms · p95=1597ms · mean=283ms
▶ TTFT — time to first token (tier=tier-64)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (4999.900916ms)
✔ TTFT — time to first token (tier=tier-64) (5000.818258ms)
  [1/20] ok=true stop=tool_use 659ms
  [2/20] ok=true stop=tool_use 511ms
  [3/20] ok=true stop=tool_use 512ms
  [4/20] ok=true stop=tool_use 515ms
  [5/20] ok=true stop=tool_use 517ms
  [6/20] ok=true stop=tool_use 513ms
  [7/20] ok=true stop=tool_use 512ms
  [8/20] ok=true stop=tool_use 512ms
  [9/20] ok=true stop=tool_use 514ms
  [10/20] ok=true stop=tool_use 516ms
  [11/20] ok=true stop=tool_use 513ms
  [12/20] ok=true stop=tool_use 514ms
  [13/20] ok=true stop=tool_use 516ms
  [14/20] ok=true stop=tool_use 514ms
  [15/20] ok=true stop=tool_use 514ms
  [16/20] ok=true stop=tool_use 512ms
  [17/20] ok=true stop=tool_use 513ms
  [18/20] ok=true stop=tool_use 515ms
  [19/20] ok=true stop=tool_use 515ms
  [20/20] ok=true stop=tool_use 515ms

=== tool-roundtrip (tier-64) ===
  wrap rate = 20/20 = 1.00  (threshold 0.9)
  latency   = min 511ms · median 514ms · p95 659ms · mean 521ms
▶ tool-call roundtrip latency (tier=tier-64)
  ✔ 20 round-trips: wrap rate ≥ 90%, latency distribution reported (10429.363274ms)
✔ tool-call roundtrip latency (tier=tier-64) (10429.671527ms)

=== multi-bug (tier-64) ===
  claw: exit=0 elapsed=11628ms files=[".claw",".sandbox-home",".sandbox-tmp","text.js"]
  node post-fix: exit=0 stderr=
▶ multi-bug: fix three independent bugs (tier=tier-64)
  ✔ claw fixes all three helpers (11670.942014ms)
✔ multi-bug: fix three independent bugs (tier=tier-64) (11671.509687ms)

=== multi-file-rename (tier-64) ===
  claw: exit=0 elapsed=7471ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-64)
  ✔ claw renames across files and updates the call site (7505.693785ms)
✔ multi-file rename + signature change (tier=tier-64) (7506.21604ms)

=== null-default (tier-64) ===
  claw: exit=0 elapsed=4877ms files=[".claw",".sandbox-home",".sandbox-tmp","lookup.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ null-default: missing vs falsy (tier=tier-64)
  ✔ claw distinguishes missing from falsy (4902.269463ms)
✔ null-default: missing vs falsy (tier=tier-64) (4902.768718ms)

=== prose-quality:bridge (tier-64) ===
  [1/3] stop=end_turn 5375ms textLen=2285 newlines=15 bullets=4
  [2/3] stop=end_turn 4466ms textLen=2122 newlines=13 bullets=4
  [3/3] stop=end_turn 4970ms textLen=2421 newlines=13 bullets=4
  sample[0] (first 320 chars, \n literal):
    ## What Are React Components?\n\nReact components are the fundamental building blocks of any modern React application. Think of them as independent, reusable pieces of UI that manage their own logic and rendering behavior. Just like Lego bricks, you can combine small, simple components to create complex user interfaces e
▶ prose quality via raw bridge (tier=tier-64)
  ✔ 3× markdown via streamMessage: len ≥ 600, newlines ≥ 5, bullets ≥ 3 (14813.24472ms)
✔ prose quality via raw bridge (tier=tier-64) (14814.370772ms)

=== prose-quality:claw-renderer (tier-64) ===
  [1/3] exit=0 5199ms rawLen=2339 cleanLen=2016 newlines=5 bullets=3
  [2/3] exit=0 4460ms rawLen=2149 cleanLen=2003 newlines=2 bullets=0
  [3/3] exit=0 3996ms rawLen=1807 cleanLen=1589 newlines=5 bullets=3
  sample[0] (first 320 chars, ANSI stripped, \n literal):
    7⠋ 🦀 Thinking...8What Are React Components?React components are reusable, self-contained building blocks that encapsulate both the logic and UI of a web application. Think of them as custom HTML elements you define yourself — each one manages its own state, receives data through properties, and renders output to the
  (informational only — claw's renderer strips header markers without preserving \n; see host/llama-server/docs/TODO-PROSE-SMUSH.md)
▶ prose quality via claw renderer (tier=tier-64, informational)
  ✔ 3× markdown via claw: counts reported, no assertions (13655.139889ms)
✔ prose quality via claw renderer (tier=tier-64, informational) (13655.437141ms)

=== refactor (tier-64) ===
  claw: exit=0 elapsed=6388ms files=[".claw",".sandbox-home",".sandbox-tmp","buggy.js"]
  node post-fix: exit=0 stderr=
▶ refactor: fix seeded off-by-one (tier=tier-64)
  ✔ claw fixes buggy.js so its assertions pass (6429.121824ms)
✔ refactor: fix seeded off-by-one (tier=tier-64) (6429.642284ms)

=== spec-compliance (tier-64) ===
  claw: exit=0 elapsed=6119ms files=[".claw",".sandbox-home",".sandbox-tmp","price.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ spec compliance: multi-requirement formatPrice (tier=tier-64)
  ✔ claw implements formatPrice satisfying all four requirements (6152.212451ms)
✔ spec compliance: multi-requirement formatPrice (tier=tier-64) (6152.710953ms)

=== state-machine (tier-64) ===
  claw: exit=0 elapsed=5717ms files=[".claw",".sandbox-home",".sandbox-tmp","light.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ state-machine: traffic light (tier=tier-64)
  ✔ claw implements the FSM with valid transitions and rejection of invalid ones (5741.294821ms)
✔ state-machine: traffic light (tier=tier-64) (5741.868822ms)

=== subtle-bug (tier-64) ===
  claw: exit=0 elapsed=6373ms files=[".claw",".sandbox-home",".sandbox-tmp","median.js"]
  node post-fix: exit=0 stderr=
▶ subtle bug: default-sort lexicographic (tier=tier-64)
  ✔ claw fixes median.js so its assertions pass (6411.497852ms)
✔ subtle bug: default-sort lexicographic (tier=tier-64) (6412.109271ms)

=== tool-discipline (tier-64) ===
  [1/10] ok=true stop=tool_use tool_use=true 1312ms
  [2/10] ok=true stop=tool_use tool_use=true 581ms
  [3/10] ok=true stop=tool_use tool_use=true 517ms
  [4/10] ok=true stop=tool_use tool_use=true 516ms
  [5/10] ok=true stop=tool_use tool_use=true 514ms
  [6/10] ok=true stop=tool_use tool_use=true 512ms
  [7/10] ok=true stop=tool_use tool_use=true 515ms
  [8/10] ok=true stop=tool_use tool_use=true 515ms
  [9/10] ok=true stop=tool_use tool_use=true 516ms
  [10/10] ok=true stop=tool_use tool_use=true 514ms
  rate    = 10/10 = 1.00  (threshold 0.9)
  latency = min 512ms · median 516ms · p95 1312ms · mean 601ms
▶ tool-call wrapping (tier=tier-64, bridge=claw-llama)
  ✔ 10 streamed calls land on stop_reason=tool_use ≥ 90% (6013.749181ms)
✔ tool-call wrapping (tier=tier-64, bridge=claw-llama) (6014.393599ms)

=== two-step-refactor (tier-64) ===
  claw: exit=0 elapsed=8353ms files=[".claw",".sandbox-home",".sandbox-tmp","stats.js"]
  node post-fix: exit=0 stderr=
▶ two-step refactor: extract helper and fix latent bug (tier=tier-64)
  ✔ claw extracts the helper without copying the off-by-one (8392.727353ms)
✔ two-step refactor: extract helper and fix latent bug (tier=tier-64) (8393.367563ms)
ℹ tests 22
ℹ suites 22
ℹ pass 22
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 159934.496681
```

Exit code: 0

## Summary

| Tier  | Exit code |
|-------|-----------|
| 64GB | 0 |

