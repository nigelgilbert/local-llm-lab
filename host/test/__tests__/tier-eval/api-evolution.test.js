// API evolution: change a function signature, update both call sites.
//
// Difficulty knob: 2 files × signature semantics change. Different from
// multi-file-rename: this is not a rename, it's an argument-order change
// in an existing API, where the model has to update each call site
// correctly (not all call sites take the same args).
//
// Sibling test to multi-file-rename — same shape (cross-file refactor),
// but smaller surface (2 files, not 3) and the work is mechanical once
// understood. Probes the same agent-loop hazard but with a lower difficulty
// floor so we can tell the difference between "model can't do cross-file
// edits at all" and "this specific multi-file test is harness-flaky."
//
// Target: medium-hard (7B 25-50%, 14B 60-80%, 30B 85-100%).

/** @manifest
 * {
 *   "test_id": "api-evolution",
 *   "test_version": "v1",
 *   "primary_axis": "multi_file_context",
 *   "secondary_axes": [
 *     "convergence"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 multi-file signature change is core to multi_file_context axis.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [
 *     "repo_size_dependent"
 *   ]
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

const PRICING_JS = `\
export function discount(price, percent) {
  return price * (1 - percent / 100);
}
`;

const APP_JS = `\
import assert from 'node:assert/strict';
import { discount } from './pricing.js';

// New signature: discount(percent, price). Caller must be updated.
assert.equal(discount(10, 100), 90,  'discount 10% off 100');
assert.equal(discount(25, 200), 150, 'discount 25% off 200');
assert.equal(discount(0,  50),  50,  'discount 0% off 50');
`;

const PROMPT =
  'Refactor pricing.js so that `discount` takes its arguments in the order ' +
  '(percent, price) instead of (price, percent). Then update app.js so its ' +
  'call sites pass arguments in the new order, and ensure that running ' +
  '`node app.js` exits 0. Do not change the assertions in app.js.';

const CLAW_TIMEOUT = 240_000;
const TIMEOUT = CLAW_TIMEOUT + 60_000;

describe(`api evolution: signature reorder across two files (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'pricing.js'), PRICING_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'app.js'),     APP_JS);
  });

  it('claw reorders the signature and updates the call site', { timeout: TIMEOUT }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'app.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: app.js must fail before the refactor');

    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    console.log(`\n=== api-evolution (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    let post = null;
    if (r.code === 0) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'app.js')], {
        encoding: 'utf8',
        timeout:  5_000,
      });
      console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);
    }

    writeAssertionResult(r.runDir, {
      passed: r.code === 0 && post != null && post.status === 0,
      claw_exit: r.code,
      target_file_exists: workspace.exists('pricing.js'),
      post_status: post ? post.status : null,
      post_stderr_tail: post ? post.stderr.slice(0, 800) : null,
    });

    if (r.terminal_status === 'timeout') assert.fail(`claw timed out after ${r.elapsedMs}ms (terminal_status=timeout)`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(post.status, 0, `app.js still fails:\n${post.stderr.slice(0, 800)}`);
  });
});
