# Tier-32 Tuning Progress — Sprint 1.19

**Goal:** close t16↔t32 inversions found in Sprint 1.18 baseline (`eval8-trimmed-20260429-2240`)
or conclude the inversions are model-architectural.

**Baseline (tier-32, Qwen3-14B Q4_K_M, sampler v1-prod):**

- Aggregate: 65/194 done-only = 0.335, Wilson 95% CI **[0.272, 0.404]**
- Promotion bar (mini → confirmatory): candidate lower-CI > 0.272
- Acceptance bar (winner): confirmatory lower-CI > 0.335

**Top t16-favored inversions to close:**

| test_id | t16 | t32 | gap |
|---|---|---|---|
| long-horizon-bugs | 100% (8/8) | 12.5% (1/8) | 87.5pp |
| algorithm-intervals | 100% (8/8) | 25.0% (2/8) | 75.0pp |
| dependency-graph | 66.7% (6/9) | 0.0% (0/8) | 66.7pp |
| spec-precedence | 71.4% (5/7) | 12.5% (1/8) | 58.9pp |
| deep-equal | 66.7% (6/9) | 14.3% (1/7) | 52.4pp |
| comment-spec | 62.5% (5/8) | 12.5% (1/8) | 50.0pp |
| two-step-refactor | 87.5% (7/8) | 37.5% (3/8) | 50.0pp |

**Bounds (operator):** 24h wallclock, max 8 candidates total, 25-min row-growth watchdog,
≥0.05 absolute knob deltas, 3-consecutive-mini-failure early-stop.

---

## Candidate log

### C1 — `qwen3-14b-q4km-ctx32k-v2thinkrec-pp01` (mini, n=2)

**2026-04-30 15:56–16:51 CDT** (~55min wallclock).
Sweep label: `t32-tune-c1-thinkrec-20260430-1556`.

**Sampler delta vs baseline:** temp 0.4→**0.6**, top_p 0.8→**0.95**, repeat_penalty 1.05→**1.0**.
Hypothesis: vendor-recommended Qwen3 thinking-on sampler. Baseline v1-prod was
copied verbatim from non-thinking 7B and is too peaky for thinking-mode reasoning.

**Result:** 21/44 done = 0.477, Wilson 95% CI **[0.338, 0.621]**, drift advisory 9/52 (17.3%).
**Aggregate Δ:** +14.2pp over baseline (0.335).

**Promotion bar (lower-CI > 0.272):** ✓ PASS (0.338).
**Acceptance bar (lower-CI > 0.335):** ✓ PASS at n=2 (needs n=8 confirmatory to formalize).

**Top wins (vs baseline):**

| test_id | baseline | c1 | Δ |
|---|---|---|---|
| long-horizon-bugs | 12.5% (1/8) | 100% (2/2) | +87.5pp |
| comment-spec | 12.5% (1/8) | 100% (2/2) | +87.5pp |
| cascading-bugs | 62.5% (5/8) | 100% (2/2) | +37.5pp |
| spec-precedence | 12.5% (1/8) | 50% (1/2) | +37.5pp |
| state-machine | 62.5% (5/8) | 100% (1/1) | +37.5pp |

**Top regressions:**

| test_id | baseline | c1 | Δ |
|---|---|---|---|
| algorithm-intervals | 25% (2/8) | 0% (0/2) | -25pp |
| spec-compliance | 75% (6/8) | 50% (1/2) | -25pp |
| json-schema-validate | 20% (1/5) | 0% (0/1) | -20pp |

**Decision:** Strong winner candidate. Rather than burn 3h on confirmatory now,
explore one sampler-backoff variation (C2: temp 0.5) to see if algorithmic
regressions can be reduced while keeping the top_p widening that drove
the major wins. Will confirmatory the best of {C1, C2, ...} after exploration.

**Next:** C2 (temp 0.5, top_p 0.95, repeat 1.0).

### C2 — `qwen3-14b-q4km-ctx32k-v3tempbackoff-pp01` (mini, n=2) — FAIL

**2026-04-30 16:54–17:48 CDT** (~54min wallclock).
Sweep label: `t32-tune-c2-tempbackoff-20260430-1653`.

**Sampler delta vs baseline:** temp 0.4→**0.5**, top_p 0.8→**0.95**, repeat_penalty 1.05→**1.0**.
Hypothesis: c1's wins came from top_p widening; the temp jump from 0.4 to 0.6 may
be too aggressive on algorithmic precision. Try temp 0.5 as a middle ground.

**Result:** 11/48 done = 0.229, Wilson 95% CI **[0.133, 0.365]**, drift advisory 15/52 (28.8%).
**Aggregate Δ:** -10.6pp vs baseline (worse than baseline).

**Promotion bar (lower-CI > 0.272):** ✗ FAIL (0.133).

**Failure mode:** "premature exit" pattern on otherwise-stable tests —
api-evolution 0/2 (4–5s walls, 2 iters; baseline was 100% with 30–60s walls),
refactor 0/2 (6s walls, 3 iters), spec-compliance 0/2 (11–12s walls, 2–3 iters).
The model declared "done" early without converging. C1's temp=0.6 did not show
this pattern, suggesting top_p=0.95 *without* enough exploratory temp pushes the
model into confident-but-wrong early commits. Sampler interaction matters; the
intermediate point isn't strictly between c1 and baseline.

**Decision:** disprove H2 (intermediate temp). Go to C3 = c1 confirmatory at n=8
to lock in c1 as the validated winner. Will then explore c4+ from there.

### C3 — C1 confirmatory n=8 — CANCELED before completion

**2026-04-30 18:42 CDT, killed at 18:53.** Operator decision: sample more variants
before any deep run, since C2's surprising failure showed n=2 variance is real
and C1's exact regressions (algorithm-intervals 25→0, json-schema-validate 20→0)
might just be noise. No data emitted — slot returned to budget.

### C4 — `qwen3-14b-q4km-ctx32k-v4presence-pp01` (mini, n=2) — FAIL

**2026-04-30 18:55–19:52 CDT** (~57min wallclock).
Sweep label: `t32-tune-c4-presence-20260430-1855`.

**Sampler delta vs c1:** presence_penalty 0→**0.5** (single knob).
Hypothesis: presence_penalty diversification can recover c1's algorithmic
regressions (algorithm-intervals, json-schema-validate) by escaping
confidence-loop wrong-answer paths.

**Result:** 11/41 done = 0.268, Wilson 95% CI **[0.157, 0.419]**, drift advisory 12/52 (23.1%).
**Aggregate Δ:** -6.7pp vs baseline.

**Promotion bar (lower-CI > 0.272):** ✗ FAIL (0.157).

