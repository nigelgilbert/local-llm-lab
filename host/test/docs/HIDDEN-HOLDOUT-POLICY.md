# Hidden-holdout policy (Sprint 0.8)

**Date:** 2026-04-29
**Status:** Decision document. No holdouts authored yet — that work belongs
to Sprint 4 (Stage 0–4 model-trial protocol). This document codifies *how*
hidden holdouts will be stored, rotated, used, and protected, so that
Sprint 4 inherits a clear contract and the next model trial does not enter
through ad-hoc tuning.

**Audience:** Harness engineers, anyone who will author or admit a model
under the v2 trial funnel.

---

## 1. Why hidden holdouts exist

Public/dev tests are useful for development, debugging, and tuning samplers
/ prompts / harness behavior. They are **not** sufficient for model
admission, because every cycle of tuning a model against public tests
moves those tests closer to "training set" territory. By the third or
fourth tuning pass, the public scorecard is measuring how well the tuning
loop overfits the visible verifier, not how well the model generalizes to
nearby tasks.

Hidden holdouts answer the question: **does this model generalize beyond
the public tests, or did tuning just teach it to pass the verifier?**

This matters most at three decision points:

1. Stage 3 of the §15 model-trial funnel (admission gate).
2. Major harness/prompt/sampler changes that could overfit on tuning runs.
3. Periodic audits of long-running production configs.

It does not matter for Sprint 1's overnight screen — that screen is
explicitly `screening_only` and not making admission decisions.

---

## 2. Storage location and access

**Path (locked):** `host/test/__tests__/tier-eval-hidden/`

**Access control:** the directory is added to `host/test/.gitignore` so its
contents never leave the host. Authoring engineers (initially: the study
owner only) place test files in it directly. Reviewers and tuning
engineers must not read them — the discipline is social, enforced by
gitignore rather than ACLs.

**Why not a separate repo:** a separate repo introduces more friction
(submodules, separate CI, separate auth) than this iteration warrants.
Gitignore is sufficient for the threat model: the threat is "tuning
engineers and the model see the test text and overfit," not external
exfiltration. If the threat model changes (e.g. the model is fine-tuned
against logs that include holdout traces), revisit and move to a separate
private repo.

**Docker mount:** the existing `host/test/__tests__` mount picks up the
hidden directory automatically because it's a subdirectory. No
docker-compose change is needed. The container can run hidden tests via
`TEST_SUITE=tier-eval-hidden` once `entrypoint.sh` is extended to scope
that suite (Sprint 4 work).

**`.gitignore` entry:** add to `host/test/.gitignore` once Sprint 4
authors the first holdout — keeping the entry out of `.gitignore` until
then avoids confusing future readers about whether the directory exists.

---

## 3. What a hidden holdout looks like

Each holdout is a `.test.js` file with the same shape as a public
tier-eval test (so the existing runner picks it up unchanged), with two
differences:

1. The `@manifest` block declares `"oracle_type": "hidden_holdout"`.
2. The test_id is the public sibling's id with a `-h` suffix
   (e.g. `expression-eval-h`, `csv-parser-h`). The suffix exists so
   discrimination-matrix joins can pair public and hidden cells without
   a separate mapping table.

Hidden holdouts are siblings of public tests, **not** trick questions:

- **Same axis.** A hidden holdout for `expression-eval` exercises the
  same `spec_precision` axis with a similar edge density.
- **Different surface.** Different operators, different error message
  conventions, different variable conventions. Solving the public
  verifier should not be equivalent to solving the hidden one.
- **No gotchas.** A correct, generalizing solution must pass. We are
  testing "did the model learn the underlying skill" — not "can we trick
  it."

Generalization patterns to draw from (strategy doc §7.4):

| Pattern | Example for `expression-eval` |
|---|---|
| Similar task, new inputs | New operator names (`+`/`-`/`*`/`/` replaced with `add`/`sub`/`mul`/`div`); same precedence rules. |
| Same spec, unseen edge combinations | Public tests cover unary-tighter-than-`^`; hidden tests add unary-binding interaction with function calls. |
| Same productivity rubric, new document | (Sprint 3 productivity holdouts.) |
| Same agentic pattern, new repo layout | (Sprint 4 agentic holdouts.) |

---

## 4. Authorship and review

| Role | Action |
|---|---|
| Study owner | Authors and approves new holdouts. |
| Tuning engineers | Must not read holdouts. May see only result summaries (pass/fail counts, axis aggregates) — never per-test traces. |
| Model trial lead | Sees per-test traces only after admission has resolved (pass or reject), so trace inspection cannot leak into the next tuning cycle. |
| Anyone with repo access | Can see that the directory exists; cannot see contents (gitignored on disk). |

