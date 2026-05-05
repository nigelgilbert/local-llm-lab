# Difficulty Pack

A 12-test extension to the tier-eval suite, authored over Sprint 1.21 (May 2026) to restore discrimination between two production compute tiers after the existing pack saturated.

## Why this exists

Sprint 1.19 unified the two production tiers (t16 cheaper/faster, t32 richer-context) on a Qwen3.5-9B base with per-tier sampler/quant/context tuning. An N=8 confirmation run on the existing 26-test pack scored:

| Tier | Pass rate (all attempts) | Pass rate (when run completed) |
|---|---|---|
| t16 | 84.6% | 98.3% |
| t32 | 88.9% | 99.5% |

Excellent for the models. Useless for evaluation. At p=0.99, N=8, Wilson 95% confidence intervals are nearly degenerate — both tiers are pinned at the ceiling and the tests can no longer separate them. Sprint 1.18, with worse models, had only 3/26 cells separating the tiers; the new configs zero that out. More repetitions don't help: the information isn't there to recover.

Sprint 2's headline deliverable is `discrimination_matrix_v1.csv` — a per-task readout of where t32 actually buys capability that t16 can't deliver, and where it doesn't. For that matrix to mean anything, it needs cells where the underlying pass rate sits in the *discriminative middle* (roughly 50–85%): high enough that the model is mostly competent, low enough that compute differences move the needle. This pack delivers those cells.

## The approach

Three sourcing streams, balancing contamination risk against authoring cost:

**P1 — Adapted from Exercism (7 tests).** The Aider polyglot benchmark is a hand-curated set of Exercism problems with public per-language pass rates. We sourced from its JavaScript subset, filtered to problems where Qwen3-coder-class models score 30–60% on Aider's leaderboard (the discriminative middle, not the floor), and hand-translated each one to our npm-free `node:test` runtime. Every port got a mutation pass — renamed functions, shifted edge cases, modified return shapes — to defeat memorization on Exercism content that's been on GitHub since 2013. Picks: `book-store`, `wordy`, `alphametics`, `word-search`, `forth`, `grade-school`, `two-bucket`.

**P2 — Provably post-training (1 test).** A port of AtCoder ARC 216 C "Count Power of 2", released 2026-03-22 — five weeks after Qwen3.5's training freeze. Hard guarantee no contamination is possible. Acts as a contamination-detection control: if the P1 ports systematically pass higher than P2 on similar capabilities, that's evidence the mutation pass wasn't strong enough. Statement was relaxed (N≤100 instead of N≤2×10⁵) to admit a brute-force `BigInt` solution within the 10-min hand-solve rule, so the test probes spec precision rather than algorithmic ingenuity. We considered LiveCodeBench instead but rejected it: LCB v6 tops out at April 2025, fully pre-Qwen3.5; it can prove "released before model shipped" but not "released after training data was frozen."

**H — Hand-authored (4 tests).** Failure modes external benchmarks underweight: an 8-step bug cascade (`cascade-eight`) for long-horizon iteration fatigue, a 12-file refactor threading two parameters (`twelve-file-refactor`) for multi-file navigation, a dense-spec SemVer-range parser (`semver-range`) for spec precision, and an INI parser (`ini-parser`) as a state-machine probe.

Each candidate had to clear two gates. First, a hand-solve audit: the author solves the task from `prompt + seed alone` in under 10 minutes. Tests that miss the rule get classified `frontier` (a Layer-D reserve, not in the core matrix). Second, a pilot calibration at N=5 per tier with eight reject criteria: no floor/ceiling on either tier (R1), no timeout storms (R2), no harness errors (R3), no uninterpretable-result rate over 20% (R4), no retry-storms past p90 of 25 iterations (R5), no t32 saturation above 85% (R6), no hand-solve violations or seed leaks (R7), and no structural match against the canonical Exercism solution on any port that passes ≥70% on t16 (R8 — memorization audit).

Sprint 2 confirmatory sizing: N≈60 per cell, re-derived from a Newcombe-Wilson power calculation against a 25pp capability-gap target. The original sprint plan footnoted N=40; we cashed in the plan's "n=40 is a starting point, not a power guarantee" caveat and bumped it.

## What actually happened

Pilot calibration ran in four cycles between 2026-05-02 and 2026-05-04. The picture that came out of it was messier than the proposal predicted, in instructive ways.

**Cycles 1–2 — the saturation knife.** Three tests floored at 0% on both tiers despite clearing the 10-min hand-solve rule: `alphametics`, `forth`, and `semver-range` (the last already classified frontier at audit time). The 10-min rule turned out to be necessary but not sufficient for "in-band for current Qwen3.5-9B at t16/t32" — the empirical floor sits higher than author hand-solvability. All three relocated to a `frontier/` reserve as documented capability gaps.