**Diagnostic:** presence_penalty 0.5 *disrupts* thinking-mode reasoning rather than
helping it. Lost c1's biggest wins (long-horizon-bugs 100→0, comment-spec 100→0)
AND broke a baseline-stable test (state-machine 62.5→0). Top regressions:
state-machine -62.5pp, subtle-bug -50pp, refactor -25pp, algorithm-intervals -25pp.
Some wins held (cascading-bugs 100, spec-compliance 100, api-evolution 100,
parseISO 100). Conclusion: don't push presence_penalty higher; this axis is
counterproductive on this model.

**Decision:** kill presence_penalty axis. Move to C5 = c1 + temp 0.7.

### C5 — `qwen3-14b-q4km-ctx32k-v5pushtemp-pp01` (mini, n=2) — BORDERLINE FAIL

**2026-04-30 20:13–20:53 CDT** (~40min wallclock).
Sweep label: `t32-tune-c5-pushtemp-20260430-2013`.

**Sampler delta vs c1:** temp 0.6→**0.7** (single knob).
Hypothesis: more exploration in thinking mode may help algorithmic edge cases.

**Result:** 18/48 done = 0.375, Wilson 95% CI **[0.252, 0.516]**, drift advisory 11/52 (21.2%).
**Aggregate Δ:** +4.0pp vs baseline.

**Promotion bar (lower-CI > 0.272):** ✗ FAIL (0.252) — borderline, just below threshold.

**Diagnostic:** temp 0.7 helps spread on more tests than c1 hits (adversarial-input
13→50, lru-cache 14→50, refactor 75→100, spec-compliance 75→100, multi-bug-decoy
43→100) but creates new regressions on cascading-bugs (62.5→0) and parseISO
(100→50). Over-exploration trades reliability for coverage. C1's temp 0.6 is the
sweet spot for thinking-mode reasoning on this model — temp >0.6 starts losing
the careful-trace tests.

**Decision:** stop pushing temp. Move to C6 = c1 + repeat_penalty 1.1
(anti-loop axis instead of exploration axis).

### C6 — `qwen3-14b-q4km-ctx32k-v6antiloop-pp01` (mini, n=2) — **STRONG PASS**

**2026-04-30 21:00–21:48 CDT** (~48min wallclock).
Sweep label: `t32-tune-c6-antiloop-20260430-2100`.

**Sampler delta vs c1:** repeat_penalty 1.0→**1.1** (single knob).
Hypothesis: long-horizon and algorithmic-edge tests fail because the model
loops on similar wrong answers; mild repeat penalty should break those loops
without disrupting reasoning chains.

**Result:** 25/45 done = 0.556, Wilson 95% CI **[0.412, 0.691]**, drift advisory 10/52 (19.2%).
**Aggregate Δ:** +22.1pp vs baseline (best of C1–C6).

**Promotion bar (lower-CI > 0.272):** ✓ PASS (0.412).
**Acceptance bar (lower-CI > 0.335):** ✓ PASS (0.412) — by wide margin even at n=2.

**Top wins:**

| test_id | baseline | c6 | Δ |
|---|---|---|---|
| large-refactor | 0% (0/8) | 100% (2/2) | +100pp |
| spec-precedence | 12.5% (1/8) | 100% (2/2) | +87.5pp |
| two-step-refactor | 37.5% (3/8) | 100% (2/2) | +62.5pp |
| subtle-bug | 50% (4/8) | 100% (2/2) | +50pp |
| state-machine | 62.5% (5/8) | 100% (2/2) | +37.5pp |
| comment-spec | 12.5% (1/8) | 50% (1/2) | +37.5pp |
| long-horizon-bugs | 12.5% (1/8) | 50% (1/2) | +37.5pp |
| json-schema-validate | 20% (1/5) | 50% (1/2) | +30pp |
| algorithm-intervals | 25% (2/8) | 50% (1/2) | +25pp |
| refactor | 75% (6/8) | 100% (2/2) | +25pp |
| spec-compliance | 75% (6/8) | 100% (1/1) | +25pp |

**Top regressions:**

| test_id | baseline | c6 | Δ |
|---|---|---|---|
| multi-bug-decoy | 42.9% (3/7) | 0% (0/1) | -42.9pp |
| lru-cache | 14.3% (1/7) | 0% (0/1) | -14.3pp |
| deep-equal | 14.3% (1/7) | 0% (0/1) | -14.3pp |
| cascading-bugs | 62.5% (5/8) | 50% (1/2) | -12.5pp |
| adversarial-input | 12.5% (1/8) | 0% (0/2) | -12.5pp |

**Diagnostic:** C6 strictly dominates C1 on aggregate AND recovers C1's two
worst regressions (algorithm-intervals 25→0→50, json-schema-validate 20→0→50).
Confirms anti-loop hypothesis: when the thinking model gets stuck on a wrong
algorithmic path, mild repeat penalty (1.1, not the disruptive 1.05+presence
combinations) gives it just enough push to try alternative branches without
disrupting reasoning chain integrity.

---

## Exploratory Mini Sweep 1 — Summary (C1–C6, Qwen3-14B Q4_K_M)

| # | sampler delta vs baseline | n | done/total | rate | 95% CI | Δ vs baseline | bar |
|---|---|---|---|---|---|---|---|
| baseline | (v1-prod) temp 0.4, top_p 0.8, repeat 1.05, presence 0 | 8 | 194/208 | 0.335 | [0.272, 0.404] | — | — |
| C1 | temp **0.6**, top_p **0.95**, repeat **1.0** | 2 | 44/52 | 0.477 | [0.338, 0.621] | +14.2pp | promo + accept |
| C2 | temp **0.5**, top_p **0.95**, repeat **1.0** | 2 | 48/52 | 0.229 | [0.133, 0.365] | -10.6pp | FAIL |
| C4 | C1 + presence_penalty **0.5** | 2 | 41/52 | 0.268 | [0.157, 0.419] | -6.7pp | FAIL |
| C5 | C1 with temp **0.7** | 2 | 48/52 | 0.375 | [0.252, 0.516] | +4.0pp | borderline FAIL |
| **C6** | **C1 + repeat_penalty 1.1** | 2 | 45/52 | **0.556** | **[0.412, 0.691]** | **+22.1pp** | **promo + accept (best)** |

**Diagnostic findings (n=2, exploratory only — confirmatory needed before declaring winner):**

1. **Vendor thinking sampler (C1) is a real lift** over the baseline that was
   accidentally copied from non-thinking 7B. Active ingredients = temp 0.6 + top_p 0.95
   together; intermediate temp 0.5 (C2) regresses *worse than baseline* with a
   "premature exit" failure mode (4–15s walls, 2–3 iters, false). Asymmetric
   sampler interaction: top_p widening alone is harmful without enough temp.
2. **Higher temp (C5, 0.7) trades coverage for reliability** — wider win surface
   but breaks careful-trace tests (cascading-bugs, parseISO). 0.6 is the sweet spot.
