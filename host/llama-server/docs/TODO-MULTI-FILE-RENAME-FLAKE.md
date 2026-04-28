# TODO: Investigate `multi-file-rename` flake (and 7B reliability at n=5+)

## Status

**Closed 2026-04-28** for the tier-64 question; **a new tier-32 issue is opened** by the closure data — see "New finding" below.

### tier-64 (the original load-bearing failure)

The original 240s timeout was n=1 on Qwen3-Coder-30B. Under tier-64
= Qwen3.6-35B-A3B at sampler v2 (`temp=0.5, presence=0, ctx=65536`),
**10/10 pass, median ~7.1s, range 6.1–8.3s.** The failure mode does not reproduce
against the new model at n=10; the original n=1 observation may have been a
Qwen3-Coder-30B issue, but we did not re-test that model to confirm causation.
Production sampler was reverted v2 → v1 (`temp=0.7, presence=1.5`) post-data-collection;
the closure should hold under v1 too, but n≥5 re-verification at v1 is cheap
if anyone wants the receipts.
Receipts: [`../../test/docs/QWEN3.6-MODEL-REPORT.md`](../../test/docs/QWEN3.6-MODEL-REPORT.md)
"C5 re-check" addendum + raw log [`../../test/logs/a2/C5-MINIVM-20260428-1528.md`](../../test/logs/a2/C5-MINIVM-20260428-1528.md).

### 7B/14B reliability at n=5 (new data, closes the question)

Run 2026-04-28: multi-file-rename × n=5 at tier-16 and tier-32. Driver:
[`../../test/logs/a2/run-multifile-lower-tier.sh`](../../test/logs/a2/run-multifile-lower-tier.sh).
Raw log: [`../../test/logs/a2/MULTIFILE-LOWER-TIER-20260428-1630.md`](../../test/logs/a2/MULTIFILE-LOWER-TIER-20260428-1630.md).

| Tier | Model | Pass rate | Times (s) | Spread |
|---|---|---|---|---|
| 16 | Qwen2.5-7B-Instruct Q5_K_M | **5/5** | 15.4, 72.8, 33.0, 33.5, 13.9 | 5.2× |
| 32 | Qwen3-14B Q4_K_M | **0/5** | 10.4, 5.8, 5.8, 5.8, 6.0 (all fail, same fingerprint) | — |

The 7B is reliable. The 5.2× spread is the same iteration-count variance pattern
characterized at tier-64 in [`../../test/docs/QWEN3.6-MODEL-REPORT.md`](../../test/docs/QWEN3.6-MODEL-REPORT.md)
A2 — not specific to multi-file-rename.

### New finding: tier-32 (14B) deterministic confident-wrong failure

The 14B fails 0/5 with the **same fingerprint every iteration**: claw exits 0
in 5–10s thinking it's done, but verify rejects because `service.js` still
imports `{ compute }` from `lib.js` while `lib.js` was renamed. Fast,
confident-and-wrong — not a timeout, not stochastic.

This is worse than the original tier-64 timeout pattern: a 240s wallclock
timeout is at least *legibly* a failure to the harness; a 5s exit=0 with a
verify-rejection means the model believes the task is complete. If anything
in production downstream of claw trusts the exit code without re-verifying
file state, this fails silently.

**Action items spawned:**

- A new TODO file should be opened for the tier-32 14B confident-wrong
  failure mode; this TODO is not the right home for it because the original
  scope was tier-64.
- The failure fingerprint (model edits `lib.js` rename target but does not
  update the `import` in `service.js`) is a clean test case for the
  iteration-distribution work's W4 Class A (verify-loop) or a new class
  ("declared-done-without-verify"). Cross-reference when
  [`TODO-ITERATION-DISTRIBUTION-TEST.md`](TODO-ITERATION-DISTRIBUTION-TEST.md) lands.
- Worth checking whether the 14B's tier-32 sampler (per `models.conf`) is
  the cause vs. the model itself — same prompt at the v2-style sampler
  shape (low temp, presence=0) at tier-32 would isolate that.

The original "7B/14B reliability at n=5+" question is now answered: 7B is
fine, 14B is broken on this test in a specific reproducible way. That answer
unblocks closing this TODO and opens a narrower one against the new finding.

---

(Original analysis below, kept for historical context.)

Discovered 2026-04-27 evening when extending the tier-eval suite with
two harder tests. See `TIER-EVAL-MEMO-20260427-evening.md` (since deleted)
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
