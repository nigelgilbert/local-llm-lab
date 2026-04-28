# New Evals Report

*Internal report, mac-llm-lab, 2026-04-28. Author: Claude Opus 4.7 under autonomous run.*

## Summary

Eleven new tier-eval tests were added to push past the previous suite's saturation ceiling. The original 22-test suite cleared 22/22 on the new tier-64 model across three sampler-knob runs, leaving no headroom to differentiate sampler settings or measure genuine capability. The new tests target the dimensions where a frontier 30B-class MoE model should plausibly fail: longer-horizon agent loops, larger refactors, recursive structure, parser correctness, and bytecode-level reasoning.

## Tests added

Eleven new tests, in three rounds of escalating difficulty:

**Round 1 — graph-reasoning and multi-file pressure (5 tests):**

| Test | Knob | Surface |
|---|---|---|
| `long-horizon-bugs` | sustained edit/verify loop | 4 unrelated bugs across 6 files; one runner |
| `large-refactor` | parameter threading | thread `currency` arg through 5 call sites in 6 files |
| `multi-bug-decoy` | over-edit trap | 5 buggy helpers + 1 unusual-but-correct decoy |
| `spec-precedence` | careful reading | 4 transformation rules with explicit ordering precedence |
| `dependency-graph` | recursive algorithm | topological sort + cycle detection + disconnected graphs |

**Round 2 — concurrent invariants and recursive structure (4 tests):**

| Test | Knob | Surface |
|---|---|---|
| `lru-cache` | many-invariant spec | LRU + TTL + eviction callback + peek + iteration order (9 distinct behaviors) |
| `csv-parser` | small-language parser | RFC 4180 quoting, embedded newlines, escaped quotes (11 cases) |
| `json-schema-validate` | recursive validator | type/required/pattern/items, accumulated errors with paths (10 cases) |
| `cascading-bugs` | run/fix iteration | 5 bugs visible only one at a time (assert short-circuits) |

**Round 3 — frontier ceiling probes (2 tests):**

| Test | Knob | Surface |
|---|---|---|
| `expression-eval` | grammar correctness | recursive-descent parser: precedence, associativity, unary tighter than `^`, 6 error contracts |
| `mini-vm` | dense state machine | bytecode interpreter: 12 opcodes, CALL/RET frames, recursive factorial, 5 error cases |

## Design principles applied

The new tests were written against the eval-design rubric in [EVAL-DESIGN.md](EVAL-DESIGN.md):

- **Verify by re-running real code, not by string matching.** Every test exits 0 only if a `node verify.js` post-condition passes. No keyword-grep, no LLM-judge.
- **Pre-condition + post-condition.** Tests assert that `node verify.js` *fails* before claw runs, then *passes* after. This catches no-op completions.
- **Distractors and hidden edges.** `multi-bug-decoy` and `distractor` (existing) include correct-but-edit-tempting code. `spec-precedence` includes a non-obvious ordering rule the verify suite enforces.
- **Recursion in both data and control.** `json-schema-validate` recurses into nested objects/arrays; `dependency-graph` and `mini-vm`'s factorial program test recursive behavior end-to-end.
- **Ladder difficulty by `files × constraints`.** Round 1 mostly varies file count (5–6 files); round 2 mostly varies constraint count (9–11 verify-suite cases); round 3 stacks both.

## Empirical difficulty calibration (tier-64, Qwen3.6-35B-A3B)

Pass/fail across six sweeps (n=5 at 32k context, n=1 at 64k context):

