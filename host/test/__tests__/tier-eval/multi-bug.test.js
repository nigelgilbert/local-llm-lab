// Multi-bug: three independent bugs in one file, all must be fixed.
//
// Difficulty knob: 1 file × N bugs. Tests whether the model finds and fixes
// every failing assertion, not just the first one. A model that runs the
// file once, fixes the first error, and stops — without re-running — leaves
// 2/3 broken.
//
// The three bugs are deliberately of different kinds so the model can't
// pattern-match a single fix:
//   - capitalize: returns lowercased string instead of capitalized first letter
//   - reverseWords: splits on '' instead of ' '
//   - countVowels: regex misses uppercase vowels
//
// Target: medium-hard (7B 25-50%, 14B 60-80%, 30B 85-100%).

/** @manifest
 * {
 *   "test_id": "multi-bug",
 *   "test_version": "v1",
 *   "primary_axis": "convergence",
 *   "secondary_axes": [
 *     "tool_discipline"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "medium",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 sibling to cascading-bugs but with simultaneously-visible bugs.",
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

const TEXT_JS = `\
import assert from 'node:assert/strict';

export function capitalize(s) {
  return s.toLowerCase();
}

export function reverseWords(s) {
  return s.split('').reverse().join('');
}

export function countVowels(s) {
  return (s.match(/[aeiou]/g) || []).length;
}

assert.equal(capitalize('hello'),       'Hello',         'capitalize');
assert.equal(capitalize('WORLD'),       'World',         'capitalize from upper');
assert.equal(reverseWords('one two'),   'two one',       'reverseWords basic');
assert.equal(reverseWords('a b c'),     'c b a',         'reverseWords three');
assert.equal(countVowels('Hello World'), 3,              'vowel count incl uppercase');
assert.equal(countVowels('AEIOU'),       5,              'all uppercase vowels');
`;

const PROMPT =
  'text.js implements three string helpers (capitalize, reverseWords, ' +
  'countVowels) and runs assertions on each. Multiple assertions are ' +
  'currently failing. Fix every helper so that running `node text.js` ' +
  'exits 0. Do not change the assertions.';

const TIMEOUT = 300_000;

describe(`multi-bug: fix three independent bugs (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'text.js'), TEXT_JS);
  });

  it('claw fixes all three helpers', { timeout: TIMEOUT }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'text.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: text.js must fail before the fix');

    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== multi-bug (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'text.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(post.status, 0, `text.js still fails:\n${post.stderr.slice(0, 800)}`);
  });
});
