# Frontier reserve

Tests held outside the active tier-eval screening filter. Two reasons something lives here:

**1. Capability frontier.** Beyond the current Qwen3.5-9B floor at t16/t32 — kept as documented capability gaps. Promote out only when a pilot sweep shows t32 pass-rate ≥ 30% (per the manifest `keep_drop_rule` on each file). Currently: `alphametics`, `forth`, `semver-range`.

**2. Tooling / runtime probe.** Surfaces harness or runtime instability rather than model behavior. Held aside until the tooling issue is resolved. Currently: `needle-haystack` (t64 SSE-deadlock — see `host/test/docs/usability-pack/memos/needle-haystack-t64-inversion.md`). Note: this file's manifest still reads `suite_layer: B / band: hard` from before relocation; its physical location reflects current operational status, not capability classification.

## Sweep behavior — `frontier/` is NOT picked up by default

- The standard tier-eval sweep expands `__tests__/tier-eval/*.test.js` (flat glob, non-recursive) — see `host/test/entrypoint.sh:53-66`. Frontier tests are skipped.
- `host/test/scripts/expected-attempts.mjs` likewise does not recurse, so frontier tests do not appear in expected-attempts plans.
- `host/test/scripts/explore-cycle.sh`'s `NEW_TESTS` filter does not include any frontier test.

This exclusion is deliberate. To exercise a frontier test, invoke `node --test path/to/frontier/<file>.test.js` directly; do not retarget the screening pipeline.

## Background

- Capability-frontier story: `host/test/docs/difficulty-pack/README.md` (Sprint 1.21 cycles 1–2 floored alphametics, forth, semver-range)
- needle-haystack inversion: `host/test/docs/usability-pack/memos/needle-haystack-t64-inversion.md`
- Operator notes on current exclusions: `host/test/scripts/explore-cycle.sh:54-61`
