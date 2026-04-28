// Distractor: 1 file × 1 buggy function among 3 working ones.
//
// Difficulty knob (per docs/EVAL-DESIGN.md rule #6): plausible-but-correct
// distractor code in the seed. The model must read the whole file, identify
// which function actually has the bug, and edit only that one. Smaller models
// tend to either (a) not read the working code carefully enough and "fix"
// something that wasn't broken, or (b) flag the bug correctly but rewrite
// adjacent code unnecessarily, which still passes the assertion but burns
// turns and tokens.
//
// File names and assertion messages are deliberately neutral — no `// FIXME`
// hints, no `buggy_*` filenames (rule #8).

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

// Three correct, one wrong. `diagonal` returns w+h instead of √(w²+h²).
// Other three are textbook-correct geometry one-liners; a careless reader
// might "fix" `area` (which uses `*`, not `**`) thinking the bug is there.
const GEOMETRY_JS = `\
export function area(w, h) {
  return w * h;
}

export function perimeter(w, h) {
  return 2 * (w + h);
}

export function circumference(r) {
  return 2 * Math.PI * r;
}

export function diagonal(w, h) {
  return w + h;
}
`;

const VERIFY_JS = `\
import assert from 'node:assert/strict';
import { area, perimeter, circumference, diagonal } from './geometry.js';

assert.equal(area(3, 4),         12, 'area mismatch');
assert.equal(perimeter(3, 4),    14, 'perimeter mismatch');
assert.equal(Math.round(circumference(1) * 1000) / 1000, 6.283, 'circumference mismatch');
assert.equal(diagonal(3, 4),      5, 'diagonal mismatch');
assert.equal(diagonal(5, 12),    13, 'diagonal mismatch');
assert.equal(diagonal(8, 15),    17, 'diagonal mismatch');
`;

const PROMPT =
  'verify.js imports four geometry helpers from geometry.js and runs ' +
  'assertions on each. One assertion currently fails. Find which helper ' +
  'is wrong and fix only that helper. Do not modify verify.js or any ' +
  'helper that is already correct.';

const TIMEOUT = 300_000;

describe(`distractor: one buggy helper among three (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'geometry.js'), GEOMETRY_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'),   VERIFY_JS);
  });

  it('claw fixes only the broken helper', { timeout: TIMEOUT }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: verify.js must fail before the fix');

    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== distractor (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(
      post.status,
      0,
      `verify.js still fails after claw's fix:\n${post.stderr.slice(0, 800)}`,
    );
  });
});