The hand-authored gap-fillers had the opposite problem. `cascade-eight` and `twelve-file-refactor` saturated at 100% on both tiers. We aimed too low on long-horizon convergence and too low on multi-file scale. Both filed as ceiling probes; sibling difficulty-bumps (12-step cascade, 18-file refactor) noted but not authored this sprint.

**Cycle 3 — the ctx-overflow surprise.** Two ports — `book-store` and `two-bucket` — produced a clean t32-passes / t16-fails pattern, but the t16 failures weren't algorithmic. They were `ctx_overflow_400` errors from llama-server: the model needs more turns to converge at IQ4_XS quant than at Q5_K_XL, which trips the t16 32k context ceiling before the model gets to a working solution. The original keep-band would have rejected these as floor (R1) on t16. They are not floor — they are discriminating on a different axis: per-turn context efficiency.

We added a new classifier, R9-A (`ctx_discriminator`), to the calibration protocol: a cell qualifies if one tier passes cleanly ≥66% and the other tier hits ≥66% legitimate `ctx_overflow_400`, with a transient-noise filter to exclude bridge SSE drops that look superficially similar but aren't real model behavior. R9-B (`ctx_floor`) catches cells that overflow on both tiers — frontier, not discriminating. The verification gate now reads "pass-rate keep-band cells ∪ R9-A cells, target ≥6."

**Cycle 4 — needle-haystack.** With the ctx-efficiency axis newly legible, we authored one more test specifically to probe it: a needle-in-a-haystack retrieval task across 30 small JS files (~45kb total), exactly one of which exports the target value at line 47. Hand-solve is trivial (`grep -rn`), so the test isn't measuring algorithmic skill — it's measuring whether the per-turn token economy at t16 vs t32 trips the ctx ceiling on the harder-to-fit quant before the model finds the file.

## Where it landed

After cycles 1–4, the live pack:
- 5 P1 ports active (`book-store`, `wordy`, `word-search`, `grade-school`, `two-bucket`); 2 relocated to frontier (`alphametics`, `forth`)
- 1 P2 port (`count-power-of-two`) — saturated at 100%/100% on relaxed-N, kept as ceiling probe; the post-Feb-2026 contamination defense itself was sound and is now a tool we have
- 4 H tests in core (`cascade-eight`, `twelve-file-refactor`, `ini-parser`, `needle-haystack`); 1 H frontier (`semver-range`)

The cycle-by-cycle reframe added more methodology than the proposal anticipated. The R9 ctx-efficiency axis didn't exist before this sprint and now it does.

Sprint 2 takes this pack to N=60 per cell and produces the discrimination matrix. This pack is a hard gate for that matrix; without cells in the discriminative middle, the matrix is decorative.

## Things that didn't make it (and why)

- **Productivity / rubric-judged tests** — deferred to Sprint 3. Needs grader-human calibration as prerequisite.
- **Library-API axis (BigCodeBench-style)** — would require npm dependencies in the test container, against the deliberate npm-free Dockerfile design.
- **Hidden-holdout siblings** — Sprint 4 territory. Public tests authored here may get hidden siblings later; not authoring both at once.
- **t64 tier comparison** — t64 still runs Qwen3.6-35B-A3B (a different model family). Cross-tier comparisons would mix variables. Single-family unification is its own future sprint.
- **Multi-SWE-bench JS/TS integration** — npm-install workspace adapter is real harness work, orthogonal to this gate.
- **A second P2 port** — manual contest-statement fetching is high-overhead; the second slot redirected to hand-authored content. The single P2 still serves the contamination-detection purpose.

## What we learned

- **Hand-solve time is a weak proxy for model difficulty.** A test the author solves in 8 minutes can still be a 0% floor for the model. Pilot earlier and harder; don't trust the 10-min rule as a difficulty estimator, only as a sanity floor.
- **Discrimination axes can be invisible at proposal time.** The ctx-efficiency axis (R9) emerged from cycle-3 evidence and required a real rethink of the keep-band. Calibration that only looks at pass rate misses architectural differences that surface as error-class differences.
- **Saturation is a moving target.** Tests sized for the previous model are obsolete one tier-config sprint later. The 26-test pack went from informative (Sprint 1.18) to ceiling-pinned (Sprint 1.19) in a single sprint.
- **Memorization risk on legacy Exercism content is real but mutable.** R8 didn't fire on any port at >70% t16 in this sprint, but the discipline of having the check is what makes inclusion defensible.

## External references

- [Bowyer, Aitchison, Ivanova. *Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints.* ICML 2025 (arXiv:2503.01747)](https://arxiv.org/abs/2503.01747) — informs the N=60 confirmatory sizing
- [Aider polyglot benchmark](https://aider.chat/docs/leaderboards/) — P1 source
- [AtCoder](https://atcoder.jp/) — P2 source
- [LiveCodeBench](https://livecodebench.github.io/) — considered as a P2 alternative and rejected; cutoff predates Qwen3.5
