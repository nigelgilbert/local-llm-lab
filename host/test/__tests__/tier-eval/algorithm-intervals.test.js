// Algorithm-intervals: merge overlapping intervals.
//
// Difficulty knob: classic algorithm with multiple edge cases. Naive
// implementations forget to sort first, mishandle adjacent (touching)
// intervals, or fail when one interval contains another. The assertions
// cover all of these cases without spelling them out in the prompt.
//
// Target: medium (7B 50-75%, 14B 80-95%, 30B 95-100%). Well-known enough
// that capable coders nail it; tight enough that "almost correct"
// solutions miss one or two edge cases.

/** @manifest
 * {
 *   "test_id": "algorithm-intervals",
 *   "test_version": "v1",
 *   "primary_axis": "stateful_logic",
 *   "secondary_axes": [
 *     "spec_precision"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "medium",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 classic algorithm with multiple edge cases; expected to discriminate at lower tiers.",
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

const VERIFY_JS = `\
import assert from 'node:assert/strict';
import { mergeIntervals } from './intervals.js';

assert.deepEqual(mergeIntervals([[1,3],[2,6],[8,10],[15,18]]), [[1,6],[8,10],[15,18]], 'classic case');
assert.deepEqual(mergeIntervals([[1,4],[4,5]]),                [[1,5]],                'touching intervals merge');
assert.deepEqual(mergeIntervals([[1,10],[2,3]]),               [[1,10]],               'one contains another');
assert.deepEqual(mergeIntervals([[3,5],[1,2]]),                [[1,2],[3,5]],          'unsorted input');
assert.deepEqual(mergeIntervals([]),                            [],                    'empty input');
assert.deepEqual(mergeIntervals([[1,5]]),                       [[1,5]],               'single interval');
assert.deepEqual(mergeIntervals([[1,2],[3,4],[5,6]]),          [[1,2],[3,4],[5,6]],   'no overlap');
`;

const PROMPT =
  'Create intervals.js that exports `mergeIntervals(intervals)`. Each interval ' +
  'is a [start, end] pair (inclusive). The function returns a new array of ' +
  'merged intervals: any pair that overlaps or touches is combined into a ' +
  'single interval. The result must be sorted by start. Then ensure `node verify.js` ' +
  'exits 0. Do not edit verify.js.';

const TIMEOUT = 300_000;

describe(`algorithm: merge intervals (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw merges intervals across all edge cases', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== algorithm-intervals (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(workspace.exists('intervals.js'), true, 'intervals.js must be created');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(post.status, 0, `verify.js failed:\n${post.stderr.slice(0, 800)}`);
  });
});
