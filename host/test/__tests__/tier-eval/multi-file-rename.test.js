// Multi-file rename + signature change.
//
// Three files are seeded into the workspace; index.js fails because it imports
// a `transform` symbol that lib.js doesn't yet export. The model must:
//   1. Rename `compute` → `transform` in lib.js *and* change the body
//      from `x * 2` to `x * 2 + 1`.
//   2. Update the import + call site in service.js so `run` keeps working.
//   3. Leave index.js alone (the asserts already match the new contract).
//
// Single-file refactor.test.js doesn't exercise cross-file awareness — a model
// that edits lib.js but forgets service.js leaves a broken `run()` and the
// post-condition fails. Expected differentiator: planning + completing
// multi-step edits without dropping a step.

/** @manifest
 * {
 *   "test_id": "multi-file-rename",
 *   "test_version": "v1",
 *   "primary_axis": "multi_file_context",
 *   "secondary_axes": [
 *     "convergence"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "medium",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 minimal multi-file refactor; pairs with api-evolution and large-refactor at increasing scale.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": []
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw, writeAssertionResult } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const LIB_JS = `\
export function compute(x) {
  return x * 2;
}
`;

const SERVICE_JS = `\
import { compute } from './lib.js';

export function run(n) {
  return compute(n);
}
`;

const INDEX_JS = `\
import assert from 'node:assert/strict';
import { run } from './service.js';
import { transform } from './lib.js';

assert.equal(run(5),       11, 'run(5) should equal 11');
assert.equal(transform(5), 11, 'transform(5) should equal 11');
assert.equal(transform(0),  1, 'transform(0) should equal 1');
`;

const PROMPT =
  'index.js fails because lib.js does not yet export `transform`. ' +
  'Rename the function `compute` to `transform` in lib.js and change its body ' +
  'so it returns `x * 2 + 1`. Update service.js so `run` calls the renamed ' +
  '`transform` directly (the body of `run` should just return `transform(n)`). ' +
  'Leave index.js unchanged. After your edits, running `node index.js` must exit 0.';

const TIMEOUT = 300_000;

describe(`multi-file rename + signature change (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'lib.js'),     LIB_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'service.js'), SERVICE_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'index.js'),   INDEX_JS);
  });

  it('claw renames across files and updates the call site', { timeout: TIMEOUT }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'index.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: index.js must fail before the rename');

    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== multi-file-rename (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'index.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    writeAssertionResult(r.runDir, {
      passed: r.code === 0 && post.status === 0,
      claw_exit: r.code,
      target_file_exists: null,
      post_status: post.status,
      post_stderr_tail: post.stderr.slice(0, 800),
    });

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(
      post.status,
      0,
      `index.js still fails after claw's edits:\n${post.stderr.slice(0, 800)}`,
    );
  });
});