Reviews happen out of band. The directory does not have a code-review
trail in the public repo because the repo doesn't carry its contents.
Track holdout authorship in a separate plaintext log under
`host/test/__tests__/tier-eval-hidden/AUTHORSHIP.md` (also gitignored).

---

## 5. Rotation cadence

Hidden tests decay as they influence decisions. The rotation rules:

- **Cadence: quarterly**, or after any major tuning cycle that produces a
  model admission decision — whichever comes first.
- **Per-axis reserve pool:** for each Layer-B core test, maintain at
  least 2 hidden siblings in reserve at all times. Rotation rotates the
  active sibling out and a reserve in.
- **Retire on suspicion of leak:** if a holdout's pass rate
  monotonically rises across consecutive tuning cycles in a way the
  public test does not, retire it on suspicion. Add a fresh sibling
  before the next admission.
- **Retire on overfit signature:** if a model's hidden pass rate
  clearly tracks its public pass rate cycle-over-cycle, the hidden test
  has lost its independence. Retire and replace.

The retired test moves to `tier-eval-hidden/_archive-<date>/` (still
gitignored) so its content is preserved for future calibration but never
reused as an admission gate.

---

## 6. Distinguishing hidden probes from official admission holdouts

Two related things should not be confused:

- **Exploratory hidden probes:** ad-hoc holdouts the study owner runs to
  spot-check a tuning hypothesis. May be informal, do not rotate on
  schedule, and are not part of a Stage 3 admission gate.
- **Official admission holdouts:** the rotated, per-axis reserve pool
  used at Stage 3. Pass/fail on these is what gates admission.

Both live in `tier-eval-hidden/`. Distinguish with a manifest field
(extend the schema in Sprint 4 with `"holdout_class":
"exploratory" | "admission"`).

---

## 7. Result reporting without leaking

Stage 3 outputs (and any internal report referencing hidden results) must
follow these rules:

- Per-test pass/fail is allowed in the run-registry rows themselves
  (so the registry remains source-of-truth) but registry rows are
  visible only to the study owner and the trial lead.
- Aggregate reports for tuning engineers show **axis-level** hidden pass
  rates only. No per-test rates, no trace excerpts, no failed-input
  examples.
- Aggregate reports for leadership show pass/fail of the admission gate
  as a single boolean (admitted vs. not), not the underlying axis
  numbers, until the model has been admitted and the holdouts have been
  rotated.

If a tuning engineer asks "why did my model fail Stage 3," the legitimate
answer is "axis X dropped >5 pp on the hidden panel" — not "the model
failed test `csv-parser-h` on inputs Y and Z."

---

## 8. What hidden holdouts must not be

To stay healthy, hidden holdouts:

- **Are not adversarial.** No trick prompts, no contradictory specs, no
  hidden requirements that contradict the visible spec.
- **Are not arbitrary edge cases unrelated to the axis.** A
  `spec_precision` holdout that introduces a `multi_file_context`
  burden is testing the wrong thing.
- **Are not used for tuning.** Even one tuning cycle against a holdout
  retires it.
- **Are not used for sampler/prompt/harness comparisons.** Those use
  public/dev tests where the comparison can be reproduced and reviewed.

---

## 9. Stage-3 runner behavior (Sprint 4 contract)

Sprint 4 will implement `host/test/run-model-trial.sh` invoking Stages
0 → 1 → 3. The Stage-3 runner contract is set here:

- Read tests from `host/test/__tests__/tier-eval-hidden/`.
- If the directory does not exist, or is empty: emit a **visible
  warning** in the run output (`STAGE 3 SKIPPED — no hidden holdouts
  authored`) and mark the trial result `admission_status=skipped`
  rather than `admission_status=passed`. Silent passes are forbidden.
- Emit registry rows with `oracle_type=hidden_holdout` and
  `run_kind=admission`.
- Do not log per-test inputs or outputs in any artifact accessible to
  tuning engineers. Trace artifacts go under
  `.claw-runtime/<run_id>/` as usual but with a marker file
  `.holdout-trace` that the existing log-aggregation excludes.

---

## 10. Open questions deferred to Sprint 4

These do not block Sprint 0 sign-off. They will be resolved when the
first hidden holdouts are authored.

- Whether hidden inputs are revealed to the model at run time but only
  to the trial lead post-hoc (current default), versus being held by an
  external service the model talks to over a tool call.
- Whether the gitignored directory will eventually move to a separate
  private repo with stricter ACLs.
- The exact axis-level reporting threshold for "the trial passed" —
  likely "no axis drops >5 pp from public" but to be confirmed with
  data.
