// Two-step refactor: extract a helper AND fix a bug inside it.
//
// Difficulty knob: multi-step single-file. Single-step refactor is easy
// (everyone passes). Two sequential edits in one file — extract a helper
// from a duplicated pattern, then fix the bug that lives in the duplicated
// logic — distinguishes models that plan from models that pattern-match.
//
// The seed has duplicated `for (let i = 0; i <= arr.length; i++)` blocks in
// two functions. Asking to extract them surfaces the off-by-one (which both
// callers had); a model that just extracts without thinking copies the bug
// into the helper. A model that thinks about correctness fixes it.
//
// Target: medium-hard (7B 25-50%, 14B 60-80%, 30B 85-100%).

/** @manifest
 * {
 *   "test_id": "two-step-refactor",
 *   "test_version": "v1",
 *   "primary_axis": "convergence",
 *   "secondary_axes": [
 *     "spec_precision"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "medium",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 multi-step single-file is a distinct convergence sub-mode (plan vs. pattern-match).",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": []
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const STATS_JS = `\
import assert from 'node:assert/strict';

export function sum(arr) {
  let total = 0;
  for (let i = 0; i <= arr.length; i++) {
    total += arr[i];
  }
  return total;
}

export function product(arr) {
  let total = 1;
  for (let i = 0; i <= arr.length; i++) {
    total *= arr[i];
  }
  return total;
}

assert.equal(sum([1, 2, 3]),     6, 'sum mismatch');
assert.equal(product([2, 3, 4]), 24, 'product mismatch');
assert.equal(sum([]),            0, 'empty sum');
assert.equal(product([]),        1, 'empty product');
`;

const PROMPT =
  'stats.js has two functions, sum and product, that share an iteration ' +
  'pattern. Extract a single helper function `reduce(arr, op, init)` that ' +
  'both sum and product use, and rewrite sum and product in terms of it. ' +
  'After your edits, running `node stats.js` must exit 0. Keep both exports ' +
  'and all assertions in place.';

const TIMEOUT = 300_000;

describe(`two-step refactor: extract helper and fix latent bug (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'stats.js'), STATS_JS);
  });

  it('claw extracts the helper without copying the off-by-one', { timeout: TIMEOUT }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'stats.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: stats.js must fail before the refactor');

    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== two-step-refactor (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'stats.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(post.status, 0, `stats.js still fails:\n${post.stderr.slice(0, 800)}`);
  });
});
