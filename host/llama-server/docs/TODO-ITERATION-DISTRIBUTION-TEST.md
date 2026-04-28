# TODO — Iteration-Distribution Characterization (pre-v2 prerequisite)

*Status: planned, not started. Author: director + planning-agent synthesis, 2026-04-28. To be processed and digested before any further deep tuning runs.*

## One-line summary

Characterize the iteration-count distribution of agent loops on the noisy tier-64 tests so we know whether wallclock variance is sampler-sensitive (tuneable) or iteration-path-driven (needs different levers). Block deep tuning runs (v2) on the answer.

## Why this is a prerequisite, not a parallel work item

B3 (sampler grid, 8 cells × 5 tests × n=3, ctx=65536, completed 2026-04-28) produced a negative result: no sampler cell is dramatically worse on capability, no cell is clearly better than the current production sampler (Cell 6: temp=0.7, presence_penalty=1.5), and the within-cell n is below the variance floor that A2 already characterized (lru-cache 2.8× spread at fixed sampler, n=7).

The single most informative data point in B3 is **Cell 2 iter 2 csv-parser at 170s**. Cell 2 is the most deterministic sampler in the grid (temp=0.3, presence_penalty=1.5). If sampling were the dominant variance source, that cell should be the tightest. It produced the largest single outlier instead. Combined with A2's lru-cache spread at fixed sampler, the conclusion is:

> Wallclock variance on these tests is dominated by **how many agent iterations claw runs**, not by per-token sampling decisions.

If that hypothesis is correct, every downstream sampler-tuning effort is chasing variance with the wrong instrument, and v2 work that depends on sampler decisions inherits that error. The instrumentation and characterization proposed below is what either confirms or falsifies the hypothesis. Until it lands, sampler-tuning tickets should be paused.

## Hypothesis to test

**H1 (primary):** Wallclock variance on `csv-parser`, `lru-cache`, and `expression-eval` is primarily driven by the number of claw agent iterations per run, not by per-token sampling stochasticity. Iteration-count distribution is bimodal or long-tailed; sampler temperature does not strongly modulate it.

**H2 (corollary):** Long-tail iteration runs cluster into a small number of identifiable failure-mode classes (verify-loop, wrong-module-shape, context-drift, grammar-dead-branch). Each class has a distinct lever; sampler tuning is the right lever for at most one of them, possibly none.

## Falsification criteria (write these down before running)

The thresholds below are judgment calls, not derived — they are the smallest effects that would change v2 prioritization, anchored to "actionable effect size" rather than statistical significance. Reviewers should push back if they think a different cutoff better matches what's actionable.

- **H1 falsified if:** at fixed sampler, iteration count is tightly clustered (IQR ≤ 1.5× median) and wallclock variance instead correlates with per-iteration token count or per-token decode time. In that case, sampler tuning *is* the right lever and we resume B3 with a properly-resolved grid.
- **H1 confirmed if:** iteration count distribution is wide (IQR ≥ 2× median or visibly bimodal) and explains ≥ 70% of wallclock variance (incremental R² of iter_count controlling for output_tokens — see §W2 for the model spec). Sampler is then deprioritized as a variance lever; iteration-driving causes are the focus.
- **H2 falsified if:** long-tail runs show no consistent failure-mode signature — they look like smooth stochasticity. In that case, the conclusion is "irreducible model noise; set wallclock budgets accordingly and retry on timeout." Worse outcome but still actionable.
- **H2 confirmed if:** ≥ 60% of long-tail runs cluster into ≤ 4 named failure-mode classes with distinct trace signatures, **and** the taxonomy survives the inter-rater check in §W4 (κ ≥ 0.6). Each class becomes a separate downstream ticket with a specific lever.

## Workstreams

### W1 — Instrumentation: per-iteration trace from claw

Surface per-iteration trace data as structured JSONL, one record per agent iteration per run.