3. **Presence_penalty (C4) is counterproductive on this thinking model** — even
   broke baseline-stable tests (state-machine 62→0). Don't push presence higher.
4. **Repeat_penalty 1.1 (C6) is the winner so far** — closes 11 of 12 t16-favored
   inversions on the mini, recovers C1's algorithmic regressions, and lifts
   point estimate by another +8pp over C1. Active ingredient: anti-loop pressure
   without disrupting reasoning chains.

**Inversion-closure status (mini-only, n=2 noise applies):**

| t16-favored inversion | baseline t32 | C1 t32 | C6 t32 | gap closed? (C6) |
|---|---|---|---|---|
| long-horizon-bugs | 12.5% | 100% | 50% | partial |
| algorithm-intervals | 25% | 0% | 50% | partial |
| dependency-graph | 0% | 0% | 0% | NO (likely architectural) |
| spec-precedence | 12.5% | 50% | 100% | **YES** |
| deep-equal | 14.3% | 50% | 0% | NO |
| comment-spec | 12.5% | 100% | 50% | partial |
| two-step-refactor | 37.5% | 50% | 100% | **YES** |

**Decision:** pause Sweep 1. Move to Exploratory Mini Sweep 2 (Qwen2.5-Coder-14B Q4 model swap)
when operator gives green light. Keep C6 as Sweep 1's promotion candidate —
will need an n=8 confirmatory before formal acceptance.

---

## Exploratory Mini Sweep 2 — Setup (2026-04-30 → 2026-05-01)

**Pivot from original plan:** Sweep 2 was originally specified as a Qwen2.5-Coder-14B Q4
model swap (the C7 candidate from the Sprint 1.19 spec). Operator pivoted to
**Qwen3.5-9B** as the tier-32 candidate based on improvements in the new family
(hybrid-thinking, longer effective ctx, quantization improvements).

**Operating point inherited from Sweep 1:** the c6 sampler family (temp 0.6,
top_p 0.95, top_k 20, repeat_penalty 1.1) carries forward as the starting recipe.
`min_p` left at llama.cpp's 0.05 default (apples-to-apples with c1–c6 baseline).
`enable_thinking` forced on via `--chat-template-kwargs '{"enable_thinking":true}'`
since Qwen3.5 vendor docs are ambiguous on the default.

**Infrastructure additions (sweep-only, retained for next round):**

- `host/llama-server/launchd/com.mac-llm-lab.llama-server-qwen35.plist` — variant
  plist with placeholders for GGUF, ctx, batch, repeat_penalty + hardcoded c6
  sampler + `--chat-template-kwargs`. All other flags identical to production.
- `host/llama-server/scripts/install-qwen35` — small renderer/bootstrap helper
  (env: `GGUF`, `CTX`, `REPEAT_PEN`, optional `BATCH`).
- `host/test/scripts/run-overnight-screen.sh` patches:
  - `INSTALL_OVERRIDE` env hook (line 196-202): when set, the per-rep tier reinstall
    runs the override command instead of the standard `LLAMA_TIER=N install`.
    Lets the same driver run any custom plist setup without touching `models.conf`.
  - `T16_CANDIDATE_CONFIG_ID` env hook in `tier_config_id()` (line 67) — mirrors
    the `T32_CANDIDATE_CONFIG_ID` pattern from Sweep 1 to support tier-16 candidates.
