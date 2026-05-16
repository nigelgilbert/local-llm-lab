# Frontier reserve

Tests held outside the active tier-eval screening filter. Two reasons something lives here:

**1. Capability frontier.** Beyond the current Qwen3.5-9B floor at t16/t32 — kept as documented capability gaps. Promote out only when a pilot sweep shows t32 pass-rate ≥ 30% (per the manifest `keep_drop_rule` on each file). Currently: `alphametics`, `forth`, `semver-range`.

**2. Tooling / runtime probe.** Surfaces harness or runtime instability rather than model behavior. Held aside until the tooling issue is resolved. Currently: `needle-haystack` (t64 SSE-deadlock — see `host/test/docs/usability-pack/memos/needle-haystack-t64-inversion.md`). Note: this file's manifest still reads `suite_layer: B / band: hard` from before relocation; its physical location reflects current operational status, not capability classification.

## Sweep behavior — `frontier/` is NOT picked up by default

- The standard tier-eval sweep expands `__tests__/tier-eval/*.test.js` (flat glob, non-recursive) — see `host/test/entrypoint.sh:53-66`. Frontier tests are skipped.
- `host/test/scripts/expected-attempts.mjs` likewise does not recurse, so frontier tests do not appear in expected-attempts plans.
- `host/test/scripts/explore-cycle.sh`'s `NEW_TESTS` filter does not include any frontier test.

This exclusion is deliberate. To exercise a frontier test, invoke `node --test path/to/frontier/<file>.test.js` directly; do not retarget the screening pipeline.

## Test structure — opts out of `runAgent`

Frontier tests call `runClaw` + `writeAssertionResult` directly rather than going through `runAgent`. This is deliberate, not technical debt.

Active tier-eval tests use `runAgent` to centralize the prelude (workspace reset, seedFiles, optional precondition/postScript) and the registry-sidecar flush via the reporter. Frontier tests opt out because:

- Failure rate ≈ 100% — these are cold-storage reserves exercised only during capability-promotion pilots, not actively maintained.
- Migration cost outweighs benefit: `runAgent.seedFiles` would need nested-path `mkdir` support for needle-haystack's 30 files across subdirs; the sidecar would lose its explicit `target_file_exists` field (reporter writes `{passed, claw_exit, post_status, post_stderr_tail}` only — see `host/test/lib/registry-reporter.js:78-83`); the custom console.log blocks become redundant with the reporter's auto-emitted header.
- Files don't drift between sprints, so ~30 lines of duplicated post-claw boilerplate per file is cheap.

Promote-out path: when a frontier test graduates (per its manifest `keep_drop_rule`), migrate it to `runAgent` as part of the promotion, not before.

**Timeout invariant — author's responsibility.** `runClaw`'s `timeoutMs` must fire before node:test's outer `{timeout}` so diagnostics and `writeAssertionResult` can land before cancellation. `runAgent` enforces this automatically by subtracting slack from `clawTimeoutMs`; direct callers do not get that guard (see `host/test/lib/claw.js:90-97` and `host/test/lib/runAgent.js:26-29`). Established convention in this directory: `CLAW_TIMEOUT = 285_000` inner, `CLAW_TIMEOUT + 20_000` outer (~20s margin covers the 10s verify.js spawn plus sidecar flush). Keep the same pair when adding a new frontier test.

## Background

- Capability-frontier story: `host/test/docs/difficulty-pack/README.md` (Sprint 1.21 cycles 1–2 floored alphametics, forth, semver-range)
- needle-haystack inversion: `host/test/docs/usability-pack/memos/needle-haystack-t64-inversion.md`
- Operator notes on current exclusions: `host/test/scripts/explore-cycle.sh:54-61`
