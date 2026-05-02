# Difficulty Pack — Sprint 1.21

**Status:** proposal, pre-implementation
**Date:** 2026-05-02
**Audience:** PMs, leadership, ML reviewers, stakeholders
**For engineers:** see [`PLAN.md`](PLAN.md) for the full implementation plan.

---

## TL;DR

Our 26-test capability evaluation pack has saturated against our current models — both compute tiers score 98–99% on it, leaving no room to compare them. Without that signal, the matrix we plan to publish in Sprint 2 (the credible "what does each tier cost vs. deliver?" artifact) loses its meaning. **This pack adds 12 harder tests** sourced and authored to land in the discriminative middle (50–85% pass rate), restoring the matrix's ability to distinguish tiers.

---

## The problem

Sprint 1.19 unified our two production tiers (t16, t32) on a Qwen3.5-9B model with per-tier tuning. Confirmation runs at N=8 reps:

| Tier | Pass rate (all attempts) | Pass rate (when run completed) |
|---|---|---|
| t16 (cheaper, faster) | 84.6% | **98.3%** |
| t32 (richer context) | 88.9% | **99.5%** |

This is excellent for the models — and **bad for evaluation.** Both tiers are pinned at the ceiling of our current test pack. Statistical confidence intervals at this pass rate are too wide to declare meaningful differences between tiers. The information that would let us compare tiers is no longer in the data.

Sprint 1.18, with weaker models, showed only 3/26 tests separating the tiers. Under the new strong models, the separation is essentially zero. **More test repetitions cannot recover this** — the pack itself is too easy.

## The goal

Sprint 2 ships `discrimination_matrix_v1.csv` — the artifact that lets leadership answer:

- **Where does t32 actually deliver capability that t16 cannot?**
- **Which tasks degrade gracefully with cheaper compute, and which fall off a cliff?**
- **What's the per-task confidence on these claims?**

For that matrix to be credible, it needs cells where the pass rate sits in the **discriminative middle** (50–85%) — high enough to show capability, low enough that compute differences move the needle. This pack delivers those cells.

## The approach

12 new tests across three sourcing streams, each with a different contamination posture:

| Stream | Count | Source | Why |
|---|---|---|---|
| **P1 — Adapted** | 7 | JavaScript subset of the Aider polyglot benchmark (Exercism exercises) | Strong external citation; calibrated against an industry-standard leaderboard; mutated for contamination resistance (rename variables, shift edge cases, change return shapes) |
| **P2 — Provably-novel** | 1 | AtCoder competitive-programming problem from March 2026 | Released **after** our model's training was complete — hard guarantee no contamination is possible. Acts as a contamination-detection signal: if Stream P1 systematically passes higher than P2 on similar capabilities, that's evidence the P1 tests are leaking. |
| **H — Hand-authored** | 4 | Designed in-house to probe failure modes external benchmarks underweight | Long-horizon convergence (8-step bug cascades), multi-file refactors with circular dependencies, dense-spec grammar parsers, plus one post-pilot gap-filler |

**Locked P1 picks** (after deep-research review): `book-store`, `wordy`, `alphametics`, `word-search` (all spec_precision); `forth`, `grade-school` (stateful_logic); `two-bucket` (convergence). Full picks-and-rationale trail in [`p1-picks.md`](p1-picks.md).

**Locked P2 pick:** AtCoder ARC 216 C "Count Power of 2" (2026-03-22). Sourcing decision trail in [`p2-decision.md`](p2-decision.md).

## Key decisions and tradeoffs

| Decision | What we chose | What we gave up |
|---|---|---|
| **Sourcing strategy** | External ports first, hand-author only the gaps | Pure hand-authored gives stronger contamination control but quadruples authoring effort and weakens external-reviewer defensibility |
| **Volume** | 12 tests (not 16+) | Larger packs would give finer axis coverage but bloat the pilot calibration cycle |
| **Tier comparison** | t16 vs t32 only (skip t64) | t64 currently runs a different model family (Qwen3.6-35B) so cross-tier comparisons would mix variables. t64 model unification is a future sprint |
| **Difficulty axis** | Existing 5 coding axes only (no productivity, no library-API) | Productivity tests need a grader-calibration prerequisite (Sprint 3). Library-API tests would require npm dependencies in the test container, against intentional design |
| **Contamination defense** | Per-port mutation (P1) + post-Feb-2026 sourcing (P2) | Heavier mutation reduces transfer signal from upstream benchmark; provably-novel sourcing is high-overhead per problem |
| **P2 stream sizing** | 1 port instead of original 2 | Manual statement-fetching from contests has practical limits; redirected the second slot to in-house hand-authored content |
| **Calibration gate** | N=5 pilot per test before commit, with 8 reject criteria | Slightly slower than commit-now-iterate-later, but prevents publishing a matrix with cells calibrated against memorized solutions |
| **Sprint 2 sample size** | N=60 per cell (re-derived) | Original V2 plan footnote suggested N=40; we recomputed against the actual capability gap target (Δ=25pp) and bumped it. Roughly +50% compute cost in Sprint 2, but eliminates "we can't statistically support this" risk |

