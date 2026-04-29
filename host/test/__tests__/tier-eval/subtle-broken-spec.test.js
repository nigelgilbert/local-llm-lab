// Subtle broken spec: the prompt is internally suggestive ("compact form,
// omit zero components"), but the verify script tests the OPPOSITE behavior
// for zero-component edge cases. The model writes the natural compact-form
// implementation, fails on `formatTime(0)`, `formatTime(60)`, and similar
// zero-minute / zero-second cases, and must iterate to converge on the
// verbose form the verify actually demands.
//
// Predicted dominant class: A (verify-loop) with a CLEANER trace than
// expression-eval — the failure is concentrated on 2-3 specific assertions
// rather than spread across 25+, so the W4 classifier can produce sharper
// Class-A signatures for downstream lever authoring.
//
// Methodology caveat: this is intentional spec deception. The audit flags
// it as an ethical test-design call. Including in the pilot per the user's
// decision; if the trace shape ends up dominated by deception-handling
// rather than iteration-loop behavior, exclude from the production suite
// and report as a methodology note.

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
import { formatTime } from './formatTime.js';

// Under-minute durations.
assert.equal(formatTime(5),     '5s',         '5 seconds');
assert.equal(formatTime(45),    '45s',        '45 seconds');
assert.equal(formatTime(59),    '59s',        '59 seconds');

// Minute range — verify REQUIRES the seconds component even when zero.
// The prompt's "omit zero components" framing pushes the model toward '1m'.
assert.equal(formatTime(60),    '1m 0s',      'exactly 1 minute (verbose form)');
assert.equal(formatTime(65),    '1m 5s',      '1 minute 5 seconds');
assert.equal(formatTime(125),   '2m 5s',      '2 minutes 5 seconds');
assert.equal(formatTime(3599),  '59m 59s',    'just under an hour');

// Hour range — verify REQUIRES the minutes component even when zero.
assert.equal(formatTime(3600),  '1h 0m',      'exactly 1 hour (verbose form)');
assert.equal(formatTime(3661),  '1h 1m',      '1 hour 1 minute (drops seconds)');
assert.equal(formatTime(7200),  '2h 0m',      'exactly 2 hours (verbose form)');
assert.equal(formatTime(36000), '10h 0m',     '10 hours');

// Zero — the prompt's "compact form" implies empty string; verify demands '0s'.
assert.equal(formatTime(0),     '0s',         'zero seconds');
`;

const PROMPT =
  'Create formatTime.js exporting `formatTime(seconds)` that returns a ' +
  'concise human-readable duration string. Always drop zero-valued ' +
  'components — only show parts of the duration that have a non-zero ' +
  'value. Examples:\n' +
  '  - formatTime(125)  → "2m 5s"     (minutes and seconds)\n' +
  '  - formatTime(65)   → "1m 5s"     (minutes and seconds)\n' +
  '  - formatTime(60)   → "1m"        (zero seconds dropped)\n' +
  '  - formatTime(3661) → "1h 1m"     (zero seconds dropped)\n' +
  '  - formatTime(3600) → "1h"        (zero minutes dropped)\n' +
  '  - formatTime(45)   → "45s"       (just seconds)\n' +
  '  - formatTime(0)    → ""          (empty string for zero duration)\n' +
  'Then ensure `node verify.js` exits 0. Do not edit verify.js.';

const CLAW_TIMEOUT = 180_000;
const TIMEOUT = CLAW_TIMEOUT + 20_000;

describe(`subtle-broken-spec: formatTime with prompt/verify mismatch (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw implements formatTime to match verify (despite suggestive prompt)', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    console.log(`\n=== subtle-broken-spec (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    const formatTimeJsExists = workspace.exists('formatTime.js');
    let post = null;
    if (r.code === 0 && formatTimeJsExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout:  5_000,
      });
      console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);
    }

    writeAssertionResult(r.runDir, {
      passed: r.code === 0 && formatTimeJsExists && post != null && post.status === 0,
      claw_exit: r.code,
      target_file_exists: formatTimeJsExists,
      post_status: post ? post.status : null,
      post_stderr_tail: post ? post.stderr.slice(0, 800) : null,
    });

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(formatTimeJsExists, true, 'formatTime.js must be created');
    assert.equal(post.status, 0, `verify.js failed:\n${post.stderr.slice(0, 800)}`);
  });
});