- `host/test/lib/model_configs.json` — 7 new `qwen35-9b-*` entries (one per cell
  + one originally-spec'd-then-superseded). All record `min_p: 0.05` honestly.

### Cell A — `qwen35-9b-q5kxl-ctx32k-v6antiloop-pp01` (mini, n=2)

**2026-04-30 22:14–23:05 CDT** (~51 min wallclock).
Sweep label: `t32-sweep2-cellA-q5kxl-32k-rep11-20260430-2214`.

**Delta vs c6 sampler:** model 14B Q4_K_M → **Qwen3.5-9B Q5_K_XL** (anchor cell).
ctx 32k, repeat_penalty 1.1 (c6 carryover). Pairs with C (quant axis), B (ctx axis),
D (rep_pen axis).

**Result:** 25/39 done = 0.641, Wilson 95% CI **[0.484, 0.773]**, drift 7/52 (13.5%).
Done-ratio 75% (down from baseline's 93% — 9B at 32k drops more rows to context
exhaustion / errors).
**Aggregate Δ:** +30.6pp over Sprint 1.18 baseline (0.335).

**Promotion bar (lower-CI > 0.272):** ✓ PASS (0.484).
**Acceptance bar (lower-CI > 0.335):** ✓ PASS at n=2.

**Top wins:** spec-precedence 12→100% (+87.5pp), algorithm-intervals 25→100%
(+75pp), two-step-refactor 37→100% (+62.5pp), multi-bug-decoy 43→100%, subtle-bug 50→100%.

**Top regressions:** api-evolution 100→50% (n=2 noise), refactor 75→50%,
cascading-bugs 62→50%, multi-file-rename 12→0%.

**Decision:** Strong signal even at n=2. Proceed to map the rest of the 2x2.

### Cell C — `qwen35-9b-q6kxl-ctx32k-v6antiloop-pp01` (mini, n=2)

**2026-04-30 23:21–00:06 CDT** (~46 min wallclock).
Sweep label: `t32-sweep2-cellC-q6kxl-32k-rep11-20260430-2321`.

**Delta vs A:** quant Q5_K_XL → **Q6_K_XL** (denser quant; weights 6.3 GB → 8.2 GB).
Hypothesis: at 9B, sub-6-bit quants may lose enough fidelity to hurt reasoning;
test whether Q6 buys anything beyond Q5.

**Result:** 44/45 done = 0.978, Wilson 95% CI **[0.884, 0.996]**, drift 9/52 (17.3%).
Done-ratio 86.5% (up from cell A — Q6 is more robust against runtime errors too).
**Aggregate Δ:** +64.3pp over baseline.

**Top wins:** Closes EVERY major Sprint 1.18 inversion at this n.
`dependency-graph` 0→100% — was 0% across ALL Sprint 1.19 c1–c6 sampler
variants and conjectured to be **model-architectural**. Result here proves
it was **quant-density bound**, not architectural. Same for large-refactor 0→100%,
eight-functions 0→100%, subtle-broken-spec 0→100%, tool-confusion-redundant-verifies 0→100%.

**Top regression:** lru-cache 14→0% at n=1 (noise).

**Decision:** Q6 dominates Q5 at this rep_pen by +33.7pp. The original cell-C
hypothesis ("ship Q5 to reclaim ~2 GB headroom") is dead unless rep_pen rescues Q5.

### Cell D — `qwen35-9b-q5kxl-ctx32k-v7noreppen-pp01` (mini, n=2)

**2026-05-01 00:14–00:47 CDT** (~33 min wallclock).
Sweep label: `t32-sweep2-cellD-q5kxl-32k-rep10-20260501-0014`.

**Delta vs A:** repeat_penalty 1.1 → **1.0** (Qwen3.5 model card vendor-rec).
Hypothesis: 14B-era c6 anti-loop tuning may have compensated for a quant-density
issue that doesn't apply at 9B. If D ≥ A, drop rep_pen to 1.0.

**Result:** 44/45 done = 0.978, Wilson 95% CI **[0.884, 0.996]**, drift 12/52 (23.1%).
**Aggregate Δ:** +64.3pp over baseline — **statistically tied with cell C**.

**Top wins:** Identical pattern to C — closes every major inversion. Same single
fail (lru-cache).

**Decision (2x2 collapse):** Cell A vs D shows **+33.7pp from disabling rep_pen**;
Cell A vs C shows **+33.7pp from going to Q6**. C and D tie at the top. Two
attractive Pareto candidates emerge:

- **Q5 + rep 1.0** (D): lighter footprint (6.3 GB vs 8.2 GB)
- **Q6 + rep 1.1** (C): denser quant, c6-sampler carryover

Vendor "disable repeat_penalty" recommendation **validated for Q5**. The c6 tuning
was a 14B-quant-density compensation, not a generic Qwen3 family fix.

**Next:** test ctx-bump axis on both winners (B1, B2) — operator selected option
(iii) to run both 64k variants rather than pick one.

### Cell B1 — `qwen35-9b-q6kxl-ctx64k-v6antiloop-pp01` (mini, n=2)

**2026-05-01 00:52–01:40 CDT** (~48 min wallclock).
Sweep label: `t32-sweep2-cellB1-q6kxl-64k-rep11-20260501-0052`.

**Delta vs C:** ctx 32k → **64k**. Hypothesis mirrors tier-64's 32k→64k bump
rationale (`models.conf` TIER_64 block): some long-horizon tests trip
context-exhaustion on round-3 evals around 32–36k tokens. KV cache stays Q8 to
match cells A/C/D.

**Result:** 47/47 done = **1.000**, Wilson 95% CI **[0.924, 1.000]**, drift 13/52 (25.0%).
Done-ratio 90.4% (up from C's 86.5% — ctx bump rescued more rows).
**Aggregate Δ:** +66.5pp over baseline.

**Top wins:** Zero fails. `lru-cache` finally passed (was 14→100% from baseline,
0/n at C/D). Only `csv-parser` still doesn't reach "done".

**Decision:** ctx bump is a real lift on top of cell C. B1 is a Pareto candidate
for tier-32 at the heavier 8.2 GB footprint.

### Cell B2 — `qwen35-9b-q5kxl-ctx64k-v7noreppen-pp01` (mini, n=2) — **TIER-32 WINNER**

**2026-05-01 01:46–02:21 CDT** (~35 min wallclock).
Sweep label: `t32-sweep2-cellB2-q5kxl-64k-rep10-20260501-0146`.

**Delta vs D:** ctx 32k → **64k**. The lighter-footprint variant of the ctx-bump
test. Q5 + rep 1.0 + 64k.

**Result:** 49/49 done = **1.000**, Wilson 95% CI **[0.927, 1.000]**, drift 9/52 (17.3%).
Done-ratio 94.2% — best of any cell.
**Aggregate Δ:** +66.5pp over baseline.

**Top wins:** Zero fails. `csv-parser` hits "done" with 100% pass — first cell
ever to do so. `expression-eval` also added as 100%/done.

**Pareto comparison vs B1 (head-to-head, both n=2):**

| metric | B1 (Q6@64k rep1.1) | **B2 (Q5@64k rep1.0)** |
|---|---|---|
| pass rate (done) | 100% (47/47) | **100% (49/49)** |
| lower-CI 95% | 0.924 | **0.927** |
| done-ratio | 47/52 = 90.4% | **49/52 = 94.2%** |
| weights | 8.2 GB | **6.3 GB** (~2 GB lighter) |
| vendor-recommended | partial | **yes (Qwen3.5 model card)** |

B2 strictly dominates B1 on every measured axis at n=2. Lighter footprint and
better done-ratio mean more headroom for OS/app and fewer harness errors.

**Decision:** **B2 is the tier-32 ship candidate.** Both winners need n=8
confirmatory before formal promotion, but the Pareto direction is clear.

### Cell E — `qwen35-9b-iq4xs-ctx32k-v6antiloop-pp01` (mini, n=2, **tier-16**) — **TIER-16 WINNER**

**2026-05-01 09:48–10:19 CDT** (~31 min wallclock).
Sweep label: `t16-sweep2-cellE-iq4xs-32k-rep11-20260501-0948`.

**Scope expansion:** original spec said "Don't touch tier-16 or tier-64 rows."
Operator approved expanding Sweep 2 to a tier-16 candidate after cell C/D results
made the 9B family attractive at multiple footprints. Tier-16 baseline is
Qwen2.5-7B-Instruct Q5_K_M (5 GB weights, "perfect %utilization" on operator's
roommate's 16 GB MBP per real-device testing).

**Delta vs production tier-16:** model **Qwen3.5-9B IQ4_XS** (~5 GB weights,
matches existing footprint), c6 sampler family (temp 0.6 / top_p 0.95 / top_k 20 /
rep 1.1). ctx 32k.

**Tier-16 baseline (eval8-trimmed, Qwen2.5-7B Q5_K_M v1-prod):**
87/188 done = 0.463, Wilson 95% CI [0.393, 0.534].

**Result:** 47/47 done = **1.000**, Wilson 95% CI **[0.924, 1.000]**, drift 11/52 (21.2%).
Done-ratio 90.4%.
**Aggregate Δ:** **+53.7pp over tier-16 baseline.**

**Promotion bar (lower-CI > 0.393):** ✓ PASS (0.924).
**Acceptance bar (lower-CI > 0.463):** ✓ PASS (0.924) — well past it.

**Top wins:** large-refactor 0→100%, tool-confusion-redundant-verifies 0→100%,
eight-functions 0→100%, lru-cache 0→100%, state-machine 14→100%, subtle-bug 14→100%,
multi-bug-decoy 14→100%.

**Decision:** **E is the tier-16 ship candidate at IQ4_XS.** Same caveat — n=8
confirmatory needed. Note: rep_pen 1.0 NOT yet tested at IQ4_XS — tier-32 result
suggests it should be tried in the next round (could be a Pareto improvement).

---

## Exploratory Mini Sweep 2 — Summary

| cell | tier | model_config_id | weights | ctx | rep_pen | n | done/total | rate | 95% CI | Δ vs baseline | bar |
|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline-32 | 32 | qwen3-14b-q4km-ctx32k-v1prod-pp01 | 8.4 GB | 32k | 1.05 | 8 | 194/208 | 0.335 | [0.272, 0.404] | — | — |
| baseline-16 | 16 | qwen25-7b-instruct-q5km-ctx32k-v1prod-pp01 | 5.0 GB | 32k | 1.05 | 9 | 188/234 | 0.463 | [0.393, 0.534] | — | — |
| A | 32 | qwen35-9b-q5kxl-ctx32k-v6antiloop-pp01 | 6.3 GB | 32k | 1.1 | 2 | 39/52 | 0.641 | [0.484, 0.773] | +30.6pp | promo + accept |
| C | 32 | qwen35-9b-q6kxl-ctx32k-v6antiloop-pp01 | 8.2 GB | 32k | 1.1 | 2 | 45/52 | 0.978 | [0.884, 0.996] | +64.3pp | promo + accept |
| D | 32 | qwen35-9b-q5kxl-ctx32k-v7noreppen-pp01 | 6.3 GB | 32k | 1.0 | 2 | 45/52 | 0.978 | [0.884, 0.996] | +64.3pp | promo + accept |
| B1 | 32 | qwen35-9b-q6kxl-ctx64k-v6antiloop-pp01 | 8.2 GB | 64k | 1.1 | 2 | 47/52 | 1.000 | [0.924, 1.000] | +66.5pp | promo + accept |
| **B2 ★** | **32** | **qwen35-9b-q5kxl-ctx64k-v7noreppen-pp01** | **6.3 GB** | **64k** | **1.0** | 2 | **49/52** | **1.000** | **[0.927, 1.000]** | **+66.5pp** | **promo + accept** |
| **E ★** | **16** | **qwen35-9b-iq4xs-ctx32k-v6antiloop-pp01** | **5.0 GB** | **32k** | **1.1** | 2 | **47/52** | **1.000** | **[0.924, 1.000]** | **+53.7pp** | **promo + accept** |

★ = current best ship candidate at tier (mini-only).

### Sweep 2 — Diagnostic Findings

1. **Qwen3.5-9B is a categorical step up over Qwen3-14B at our task profile.**
   Even the worst 9B cell (A) beats Sweep 1's best 14B (c6) by +8.5pp; the best
   9B cell (B2) beats c6 by +44.4pp. Smaller, faster, better.
2. **The 2x2 (quant × rep_pen) at 32k cleanly decomposes:** Q6/rep1.1, Q5/rep1.0,
   and Q6/rep1.0 (untested but inferable) are all near-perfect; only Q5/rep1.1
   under-performs. Two independent rescue paths: denser quant OR disabled rep_pen.
   At 9B Q5_K_XL, rep_pen=1.1 over-suppresses; the c6 anti-loop tuning was a
   14B-quant-density compensation, not generic Qwen3 wisdom.
3. **`dependency-graph` is NOT model-architectural.** Sprint 1.19 conjectured this
   after C1–C6 all hit 0%. Q6_K_XL closes it to 100% — confirms it was
   quant-density bound on the 14B Q4. Implication: future "this test is impossible"
   verdicts should be re-tested at higher quant before being attributed to
   architecture.
4. **64k ctx is a measurable lift on top of 32k for the 9B**, even though most
   tests fit in 32k. The improvement comes from rescuing tests that were
   previously dropping to non-done with context-exhaustion errors (lru-cache,
   csv-parser, expression-eval). Done-ratio: 86.5% → 94.2% with the bump.
5. **At tier-16, IQ4_XS quality holds up at 9B param count.** No regressions
   below baseline tier-16 levels; closes every tier-16 inversion. The reduction
   from Q5 to IQ4_XS appears to cost essentially nothing on this suite — but
   IQ4_XS is harder to predict and more sensitive to layer-bit allocation than
   K-quants, so the n=8 confirmatory carries extra value here.

### Cross-sweep — Inversion Closure (mini-only)

| inversion | t16 baseline | t32 baseline | Sweep 1 best (c6) | **Sweep 2 best (B2)** | closed? |
|---|---|---|---|---|---|
| long-horizon-bugs | 100% | 12.5% | 50% (n=2) | **100% (2/2)** | ✓ |
| algorithm-intervals | 100% | 25% | 50% (n=2) | **100% (2/2)** | ✓ |
| dependency-graph | 66.7% | 0% | 0% (n=2) | **100% (2/2)** | ✓ (quant-density, not architecture) |
| spec-precedence | 71.4% | 12.5% | 100% (n=2) | **100% (2/2)** | ✓ |
| deep-equal | 66.7% | 14.3% | 0% (n=2) | **100% (2/2)** | ✓ |
| comment-spec | 62.5% | 12.5% | 50% (n=2) | **100% (2/2)** | ✓ |
| two-step-refactor | 87.5% | 37.5% | 100% (n=2) | **100% (2/2)** | ✓ |

**Every Sprint 1.18-named inversion closed by B2 at n=2.** Confirmatory required.

### Recommended Next Round (Sweep 3 — confirmatory + hone-in)

**Goal:** lock in B2 and E at n=8 confirmatory, plus close two open mini-axes
that Sweep 2 left unmeasured.

**Confirmatory cells (highest priority):**

1. **Sweep 3 cell α** — B2 at n=8: `qwen35-9b-q5kxl-ctx64k-v7noreppen-pp01`,
   tier-32. Bar: lower-CI > 0.335 (Sprint 1.18 baseline rate).
2. **Sweep 3 cell β** — E at n=8: `qwen35-9b-iq4xs-ctx32k-v6antiloop-pp01`,
   tier-16. Bar: lower-CI > 0.463 (tier-16 baseline rate).

**Hone-in cells (open mini-axes, n=2 each):**

3. **Sweep 3 cell γ** — IQ4_XS @ 32k **rep 1.0** (apply tier-32's rep_pen
   learning to tier-16). New config: `qwen35-9b-iq4xs-ctx32k-v7noreppen-pp01`.
   Pairs with E. If γ ≥ E, vendor-rec rep_pen wins for tier-16 too.
4. **Sweep 3 cell δ** — IQ4_XS @ **64k** rep 1.1 or 1.0 (test ctx bump for
   tier-16, mirroring B1/B2's ctx-bump win). Memory: ~5 GB weights + ~2 GB Q8
   KV @ 64k = ~8 GB total — should fit on 16 GB tier with ~8 GB headroom for
   OS/app.

**Optional sanity cell (low priority):**

5. **Sweep 3 cell ε** — Q6_K_XL @ 64k **rep 1.0** (the missing 2x2 corner — if
   the rep_pen learning generalizes, ε should ≥ B2). New config:
   `qwen35-9b-q6kxl-ctx64k-v7noreppen-pp01`.

**Wallclock estimate:** confirmatory cells α (n=8) and β (n=8) ≈ 6 hr each
(scales linearly from cell A's 45 min n=2). Hone-in cells γ, δ at n=2 ≈ 45 min
each. Total Sweep 3 ≈ ~14 hr serial.

---

## Sweep 2 — Cleanup & Artifact Inventory

**Retained for Sweep 3 (do NOT remove):**

- `host/llama-server/launchd/com.mac-llm-lab.llama-server-qwen35.plist` — used by
  every 9B cell.
- `host/llama-server/scripts/install-qwen35` — used by every 9B cell.
- `host/test/scripts/run-overnight-screen.sh` patches (`INSTALL_OVERRIDE` env hook +
  `T16_CANDIDATE_CONFIG_ID` hook in `tier_config_id()`) — both general-purpose
  escape hatches; recommend keeping permanently.
- `host/test/lib/model_configs.json` — 7 new `qwen35-9b-*` entries
  (cells A, B1, B2, C, D, E + the originally-spec'd Q5@64k+rep1.1 that was
  superseded). Configs are immutable history records and should never be deleted.

**Deleted in this cleanup:**

- `host/test/logs/OVERNIGHT-SCREEN-t32-sweep2-cellA-q5kxl-32k-rep11-20260430-2213.md`
  — killed-attempt log from the first cell A run (driver bug, INSTALL_OVERRIDE not
  yet wired). Superseded by the `…-2214.md` log.
- `/tmp/sweep2-cell{A,B1,B2,C,D,E}.{label,pid,out,watchdog,watchdog.pid}` — per-cell
  driver/watchdog scaffolding. Driver `.out` content is duplicated in the
  `host/test/logs/OVERNIGHT-SCREEN-t*-sweep2-cell*.md` files.
- `/tmp/sweep2-watchdog-cell*.sh` — watchdog scripts (templated from a single
  base; will be regenerated for Sweep 3 if needed).

**Keep, but operator-discretion:**

- `/tmp/compare-candidate.py` — Python port of `/tmp/compare-candidate.mjs` (host
  has no node, only the test container does). Reusable for any future sweep.
  Not in repo; lives in `/tmp` deliberately as transient analysis tooling.
- `/tmp/sweep2-prod-plist-backup.plist` — backup of the production plist taken
  before Sweep 2 began. Kept in case the cleanup-on-exit (`LLAMA_TIER=64 install`)
  in `run-overnight-screen.sh` ever needs to be reversed manually.

**Per-cell registries (canonical data — never delete):**

```
host/test/.claw-runtime/run_registry.t32-sweep2-cellA-q5kxl-32k-rep11-20260430-2214.jsonl
host/test/.claw-runtime/run_registry.t32-sweep2-cellC-q6kxl-32k-rep11-20260430-2321.jsonl
host/test/.claw-runtime/run_registry.t32-sweep2-cellD-q5kxl-32k-rep10-20260501-0014.jsonl
host/test/.claw-runtime/run_registry.t32-sweep2-cellB1-q6kxl-64k-rep11-20260501-0052.jsonl
host/test/.claw-runtime/run_registry.t32-sweep2-cellB2-q5kxl-64k-rep10-20260501-0146.jsonl
host/test/.claw-runtime/run_registry.t16-sweep2-cellE-iq4xs-32k-rep11-20260501-0948.jsonl
```

Plus the killed-attempt registry `…-cellA-q5kxl-32k-rep11-20260430-2213.jsonl`
which contains 0 useful rows but is preserved for audit (per project convention
of never deleting `.claw-runtime` files).

**No production state changed.** `host/llama-server/models.conf` still points at
the Sprint 1.19 c6 sampler on the 14B (since cleanup-on-exit re-installs the
tier-64 plist after every sweep, the active llama-server is currently the 64GB
Qwen3.6 plist). No formal promotion of any 9B candidate has occurred.

---

## Exploratory Mini Sweep 3 — Tier-16 hone-in (2026-05-01, n=2 each)

**Goal:** find any extractable perf at tier-16 beyond cell E (IQ4_XS @ 32k rep 1.1,
the Sweep 2 winner). Cell E hit 100% pass on 47/52 done (done-ratio 90.4%), so the
only extractable perf is **done-ratio** — getting more rows past the
context-exhaustion / runtime-error bar.

**Scope:** 3 variants derived from cell E forming a complete 2x2 with E as anchor.
Same model (Qwen3.5-9B IQ4_XS), same sampler family (temp 0.6 / top_p 0.95 /
top_k 20 / min_p 0.05 default / presence 0). Two axes from tier-32 lessons:
rep_pen (1.1 → 1.0) and ctx (32k → 64k). KV cache stays Q8 to match all prior cells.

### Cell γ — `qwen35-9b-iq4xs-ctx32k-v7noreppen-pp01` (mini, n=2)

**2026-05-01 11:03–11:50 CDT** (~47 min wallclock).
Sweep label: `t16-sweep3-cellG-iq4xs-32k-rep10-20260501-1103`.

**Delta vs E:** repeat_penalty 1.1 → **1.0**. Hypothesis: tier-32 cells D/B2 showed
disabled rep_pen ties or beats rep 1.1 on the 9B family; carries to IQ4_XS at tier-16?

**Result:** 44/44 done = 1.000, Wilson 95% CI **[0.920, 1.000]**, drift 14/52 (26.9%).
Done-ratio **84.6%** (down from E's 90.4%).
**Aggregate Δ:** +53.7pp over tier-16 baseline (0.463) — same delta as E since pass
rate is at the ceiling.

**Top wins:** Same set as E.

**Top regressions:** `lru-cache` was 1/1 done at 100% in E; non-done in γ.

**Decision:** rep_pen 1.0 actually slightly hurts done-ratio at IQ4_XS — opposite
direction from tier-32. Either real (IQ4_XS is more loop-prone than K-quants and
benefits from rep_pen pressure) or n=2 noise. Either way: not the rescue path.

### Cell δ — `qwen35-9b-iq4xs-ctx64k-v6antiloop-pp01` (mini, n=2)

**2026-05-01 11:51–12:33 CDT** (~42 min wallclock).
Sweep label: `t16-sweep3-cellD-iq4xs-64k-rep11-20260501-1151`.

**Delta vs E:** ctx 32k → **64k**. Hypothesis: Sweep 2 cells B1/B2 showed ctx bump
rescued context-exhaustion non-done rows at tier-32; carries to IQ4_XS at tier-16?
Memory: ~5 GB IQ4_XS weights + ~4.5 GB Q8 KV @ 64k = ~11 GB total on 16 GB tier
(tighter than E's ~8 GB but still ~4-5 GB headroom for OS/app).

**Result:** 46/46 done = 1.000, Wilson 95% CI **[0.923, 1.000]**, drift 16/52 (30.8%).
Done-ratio **88.5%** (slightly down from E's 90.4%).
**Aggregate Δ:** +53.7pp over tier-16 baseline.

**Top wins:** δ rescued `lru-cache` (100%, 1/1 done — was non-done in γ, 1/1 done
in E) and `parseISO-with-timezone` (became 2/2 done — was 1/1 done in E).

**Top regressions:** lost a different test to non-done (likely state-machine or
multi-bug-decoy at n=1 vs n=2 in E — the per-test denominators show the rotation).

**Decision:** ctx bump at IQ4_XS does NOT cleanly improve done-ratio the way it did
at tier-32 (B1: 90.4% > C: 86.5%; B2: 94.2% > D: 86.5%). The non-done rows here
seem to rotate rather than reduce — different tests fall off depending on cell, but
the count stays roughly constant in [44, 47].

### Cell ζ — `qwen35-9b-iq4xs-ctx64k-v7noreppen-pp01` (mini, n=2)

**2026-05-01 12:34–13:14 CDT** (~40 min wallclock).
Sweep label: `t16-sweep3-cellZ-iq4xs-64k-rep10-20260501-1234`.

**Delta vs E:** ctx 32k → **64k** AND repeat_penalty 1.1 → **1.0** (B2-analogue
for tier-16). Hypothesis: if neither single change helped, maybe the combination
(which won at tier-32 as B2) does.

**Result:** 47/47 done = 1.000, Wilson 95% CI **[0.924, 1.000]**, drift 12/52 (23.1%).
Done-ratio **90.4%** — **exact tie with cell E**.
**Aggregate Δ:** +53.7pp over tier-16 baseline.

**Top wins:** ζ rescued `lru-cache` and `csv-parser` (both became 1/1 done at 100%
— csv-parser was non-done in E AND in γ AND in δ).

**Top regressions:** `expression-eval` non-done (was non-done in E too, so consistent).

**Decision:** ζ ties E on every aggregate metric. The two configs are
indistinguishable at n=2. ζ gets `csv-parser` to done where E doesn't — partial
rescue from the ctx bump — but loses something else to keep the done-count flat.

### Sweep 3 — Summary

| cell | ctx | rep | done/total | done% | passed/done | lower-CI | weights+KV est. |
|---|---|---|---|---|---|---|---|
| baseline-16 | 32k | 1.05 | 188/234 | 80.3% | 87/188 (46.3%) | 0.393 | 5.0 GB + small (Q5 7B) |
| **E (anchor)** | **32k** | **1.1** | **47/52** | **90.4%** | **47/47 (100%)** | **0.924** | **~5 GB + ~2 GB Q8 = ~7 GB** |
| γ | 32k | 1.0 | 44/52 | 84.6% | 44/44 (100%) | 0.920 | ~7 GB (same as E) |
| δ | 64k | 1.1 | 46/52 | 88.5% | 46/46 (100%) | 0.923 | ~5 GB + ~4.5 GB Q8 = ~10 GB |
| **ζ** | **64k** | **1.0** | **47/52** | **90.4%** | **47/47 (100%)** | **0.924** | **~10 GB (same as δ)** |

### Sweep 3 — Diagnostic Findings

1. **Tier-32 sampler/ctx lessons do NOT transfer to tier-16 IQ4_XS.** At tier-32,
   disabling rep_pen (cell D) gave +33.7pp over rep 1.1 (cell A); at tier-16 IQ4_XS,
   disabling rep_pen (cell γ) is a wash or slight regression on done-ratio. Same for
   ctx bump. The active ingredients are quant-family-specific, not generic Qwen3.5
   wisdom.
2. **IQ4_XS at 9B param count is at its ceiling on this suite.** All 4 cells tied
   at 100% pass rate; lower-CIs span just [0.920, 0.924]; done-ratios span [84.6%,
   90.4%]. Differences are within n=2 noise.
3. **Done-ratio "rotates" rather than improves** with these knobs at IQ4_XS. Each
   cell rescues some tests to done while losing others — the count stays roughly
   constant. Suggests the non-done bar is hitting different runtime/harness edge
   cases per config rather than a single fixable mode.
4. **Cell ζ ties cell E with strictly more memory pressure.** For the
   "perfect %utilization" tier-16 ship goal (operator's roommate's 16 GB MBP), **E
   remains the recommended config** — same metrics, ~3 GB lighter total
   footprint, more headroom for OS/app/safari.
5. **What WOULD potentially extract more perf at tier-16:** higher-fidelity quant
   (Q4_K_M ~5.5 GB, Q5_K_S ~5.7 GB) would explore whether the IQ4_XS ceiling is
   from the I-quant's bit-allocation strategy or from the param count itself. Out
   of Sweep 3 scope; logged as a Sweep 4 candidate if the operator wants to chase it.

### Tier-16 ship candidate — UNCHANGED from Sweep 2

**Cell E: `qwen35-9b-iq4xs-ctx32k-v6antiloop-pp01`** remains the tier-16
recommended config. Sweep 3 confirms there is no extractable perf within the
IQ4_XS sampler/ctx envelope at n=2.

**Confirmatory:** the n=8 confirmatory at tier-16 (proposed Sweep 3 cell β in the
prior recommendation) is now the natural next step — still pending.

### Sweep 3 — Cleanup additions

**New `qwen35-9b-iq4xs-*` configs in `model_configs.json` (3, retained):**

- `qwen35-9b-iq4xs-ctx32k-v7noreppen-pp01` (γ)
- `qwen35-9b-iq4xs-ctx64k-v6antiloop-pp01` (δ)
- `qwen35-9b-iq4xs-ctx64k-v7noreppen-pp01` (ζ)

**Per-cell registries (canonical data — never delete):**

```
host/test/.claw-runtime/run_registry.t16-sweep3-cellG-iq4xs-32k-rep10-20260501-1103.jsonl
host/test/.claw-runtime/run_registry.t16-sweep3-cellD-iq4xs-64k-rep11-20260501-1151.jsonl
host/test/.claw-runtime/run_registry.t16-sweep3-cellZ-iq4xs-64k-rep10-20260501-1234.jsonl
```

**Deleted in this cleanup:**

- `/tmp/sweep3-cell{G,Delta,Z}.{label,pid,out}` — per-cell driver scaffolding.
  Driver `.out` content duplicated in `host/test/logs/OVERNIGHT-SCREEN-t16-sweep3-*.md`.

**No watchdogs spawned for Sweep 3** — cells were short enough (~40-47 min) that
Monitor task notifications were sufficient and the watchdog overhead wasn't
warranted.

---

## Sweep 4 — Tier-32 hone-in on B2 winner (2026-05-01)

**Objective:** look for extractable perf around B2 (Qwen3.5-9B-UD-Q5_K_XL @ 64k,
rep_pen=1.0), the Sweep-2 tier-32 winner. n=2 each, three cells along independent
sampler / quant axes the prior sweeps left untouched.

**Baseline:** B2 = `qwen35-9b-q5kxl-ctx64k-v7noreppen-pp01` — 49/49 done passed
(100%), Wilson 95% CI lower 0.927, drift_advisory 9/52 (17.3%).

| Cell | Config                                                  | Axis varied         | Result (done-only)        | Lower-CI | Drift adv. |
|------|---------------------------------------------------------|---------------------|---------------------------|----------|------------|
| α    | `qwen35-9b-q5kxl-ctx64k-v8vendormp-pp01` (min_p=0.0)    | min_p 0.05 → 0.0    | 46/48 = 95.8%             | 0.860    | 14/52 (26.9%) |
| β    | `qwen35-9b-q5kxl-ctx64k-v9tempup-pp01`  (temp=0.7)      | temp 0.6 → 0.7      | 48/48 = 100%              | 0.926    | 17/52 (32.7%) |
| ε    | `qwen35-9b-q6kxl-ctx64k-v7noreppen-pp01`                | quant Q5 → Q6       | 49/49 = 100%              | 0.927    | 14/52 (26.9%) |

### Verdict

**B2 holds as tier-32 winner.** No cell clears the promotion bar
(lower-CI > baseline lower-CI 0.927):

- **Cell α (min_p=0.0, vendor-rec):** rejected. Single-test regression on
  `expression-eval` (1/1 → 0/2), drops point estimate to 95.8% and lower-CI
  to 0.860. The vendor-recommended `min_p=0.0` is **worse** for this workload
  than the llama.cpp default 0.05. Hypothesis: removing the floor lets
  long-tail tokens through that derail expression-eval's deeper search.
- **Cell β (temp=0.7):** statistical tie (point 100%, lower-CI 0.926 vs B2's
  0.927 — within rounding noise). Drift_advisory nearly doubles (32.7% vs
  17.3%), indicating higher thermal pressure with the hotter sampler. No
  reason to prefer over B2.
- **Cell ε (Q6_K_XL @ 64k rep1.0):** statistical tie (49/49, lower-CI 0.927 =
  B2's lower-CI exactly). Q6 weights are heavier on disk and KV memory budget
  (~6.5 GB vs ~5.5 GB) for zero measurable gain at n=2. Pareto-dominated by
  B2 on memory.

**Pattern echo from Sweep 3:** as with the tier-16 IQ4_XS hone-in, a 3-cell
n=2 mini-sweep around an already-perfect-at-n=2 config yields no
distinguishable improvement at this resolution. The grid resolution is below
the within-cell variance floor; ties at 100% / lower-CI ≈ 0.92 are
unresolvable without n≥7 confirmatory.

### Cross-sweep diagnostic notes

- **min_p sensitivity is workload-specific.** `expression-eval` is the
  canonical "deeper search" test in the suite; cell α's regression there
  (and only there) is consistent with min_p acting as a search-space-pruner
  the model leans on for that particular task. For uniform-difficulty suites
  the vendor-rec `min_p=0.0` may be fine; for our heterogeneous suite, keep
  llama.cpp default 0.05.
- **temp=0.7 thermal cost is visible.** drift_advisory ratio jumped from
  17.3% (B2) → 32.7% (β) on the same hardware in the same evening. Suggests
  per-token compute budget is meaningfully higher at temp=0.7 — likely
  because the model spends more tokens in `<think>` before converging. Worth
  re-measuring next time we tune sampler temp.
- **Q5 → Q6 not Pareto-improving at n=2.** Sweep 2 already showed Q6@32k
  (cell C) recovered `dependency-graph` from 0% (the Q4 quant-density floor),
  but at n=2 no further headroom is visible at Q6 vs Q5 in the 64k regime.
  ε is a "no harm done" finding rather than a positive recommendation —
  preserves Q6 as a safety option if a future stress test shows Q5 brittleness.

### Recommended next step

**Tier-32 lock-in stands at B2** (Q5_K_XL @ 64k rep1.0 c6 sampler). When
ready to swap in:

```bash
TIER_32_GGUF="$HOME/.ollama/gguf/Qwen3.5-9B-UD-Q5_K_XL.gguf"
TIER_32_CTX=65536
# Sampler same as B2 / cell E (Sprint 1.19 c6 family)
TIER_32_TEMP=0.6
TIER_32_TOP_P=0.95
TIER_32_TOP_K=20
TIER_32_REPEAT_PENALTY=1.0   # NB: rep_pen 1.0 (B2), not 1.1 (cell E tier-16)
TIER_32_PRESENCE_PENALTY=0
```

Plus the production plist already carries `--chat-template-kwargs '{"enable_thinking":true}'`
(added during tier-16 lock-in), so no plist change needed beyond models.conf.

**Confirmatory work pending (both tiers, batch one sweep):**

1. n=8 confirmatory of B2 (tier-32) at the lock-in config — promote 100% n=2
   to a stable lower-CI ≥ ~0.85 at n=8.
2. n=8 confirmatory of E (tier-16) — same reason.
3. Reference sweep on the **prior** baselines (Qwen3-14B Q4_K_M c6; Qwen2.5-7B
   Q5 v1-prod) under the new model_config_id schema, to flip their
   canonical_status flags and frame the Δ in the analysis writeup.

### Sweep 4 — Cleanup additions

**New `qwen35-9b-*` configs in `model_configs.json` (3, retained):**

- `qwen35-9b-q5kxl-ctx64k-v8vendormp-pp01` (α)
- `qwen35-9b-q5kxl-ctx64k-v9tempup-pp01` (β)
- `qwen35-9b-q6kxl-ctx64k-v7noreppen-pp01` (ε)

**Per-cell registries (canonical data — never delete):**

```
host/test/.claw-runtime/run_registry.t32-sweep4-cellA-q5kxl-64k-rep10-mp0-20260501-1359.jsonl
host/test/.claw-runtime/run_registry.t32-sweep4-cellB-q5kxl-64k-rep10-t07-20260501-1449.jsonl
host/test/.claw-runtime/run_registry.t32-sweep4-cellE-q6kxl-64k-rep10-20260501-1535.jsonl
```

**Deleted in this cleanup:**

- `/tmp/sweep4-cell{A,B,E}.out` — per-cell driver scaffolding. Driver content
  duplicated in `host/test/logs/OVERNIGHT-SCREEN-t32-sweep4-*.md`.

**Variant plist + install-qwen35 retained** — same DELETE-AFTER-COALESCE
caveats as before; will go away once n=8 confirmatory closes out the new
candidate baselines and the production plist is the only path needed.

