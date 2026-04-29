# V2 levers — preliminary scaffold (filled at W5, post-Pass-2)

*This file is a scaffold. The director will fill in the lever sections after
the W4 classification (Pass 1 + Pass 2) is complete and κ-accepted. See
[TODO-ITERATION-DISTRIBUTION-TEST.md](TODO-ITERATION-DISTRIBUTION-TEST.md)
§"W5 — lever assignment".*

## Class A — verify-loop

- **Trace signature:** _(filled from accepted Pass 2)_
- **Run count:** _(N)_  _(M%)_
- **Example run IDs:** _(comma list of ≤3 illustrative runs)_
- **Proposed lever:** _(one of: clearer verification instructions / test-output truncation / structured error extraction / other)_
- **Expected mechanism:** _(why this should reduce p90 iter_count)_
- **Metric expected to move:** _(e.g., p90 iter_count from X to Y on csv-parser; pass rate unchanged)_
- **Validation experiment:** _(n, design, primary criterion, joint-test correction if applicable)_
- **Pass-rate regression risk:** _(the failure mode the lever could introduce)_
- **Rollback / no-go criterion:** _(measurable; trips a revert)_
- **Confidence:** high / medium / low

## Class B — wrong-module-shape

- **Trace signature:** _(...)_
- **Run count:** _(...)_
- **Example run IDs:** _(...)_
- **Proposed lever:** _(seed module format / add package.json / clarify ESM/CJS in prompt or harness)_
- **Expected mechanism:** _(...)_
- **Metric expected to move:** _(...)_
- **Validation experiment:** _(must avoid benchmark leakage)_
- **Pass-rate regression risk:** _(...)_
- **Rollback / no-go criterion:** _(...)_
- **Confidence:** _(...)_

## Class C — context-drift

- **Trace signature:** _(...)_
- **Run count:** _(...)_
- **Example run IDs:** _(...)_
- **Proposed lever:** _(compaction near 80% n_ctx / explicit context budget warning / hard iteration cap as policy — separate compaction (a fix) from a hard cap (a budget guardrail))_
- **Expected mechanism:** _(...)_
- **Metric expected to move:** _(...)_
- **Validation experiment:** _(...)_
- **Pass-rate regression risk:** _(...)_
- **Rollback / no-go criterion:** _(...)_
- **Confidence:** _(...)_

## Class D — grammar/tool dead-branch

- **Trace signature:** _(...)_
- **Run count:** _(...)_
- **Example run IDs:** _(...)_
- **Proposed lever:** _(grammar restriction / better tool feedback / no-op detection — confirm grammar permits dead-end behavior before changing it)_
- **Expected mechanism:** _(...)_
- **Metric expected to move:** _(...)_
- **Validation experiment:** _(...)_
- **Pass-rate regression risk:** _(...)_
- **Rollback / no-go criterion:** _(...)_
- **Confidence:** _(...)_

## Class E — infra / non-model-gap latency

- **Trace signature:** _(...)_
- **Run count:** _(...)_
- **Example run IDs:** _(...)_
- **Proposed lever:** _(tool-side optimization / runner caching / tool-output streaming — out of scope for prompt/sampler work)_
- **Expected mechanism:** _(...)_
- **Metric expected to move:** _(...)_
- **Validation experiment:** _(...)_
- **Pass-rate regression risk:** _(...)_
- **Rollback / no-go criterion:** _(...)_
- **Confidence:** _(...)_

## Class F — other / insufficient evidence

- **Run count:** _(...)_
- **Disposition:** No v2 lever ticket generated. This is a finding about
  the limits of trace-level diagnosis at our n. Recommendations for what
  would need to change to recover signal: _(e.g., longer iteration cap
  before censoring, retain stdout/stderr from `bash` tool calls verbatim
  for ≥ N chars, capture per-call timestamps via a claw fork)_.
