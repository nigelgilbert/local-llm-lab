# TODO: Investigate `multi-file-rename` flake (and 7B reliability at n=5+)

## Status

Open. Discovered 2026-04-27 evening when extending the tier-eval suite with
two harder tests. See [`TIER-EVAL-MEMO-20260427-evening.md`](../../test/docs/TIER-EVAL-MEMO-20260427-evening.md)
for full context.

## What we observed

Across 5 separate tier-eval invocations of `__tests__/tier-eval/multi-file-rename.test.js`:

| Run | Tier / Model | Outcome | Time |
|-----|--------------|---------|------|
| 1 | tier-16 / Qwen2.5-7B-Instruct Q5 | ✔ pass | 15.8 s |
| 2 | tier-16 / Qwen3-14B Q4_K_M | ✖ fail | 51.7 s |
| 3 | tier-16 / Qwen2.5-7B-Instruct Q5 | ✖ fail | 50.4 s |
| 4 | tier-32 / Qwen3-14B Q4_K_M | ✔ pass | 68.7 s |
| 5 | tier-64 / Qwen3-Coder-30B Q6_K_XL | ✖ **claw timeout** | 240.0 s |

The strongest model in the lineup hit the **240 s claw process timeout**
(`runClaw` default — see [`host/test/lib/claw.js:13`](../../test/lib/claw.js#L13)).
Same model, same prompt, same workspace passes every other test.

## Why "claw artifact, not model capability"

1. **Time-vs-capability.** The Coder-30B wrote correct fibonacci in 7 s,
   parallel-wrote 3 files in 7.5 s, fixed an off-by-one in 17.6 s, and solved
   the default-sort bug in 21 s — all in the same eval session. A model that
   can do those tasks in 7–21 s is not legitimately *thinking* about a 3-file
   rename for 240 s. Most likely it's stuck in a loop.
2. **Pattern of likely tool-loop.** The hypothesis: claw enters a
   `read_file → propose edit → diff mismatch → re-read → re-edit` cycle when
   maintaining mental state across multiple files. The 7B and 14B occasionally
   escape it (3 of 4 runs); the 30B may be more verbose / more tokens per
   turn, hitting the wall-clock budget faster.
3. **No claw exit trace in the result file.** Compare the 14B tier-32 run
   (which printed `=== multi-file-rename (tier-32) === claw: exit=0 elapsed=68673ms`)
   against the 30B run (which printed only `▶ multi-file rename + signature
   change (tier=tier-64)` followed by the assertion). The claw process never
   returned, so the test body's `console.log` after `runClaw()` never executed.

## Plan to root-cause

1. **Reproduce on tier-64 and capture the claw transcript.** The runs above
   left `/workspace/.claw/` artifacts inside the ephemeral test container,
   which `--rm` discarded. Re-run `EVAL_TIERS=64` with a workspace bind-mount
   so `/workspace/.claw/transcript.jsonl` (or whatever claw persists) survives.
2. **Read the transcript.** Look for repeated tool calls on the same file,
   diff-application failures, or claw retry markers. The hypothesis is right
   if we see the same `read_file → edit_file → read_file` sequence loop on
   `service.js` or `lib.js`.
3. **If confirmed** — file the issue against claw, not the test. Possible
   mitigations on our side:
   - Tighten the prompt to discourage re-reading already-edited files.
   - Use a workspace `CLAUDE.md` that pre-declares "never re-read a file you
     just edited unless you have a specific reason."
   - Lower `runClaw`'s `timeoutMs` for this test alone (currently 240 s) so a
     loop is detected faster — won't fix the loop, will surface it earlier.
4. **If not confirmed** — the model is genuinely stuck on multi-file edits.
   Different intervention: try Qwen3-Coder-30B with the workspace
   `CLAUDE.md` that pre-states the file structure, or test whether the
   `Qwen3-Coder-Next` 80B handles this without looping.

## 7B reliability at n=5+ (related)

Same memo flagged the 7B at n=2 on the new tests: 1 pass / 1 fail on each.
Need n=5+ to call a real pass rate. This is a clean overnight job:

```sh
for i in 1 2 3 4 5; do
  EVAL_TIERS=16 bash host/test/run-tier-eval.sh
done
```

Then summarize multi-file-rename + subtle-bug pass counts from the resulting
`TIER-EVAL-RESULTS-*.md` files. Same script also surfaces the multi-file-rename
flake rate against the 7B specifically — feeds back into (1) above.

## Why this is "off-hours" work

- Each tier-eval run is ~3–5 minutes for tier-16 alone. n=5 ≈ 25 minutes;
  parallelization is structurally hard because llama-server can only host one
  model at a time, and the 30B reproduction needs llama-server reloaded with
  tier-64.
- No new code required — just running the existing harness multiple times,
  reading transcripts, summarizing.
- No production decision blocked. Tier-16 is committed against the 7B per the
  evening memo; this work refines the confidence interval, doesn't change it.

## Acceptance gates

- A note appended below this section listing the 7B's pass rate on
  multi-file-rename and subtle-bug at n≥5.
- A claw transcript excerpt (or summary) for the 30B failure showing what
  claw was doing during the 240 s window.
- Either: (a) a fix or test-side mitigation that drops the multi-file-rename
  flake rate to ≤1/10 across all tiers, or (b) confirmation that this is
  upstream claw behaviour, with a link to the filed issue.
