// Null-default: implement a getter that distinguishes "missing" from "falsy".
//
// Difficulty knob: 1 file × 1 hidden edge case. Naive `obj[key] || fallback`
// returns the fallback for 0, '', false — wrong. Correct uses `??` (or
// explicit `=== undefined` / `in`). Tested without that edge mentioned in
// the prompt.
//
// Target: easy-medium (7B ~80-95%, 14B ~95%, 30B 100%).

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
import { getOrDefault } from './lookup.js';

assert.equal(getOrDefault({ a: 1 },     'a', 99), 1,    'present value');
assert.equal(getOrDefault({},           'a', 99), 99,   'missing key');
assert.equal(getOrDefault({ a: 0 },     'a', 99), 0,    'zero is not missing');
assert.equal(getOrDefault({ a: '' },    'a', 99), '',   'empty string is not missing');
assert.equal(getOrDefault({ a: false }, 'a', 99), false,'false is not missing');
assert.equal(getOrDefault({ a: null },  'a', 99), null, 'null is a real value');
`;

const PROMPT =
  'Create lookup.js that exports `getOrDefault(obj, key, fallback)`. It returns ' +
  'obj[key] when the key is present, otherwise fallback. Then ensure that ' +
  '`node verify.js` exits 0. Do not edit verify.js.';

const TIMEOUT = 300_000;

describe(`null-default: missing vs falsy (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw distinguishes missing from falsy', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== null-default (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(workspace.exists('lookup.js'), true, 'lookup.js must be created');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(post.status, 0, `verify.js failed:\n${post.stderr.slice(0, 800)}`);
  });
});