| Test | S1 (32k) | S2 (32k) | S3 (32k) | S4 (64k) | S5 (32k) | S6 (32k) |
|---|---|---|---|---|---|---|
| spec-precedence       | ✔ 6.7s  | ✔ 6.4s  | ✔ 6.8s  | ✔ 6.9s  | ✔ 6.7s  | ✔ 7.8s  |
| dependency-graph      | ✔ 11s   | ✔ 9s    | ✔ 11s   | ✔ 10s   | ✔ 9s    | ✔ 10s   |
| large-refactor        | ✔ 11s   | ✔ 11s   | ✔ 11s   | ✔ 11s   | ✔ 11s   | ✔ 12s   |
| long-horizon-bugs     | ✔ 17s   | ✔ 16s   | ✔ 17s   | ✔ 17s   | ✔ 18s   | ✔ 19s   |
| multi-bug-decoy       | ✔ 32s   | ✔ 30s   | ✔ 30s   | ✔ 32s   | ✔ 29s   | ✔ 32s   |
| cascading-bugs        |   —     | ✔ 20s   | ✔ 20s   | ✔ 20s   | ✔ 20s   | ✔ 20s   |
| csv-parser            |   —     | ✔ 11s   | ✔ 89s   | ✔ 24s   | ✔ 12s   | ✔ 13s   |
| json-schema-validate  |   —     | ✔ 37s   | ✔ 15s   | ✔ 16s   | ✔ 30s   | ✔ 38s   |
| lru-cache             |   —     | ✔ 20s   | ✔ 20s   | ✔ 43s   | ✔ 26s   | ✔ 40s   |
| expression-eval       |   —     |   —     | ✖ 79s ctx | ✔ 74s | ✖ 84s ctx | ✖ 69s ctx |
| mini-vm               |   —     |   —     | ✖ 234s ctx | ✖ 240s timeout | ✖ 113s ctx | ✖ 166s ctx |

**Observations:**

- **Round 1 is fully passable** by tier-64 — all five tests pass deterministically in 7–32s across every sweep (5/5 × n=6). Useful for tier-32 differentiation; not differentiating at tier-64.
- **Round 2 is also passable but exposes variance.** csv-parser swung 11s/89s/24s/12s/13s; lru-cache 20s/43s/26s/40s; json-schema-validate 15s/30s/37s/38s. Same prompt, same model. 4/4 × n=5 passes. These are good candidates for tier-32 stress-testing.
- **Round 3 found the ceiling.** `expression-eval` is borderline: at 32k context it exhausts deterministically (0/3 at 32k, ~75s before tripping), but it passes cleanly at 64k (1/1, 74s). `mini-vm` is **the test that fails on every config** — 0/3 at 32k (context exhaustion at 113–234s), 0/1 at 64k (240s claw timeout). The model has now had four swings at the bytecode VM and produced no passing solution. This is a robust capability ceiling.

## Failure-mode attribution

Of the failures observed in this session, **zero are discipline failures** (no instances of `<5s claw + .claw-only files`, the signature of a model emitting prose without tool calls). All failures are either context-exhaustion or task-too-long-to-converge — both meaningful signal that the test surface is at the model's ceiling.

One test outside the new-evals scope flaked once in six sweeps: `prose quality via raw bridge` (S5 only). Linked to the known prose-smush issue in [host/llama-server/docs/TODO-PROSE-SMUSH.md](../../llama-server/docs/TODO-PROSE-SMUSH.md), not a new-eval design issue.

## Recommendations

1. **Keep all 11 new evals.** They calibrate cleanly against tier-64 and will give richer signal at tier-32 and tier-16, where pass rates should be substantially below 100%.
2. **`mini-vm` is the suite's new top-end anchor.** It is the only test that genuinely fails the frontier model at present configurations; everything else either passes deterministically or is borderline.
3. **`expression-eval` is the cleanest "context-budget" canary.** Its pass/fail flipping with context size makes it a useful indicator of when context becomes the constraint rather than capability.
4. **Re-run round 2 and 3 against tier-32 and tier-16** to confirm the gradient. Expected: tier-32 fails round 3 entirely and is variable on round 2; tier-16 fails most of round 2 and all of round 3.
5. **Consider one more round.** Even at 64k context the tier-64 model passed 32/33. To stress harder, candidates are (a) genuinely long-horizon multi-day tasks (not feasible in this harness), (b) tasks requiring algorithmic correctness against tight performance budgets, (c) pure-prose tasks with strict structural floors. The current suite is already past the previous calibration paper's ceiling — further escalation has diminishing returns.

## Files

All 11 new tests live in [host/test/__tests__/tier-eval/](../__tests__/tier-eval/). Each follows the same shape as the existing tests: seed workspace → run claw → exec a `node verify.js` post-condition.
