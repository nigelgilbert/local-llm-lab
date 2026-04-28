// Deep-equal: implement structural equality with adversarial values.
//
// Difficulty knob: 1 file × multiple hidden edges. Naive `JSON.stringify(a) ===
// JSON.stringify(b)` fails on NaN (becomes null), Date objects, and is order-
// sensitive on plain objects. A correct solution recursively compares.
//
// Target: easy-medium (7B 70-90%, 14B 90-100%, 30B 100%). NaN-equals-NaN
// is the trip wire: it's the one place where direct `===` deliberately
// disagrees with deep equality.

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
import { isEqual } from './eq.js';

assert.equal(isEqual(1, 1),                                   true,  'primitives equal');
assert.equal(isEqual(1, 2),                                   false, 'primitives unequal');
assert.equal(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }),         true,  'key order should not matter');
assert.equal(isEqual({ a: 1 }, { a: 1, b: 2 }),               false, 'extra key on right');
assert.equal(isEqual([1, 2, 3], [1, 2, 3]),                   true,  'arrays equal');
assert.equal(isEqual([1, 2, 3], [1, 2]),                      false, 'arrays unequal length');
assert.equal(isEqual({ a: { b: [1] } }, { a: { b: [1] } }),   true,  'nested equal');
assert.equal(isEqual({ a: { b: [1] } }, { a: { b: [2] } }),   false, 'nested unequal');
assert.equal(isEqual(NaN, NaN),                               true,  'NaN must equal NaN');
assert.equal(isEqual(0, -0),                                  true,  '+0 and -0 equal');
`;

const PROMPT =
  'Create eq.js that exports `isEqual(a, b)` returning true when a and b are ' +
  'structurally equal. It should handle primitives, plain objects, and arrays ' +
  'recursively. Then ensure `node verify.js` exits 0. Do not edit verify.js.';

const TIMEOUT = 300_000;

describe(`deep-equal: structural equality (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw implements deep equality including NaN', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== deep-equal (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(workspace.exists('eq.js'), true, 'eq.js must be created');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(post.status, 0, `verify.js failed:\n${post.stderr.slice(0, 800)}`);
  });
});
