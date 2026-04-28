// Refactor: can the model identify and fix a seeded bug?
//
// The test pre-seeds /workspace/buggy.js with an off-by-one error
// (i <= arr.length reads past the end, giving NaN), then asks claw to fix it.
// After claw exits, the test runner re-executes the file with node and asserts
// exit 0. The pre-condition check (node exits non-zero before the fix) ensures
// the test is not trivially satisfied by a pre-fixed file.
//
// Expected differentiator: smaller dense models (tier-16 7B) sometimes miss
// the off-by-one without thinking; the 14B/30B reliably spot it from the
// assertion message alone.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

// Off-by-one: `i <= arr.length` reads arr[arr.length] === undefined.
// undefined coerces to NaN in arithmetic, so total stays NaN throughout.
// The assert fires every time, producing a clear failure message.
const BUGGY_JS = `\
import assert from 'node:assert/strict';

function sum(arr) {
  let total = 0;
  for (let i = 0; i <= arr.length; i++) { total += arr[i]; }
  return total;
}

assert.equal(sum([1, 2, 3]), 6, 'sum([1,2,3]) should be 6');
assert.equal(sum([]),        0, 'sum([]) should be 0');
`;

const PROMPT =
  'buggy.js has a bug that causes its own assertion to fail. ' +
  'Find and fix the bug so that running `node buggy.js` exits 0.';

const TIMEOUT = 300_000;

describe(`refactor: fix seeded off-by-one (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'buggy.js'), BUGGY_JS);
  });

  it('claw fixes buggy.js so its assertions pass', { timeout: TIMEOUT }, async () => {
    // Pre-condition: file must fail before fix.
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'buggy.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: buggy.js must fail before the fix');

    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== refactor (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'buggy.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(
      post.status,
      0,
      `buggy.js still fails after claw's fix:\n${post.stderr.slice(0, 800)}`,
    );
  });
});
