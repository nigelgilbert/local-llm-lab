# Memo: lib/standardTest.js control-flow helper — 2026-05-02

## TL;DR

The 26 tier-eval tests duplicate ~40 lines of boilerplate
(workspace reset, seed write, runClaw, post-script, writeAssertionResult,
timeout guard, assertion chain). Two prior sprints (1.10, 1.16a)
demonstrated the cost: cross-cutting changes required mechanical sweeps
across 20–32 files. A single `runStandardTest({prompt, seedFiles,
targetFile, verifyJs, timeoutMs})` helper collapses each test body to
~15 lines.

## What stays inline

Fixture *content* (the `VERIFY_JS` / seed-file template literals) stays
inline per test, not in a shared `fixtures/` directory. Reasons:

- **License/contamination posture:** a committed fixture directory
  pulls upstream content (especially Aider/Exercism-derived seeds from
  Sprint 1.21) into the repo with stable file hashes a future training
  crawl can match.
- **Self-containment:** each test's fixture is its ground truth and
  should travel with the test.

## What gets extracted (control flow only)

1. `workspace.reset()`
2. `fs.writeFileSync` for each seed file (caller passes a
   `{filename: content}` map)
3. `runClaw` with the caller's prompt + `timeoutMs`
4. Conditional `node verify.js` post-script (5s timeout)
5. `writeAssertionResult` with the computed `passed` boolean
6. Sprint 1.16a timeout guard before code-zero assert
7. The three standard assertions (claw exit clean, target file exists,
   verify.js exit 0)

Approximate API:

```js
runStandardTest({
  prompt,
  seedFiles: { [filename]: content },  // written into /workspace
  targetFile,                          // existence-checked post-claw
  verifyJs,                            // template-literal content
  timeoutMs,
  postTimeoutMs = 5_000,
})
```

## Why deferred from 1.21

1.21's gate is the difficulty-extension test pack, not harness
refactoring. Landing the helper concurrently would:

- Trigger a `docker compose build test` rebuild on the critical path of
  authoring.
- Risk helper API churn during the first wave of new test authoring
  (12 new tests against an unstable helper is a bad combination).
- Mix two diffs (helper + new tests) that are easier to review
  separately.

Cleaner to author 1.21 against the existing inline pattern; migrate the
existing 26 tests + the new 12 in 1.22 or 1.23.

## Migration plan (1.22 or 1.23)

1. Land `lib/standardTest.js` + smoke test covering:
   - Sprint 1.16a timeout guard ordering
   - Sprint 1.13 timeout-as-row behavior
   - Sprint 1.10 emit-on-`RUN_REGISTRY_EMIT` path
   - Sprint 1.16b `iters_count` enrichment
2. Migrate the 38 tests (26 existing + 12 from 1.21) in one PR or in
   per-axis batches. Verification: `expected-attempts.mjs` diff = 0/0
   on a t64 N=1 sweep before/after.
3. Update [`CODE-REVIEW.md`](../../base/CODE-REVIEW.md) classification: `keep`
   (not `defer-decision`).

## Evidence the duplication is real technical debt

- **Sprint 1.10:** added `writeAssertionResult` to 20 emit-eligible
  tests one-by-one. Pattern: compute `passed` from `r.code === 0` AND
  target-file-exists AND post-script `status === 0`; insert before
  assert chain. The fact that the pattern is mechanically identical
  across 20 files is the signal.
- **Sprint 1.16a:** inserted `if (r.terminal_status === 'timeout')
  assert.fail(...)` ahead of the existing `assert.equal(r.code, 0,
  …)` in 32 files via Python regex sweep. The sweep worked because the
  surrounding code is identical.
- **Sprint 1.13:** schema change rippled through every test's
  understanding of `r.code = null`. Helper would have absorbed this in
  one place.

## Open question

Whether to also fold per-test `iters_count` p90 caps and per-test
wallclock budgets into the helper as optional knobs — relevant if
Sprint 2 confirmatory wants per-cell SLOs. Defer until Sprint 2
surfaces a concrete need; designing for hypothetical future
requirements is exactly the kind of premature abstraction the lab
avoids.

## Status

Planned for Sprint 1.22 or 1.23 per
[`TIER-EVAL-V2-SPRINT-PLAN.md`](../../base/TIER-EVAL-V2-SPRINT-PLAN.md) row 1.22.
Not started; this memo is rationale-only.
