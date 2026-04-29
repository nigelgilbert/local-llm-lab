# Tier-eval test suite — strategic-layer handoff

**Date:** 2026-04-29
**Prepared for:** strategic / R&D leadership
**Branch:** `feature/iteration-distribution-test`
**Companion docs:**
- [TIER-EVAL-SUITE-AUDIT.md](TIER-EVAL-SUITE-AUDIT.md) (the scientist's audit, commit `d34a59b`)
- [TIER-EVAL-PILOT-LOOPS-FINDING-20260429.md](TIER-EVAL-PILOT-LOOPS-FINDING-20260429.md) (escalation note from loop 1+2)
- [W4-TAXONOMY.md](W4-TAXONOMY.md) (frozen failure-mode taxonomy, Class E now deprecated)

## TL;DR

Two pilot loops + the existing tier-64 production sweep all converge on one finding: **at tier-64 with the current Qwen3-Coder model, only `expression-eval` produces failures (27.5% on n=40); every other test passes ≥95%.** This was treated as a problem under the old framing ("we need more failures across more classes for W4 κ").

Under the strategic framing the project actually has — **stratifying tier-16 / tier-32 / tier-64 model performance to drive lab R&D** — that "no failures at tier-64" finding is *not* a problem, it's a *tier-64 ceiling observation*. The right next move is not to make tests harder; it's to **run the existing suite against tier-16 and tier-32** and look at the discrimination matrix across tiers. That data is what answers the questions the lab is actually trying to answer.

This document re-frames everything we've produced and tells you what to ask the strategic layer to decide.

## Strategic framing (received 2026-04-29)

The project's purpose: bring a Claude-like agentive harness and truly useful AI models on 16/32/64 GB Mac silicon mini systems. The test suite exists to:

1. **Stratify the 3 systems' performance** on productivity, agentive, and coding tasks.
2. **Compare models side-by-side** to drive config tuning (samplers, prompts, harness behavior).
3. **Trial new models** and slot them into the same evaluation grid.
4. **Drive R&D** for the lab.

This is a *cross-model differential* goal. It is NOT "characterize one model's failure modes" (which is what the W4 audit and our two pilot loops were optimizing for, by inheritance from the iter-distribution work).

## What this changes

**The W4 failure-mode taxonomy (A/B/C/D/E/F) was designed for one-model failure-mode characterization.** It's not the wrong frame for that question, but it's the wrong frame for stratification. For stratification you want:

- A test's **discrimination signature**: `[pass_rate@tier-16, pass_rate@tier-32, pass_rate@tier-64]`.
- Useful tests: signatures with **monotonic-decreasing** or **wide-spread** rates across tiers.
- Useless tests: 100% pass at every tier (everything's easy) OR 0% pass at every tier (no model can do it).
- Best tests: the band that separates tiers cleanly — e.g., `[20%, 60%, 95%]` discriminates all three; `[100%, 100%, 30%]` only discriminates tier-64 from the rest.

The audit's K-rate framing ("≥15% fail to be useful") is silently a single-tier framing. Under cross-tier framing, a test with 100% pass at tier-64 and 30% pass at tier-32 is **highly useful** — it just doesn't show up in tier-64-only data.

## Empirical findings, re-framed

### What loops 1 and 2 actually told us (revised reading)

| Test | Tier-64 pass-rate | Old reading | New reading |
|---|---|---|---|
| expression-eval | 72.5% (29/40) | "K-rated, carries signal" | Tier-64 ceiling: **already discriminative at tier-64**. Likely 0–20% at tier-32, 0% at tier-16. |
| csv-parser, lru-cache | 100% | "Drop, too easy" | Tier-64 ceiling reached. **Probably discriminate at tier-32 / tier-16.** Don't drop. |
| agent-single | 100% (n=20 retrofit-aware) | "Audit's 33% fail didn't reproduce, drop" | Tier-64 capability ceiling. **Critical to test at tier-32 / tier-16** — TTFT-fail is a tier-sensitive failure mode. |
| parseISO, eight-functions, tool-confusion, subtle-broken-spec | 100% | "Audit proposals failed, drop" | Tier-64 capability ceiling. **Discrimination unknown** — they may produce useful tier-16 / tier-32 signal. |
| large-refactor, api-evolution | 100% (n=10) | "C-class candidates didn't trigger" | Tier-64 capability ceiling. Multi-file work is a known tier-sensitive capability. |
| adversarial-input, deep-equal | (historical 25-42% from sampler-grid) | "K-rated, keep" | Confirmed tier-64 discriminator. |

**The action this implies:** keep nearly everything. The cost of running these tests at tier-32 and tier-16 is wallclock, not authorship. We've already paid the authorship cost.

### Pass 1 classification of the 11 expression-eval failures (tier-64)

I read all 11 failed-run traces (compact summarizer at `/tmp/w4-pass1/`). Per the post-amendment W4 taxonomy (A/C/D/F):

| run_id | sampler | iter | class | sub-pattern | notes |
|---|---|---|---|---|---|
| 39e86bcd | v1-prod | 9 | A | early-quit | 5 writes, 2 verifies; model gave up before the cap |
| a251ef42 | v3-det | 12 | A | iter-cap (12) | 4 writes, 4 bashes; classic verify-loop |
| e9fdc59c | v3-det | 12 | A | low-verify-cadence | 7 writes / 2 bashes — lots of editing without checking |
| 077672ad | v1-prod | 13 | A | iter-cap (13) | 7 changes, 5 verifies |
| f4cdf104 | v3-det | 14 | A | iter-cap (14) | 7 changes, 5 verifies |
| 84a8b89d | v1-prod | 16 | A | **incorrect-convergence** | terminal=done, exit=0, but verify caught `unexpected token '2' after expression` — model declared success on a buggy parser |
| 3e48abe0 | v3-det | 16 | A | iter-cap (16) | 6 changes, 9 bashes |
| 22f89f9c | v1-prod | 24 | A | iter-cap (24) | 7 changes, 14 bashes — heaviest verify cadence in dataset |
| 01f82168 | v3-det | 20 | A | iter-cap (20) | 8 changes, 10 bashes |
| 39571b89 | v3-det | 20 | A | iter-cap with tool-shape error at iter 20 | 1 `invalid tool input JSON` error at the end |
| 9d8d1c64 | v1-prod | 46 | **D-tentative** | bash-loop-stuck | 38 consecutive bash calls iter 8–43 with no edits; the only run that doesn't fit the verify-loop shape |

**Distribution: A=10/11 (91%), D-tentative=1/11 (9%), C=0, F=0.** Class A absolutely dominates — confirming the audit's prior observation that A is the dominant model failure mode at this difficulty.

**Sub-patterns within A** that matter for lever authoring:
- *iter-cap* (most common): model exhausts its 20–24 iter budget with persistent edit-verify cycles.
- *early-quit*: model stops at iter 9–14 with 5+ writes, no convergence — different lever (encouragement / reformulation).
- *incorrect-convergence*: model declares success despite assertion failure — different lever (better verification feedback).
- *low-verify-cadence*: model edits more than it tests — different lever (prompt model to verify after each edit).

### Distribution diagnostics: productive vs failed cohorts (tier-64 expression-eval)

| Metric | Productive (n=29) | Failed (n=11) | Δ |
|---|---|---|---|
| iter median | 10–12 | 16 | +50% |
| iter p90 | 15 | 20 (46 with outlier) | +33% |
| workspace_changed median | 4 | 5–7 | +50% |
| in_tok p50 (% of ctx 65536) | **56.0%** | **74.5%** | +33% |
| in_tok p90 (% of ctx) | 71.9% | 81.6% | +14% |
| out_tok median | 4–6k | 10–12k | +100% |

**Key reading:** failed runs hit context pressure. p50 input-token usage is 74.5% of ctx for failures vs 56% for passes. The audit's Class C threshold (70–80% of ctx) IS a real signal here — but it's a *gradient*, not a step. Productive runs at p90 already reach 71.9%. So we can't use the threshold as a clean classifier, but it tells us **failures and successes differ in a way that looks like ctx pressure**, even though my Pass 1 classified 0 of 11 as Class C.

This is a hint that the A/B/C/D/E/F taxonomy is mis-cutting: the underlying signal continuum (input-token-share, edit/verify ratio, iteration count) doesn't align cleanly with the discrete classes.

## Coverage gaps under cross-tier framing

Reviewing the existing 31 tier-eval tests against the strategic dimensions:

| Dimension | Existing coverage | Gap |
|---|---|---|
| **Coding** (spec implementation, parsers, refactor, debugging) | ~24 tests | Well-covered |
| **Agentive** (multi-step, multi-tool, tool selection, recovery) | agent-single, agent-parallel, multi-bug-decoy (Q'd), tool-discipline, tool-confusion-redundant-verifies | Light. Mostly hello-world tier or harness-shape tests. No "plan a multi-step task and execute" probe. |
| **Productivity** (drafting docs, summarizing, formatting non-code text, structured Q&A) | **0 tests** | **Completely absent.** prose-quality is the only adjacent test, and the audit recommended dropping it. |

**The productivity dimension is empirically unmeasured.** If the project's stated goal is "useful AI models on 16/32/64 Mac systems," and the audit framing is "stratify on productivity, agentive, and coding" — productivity is completely missing from the test suite. This is the largest single gap in the current setup.

## Re-frame of the W4 taxonomy

Under cross-tier stratification, the A/B/C/D/E/F failure-mode taxonomy is the wrong abstraction. Two alternatives, in order of how much they retain:

**Alternative 1 — Behavioral-signature taxonomy** (continuous, not class-based):
For each (test, tier) cell, report a signature vector:
- pass_rate
- iter_count distribution: median, p90, max
- workspace_changed / iter_count ratio (edit cadence)
- input_token / ctx ratio (context pressure)
- bash / edit ratio (verify cadence)
- terminal_status mix (done / error / timeout)
- incorrect_convergence rate (terminal=done & passed=False)

This makes every test produce a multi-dimensional fingerprint at every tier. Stratification is "compare the fingerprint surfaces across tiers." Loses the clean per-class κ but gains far richer comparative info.

**Alternative 2 — Capability-axis taxonomy** (3–5 axes derived from data):
Replace A/B/C/D with axes that the empirical signal supports:
- *Spec-precision* (handles edge cases beyond the prompt — adversarial-input, deep-equal, expression-eval)
- *Multi-file-context* (cross-file coherence — large-refactor, api-evolution, eight-functions)
- *Tool-discipline* (uses tools efficiently without thrashing — agent-single, tool-confusion)
- *Convergence* (fixes what verification reports — applies to all coding tests)
- *(Future) Productivity* (non-coding generation — currently uncovered)

Each test maps to 1–3 axes. Tier comparison becomes "which capability axes degrade fastest as you go from tier-64 → tier-32 → tier-16." Far more useful for *lever authoring* and *config tuning* than κ on A/B/C/D.

**My recommendation:** Alternative 2, with Alternative 1 as the underlying data layer. Capability axes are the strategic-layer-friendly framing; behavioral signatures are the engineer-level data.

## Where the current technical state sits

**In the codebase, ready to use:**
- 31 tier-eval tests, all telemetry-compatible (post-retrofit) for runs to write `assertion_result.json`
- 4 new test files (parseISO, eight-functions[12-files], tool-confusion, subtle-broken-spec) — empirically too easy at tier-64; **unknown discrimination at lower tiers**
- W4 telemetry pipeline (claw.js, build-run-table.py, iter-distribution.py)
- Sweep driver (`run-iter-distribution-sweep.sh`) and pilot driver (`run-iter-distribution-pilot.sh`) — both parameterized
- Tier infrastructure (TIER env var, `lib/tier.js` with `clawModel` / `bridgeModel` per tier)

**Data we have:**
- 120-run tier-64 production sweep (csv-parser, lru-cache, expression-eval × 2 samplers × 20)
- Loop-1 + loop-2 pilot data on the new tests at tier-64 (mostly 100% pass; archived but inspectable)
- W4 stratified classifications from prior sweep (14 failed-tail + 26 productive — frozen, well-documented)
- Sampler-grid data (5 tests × 8 cells × n=3) cited in the audit at tier-64 only

**Data we don't have:**
- Any systematic tier-32 or tier-16 sweep on the K-3 / K-5 / extended suite
- Any productivity-task data (no tests exist)
- Any cross-tier discrimination signature for any test
- Effective sampler-arm comparison data at tiers below 64

## What I recommend, in priority order

1. **Run the existing tier-eval suite at tier-32 and tier-16 (n=20 per tier).** This is the single highest-value action available. It directly produces the discrimination matrix the strategic goal needs. Cost: ~6–10h wallclock per tier on M5; can be run sequentially (one weekend) or in parallel on the 32 / 16 GB Macs. No code changes required — `TIER=32` and `TIER=16` env switches are already wired.

2. **Build a discrimination-matrix dashboard.** A simple Markdown or HTML table: rows = tests, columns = tiers (16/32/64), cell = pass-rate ± CI. Sortable by "max-min spread" to surface the most discriminative tests. Cost: 1–2 days, mostly Python pandas + a small report generator.

3. **Add 3–5 productivity-task tests.** This is the empirical gap, not the agentive or coding ones. Examples: "summarize this 800-word changelog into bullets," "rewrite this email in formal register," "format this CSV as a Markdown table with totals." Each produces verifiable output (length bounds, required content). Cost: ~1 day authorship + 1 pilot loop.

4. **Re-frame the failure-mode taxonomy as a capability-axis taxonomy** (Alternative 2 above). Cost: research / writing, not implementation. Best done after step 1 produces the discrimination matrix — let the data drive which axes matter.

5. **Park the κ / Cohen agreement work** until we know if it's still the right metric. Under cross-tier framing, the question shifts from "do classifiers agree on failure-mode labels?" to "do tiers separate cleanly on capability axes?" — different statistical frame.

## Specific decisions for the strategic layer

These are the calls I cannot make myself:

1. **Productivity-task scope.** What does "productivity" mean for the lab — drafting docs? structured data wrangling? conversational helpfulness? Each produces different test designs. Without scope, we'll guess wrong twice and burn a week.

2. **Tier-comparison goal.** Are we trying to:
   (a) **Answer "which tier is good enough for what use case?"** → optimizes for clean separation of tier capabilities; suite needs a wide difficulty band per axis.
   (b) **Answer "where is the current model strong/weak per tier?"** → optimizes for tier-internal capability profiling; current suite is closer to this.
   (c) **Answer "does config X (sampler, prompt, harness tweak) move the needle?"** → optimizes for low-variance discriminating tests; needs effect-size tooling more than coverage.
   These goals are not conflicting but they prioritize different next-steps.

3. **Model-trial readiness.** When a new model gets slotted in, what's the acceptance bar? "Beats current on N/M tests" or "runs at all" or "matches tier-N capability"? The bar drives test stability requirements.

4. **Sampler-tuning vs. test-suite work.** The W3 finding (sampler tuning cannot be retired on n=20 evidence) suggests sampler is still a real lever. Should sampler exploration get equal priority with cross-tier sweeps, or queue behind?

5. **"Useful test" criterion.** Under the new framing, replace the audit's `≥15% fail rate at tier-64` rule with: `discrimination spread (max_pass − min_pass across tiers) ≥ X%`. What's X? 30% gives strong tier separation; 15% catches subtler differences but admits more noise.

## Honest limits

- I cannot judge productivity-task value. The lab knows what it wants from the systems; I know what the tests measure.
- I cannot pick between "answer for an end-user use case" (decision 2a) vs "answer for R&D" (2b/c). They have different costs.
- The Pass 1 classification I did (10/11 = A, 1 D-tentative) is reliable for this dataset but small-n. A second classifier would lift confidence; an LLM-as-classifier (probably Claude) running director Pass 2 would be straightforward to add if the κ frame turns out to still matter.
- The model-version-specific intuition that comes from sustained ownership of this codebase isn't in this report. Whoever's been close to the W2/W3/W4 work for weeks should sanity-check the framing pivot before committing.

---

*Report prepared by automated analysis. Pass 1 classifications, distribution diagnostics, and pilot-loop data inspectable at the run-id level under `host/test/.claw-runtime/`. Trace summarizer at `/tmp/w4-pass1/summarize-trace.py`.*