## Risks (and what we're doing about them)

1. **Contamination** — Exercism content has been on GitHub since 2013 and is almost certainly in our model's training data. *Mitigation:* mandatory mutation pass + memorization audit on any port that passes >70%; one P2 port sourced after the model's training cutoff acts as a contamination-detection control.
2. **Saturation overshoot** — picking too-hard problems lands them all at 0% pass rate. *Mitigation:* targeted at the discriminative middle on external leaderboard data; 5-rep pilot with rejection criteria before commit.
3. **Ceiling re-creation** — picking too-easy problems repeats the original problem. *Mitigation:* explicit reject criterion at >85% pass rate.
4. **Statistical credibility** — earlier draft had a ~2× math error in confidence-interval calculations. *Mitigation:* numbers re-derived from first principles; cited primary literature (ICML 2025 position paper on small-sample LLM evaluation).

## Timeline

- **Authoring** (no GPU required): ~2 weeks single-author, ~1 week with three parallel streams
- **Pilot calibration** (3–7 GPU-hours): one-to-three sessions of N=5 reps per test on each tier
- **Reject-and-iterate**: budget ~25% of tests requiring a second pilot pass
- **Total to ship**: 2–3 weeks from authoring start

This is a **hard gate** for Sprint 2. The discrimination matrix cannot ship without it.

## Open questions for stakeholder review

1. Is N=60 per cell the right Sprint 2 confirmatory target, or should we measure paired-seed correlation in the pilot and adjust downward to N=45–50?
2. Should the P2 stream be expanded (more provably-novel ports) given the contamination-detection value? Tradeoff: each additional P2 port is high authoring overhead.
3. How aggressive should P1 mutation be? Heavier mutation = stronger contamination defense but blurs the line between "ported test" and "newly-authored-inspired-by test."
4. The discrimination matrix is intended for leadership consumption. Should the published artifact include per-cell contamination provenance ("this cell's pass rate may include memorization")?

## Document index

- [`PLAN.md`](PLAN.md) — engineering implementation plan (test composition, calibration protocol, statistical sizing, harness affordances, execution order)
- [`p1-picks.md`](p1-picks.md) — locked Aider/Exercism picks with research rationale and runner-up bench
- [`p2-decision.md`](p2-decision.md) — full P2 sourcing trail (LCB rejection, candidate evaluations, why one port not two)
- [`mutations.md`](mutations.md) — per-pick mutation specs (rename maps, edge shifts, return-shape changes) for the 7 P1 ports
- [`authoring-template.md`](authoring-template.md) — canonical `.test.js` pattern, manifest field reference, per-stream variations
- [`canonicals/`](canonicals/) — read-only Exercism upstream snapshot for the 7 P1 picks (R8 audit reference)
- [`memos/n8-confirm-vs-baseline.md`](memos/n8-confirm-vs-baseline.md) — the saturation finding that motivated this pack
- [`memos/aider-calibration-note.md`](memos/aider-calibration-note.md) — Aider per-exercise data unavailable; aggregate Qwen3 numbers calibrate the discriminative-middle assumption
- [`memos/standardtest-helper.md`](memos/standardtest-helper.md) — deferred-architecture rationale (test-helper refactor, sequenced for Sprint 1.22 or 1.23)

## External references

- [Bowyer, Aitchison, Ivanova. ICML 2025 position paper on LLM eval sample sizes (arXiv:2503.01747)](https://arxiv.org/abs/2503.01747)
- [Aider polyglot benchmark](https://aider.chat/docs/leaderboards/)
- [LiveCodeBench (considered, rejected)](https://livecodebench.github.io/)
- [AtCoder](https://atcoder.jp/) — P2 source
