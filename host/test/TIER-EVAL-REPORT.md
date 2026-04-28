# Tier Eval Report — 2026-04-27

Source data: [TIER-EVAL-RESULTS-20260427-2034.md](TIER-EVAL-RESULTS-20260427-2034.md).
Suite: 7 tests across 8 `it()` blocks (`latency.test.js` is two suites in one file).

## Models

| Tier | Model | Quant | Active params | Type |
|------|-------|-------|---------------|------|
| 16 GB | Qwen3-14B | Q4_K_M | 14B | dense, instruct |
| 32 GB | Qwen3-30B-A3B-Instruct-2507 | Q4_K_XL | 3B (of 30B) | MoE, instruct |
| 64 GB | Qwen3-Coder-30B | Q6_K_XL | 30B | dense, coder |

All three run through the same `claw.gbnf` grammar, same sampler (`temp=0.4`, `top-p=0.8`,
`top-k=20`, `repeat-penalty=1.2`), same plist on port 11435.

## Results

| Test                   | tier-16 (14B dense) | tier-32 (30B MoE / 3B active) | tier-64 (30B coder dense) |
|------------------------|---------------------|--------------------------------|----------------------------|
| agent-single (`hello.py`)        | ✔ 19.8 s | ✔ **1.4 s** | ✔ 2.1 s |
| agent-parallel (3 files)         | ✔ 33.0 s | ✔ **5.1 s** | ✔ 7.4 s |
| code-self-test (`fib.js`)        | ✔ 66.7 s | ✔ **6.9 s** | ✔ 8.2 s |
| refactor (off-by-one fix)        | ✔ 28.0 s | ✔ **5.9 s** | ✔ 16.3 s |
| TTFT median (25-tool prompt)     | ✔ 189 ms | ✔ 122 ms | ✔ **82 ms** |
| TTFT p95 (cold first request)    | 3 347 ms | 1 713 ms | **2 393 ms** |
| Tool-roundtrip wrap rate (N=20)  | ✖ **2/20 (10%)** | ✔ 20/20 | ✔ 19/20 |
| Tool-roundtrip latency (median)  | 9 657 ms* | **282 ms** | 396 ms |
| Tool-discipline wrap rate (N=10) | ✖ **0/10 (0%)** | ✔ 10/10 | ✔ 10/10 |
| Prose quality (newlines / 3 runs)| ✖ 17/10/4 | ✖ 2/2/2 | ✖ 2/5/2 |

*Tier-16 tool-roundtrip latency is meaningless because the model never wraps —
it runs to `max_tokens=256` every time.

### Pass/fail summary

| Tier | Pass | Fail | Failing tests |
|------|------|------|---------------|
| 16   | 5/8  | 3    | tool-discipline, tool-roundtrip wrap, prose-quality |
| 32   | 7/8  | 1    | prose-quality |
| 64   | 7/8  | 1    | prose-quality |

## Observations

### 1. Tier-16 cannot wrap into `<tool_call>` under our grammar

Every failing roundtrip on tier-16 ended with `stop_reason=max_tokens` and
`tool_use=false`. The grammar permits an optional `prelude` of free prose before
the `<tool_call>` opener — and Qwen3-14B (instruct, not coder) burns the entire
256-token budget on prelude prose, never reaching the wrapper.

This is **not** a quantisation effect: agent tasks (which terminate on `end_turn`,
not `tool_use`) succeed — `hello.py`, `fib.js`, the parallel writes, and the
refactor all pass. The 14B can use tools through claw; it just can't wrap them in
the qwen-coder XML format that our grammar requires.

The mismatch makes sense:
- Qwen3-Coder-30B was trained with `<tool_call>{json}</tool_call>` as the native
  format, so the wrapper is the path of least resistance.
