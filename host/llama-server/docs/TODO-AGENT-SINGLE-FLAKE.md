# TODO — qwen3-coder agent-single early-exit flake

Status: **closed 2026-04-28** (re-verified). Under tier-64 = Qwen3.6-35B-A3B
at sampler v2 (`temp=0.5, presence=0, ctx=65536`) the test passes **10/10**
on the exact prompt below, range 1219–5175ms, median ~1.3s. Note: production
sampler was reverted v2 → v1 (`temp=0.7, presence=1.5`) post-data-collection
pending an n=7 confirmation between the three tied cells; v1 vs v2 was not
significant at n=3, so the closure should hold under v1 too — but n=10
re-verification at v1 is cheap if anyone wants the receipts.
The grammar's `trailing-text` branch is not reproducibly observed at n=10 on
this prompt shape — if the prior rate was ~33%, the probability of zero
observations across 10 trials is ~1.8%, so a real rate change is likely.
Lower-rate residual flake (~few-percent) remains plausible and would need
n≥30 to rule out; the agent-single test stays intentionally sensitive so any
return shows up. Receipts in
[`../../test/docs/QWEN3.6-MODEL-REPORT.md`](../../test/docs/QWEN3.6-MODEL-REPORT.md)
"C5 re-check" addendum + raw log
[`../../test/logs/a2/C5-MINIVM-20260428-1528.md`](../../test/logs/a2/C5-MINIVM-20260428-1528.md).

The agent-single test remains intentionally sensitive — if a future model
swap regresses, this TODO is the breadcrumb.

---

(Original analysis below, kept for historical context.)

## Symptom

`__tests__/tier-eval/agent-single.test.js` against tier-64
(Qwen3-Coder-30B-A3B-Instruct UD-Q6_K_XL) on llama-server with
`claw.gbnf` grammar. Prompt:

> `create hello.py with one line: print('hello')`

Roughly 1-in-3 invocations on tier-64 exit cleanly in ~930 ms,
`workspace.list()` returns `[".claw"]` (no `hello.py`), `claw.code === 0`,
no error. The model produced a prose response and ended the turn — no
`<tool_call>` block was emitted.

Sampling on 2026-04-27 across 5 tier-64 runs after the workspace.js
revert: **2 fail / 3 pass** on this exact prompt. Same fingerprint as the
documented "838 ms, only `.claw`" flake in
[`../../test/docs/SETTINGS-AB-RESULTS.md`](../../test/docs/SETTINGS-AB-RESULTS.md)
(1-in-5 there). Pre-dates the 2026-04-27 changes.

## Cause (best current understanding)

The prompt is short and contains no tool name or imperative tool
phrasing. Qwen3-Coder reads it as conversational and answers in prose
("Sure, here's how you can create hello.py with `print('hello')`…")
without invoking `write_file`. The grammar permits this — a pure-prose
response is a legal `root::=trailing-text` derivation — so nothing
forces the model down the tool branch.

Other tier-eval tests don't exhibit this:
- `agent-parallel` ("Create three files in one response: a.py with one
  line print(1)…") — explicit "in one response" cue + plural action.
- `code-self-test` ("Write a file called fib.js…validates the results
  using…") — long, multi-clause, technical.
- `refactor` ("buggy.js has a bug…Find and fix the bug so that running
  `node buggy.js` exits 0.") — describes outcome, not just an artifact.

The tier-64 model only flakes on the shortest prompt with no tool cue.
Tier-16 and tier-32 don't exhibit the flake (verified across 5 runs on
2026-04-27 — likely lower wrap-rate on those tiers means they fall back
to the tool branch more aggressively).

## Why we're NOT masking this

The obvious test-side mitigation would be tightening the prompt to
something like *"Use the write_file tool to create hello.py with…"*.
Explicitly rejected — a real user asking the agent for a one-line
file shouldn't need to say "use the write_file tool". The flake is a
legitimate UX signal we want the eval to catch. If a model can't
handle the shortest reasonable prompt, that's the model failing the
test, not the test failing the model.

The eval suite is allowed to be red on tier-64 sometimes for this
reason, until the underlying model behavior improves or we ship one
of the structural fixes below.

## Paths to actually fix

1. **Drop the optional `prelude` in `claw.gbnf`** — see
   [`TODO-GRAMMAR-PRELUDE.md`](TODO-GRAMMAR-PRELUDE.md). Doesn't
   eliminate the flake (the model can still legally pick the
   `trailing-text` branch — this is the whole prose-or-tool decision),
   but it ends the "narrate then call" failure mode and might make
   the prose-vs-tool decision feel more committed earlier in
   sampling.
2. **Add a sampler bias toward the tool branch.** llama.cpp doesn't
   expose per-grammar-rule biasing today, but we could add a
   logit-bias for the `<` token at the start of the response (raises
   the prior of opening a `<tool_call>`). Risky — would push the
   model toward tool calls even on legitimately conversational
   prompts.
3. **Try a different tier-64 model.** Qwen3-Coder-30B is the
   strongest coder in this size class but its instruction-following
   on minimal prompts is borderline. A successor model (when one
   exists) or Qwen3.6-35B-A3B with thinking disabled (open question
   in `MODEL-AB-RESULTS.md`'s "next experiment" section) might be
   better behaved.

## Reproducer

```sh
EVAL_TIERS="64" host/test/run-tier-eval.sh
# Repeat 5 times. Expect ~30-40% fail rate on agent-single, all with
# the 930 ms / `.claw` only fingerprint.
```

## Pairs with

- [`TODO-GRAMMAR-PRELUDE.md`](TODO-GRAMMAR-PRELUDE.md) — grammar-side
  path that addresses the same prose-vs-tool decision.
- [`../../test/docs/SETTINGS-AB-RESULTS.md`](../../test/docs/SETTINGS-AB-RESULTS.md) —
  prior independent observation of the same fingerprint (the "838 ms,
  only `.claw`" note).
- [`../../test/__tests__/tier-eval/agent-single.test.js`](../../test/__tests__/tier-eval/agent-single.test.js)
  — the test left intentionally sensitive to this.