**Definition of "iteration" (canonical for this work):** one model turn, where a turn is a single completion call to llama-server regardless of how many tool calls the model emits in that turn. A turn that emits two tool calls in one completion = one iteration; a turn that emits one tool call, observes the result, then emits another via a separate completion = two iterations. This matches the granularity of `n_request` in the server log and is the unit `claw` actually budgets against. W4's signature definitions (alternating write/run, monotonically rising input_tokens, etc.) are anchored to this definition.

**Pre-W1 scoping check (do first, ~15 min):** confirm `.claw/transcripts/` already structures tool calls as records with name + args, not free-text. If transcripts are free-text, W1 grows a parser and the 2h estimate moves to ~half a day. Spend the 15 min before sizing the work so the estimate is accurate.

**Required fields per iteration:**

- `run_id` — uuid for the test invocation
- `iter` — 1-indexed iteration number within the run
- `input_tokens` — prompt size including conversation history
- `output_tokens` — model generation size for this iteration
- `elapsed_ms` — wallclock for this iteration (server-side decode + tool roundtrip)
- `tool_name` — name of the tool called this iteration (or `null` if none)
- `tool_arg_hash` — sha1 of normalized tool args (for detecting repeated identical calls)
- `terminal_status` — `continue` | `done` | `error` | `context_overflow` | `timeout`
- `stop_reason` — model's reported stop reason (`tool_call`, `end_turn`, `max_tokens`, etc.)

**Implementation notes for the architect agent:**

- Most fields are likely already in `.claw/transcripts/` artifacts. The work is surfacing them as a single structured JSONL rather than reconstructing from tool log scrapes.
- Bind-mount `.claw/` to a host volume in `docker-compose.yml` if not already.
- Modify `host/test/lib/claw.js` `runClaw()` to read the transcript on completion, derive the per-iter records, and emit a sidecar `.iterations.jsonl` next to the existing result file.
- This change is also P0.3 in the existing `PROPOSAL.md` (per-turn telemetry). Land it once; both this work item and the proposal-doc P0.3 are satisfied by the same code change.
- Acceptance: `host/test/scripts/aggregate-results.sh` gains columns for total iterations per run and surfaces them in the per-test summary.

### W2 — Distribution measurement at fixed sampler

Once W1 is in place, run n=20 per test on the noisy tests at the current production sampler (temp=0.7, presence_penalty=1.5, ctx=65536). Aggregate iteration-count distributions per test.

**Tests:** `csv-parser`, `lru-cache`, `expression-eval`. Skip `multi-bug-decoy` (already characterized as low-variance, 1.2× spread at n=7) and `json-schema-validate` (1.6× spread, less interesting). The three noisy tests are the population to characterize.

**Outputs:**

- Histogram of iteration counts per test (suggest 1–20 bins).
- Median, IQR, p90 of iteration count.
- Correlation matrix: `iter_count × wallclock`, `output_tokens × wallclock`, `input_tokens × wallclock`.
- The single "iteration-count explains X% of wallclock variance" number — this is the H1 falsification check.

**Variance-attribution model spec (required, not optional):** `iter_count` and `output_tokens` are mechanically correlated (more iters → more total output), so a univariate R² will overstate iter_count's role. Specify the model:

1. Fit `wallclock ~ output_tokens` → R²_tokens.
2. Fit `wallclock ~ output_tokens + iter_count` → R²_full.
3. Report incremental R² of iter_count = R²_full − R²_tokens. **This is the number compared against the 70% threshold in the falsification criteria**, not the univariate R².
4. Also report R²_full and R²_tokens for context, and the iter_count coefficient with a 95% CI.

Per-test, then pooled. If the per-test verdicts disagree, report each separately rather than averaging.

**Wallclock estimate:** 3 tests × 20 iterations × ~30s typical = ~30 min compute, but iteration cost is the bottleneck not wallclock. Run overnight to be safe. Single sampler.

### W3 — Concurrent sampler arm (cheap negative-result generator)

