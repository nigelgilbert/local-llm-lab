# Memo: tier-16 / tier-32 N=8 confirm vs Sprint 1.18 baseline — 2026-05-02

## TL;DR

Both new tier configs (Qwen3.5-9B unified across tiers) crush the
Sprint 1.18 deep-N=8 baseline (mixed Qwen2.5-7B / Qwen3-14B). Done-only
pass rates jumped from 46.3% → 98.3% on tier-16 and 33.5% → 99.5% on
tier-32. The 1.18 t16↔t32 Pareto inversion is gone; t32 now cleanly
dominates t16 on both metrics. Most failures are now non-content
(harness errors on t16, timeouts on t32), and the 26-test pack is
hitting its ceiling — discrimination work needs a harder pack, not more
reps.

## Configurations under test

| tier | baseline (Sprint 1.18) | new (Sprint 1.19 confirm) |
|---|---|---|
| t16 | Qwen2.5-7B Q5_K_M @ 32k, baseline sampler | Qwen3.5-9B IQ4_XS @ 32k, sampler `v6antiloop-pp01` (rep11) — `qwen35-9b-iq4xs-ctx32k-v6antiloop-pp01` |
| t32 | Qwen3-14B Q4_K_M @ 32k, baseline sampler | Qwen3.5-9B Q5_K_XL @ 64k, sampler `v7noreppen-pp01` (rep10, cell B2) — `qwen35-9b-q5kxl-ctx64k-v7noreppen-pp01` |

Both new runs: 26 tier-eval tests × 8 reps = 208 attempts each, split
across two N=4 chunks ([t16 chunk1](../.claw-runtime/run_registry.t16-confirm-n4-chunk1-e-iq4xs-32k-rep11-20260501-2152.csv),
[t16 chunk2](../.claw-runtime/run_registry.t16-confirm-n4-chunk2-e-iq4xs-32k-rep11-20260502-0044.csv),
[t32 chunk1](../.claw-runtime/run_registry.t32-confirm-n4-chunk1-b2-q5kxl-64k-rep10-20260501-1841.csv),
[t32 chunk2](../.claw-runtime/run_registry.t32-confirm-n4-chunk2-b2-q5kxl-64k-rep10-20260501-2307.csv)).

## Headline numbers

### Tier-16

| metric | baseline (1.18) | new N=8 | Δ |
|---|---|---|---|
| pass-rate (all attempts) | 37.2% [31.2, 43.5] | **84.6%** (176/208) | **+47.4 pp** |
| done-only pass | 46.3% | **98.3%** (176/179) | **+52.0 pp** |
| harness-error rate | drift advisory 31% | 13.5% (28/208) | substantially reduced |
| timeouts | — | 0.5% (1/208) | — |

### Tier-32

| metric | baseline (1.18) | new N=8 | Δ |
|---|---|---|---|
| pass-rate (all attempts) | 31.2% [25.3, 37.8] | **88.9%** (185/208) | **+57.7 pp** |
| done-only pass | 33.5% | **99.5%** (185/186) | **+66.0 pp** |
| harness-error rate | drift advisory 26% | 2.9% (6/208) | nearly eliminated |
| timeouts | — | 7.7% (16/208) | new dominant failure mode |

## Interpretation

- **t16↔t32 plateau is gone.** 1.18 was the headline finding that t16
  (46.3% done-only) *beat* t32 (33.5%) — a Pareto inversion that
  drove the manifesto framing of t32 as "instruction-following tier
  that doesn't dominate." Under the new configs, t32 (99.5%) > t16
  (98.3%) on done-only and 88.9% > 84.6% on all-attempts. The
  manifesto framing is now false and should not ship to leadership in
  Sprint 2 in its current form.
- **Most of the gain is the model swap, not the sampler tuning.**
  Going from per-tier mixed models (Qwen2.5-7B / Qwen3-14B) to a
  unified Qwen3.5-9B base lifted the floor across both tiers. The
  per-tier sampler/quant/context tuning (rep10/rep11, IQ4_XS @ 32k vs
  Q5_K_XL @ 64k) sits on top of that lift.
- **Failure modes have shifted.** t16 is now bottlenecked by harness
  errors (28/208 = 13.5%) — protocol/parse failures, not test-content
  failures. t32 has nearly eliminated errors (6/208 = 2.9%) but
  inherits 16/208 = 7.7% timeouts from the longer 64k context. When
  t32 finishes, it is correct 99.5% of the time; it now fails by
  running out of clock, not by being wrong.
- **Discrimination caveat — ceiling effect.** With both tiers ≥84% on
  all-attempts and ≥98% done-only, headroom on the current 26-test
  pack is compressed. Wilson 95% CIs on per-cell pass rates will
  overlap on most cells, defeating the discrimination matrix
  objective. This is the ceiling-effect risk EVAL-DESIGN flagged. The
  next move is a harder pack (or carve-out of a hidden-holdout
  difficulty extension), not more reps on the current pack.

## Recommended next actions

1. Update [`TIER-EVAL-V2-SPRINT-PLAN.md`](TIER-EVAL-V2-SPRINT-PLAN.md)
   row 1.19 with the lock-in result and flip the manifesto-framing
   line in row 1.18 to "superseded by Sprint 1.19 confirm."
2. Triage t16 harness errors (28 across 208) — if they cluster on a
   small set of test_ids they are protocol-level fixes, not capability
   gaps; that recovers most of the 84.6 → 98.3 pp gap on all-attempts.
3. Open a Sprint 1.20 ticket for a difficulty-extension test pack
   before publishing the discrimination matrix in Sprint 2 — current
   pack saturates.

## Provenance

- Source rows: `host/test/.claw-runtime/run_registry.t{16,32}-confirm-n4-chunk{1,2}-*.csv`
- Baseline rows: `host/test/.claw-runtime/run_registry.eval8-trimmed-20260429-2240.csv`
  (Sprint 1.18, see [`TIER-EVAL-V2-SPRINT-PLAN.md`](TIER-EVAL-V2-SPRINT-PLAN.md) row 1.18)
- Test pack: 26 tier-eval tests, unchanged between baseline and
  confirm.