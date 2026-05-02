# Productivity-grader research notes

**Date:** 2026-04-29 (moved to research/ 2026-05-01)
**Status:** Research notes, not commitments. No graders built. If a real
productivity-grading need arises, re-derive the decisions below under the
constraints that actually exist at that time — don't treat anything here
as locked.

**Open questions worth keeping warm:**
- Judge pinning vs floating model id (and how to handle Anthropic version bumps)
- κ ≥ 0.7 vs Krippendorff's α for ordinal rubrics
- Calibration-set composition and size
- Cost ceiling per grade
- Hybrid grader architecture (deterministic → semantic → judge → human override)
- Rubric versioning

---

## 1. Why a separate methodology

Productivity tests are the largest coverage gap (strategy doc §2.2). The
existing tier-eval suite has exactly **one** productivity-axis test
(`prose-quality`, an assertive newline/bullet count), and that's a
deliberate floor — anything richer requires graded judgment over free-form
text.

Three failure modes are easy to fall into and must be avoided:

1. **Brittle string-match scoring.** "Output must contain phrase X."
   Misses paraphrases, false-positives on coincidental keywords, and
   teaches models to pattern-match instead of understand.
2. **Uncalibrated LLM-as-judge.** A judge model prompted with a rubric and
   no validation has unknown agreement with human raters. Numbers from
   such a judge look authoritative but mean nothing until validated.
3. **Self-grading.** Local model writes the output; same family judges
   it. The judge is biased toward outputs the model would itself produce.

This memo specifies a hybrid grader that addresses all three, with a
calibration step that gates productivity tests from entering the core
matrix.

---

## 2. Pinned judge: claude-opus-4-7

**Judge model:** `claude-opus-4-7` via the Claude API.
**Why Opus:** Per the Q&A captured in `TIER-EVAL-V2-SPRINT-PLAN.md` §2,
the capability delta between Opus and the local lab models is large
enough that bias in either direction is unlikely to systematically
mis-rank local models. The local model never grades itself or its peers.

**Versioning:**

- Every grader output row records the exact model id literally.
- If a future Opus revision (e.g. `claude-opus-4-8`) ships, do not
  silently upgrade. Treat it as a new judge: re-run calibration before
  trusting the new judge's scores.
- Record the judge version in the run-registry row's
  `prompt_pack_version` field, alongside the rubric version
  (e.g. `judge=claude-opus-4-7,rubric=v1`).

**Prompt caching:**

- System prompt, rubric, and any fixed exemplars are cached.
- Per-call variation is the candidate output only.
- Use `cache_control: { type: "ephemeral" }` on the system + rubric
  blocks. Cache hit rate must be >= 0.9 in steady state; deviations
  indicate a rubric-text drift that should be investigated.

**Cost discipline:**

- The local lab does not need Opus's full output budget. Cap
  `max_tokens` at 512 for grading calls; the judge returns a structured
  JSON verdict, not prose.
- Treat any per-grade Opus cost > $0.05 as a regression.
- Calibration cycles are bounded (~30 examples per family × 2 humans);
  production runs cap by sweep size. Both cost lines tracked separately.

---

## 3. Hybrid grader architecture

A grading call combines four components, in this order:

```
candidate output
  ├── deterministic_checks  (schema, length, exact IDs, totals, banned phrases)
  ├── semantic_match        (paraphrase-aware fact preservation)
  ├── pinned_judge          (Opus rubric scoring, only if upstream checks did not already fail)
  └── human_overrides       (loaded calibration set + on-call adjudication)

  → graded_verdict { passed: bool, axis_scores: {...}, failure_reasons: [...] }
```

### 3.1 Deterministic checks (cheap, run first)

- JSON schema validity for structured outputs (action-item lists,
  briefs, etc.).
- Length bounds: minimum and maximum word/line counts where the rubric
  specifies them.
- Exact-string requirements: required issue IDs, required dates,
  forbidden phrases (e.g. "I don't know" when grounding is mandatory).
- Computed totals: when the rubric says "report sum of column X," the
  grader recomputes the sum from the source CSV/table and compares.

A failure here short-circuits the grade: `passed=false`, `failure_reasons`
includes the deterministic failure, no Opus call is made.

### 3.2 Semantic match (paraphrase-aware fact preservation)

Required source facts are scored for presence in the candidate output
without brittle string matching. Implementation choice for Sprint 3:

- **Embedding similarity** between the required-fact phrase and the
  candidate's nearest sentence, with a per-fact threshold tuned during
  calibration.
- Fallback: small-prompt classification call to a cheap embedding model
  (or Opus if embeddings are not yet wired) — cached per (rubric, fact).

Semantic-match failures populate `failure_reasons` but do not
short-circuit; the judge still runs because the structured verdict
captures both signals.

### 3.3 Pinned judge (Opus rubric scoring)

Called only when deterministic checks pass. Inputs:

- System prompt: defines the grader role, output schema, scoring
  dimensions. Cached.
- Rubric: per-family scoring dimensions and pass thresholds. Cached.
- Candidate output: the only varying input.
- Optionally: 2–3 calibration exemplars covering pass / borderline /
  fail. Cached.

Output: strict JSON, validated against a schema:

```json
{
  "factual_preservation": 0..5,
  "non_hallucination":    0..5,
  "structure":            0..5,
  "concision":            0..5,
  "usefulness":           0..5,
  "passed":               true | false,
  "failure_reasons":      ["..."],
  "judge_confidence":     0..1
}
```

Any judge response that fails JSON validation, or has
`judge_confidence < 0.7`, is escalated to human review and not used as
the sole verdict.