- Qwen3-30B-A3B-Instruct-2507 emits the same wrapper natively (look at the 282 ms
  median — that's grammar acceptance with effectively no rejection sampling).
- Qwen3-14B is a vanilla instruct model. The grammar only tells it the wrapper
  is *allowed*; it doesn't make the wrapper *preferred*.

### 2. Prose-quality fails on **every** tier — model issue, not tier issue

Tier-32 and tier-64 collapse to the same shape consistently: 2 newlines in
1300–1900 chars of "markdown" output. This is the markdown-smush bug already
documented in the older `model-ab/prose-density.test.js` (which is why it was
SKIP'd there). Sample from tier-64:

> `React Components ExplainedReact components are the fundamental building blocks of any React application…What Are React Components?• Components are functions or classes…`

Header text, paragraphs, and bullets are all glued together. The structure is in
the token stream — bullets, headers — but the newlines that separate them are
missing. This is the same issue we'd see if the model omits `<0x0A>` tokens
between blocks.

Tier-16 actually *sometimes* formats correctly: run 1 of 3 had 17 newlines and
4 bullets — a clean pass — but run 3 collapsed to 4. The 14B has higher prose
variance; 30B variants are deterministically smushed.

### 3. Tier-32 (MoE) is the speed king

For end-to-end agent tasks the 32 GB MoE beats the 64 GB dense by a wide margin:

| Task | tier-32 | tier-64 | Speedup |
|------|---------|---------|---------|
| `hello.py` write | 1.4 s | 2.1 s | 1.5× |
| 3-file parallel  | 5.1 s | 7.4 s | 1.4× |
| `fib.js` self-test | 6.9 s | 8.2 s | 1.2× |
| refactor         | 5.9 s | 16.3 s | **2.8×** |
| tool-call roundtrip (median) | 282 ms | 396 ms | 1.4× |

Decode dominates these — only 3B of 30B params are active per token, while
tier-64 grinds all 30B. TTFT is the one place tier-64 wins (82 ms vs 122 ms
median) because prefill activates all experts.

### 4. The cold-request artifact

Every `p95` TTFT is the first request. The bridge or the slot-cache warms up
once, then per-request TTFT drops by 10–50×:

- tier-16: 3 347 ms → 189 ms (18×)
- tier-32: 1 713 ms → 122 ms (14×)
- tier-64: 2 393 ms → 82 ms (29×)

After warmup the dense 30B is the fastest prefill. This argues against using p95
as a steady-state metric in this suite — `min` and `median` are the honest
numbers; p95 is essentially "cold start time".

## Bugs found and fixed during the run

1. **`declare -A` on macOS bash 3.2** — orchestration died on first invocation.
   Replaced with indirect-variable lookup `tier_rc_var()`.
2. **`launchctl bootstrap` race after `bootout`** — `Bootstrap failed: 5: I/O error`
   because the install script's bootout returns before the agent is fully unloaded.
   Added an explicit "wait until `launchctl print` fails" loop before invoking
   `install`.
3. **Stale Docker image** — the test image baked an `entrypoint.sh` without the
   `tier-eval` case, so the first real run executed every test under `__tests__/`,
   not the tier-eval subset. Rebuilt with `docker compose build`. Worth noting:
   `entrypoint.sh` is `COPY`'d, not bind-mounted — any future changes need a
   rebuild.
4. **`| tee` swallowing `docker compose` exit code** — the per-tier "Exit code: 0"
   in the summary was lying (tier-16 had 3 failed tests but reported 0). Wrapped
   the docker invocation in `set -o pipefail` so the real rc reaches `$rc`.
   This will be visible on the next run.

---

# Improving the 16 GB and 32 GB tiers

## Tier-32: just one failure, prose-quality

This is a model-output issue (omitted newlines), not a tier-budget issue. The
fixes apply equally to tier-64; both share the smush.

**Hypothesis A — sampler.** `repeat-penalty=1.2` over `repeat-last-n=256` is
aggressive on a small token vocabulary. `\n` (token id 198 on Qwen) repeats
naturally between markdown blocks; if the penalty kicks in the model substitutes
*anything else*, including "no separator". Worth testing `repeat-penalty=1.05`
and `repeat-last-n=64`, or excluding `\n` from the penalty window if llama.cpp
allows it.

**Hypothesis B — grammar interaction.** Our `prose-char` rule allows `\n` but
also allows everything else; the model is free to choose. If the model's logits
already weakly disprefer `\n` (because the chat template doesn't put one before
the assistant turn), grammar can't repair that. Test by serving without
`--grammar-file` for the prose-quality suite only and seeing if newlines come
back. If they do, that's grammar interaction; if they don't, it's pure sampler/
model behaviour.

**Hypothesis C — claw renderer is eating newlines.** The sample is captured
*after* claw streams it through its own terminal renderer (we already strip ANSI
in the test). It's possible the renderer collapses `\n\n` into `\n` or vice versa.
Worth checking by comparing `r.stdout` (post-claw) against a direct
`bridge.streamMessage` call with the same prompt — if direct streaming has the
newlines and claw doesn't, it's claw's fault, not the model's.

**Quick wins to try, in order of effort:**

1. Lower `repeat-penalty` to 1.05 and re-run prose-quality with `PROSE_N=10`.
2. Compare bridge-direct vs claw-rendered output for the same prompt.
3. If both Hypothesis A and B disprove, accept the smush as a known tokeniser
   quirk and downgrade prose-quality from a hard assert to an informational
   metric (as `model-ab/prose-density.test.js` already does).

## Tier-16: three failures, but only one root cause

The three failures cluster:

- tool-discipline 0/10 → wrap rate
- tool-roundtrip 2/20 → wrap rate
- prose-quality → flaky (1/3 passes)

The grammar is doing exactly what it should do: enforcing a structure the 14B
*can* produce but isn't biased toward. Fixes, ordered by likely impact:

### Most likely to work

**1. Swap to a coder-tuned 14B.** The obvious lever. Candidates that fit in
~10 GB at Q4_K_M:

| Model | Size at Q4_K_M | Notes |
|-------|----------------|-------|
| Qwen2.5-Coder-14B-Instruct | ~9 GB | Native `<tool_call>` training; same vocab as Qwen3 |
| Qwen3-Coder-14B (if/when released) | ~9 GB | Direct successor; not yet shipped as of 2026-04 |
| DeepSeek-Coder-V2-Lite-Instruct (16B MoE) | ~10 GB | MoE, ~2.4B active — could win tier-16 *and* dethrone tier-32 on speed |

Qwen2.5-Coder-14B is the safest swap — same tokeniser, drop-in to the same
grammar.

**2. Raise `max_tokens` for the wrap-rate tests on tier-16.** The 14B is
producing legitimate prose preludes that get truncated mid-thought. Bumping
`max_tokens` from 256 → 1024 in `tool-discipline.test.js` and the roundtrip
test would let the model finish its preamble and *then* attempt the wrapper.
This is diagnostic — if wrap rate goes from 0% → 50%, the budget was the cliff;
if it stays at 0%, the model genuinely doesn't want to wrap.

**3. Tighten the grammar.** Drop the optional `prelude`:

```
root ::= tool-call | trailing-text
```

This forces the model to either start with `<tool_call>` or commit to free
prose. It's a sharper constraint, but it would clobber any model that
legitimately wants to think out loud first. Worth a try as an A/B.

### Lower-impact but cheap

**4. Per-tier system prompt.** llama.cpp removed `--system-prompt-file` upstream
(noted in the plist comments), but claw concatenates `CLAUDE.md`. A tier-aware
`CLAUDE.md` could nudge the 14B harder ("you MUST emit `<tool_call>` blocks for
any file write"). Unlikely to fully fix wrap rate, but might lift it from 0% to
40%.

**5. Per-tier sampler.** Same logic as Hypothesis A above, but going the other
direction: tier-16 might benefit from `temp=0.2` and `top-k=10` to tighten its
distribution and make the structured output mode dominate. Easy to test:
`models.conf` is already per-tier; the plist template would need
`__TEMP__` / `__TOP_P__` placeholders.

### Probably not worth it

**6. Q5/Q6 quant of the 14B.** Q4_K_M → Q5_K_M raises ~9 GB → ~10.5 GB. Within
budget but unlikely to fix wrap rate — wrap-rate is a behavioural problem, not a
precision problem. The agent tasks already pass cleanly at Q4, so we're not
quant-bound.

**7. Smaller 7B coder.** Qwen2.5-Coder-7B at Q5 is ~5 GB — leaves ~10 GB free,
which is wasted on a 16 GB box. Not the right shape for this tier.

## Suggested next experiment

A two-cell A/B: same 16 GB budget, two candidates.

1. **Cell A:** swap to `Qwen2.5-Coder-14B-Instruct-Q4_K_M` (one-line change in
   `models.conf`). Re-run `EVAL_TIERS="16" ./host/test/run-tier-eval.sh`.
   Hypothesis: tool-discipline 0% → ≥90%, roundtrip 10% → ≥90%, agent latencies
   roughly unchanged (it's the same scale).

2. **Cell B (parallel, if Cell A doesn't fully fix it):** keep Qwen3-14B but
   raise `max_tokens` and tighten the grammar. Hypothesis: tool-discipline rises
   into 30–60% range — better, but still not production-grade.

If Cell A clears the bar, that's the new tier-16 default. If it doesn't, the
16 GB tier should be honestly labelled "agent-capable, not tool-strict" and
some tests should be marked tier-conditional.

## Followups (out of scope for this report)

- Decide whether prose-quality should remain a hard assert at all tiers, or
  flip to informational like the model-ab equivalent.
- The `| tee` exit-code fix (committed alongside this report) means the next
  run will surface the per-tier failures in the summary table.
- Worth committing the eval suite + this report so the deltas are visible when
  we swap a model.
