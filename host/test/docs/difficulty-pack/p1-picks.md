# P1 — Locked Aider/Exercism Picks

**Stream:** P1 (external port, mutation-defended)
**Source:** [Aider polyglot JavaScript subset](https://github.com/Aider-AI/polyglot-benchmark/tree/main/javascript/exercises/practice) — 49 Exercism JS exercises
**Date locked:** 2026-05-02
**Pilot status:** pre-pilot

---

## Research disclosure

Per-exercise pass-rate data was **not publicly available** for Qwen3-coder-class models. Aider's leaderboard exposes only aggregate scores (Qwen3-235B-A22B = 59.6% pass@2 over 225 cases). All 7 picks below carry "Aider pass rate: unknown — proceed-blind" and rely on N=5 pilot to confirm the 30–60% discriminative-middle target.

Aggregate Qwen3 ranges seen on Aider leaderboards:
- Qwen3-32B: 40.0–45.8%
- Qwen3-235B: 49.8–59.6%

Per the spec_precision/stateful_logic/convergence axis weighting, the 7 picks are 4 + 2 + 1 respectively.

---

## Locked picks

| Rank | Slug | Difficulty | Primary axis | License | Risk profile |
|---|---|---|---|---|---|
| 1 | [`book-store`](https://github.com/exercism/javascript/tree/main/exercises/practice/book-store) | 5 | spec_precision | MIT | Contamination — Harry Potter / Cyber-Dojo source ⚠️ |
| 2 | [`wordy`](https://github.com/exercism/javascript/tree/main/exercises/practice/wordy) | 7 | spec_precision | MIT | Clean |
| 3 | [`alphametics`](https://github.com/exercism/javascript/tree/main/exercises/practice/alphametics) | 7 | spec_precision | MIT | Classic but workable |
| 4 | [`word-search`](https://github.com/exercism/javascript/tree/main/exercises/practice/word-search) | 8 | spec_precision | MIT | Floor risk on t16 (highest-difficulty pick) |
| 5 | [`forth`](https://github.com/exercism/javascript/tree/main/exercises/practice/forth) | 8 | stateful_logic | MIT | Clean |
| 6 | [`grade-school`](https://github.com/exercism/javascript/tree/main/exercises/practice/grade-school) | 5 | stateful_logic | MIT | Ceiling risk on t32 (lowest-difficulty pick) |
| 7 | [`two-bucket`](https://github.com/exercism/javascript/tree/main/exercises/practice/two-bucket) | 6 | convergence | MIT | Contamination — classic water-jug AI textbook problem ⚠️ |

### Per-pick rationale

**1. book-store** (spec_precision) — Discount-tier rules with a non-greedy `4+4 > 3+5` grouping edge case that defeats naive greedy implementations. Tests rule interpretation and edge-case completeness. *Contamination defense:* mutate from books-by-author to packages-by-tier (or similar non-narrative domain), shift discount values, add a 6th tier. R8 enforcement strict.

**2. wordy** (spec_precision) — Constrained English-arithmetic parser ("What is 5 plus 13?") with invalid-syntax and operator-precedence traps. Less famous than `poker` or `zebra-puzzle` so lower contamination baseline. Strong axis fit.

**3. alphametics** (spec_precision) — Classic cryptarithmetic constraint solve with bijective digit mapping, leading-zero bans, equation satisfiability. Heavy GitHub fork count → mutation must rename letter sets and shift constraints aggressively.

**4. word-search** (spec_precision) — Coordinate precision across all 8 directions, reversals, absent-word handling. Difficulty 8; floor risk acknowledged. *Pivot path:* if t16 = 0/5 in pilot, swap with `ledger` (runner-up).

**5. forth** (stateful_logic) — Stack-based interpreter with user-defined word redefinition and case-insensitive execution. Strong stateful_logic probe; redefinition semantics catch models that confuse parse-time vs. run-time binding. Clean (less famous than other Forth implementations in training data because the Exercism version has specific conventions).

**6. grade-school** (stateful_logic) — Roster mutation across adds, sorted-reads, and duplicate handling. Difficulty 5; ceiling risk if it saturates. *Pivot path:* if t32 > 60% in pilot, swap with `robot-name` (runner-up).

**7. two-bucket** (convergence) — Classic water-jug problem (BFS over state space). Iteration-to-correct-edge-cases framing fits convergence axis: feedback reveals off-by-one move counts, start-bucket constraints, unreachable cases. *Contamination defense:* rename buckets, use non-canonical capacities (avoid the textbook `(3,5,4)` triple), modify the "starts-with" output requirement.

---

## Runner-up bench

In priority order (swap-in if a primary pick fails pilot):

| Slug | Difficulty | Best for | Notes |
|---|---|---|---|
| [`ledger`](https://github.com/exercism/javascript/tree/main/exercises/practice/ledger) | (unverified) | spec_precision / convergence | Locale-aware currency/date formatting; many independent edge cases. Difficulty integer not pinned in fetched configs at lock time. |
| [`robot-name`](https://github.com/exercism/javascript/tree/main/exercises/practice/robot-name) | 6 | stateful_logic | Swap target if `grade-school` saturates. Risk: randomness/uniqueness tests can be flaky. |
| [`zebra-puzzle`](https://github.com/exercism/javascript/tree/main/exercises/practice/zebra-puzzle) | 7 | spec_precision | Classic but heavily memorized; demoted from primary. Use only if a constraint-puzzle slot opens. |
| [`poker`](https://github.com/exercism/javascript/tree/main/exercises/practice/poker) | (unverified) | spec_precision | Hand-ranking + kicker tiebreaks; demoted due to general poker-rule training exposure. |

---

## Demoted from original shortlist

| Slug | Why demoted |
|---|---|
| `bowling` | Heavy contamination: Uncle Bob's TDD canonical example, in dozens of textbooks. R8 audit would require near-total redesign. |
| `palindrome-products` | Weak axis fit: more "performance optimization" than "convergence" in our taxonomy. Naive impl times out, but iteration-to-correct-edge-cases pattern is thin. |
| `poker` (shortlist) | Heavy domain-knowledge contamination via Udacity Intro to CS materials; even with renaming, the underlying problem is recalled. |
| `zebra-puzzle` (shortlist) | Constraint-puzzle classic; very high training-set exposure; likely exceeds 10-min hand-solve target. |

---

## Mutation specs

Per-pick mutation specs (rename map, edge-case shifts, return-shape changes) live in [`mutations.md`](mutations.md). HEAVY mutations: `book-store`, `alphametics`, `two-bucket` (contamination-flagged). STANDARD: `wordy`, `word-search`, `forth`, `grade-school`. Each spec includes a verifier-sanity table to hand-verify before commit and a mutation-depth gate that flags when to revert if pilot trips R4 (`passed=null` > 20%).

Open question for staff-scientist review (per [`PLAN.md`](PLAN.md) §Open questions Q3): if mutation drifts into "newly-authored-inspired-by," should we relabel the source as `inspired_by` rather than `adapted_from`?

## R8 calibration check (pilot dependency)

After N=5 pilot, any pick with t16 pass rate ≥ 70% triggers a memorization audit:
1. Hand-inspect the model's produced solution against the Exercism canonical reference.
2. If structurally identical → mutate harder, rerun pilot.
3. Repeat or reject.

Particularly relevant for `book-store`, `alphametics`, and `two-bucket` — the picks with explicit contamination flags.
