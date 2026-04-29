# W4 — frozen productive-iteration taxonomy (successful-tail)

*Frozen 2026-04-28, after reading six successful-tail packets across all
three test cells (f06eb8f6, 402cb878, 54821247, a26a7976, d40efe14,
cda5e65b). Coding rules and acceptance gates are inherited from
[W4-TAXONOMY.md](W4-TAXONOMY.md). This taxonomy is **parallel** to A–F, not
an extension: it applies only to runs where `terminal_status == "done"
AND exit_code == 0` (the successful-tail stratum). The failure taxonomy is
unchanged.*

## Coding rules

1. **Earliest dominant pattern wins.** A run may show traces of multiple
   classes; pick the one that explains the *most* of the iteration count.
2. **Class P5 counts toward the unclassified rate.** Use it for "trace
   evidence is not sufficient to discriminate" — not as a release valve.
3. **Provide a `primary_signal` per label** — the iteration index range
   (or indices) where the pattern is clearest, plus the field/value that
   distinguishes the class.

## Classes

### Class P1 — verify-driven refinement

**Trace signature:** tight alternation between write/edit and bash-verify.
Each verify produces information that the next edit acts on. Workspace
changes are spread evenly across the run (no long write-free or
verify-free stretches). Model produces a `workspace_changed=true` event
every 1–2 iterations through most of the run.

**Distinguishing feature vs. P2/P3:** continuous engagement — no long
bash-only stretch (P2) and no trailing pure-verify tail (P3).

**Example trace shape** (cda5e65b lru-cache, iter_count=12):
- iter 3: write → iter 4: bash → iter 5: edit → iter 6: bash → iter 7:
  read → iter 8: edit → iter 9: bash → iter 10: edit → iter 11: bash …
  Workspace changes at iters 3, 5, 8, 10 (every 2–3 iters).

**What this class implies for levers:** *productive*. Iteration count is
proportional to task complexity; cutting iterations would cut signal.
This is the model "doing it right, just slowly." No clean lever.

### Class P2 — late-rewrite-after-exploration

**Trace signature (any one):**
- ≥ 4 consecutive iterations where every tool call is `bash` and
  `workspace_changed` is False/None, followed by a major rewrite
  (write_file with output_tokens > 500) in a later iteration, OR
- A read-only bash exploration block in the back half followed by
  ≥ 2 workspace-changing iterations producing the final converged code.

**Distinguishing feature vs. P1:** P2 has a *gap* — a stretch where the
model is gathering information without acting on it. P1 has no such gap.

**Example trace shape** (54821247 expression-eval, iter_count=23):
- iters 9–13: five consecutive `bash` calls with no writes / edits.
- iter 18: write_file with output_tokens=1711 (a major rewrite).
- iters 19–22: cleanup edits + verifies.

**What this class implies for levers:** the exploration block is
candidate-prunable. Levers: better up-front context (so the model doesn't
need to explore to discover the failure mode), structured error
extraction (so each verify yields more information per call), or stop
criteria that detect "model is in pure-exploration mode" and surface the
next-action prompt.

### Class P3 — over-careful tail

**Trace signature (all three required):**
- The last *converged* code state appears at iteration k, where
  k ≤ iter_count − 3.
- Iterations k+1 through iter_count consist of bash-verifies and/or
  small cosmetic edits whose `result_error_signature` is null or the
  same as iter k's verify.
- `workspace_changed_count` for iters k+1..iter_count is ≤ 1.

**Distinguishing feature vs. P1/P2:** P3 is *trailing* iterations after
convergence. P1 and P2 spread productive iterations across the run; P3
has a productive prefix and an unproductive suffix.

**Example trace shape:** model writes the correct csv.js at iter k=18,
then iters 19–25 are `bash → bash → read → bash → bash` — repeated
verification with no diagnostic change. None of the candidate packets
fit P3 cleanly at first read; this class is hypothesized to exist
based on the iter_count distribution and is open to falsification.

**What this class implies for levers:** stop-criterion improvements
(detect "verify result hasn't changed in N calls and no edits since"),
explicit "you're done" termination prompts.

### Class P4 — high-write-churn

**Trace signature:** `workspace_changed_count ≥ 6` AND
`write_file count ≥ 4` AND `edit_file count ≤ workspace_changed_count / 3`.
The model is replacing the file wholesale on each fix rather than using
edit_file for targeted changes.

**Distinguishing feature vs. P1:** P1 mixes edits and writes in
proportion to the change size. P4 always reaches for full rewrites.

**Example trace shape** (402cb878 csv-parser, iter_count=23,
workspace_changed_count=8): write at iters 3, 9, 12, 13, 15, 16, then
edits at 18, 20. Six full writes for what could plausibly be edit_file
patches — each write incurs full output-token cost.

**What this class implies for levers:** prompt the model toward
edit_file for incremental changes; tool documentation improvement;
sampler tuning to reduce "rewrite-the-world" tendency.

### Class P5 — other / insufficient evidence

**Trace signature:** doesn't cleanly fit P1–P4, OR trace data is
insufficient to discriminate (heavily censored, very short trace,
join_status indicating missing iterations).

**Coding rule reminder:** P5 counts toward the unclassified rate. If
the agentic Pass 1 reaches for P5 often, that's a signal the productive
taxonomy needs revision — not that P5 should expand.
