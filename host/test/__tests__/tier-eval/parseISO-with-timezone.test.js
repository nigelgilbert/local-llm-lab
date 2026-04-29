// parseISO with timezone: implement an ISO 8601 parser that handles offsets and
// invalid input.
//
// Difficulty knob (rule #6): the natural `return new Date(s)` implementation
// passes the well-formed cases (since Date already parses most ISO 8601), but
// fails the invalid-input assertions because Date returns `Invalid Date`
// rather than throwing. The model must validate input and re-throw on bad
// strings — the same shape as the throw-on-error path in expression-eval, but
// with a much narrower spec, producing a cleaner Class-A trace.
//
// Predicted dominant class: A (verify-loop on offset arithmetic or invalid-
// input detection). Diversifies the A-class population beyond expression-eval.
// Pilot first; may be too easy at tier-64 since Date manipulation is well-
// trained.

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
import { parseISO } from './iso.js';

const ZULU = parseISO('2024-01-15T10:30:00Z');
assert.ok(ZULU instanceof Date,                                                'Z returns Date instance');
assert.equal(ZULU.getTime(),                Date.UTC(2024, 0, 15, 10, 30, 0),  'UTC Z basic');
assert.equal(parseISO('2024-01-15T10:30:00.123Z').getTime(),
             Date.UTC(2024, 0, 15, 10, 30, 0) + 123,                           'milliseconds');
assert.equal(parseISO('2024-01-15T10:30:00+00:00').getTime(), ZULU.getTime(),  '+00:00 equals Z');
assert.equal(parseISO('2024-01-15T10:30:00+05:30').getTime(),
             Date.UTC(2024, 0, 15,  5,  0, 0),                                 '+05:30 offset');
assert.equal(parseISO('2024-01-15T18:30:00-08:00').getTime(),
             Date.UTC(2024, 0, 16,  2, 30, 0),                                 '-08:00 offset');
assert.equal(parseISO('2024-06-15T14:00:00-05:30').getTime(),
             Date.UTC(2024, 5, 15, 19, 30, 0),                                 '-05:30 offset');
assert.ok(parseISO('2024-01-15T10:30:00') instanceof Date,                     'no-offset returns Date');

assert.throws(() => parseISO(123),                  /string|invalid|input/i,   'non-string throws');
assert.throws(() => parseISO(''),                   /empty|invalid|input/i,    'empty string throws');
assert.throws(() => parseISO('not a date'),         /invalid|format|parse/i,   'gibberish throws');
assert.throws(() => parseISO('2024-13-15T10:30:00Z'), /invalid|month|range/i,  'invalid month throws');
`;

const PROMPT =
  'Create iso.js that exports a single function `parseISO(s)` returning a ' +
  'Date for ISO 8601 strings. Handle:\n' +
  '  - UTC `Z` suffix (e.g. "2024-01-15T10:30:00Z").\n' +
  '  - Fractional seconds (e.g. "...10:30:00.123Z").\n' +
  '  - Fixed offsets like `+05:30`, `-08:00`, `+00:00`.\n' +
  '  - No-offset strings (assume local time).\n' +
  '  - Invalid input: throw an Error with a descriptive message. Triggers:\n' +
  '      • non-string input → message contains "string", "invalid", or "input"\n' +
  '      • empty string → message contains "empty", "invalid", or "input"\n' +
  '      • unparseable string → message contains "invalid", "format", or "parse"\n' +
  '      • out-of-range fields (e.g. month 13) → message contains "invalid", "month", or "range"\n' +
  'Then ensure `node verify.js` exits 0. Do not edit verify.js.';

const CLAW_TIMEOUT = 180_000;
const TIMEOUT = CLAW_TIMEOUT + 20_000;

describe(`parseISO-with-timezone: ISO 8601 parser (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw implements parseISO with offset handling and invalid-input throws', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    console.log(`\n=== parseISO-with-timezone (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    const isoJsExists = workspace.exists('iso.js');
    let post = null;
    if (r.code === 0 && isoJsExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout:  5_000,
      });
      console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);
    }

    writeAssertionResult(r.runDir, {
      passed: r.code === 0 && isoJsExists && post != null && post.status === 0,
      claw_exit: r.code,
      target_file_exists: isoJsExists,
      post_status: post ? post.status : null,
      post_stderr_tail: post ? post.stderr.slice(0, 800) : null,
    });

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(isoJsExists, true, 'iso.js must be created');
    assert.equal(post.status, 0, `verify.js failed:\n${post.stderr.slice(0, 800)}`);
  });
});
