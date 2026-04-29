// Adversarial inputs: implement a function whose assertions exceed the prompt.
//
// Difficulty knob (rule #6): edge cases NOT mentioned in the prompt. The prompt
// describes a slugify in plain English. The naive `text.toLowerCase().replace(/ /g, '-')`
// passes the basic case and fails everything else. A model that anticipates real
// inputs — multiple spaces, punctuation, leading/trailing whitespace, repeated
// separators, empty input — passes. A model that pattern-matches "lowercase +
// hyphenated" and stops there fails 3+ assertions.
//
// This test specifically probes "do you write defensive regex" — a habit that
// scales with model size. Per rule #7, all assertions test behavior on inputs
// not enumerated in the prompt.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw, writeAssertionResult } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const VERIFY_JS = `\
import assert from 'node:assert/strict';
import { slugify } from './slugify.js';

assert.equal(slugify('Hello World'),         'hello-world',   'basic two-word');
assert.equal(slugify('  Hello   World  '),   'hello-world',   'leading/trailing/repeated spaces');
assert.equal(slugify('Hello, World!'),       'hello-world',   'punctuation stripped');
assert.equal(slugify('Hello---World'),       'hello-world',   'collapse repeated separators');
assert.equal(slugify('hello_world'),         'hello-world',   'underscores become hyphens');
assert.equal(slugify(''),                    '',              'empty input');
assert.equal(slugify('   '),                 '',              'whitespace-only input');
assert.equal(slugify('CamelCase Words 42'),  'camelcase-words-42', 'mixed case and digits');
`;

const PROMPT =
  'Create slugify.js that exports a single function `slugify(text)` which ' +
  'converts a string to a URL-friendly slug: lowercase, words separated by ' +
  'single hyphens. Then ensure that `node verify.js` exits 0. Do not edit verify.js.';

const CLAW_TIMEOUT = 240_000;
const TIMEOUT = CLAW_TIMEOUT + 20_000;

describe(`adversarial inputs: slugify (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw implements slugify robustly enough for adversarial inputs', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    console.log(`\n=== adversarial-input (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    const slugifyJsExists = workspace.exists('slugify.js');
    let post = null;
    if (r.code === 0 && slugifyJsExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout:  5_000,
      });
      console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);
    }

    writeAssertionResult(r.runDir, {
      passed: r.code === 0 && slugifyJsExists && post != null && post.status === 0,
      claw_exit: r.code,
      target_file_exists: slugifyJsExists,
      post_status: post ? post.status : null,
      post_stderr_tail: post ? post.stderr.slice(0, 800) : null,
    });

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(slugifyJsExists, true, 'slugify.js must be created');
    assert.equal(post.status, 0, `verify.js failed:\n${post.stderr.slice(0, 800)}`);
  });
});