### 3.4 Human override / on-call adjudication

A small queue of borderline cases is reviewed by humans during
calibration cycles. Human verdicts override judge verdicts on those
rows. The override is recorded in the registry row as
`human_overrode=true` so audit reports can quantify how often the judge
disagrees with humans in production.

---

## 4. Initial productivity families (deferred to Sprint 3 implementation)

Per strategy doc §10.1, Sprint 3 ships pilot graders for the two cheapest
families:

1. **Changelog summarization.** Convert an 800–1200 word changelog into
   release notes. Required issue IDs, required risks, max length, no
   unsupported claims.
2. **Email rewrite.** Rewrite a blunt internal email into a
   formal/customer-safe tone. Preserve facts and ask; length bounds;
   banned phrases; no invented commitments.

The remaining three families (noisy meeting notes, structured-data
brief, doc cleanup) are queued for the next iteration after Sprint 3's
calibration confirms judge–human agreement is acceptable.

Each family gets its own `*.test.js` under
`host/test/__tests__/tier-eval/`, with `oracle_type=judge` in the
manifest header. The `prose-quality` test (currently the only
productivity test) keeps `oracle_type=rubric` because its grader is
deterministic — it does not transition to the new architecture.

---

## 5. Calibration set requirements

Before any productivity test enters the Layer-B core matrix, calibration
must satisfy all of these:

- **~30 candidate outputs per family**, distributed across pass / fail /
  borderline (target: 10/10/10 or 12/8/10).
- **Two human raters** independently grade every example using the same
  rubric the judge sees.
- **Adjudication:** disagreements are resolved by a third rater
  (rotating). The adjudicated verdict is the calibration ground truth.
- **Judge agreement measured.** Compute Cohen's κ (or Krippendorff's α
  if the rubric has ordinal sub-scores) between judge and human
  consensus. Threshold for "trust the judge at scale": **κ ≥ 0.7**.
  Below that, the family does not enter the core matrix; iterate on the
  rubric or escalate to a different judge model.
- **Calibration set is versioned** alongside the rubric. Each
  calibration cycle bumps `rubric=vN` and produces a new κ measurement.

Calibration outputs (the 30 examples + verdicts) are stored under
`host/test/docs/productivity-calibration/<family>/<rubric_version>/`,
not gitignored — these are part of the grader's auditable provenance.

---

## 6. What the judge does NOT decide

To keep the judge's role bounded:

- The judge does not decide whether a productivity test enters the core
  matrix. That is decided by the κ ≥ 0.7 calibration threshold above.
- The judge does not decide pass/fail when deterministic checks
  short-circuit. Schema/length/forbidden-phrase failures are absolute.
- The judge does not decide model admission (Stage 3). It feeds into
  the axis scorecard, which feeds into admission, but admission itself
  is gated on hidden holdouts that the judge has not seen.

---

## 7. Failure modes the architecture explicitly handles

| Failure mode | How it's caught |
|---|---|
| Local model self-grades | Architectural — the local model never has the judge role. |
| Brittle string match misses paraphrases | Semantic-match component. |
| Judge hallucinates a high score | Deterministic checks short-circuit; `judge_confidence < 0.7` escalates. |
| Judge consistently disagrees with humans | κ < 0.7 blocks the family from the core matrix. |
| Rubric drifts under our feet | `rubric=vN` versioning + cache-hit-rate monitoring. |
| Opus revision changes scoring | Re-calibration is mandatory before adopting any new judge revision. |
| Cost regression | Per-grade cost capped at $0.05; flagged in CI if exceeded. |

---

## 8. Budget envelope (planning, not commitment)

| Cost line | Estimate |
|---|---|
| Calibration cycle (one family) | ~30 examples × ~$0.05 grading + human-rater time | < $5 in Opus charges |
| Production grading (Sprint 1 overnight, hypothetical) | If 2 productivity families × 35 tests × n=10 across 3 tiers | irrelevant — productivity is **excluded from Sprint 1**. |
| Steady-state per overnight screen (post-Sprint 3) | ~600 grading calls × ~$0.04 cached | ~$25 per overnight |

The Sprint 1 overnight does not run productivity tests — by design, per
the sprint plan §4. First productivity grading runs are
`run_kind=pilot` during Sprint 3 calibration, scoped to the two pilot
families. Production productivity scoring enters the matrix in the
next iteration.

---

## 9. Sprint 3 sign-off criteria

Before productivity tests transition from `run_kind=pilot` to Layer B
core:

1. Two pilot families (changelog summarization, email rewrite) have
   calibration sets with κ ≥ 0.7.
2. Hybrid grader scaffolding exists in `host/test/lib/grader/` (or
   similar) and produces verdicts that validate against the schema in §3.3.
3. Prompt caching is verified (cache_hit_rate ≥ 0.9 in a 50-call test).
4. Judge version + rubric version round-trip into the registry rows.
5. Human reviewers have signed off on the rubric.
6. Cost per grading call has been measured against the $0.05 cap.

If any of these fail, productivity stays out of the core matrix until
the next iteration.

---

## 10. Out of scope for this iteration

To prevent scope creep:

- No productivity tests in Sprint 1's overnight screen.
- No productivity column in any leadership-facing scorecard until
  Sprint 3 sign-off.
- No expansion to all five §10.1 families until the two pilots have
  passed calibration.
- No alternate judge models. Opus is the pinned judge for this
  iteration; switching to Sonnet/Haiku for cost reasons is a future
  decision that requires its own calibration.
