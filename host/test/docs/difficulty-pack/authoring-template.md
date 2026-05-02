# Authoring template — Sprint 1.21 tier-eval tests

Canonical pattern for all 12 new tier-eval test files. Copy as the
starting point for each `host/test/__tests__/tier-eval/<test-id>.test.js`.
Referenced from [`PLAN.md`](PLAN.md) §Harness affordances.

## Pattern

```javascript
/** @manifest
 * {
 *   "test_id": "<test-id>",
 *   "test_version": "v1",
 *   "primary_axis": "spec_precision",
 *   "secondary_axes": ["stateful_logic"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [],
 *   "introduced_in": "1.21",
 *   "notes": "Adapted from Exercism JS 'foo' (MIT) with edge-case mutation 2026-05-XX. Mutation log: ..."
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { runClaw, writeAssertionResult } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const VERIFY_JS = `...`; // template literal with node:assert/strict assertions
const PROMPT = `...`;    // task description, inline any small fixtures

const CLAW_TIMEOUT = 240_000;  // or 360_000 only if pilot shows reference solution > 60s

describe(`<test name> (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
    // additional seed files inline
  });

  it('claw solves the task', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    let post = null;
    const targetExists = fs.existsSync(path.join(workspace.WORKSPACE, '<target>.js'));
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], { timeout: 5_000 });
    }
    const passed = (r.code === 0 && targetExists && post?.status === 0);

    writeAssertionResult(r.runDir, { passed, claw_exit: r.code, /* ...diagnostics */ });

    // Timeout guard MUST come before code-zero assertion (Sprint 1.16a fix)
    if (r.terminal_status === 'timeout') assert.fail(`timeout after ${r.elapsedMs}ms`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(targetExists, true, 'target file must exist');
    assert.equal(post?.status, 0, `verify.js failed: ${post?.stderr}`);
  });
});
```

## Manifest field reference

| Field | Notes |
|---|---|
| `test_id` | kebab-case slug; matches filename `<test-id>.test.js` |
| `test_version` | bump on any spec/verifier change post-merge |
| `primary_axis` / `secondary_axes` | one of `spec_precision`, `convergence`, `stateful_logic`, `multi_file_context`, `tool_discipline` |
| `suite_layer` | `B` for core matrix; `D` for `frontier` reserve |
| `difficulty_band` | `hard` (1.21 default) or `frontier` (10-min hand-solve violation) |
| `oracle_type` | `public_verifier` only for 1.21 |
| `keep_drop_rule` | per-test ceiling rule (boilerplate above is fine for most) |
| `expected_tier_signature` | `monotonic_improving` for normal; `ceiling_t16` if t16-only saturation expected |
| `known_confounds` | array of strings; e.g. `["bigint_required"]` |
| `introduced_in` | sprint identifier — `"1.21"` for this pack |
| `notes` | source attribution, mutation log, license. **Mandatory** for P1 (Exercism) and P2 (AtCoder) ports. |

## Pattern variations by stream

- **P1 (Aider/Exercism ports)** — set `notes` to `"Adapted from Exercism JS '<slug>' (<license>); mutation: <rename + edge shift + shape change details>; canonical at host/test/docs/difficulty-pack/canonicals/<slug>/"`.
- **P2 (ARC 216 C port)** — set `notes` to the AtCoder attribution string from [`p2-decision.md`](p2-decision.md) §License; add `known_confounds: ["bigint_required"]`.
- **H1, H2 (multi-file)** — `beforeEach` writes more than one seed file; consider extending the boilerplate's "additional seed files inline" comment with explicit `fs.writeFileSync` calls per file.
- **H3 (dense parser)** — verify.js will be longer than other tests; budget ~2× the assertion count of `expression-eval.test.js`.

## Reference implementations in-repo

- [`../../__tests__/tier-eval/expression-eval.test.js`](../../__tests__/tier-eval/expression-eval.test.js) — canonical complex-verifier pattern; longest verify.js in the existing pack.
- [`../../__tests__/tier-eval/cascading-bugs.test.js`](../../__tests__/tier-eval/cascading-bugs.test.js) — convergence/iterative pattern; reference for H1.
- [`../../__tests__/tier-eval/large-refactor.test.js`](../../__tests__/tier-eval/large-refactor.test.js) — multi-file pattern; reference for H2.

## Sprint 1.16a timeout-guard ordering

The `if (r.terminal_status === 'timeout') assert.fail(...)` must come
**before** `assert.equal(r.code, 0, ...)`. A timed-out claw run can have
`r.code === 0` if the wrapper exits cleanly after the timeout fires; the
guard ensures we report timeouts as timeouts rather than miscounting them
as successes. See [`memos/standardtest-helper.md`](memos/standardtest-helper.md)
for the historical context.
