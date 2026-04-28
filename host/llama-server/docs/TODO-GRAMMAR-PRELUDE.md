# TODO — tighten claw.gbnf to drop the optional prelude

Status: **deferred 2026-04-27**. Revisit only if Step 1 of the
2026-04-27 improvement plan (planting `system-prompt.md` as `CLAUDE.md`
in the eval workspace) doesn't curb tier-16's preamble-narration habit.

## The change

In [`grammars/claw.gbnf`](../grammars/claw.gbnf):

```diff
- root ::= prelude? response
+ root ::= tool-call | trailing-text
```

(plus deleting the now-unused `prelude` rule.)

## Why this is on the table

The GBNF `prelude` is free-form prose *before* the `<tool_call>` opener.
It is **not** `<think>` reasoning — none of the three tier models are
thinking variants:

- tier-16: Qwen3-14B (Instruct, no thinking)
- tier-32: Qwen3-30B-A3B-**Instruct**-2507 (the Thinking sibling lives
  in OWUI as `analyze`, not on the claw route)
- tier-64: Qwen3-Coder-30B (coder, no thinking)

What the prelude actually produces today is narration like *"I'll create
hello.py for you. Let me write it now."* before the `<tool_call>` — exactly
what [`system-prompt.md`](system-prompt.md) Rule 6 forbids (*"ACT, do not
narrate"*). On tier-16 it directly caused the 0/10 wrap-rate baseline:
the model burned its 256-token budget on prose and never reached the
wrapper.

## Why not yet

The plan is to plant `system-prompt.md` as `CLAUDE.md` in the eval
workspace first. That makes the discipline rules actually reach the
model (today they don't — verified). If the model honors Rule 6 once it
sees it, grammar enforcement isn't needed and we keep the option of
running a thinking-style model on the claw route in the future.

## When to apply this

If, after Step 1 lands and the eval re-runs:

- tier-16 `tool-discipline` regresses below 100%, **or**
- tier-16 `latency.test.js` shows long preamble tokens before
  `stop_reason=tool_use` (look at the ms numbers per call), **or**
- claw transcripts in `client/claw-code/` show repeated
  *"I'll do X..."* preamble before tool calls

…then escalate. The drop is a one-line grammar change; if anything
regresses, revert.

## Step 1 outcome (2026-04-27 attempt — reverted)

Tried planting `system-prompt.md` as `CLAUDE.md` in the eval workspace
via `host/test/lib/workspace.js` `reset()`. **Reverted same day** —
broke tier-64 on the simplest agent tasks.

What happened:

| Tier | Before | With CLAUDE.md plant | Net |
|------|--------|----------------------|-----|
| 16   | 8/8    | 9/9 (added prose-bridge, all pass) | +0 (already passed without it) |
| 32   | 7/8    | 9/9 (Step 3 fixed prose) | +1 from Step 3, +0 from CLAUDE.md |
| 64   | 7/8    | **7/9** — agent-single ✖, agent-parallel ✖ | **−2 regression** |

tier-64 saw `CLAUDE.md` in the workspace (`files=[".claw","CLAUDE.md"]`),
exited cleanly in 676 ms on `"create hello.py with one line: print('hello')"`,
and **wrote nothing**. Same failure mode as the Qwen2.5-Coder rejection
(model dives into prose branch, ends turn, no tool call). Likely cause:
combined claw system prompt + CLAUDE.md discipline rules push the model
into "acknowledge and exit" on trivial requests. Possibly Rule 5 ("end
with a brief confirmation") being misread as licence to skip the work.

Tier-16 already passed without the plant (the 2026-04-27 repeat-penalty
fix got it to 8/8 on its own), so the plant added no upside there.

What this means for the prelude-tighten plan: the Step-1-then-Step-2
sequencing assumed the plant was harmless. It isn't — for Qwen3-Coder
specifically, planting the discipline rules causes early-exit. So if
we ever want to enforce "no narration", the grammar-side path
(removing `prelude` from `claw.gbnf`) is preferable to a CLAUDE.md
plant. It enforces the constraint without adding text to the system
prompt that the model can over-interpret.

If you do want to retry the CLAUDE.md plant in the future:

- Try a much shorter version (just Rule 6, "ACT, do not narrate") to
  test whether the volume of rules is what trips tier-64.
- Make it tier-conditional in `workspace.js` — plant only for tier-16
  where it might help, skip for tier-32/64 where it doesn't.
- Or skip CLAUDE.md entirely and just do the grammar drop — simpler,
  no surprise interactions with the model's instruction-following.

## Softer alternative if a full drop feels aggressive

Cap the prelude to ~100 prose chars instead of removing it:

```
prelude ::= prose-char{0,100}
```

Limits narration token cost without forbidding it. Less impact, less
risk — but only useful if Step 1 partially helps and we want to put a
ceiling on what's left.

## What to verify after applying

```sh
EVAL_TIERS="16 32 64" host/test/run-tier-eval.sh
```

Hypothesis:
- tier-16 wrap rate stays at 100% (10/10 on tool-discipline, 20/20 on
  tool-roundtrip).
- tier-16 per-call latency drops (no preamble tokens to generate).
- tier-32 and tier-64 unchanged — they don't use the prelude branch
  today.

## Pairs with

- [`../grammars/claw.gbnf`](../grammars/claw.gbnf) — the file that would change.
- [`system-prompt.md`](system-prompt.md) — the discipline rules whose
  Rule 6 this would enforce at the grammar layer.
- [`../../test/docs/TIER-EVAL-REPORT.md`](../../test/docs/TIER-EVAL-REPORT.md) — the
  2026-04-27 report that surfaced the tier-16 prelude problem.