Run the same n=20 protocol at temp=0.3 (presence_penalty=1.5, ctx=65536, otherwise identical to W2). This is the cleanest cell from B3 by capability and the strongest counter-hypothesis cell — if any sampler matters, this one differs most from production.

**Why include this:** if iteration-count distributions at temp=0.3 vs temp=0.7 are statistically indistinguishable *at the effect size that would matter*, that closes the sampler-tuning question definitively as a side effect of W2. If they differ, the difference itself is interesting and earns a follow-up ticket.

**Acceptance (decision rule, with power caveats spelled out):**

- Per test: report effect size as the difference in median iteration count, with a bootstrap 95% CI; *and* a Mann-Whitney U test result. The CI is the load-bearing artifact, not the p-value.
- Joint decision across the three tests uses Bonferroni at α=0.033 each (joint α=0.10), not three independent α=0.10 tests.
- **State the negative result correctly:** at n=20 vs n=20, Mann-Whitney has ~80% power to detect a Cohen's d of ~0.9 (large effect) and is underpowered for moderate effects. The right framing of a non-rejection is *"the n=20 study could not detect an effect of size ≥ d=0.9; smaller effects remain possible and would need n≥50 to rule out."* Do not write "no effect" without qualifying.
- **Retirement criterion:** retire sampler-tuning as a recurring B-ticket category only if (a) joint Bonferroni-corrected p > 0.10 *and* (b) the bootstrap CI for the median-iter-count delta is bounded within ±20% of the production median on all three tests. Either alone is insufficient.

### W4 — Failure-mode classification of long-tail runs

For each run in W2/W3 with iteration count > p75 of its test's distribution, manually-or-agentically classify the failure mode using the trace data. Candidate taxonomy (refine empirically):

- **Class A — verify-loop:** model emits subtly wrong code, runs verify, sees error, re-edits, runs verify again, repeats. Signature: alternating `write`/`run` tool calls with the same target file across many iterations.
- **Class B — wrong-module-shape:** ESM-vs-CJS mismatch, missing `package.json`, wrong `import`/`require` form. Signature: early iterations show specific error strings (`Cannot use import statement outside a module`, `require is not defined`, etc.) and the model spends iterations finding the right shape.
- **Class C — context-drift:** conversation grows past some token threshold and the model loses earlier context, re-reads files, re-derives state. Signature: monotonically increasing `input_tokens` per iteration, repeated `read` tool calls on the same file.
- **Class D — grammar-dead-branch:** model commits to a tool call shape that the grammar accepts but that doesn't make progress (e.g., reading instead of editing, or calling a wrong tool). Signature: tool calls that don't change observable state across iterations.

**Method:**

- Pull the slow runs (iter > p75) from W2/W3 traces.
- **Two independent classifiers** (two agentic passes with the candidate taxonomy frozen up front, no shared state, *or* one agentic + one director pass). Each assigns a class per run independently.
- Compute Cohen's κ on the two classification sets. **κ ≥ 0.6 is required** before the taxonomy is accepted. κ < 0.6 means the categories aren't crisp enough — rebuild from the data and re-run, do not patch.
- Track unclassified rate. If > 40% don't fit, the taxonomy is wrong and needs rebuilding from the data (independent of κ).
- After κ ≥ 0.6 is achieved: the director spot-checks at least 5 classifications per class before accepting the final taxonomy. Inter-rater agreement gates acceptance; spot-check confirms the categories are also *correct*, not just consistent.

**Acceptance:** a classification table with per-class counts, signature description, one example trace per class, **and the reported κ**. `unclassified` should be < 30% of long-tail runs. The κ is what makes this externally citeable; without it, the taxonomy is a single classifier's read.

### W5 — Lever assignment and v2 unblocking

For each identified failure-mode class, name the lever that addresses it. Candidate levers:

- **Class A (verify-loop):** prompt fix — explicit instruction to verify mentally before running tests; or harness fix — verify-output truncation so the model gets clearer error signal.
- **Class B (wrong-module-shape):** workspace-side fix — seed `package.json` with `"type": "module"` (or CJS) explicitly; or prompt fix in CLAUDE.md plant.
- **Class C (context-drift):** harness-side compaction at 80% of `n_ctx`, or hard cap on iterations per test (~12 turns) with a `context_budget_exceeded` failure class.
- **Class D (grammar-dead-branch):** grammar refinement — investigate whether the grammar permits a class of dead-end tool calls that could be eliminated.

**Output:** a v2-ready ticket list, one ticket per lever-class pair, sized appropriately. This is what unblocks v2 deep tuning.

## Sequencing

```
W1 (instrumentation)
   |
   ├──> W2 (distribution at production sampler)
   |       |
   |       └──> W4 (classification)
   |               |
   ├──> W3 (sampler arm, in parallel with W2)              |
   |       |                                               |
   |       └──> sampler verdict (deprioritize or pursue)   |
   |                                                       |
   |                                                       v
   └──────────────────────────────────────────────────> W5 (lever assignment)
                                                           |
                                                           v
                                                       v2 unblocked
```

W1 is the gate. W2 and W3 can run as a single experiment (n=20 × 2 samplers × 3 tests = 120 runs at fixed M5, plan ~6h with the per-run setup overhead). W4 and W5 are analysis.

## Estimated effort

- W1: 1 engineering session (~2h focused work). Code-side; no M5 dependency.
- W2 + W3: ~6h M5 wallclock. Run overnight as one combined sweep.
- W4: ~3h analysis with manual classification spot-checks.
- W5: ~1h to write up the ticket list.

Total: ~1.5 calendar days assuming W1 lands first and then W2/W3 run overnight followed by next-day analysis.

## Decision rules (for the architect agent and the planner)

1. **Do not start W2/W3 before W1 is committed and verified.** Running the experiment without per-iteration traces wastes M5 time on data that can't answer the hypothesis.
2. **Do not promote any sampler change based on this work.** This work characterizes; it does not promote. Sampler decisions wait for a properly-resolved grid (or are retired as a category, depending on W3 outcome).
3. **Do not start v2 deep tuning until W5 produces lever assignments.** That's the prerequisite framing this whole document encodes.
4. **The director reviews W4's classification taxonomy manually before W5 proceeds.** The autonomous loop can run W1, W2, W3, and the data collection portion of W4. The decision "is this taxonomy real or force-fit" needs a human in the loop.
5. **If H1 is falsified (iteration count is tight, sampling explains variance), abandon this work item, document the negative result, and run a properly-resolved sampler grid as the v2 prerequisite instead.** The negative result is a real outcome and should be written up either way.

## What this produces beyond unblocking v2

If W4 yields a clean failure-mode taxonomy with classified long-tail runs, that's a citeable research artifact: nobody has good public characterizations of iteration-count distributions in agentic coding loops. Aggregate pass-rate benchmarks hide this layer entirely. Worth holding the writeup to a standard that lets it be shared externally — a 4–6 page methods note plus the trace dataset would be a real contribution to agentic-coding eval methodology.

## Out of scope

- Sampler tuning beyond the W3 negative-result generator. If sampler matters more than expected, it gets its own follow-up ticket; this work item does not promote.
- Cross-tier work (tier-16, tier-32). This is tier-64 only. Lower-tier iteration distributions are a separate question, sequenced after v2 baselines.
- Model swap or grammar changes. The work characterizes the current rig, not changes to it.
- `mini-vm` and `multi-bug-decoy`. mini-vm is a known ceiling; multi-bug-decoy is low-variance. Neither is in the population of interest for this work.

## Open questions to flag for director review when work lands

- Did the iteration-count distribution match the expected bimodal-or-long-tailed shape, or something else?
- Is there a sampler effect on iteration count (separate from sampler effect on per-token distribution)?
- Are the four candidate failure-mode classes the right taxonomy, or did the data force a different cut?
- For each class, is the proposed lever the best lever, or is there a better one not on the candidate list?
- Does the W5 ticket list cleanly map to v2 work, or does it expose new prerequisites?