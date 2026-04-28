// Subtle-bug debug: classic JS default-sort gotcha.
//
// median.js sorts an array with `.sort()` (no comparator), which is *lexicographic*
// — `[1, 100, 2, 50, 3]` becomes `["1", "100", "2", "3", "50"]`, so median returns
// 100 instead of 3. The assertion fires every time. The fix is one character:
// `.sort()` → `.sort((a,b) => a-b)`.
//
// Differs from refactor.test.js (single-line off-by-one): this requires the model
// to know that JS's default sort is lexicographic, not just spot a `<=` vs `<`.
// A pattern-matching model will swap the comparison or the bounds and remain
// broken; the actual fix demands understanding of the standard library.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const MEDIAN_JS = `\
import assert from 'node:assert/strict';

function median(arr) {
  const sorted = [...arr].sort();
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

assert.equal(median([1, 100, 2, 50, 3]),  3,  'median of [1,100,2,50,3] should be 3');
assert.equal(median([10, 1, 2]),          2,  'median of [10,1,2] should be 2');
assert.equal(median([2, 1, 4, 3]),        2.5, 'median of [2,1,4,3] should be 2.5');
`;

const PROMPT =
  'median.js has a bug that causes its assertions to fail. Find and fix the ' +
  'bug so that running `node median.js` exits 0. Do not change the assertions ' +
  'or the function signature — only fix the implementation of `median`.';

const TIMEOUT = 300_000;

describe(`subtle bug: default-sort lexicographic (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'median.js'), MEDIAN_JS);
  });

  it('claw fixes median.js so its assertions pass', { timeout: TIMEOUT }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'median.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: median.js must fail before the fix');

    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== subtle-bug (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'median.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(
      post.status,
      0,
      `median.js still fails after claw's fix:\n${post.stderr.slice(0, 800)}`,
    );
  });
});
