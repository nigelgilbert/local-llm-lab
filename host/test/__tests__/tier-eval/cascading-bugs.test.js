// Cascading bugs: fix one, expose the next. Forces multi-cycle iteration.
//
// Difficulty knob: a single test runner reports only the FIRST failing
// assertion. There are 5 unrelated bugs across 5 files. The model can
// only see them one at a time — each fix exposes the next failure. A
// model that runs once, fixes what it sees, and stops gets 1/5; the
// task only completes when the model loops fix → re-run → fix until
// the runner exits clean.
//
// Bugs are intentionally trivial individually so we measure the LOOP,
// not per-bug skill.
//
// Target: very hard (long-horizon agentic).

/** @manifest
 * {
 *   "test_id": "cascading-bugs",
 *   "test_version": "v1",
 *   "primary_axis": "convergence",
 *   "secondary_axes": [
 *     "tool_discipline"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 multi-cycle iteration is core to convergence axis.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [
 *     "context_pressure_high"
 *   ]
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

const A_JS = `\
export function inc(n) { return n + 2; }   // bug: should be n + 1
`;

const B_JS = `\
export function double(n) { return n + n + 1; }   // bug: should be n + n
`;

const C_JS = `\
export function negate(n) { return n; }   // bug: should be -n
`;

const D_JS = `\
export function isEven(n) { return n % 2 === 1; }   // bug: should be === 0
`;

const E_JS = `\
export function head(arr) { return arr[1]; }   // bug: should be arr[0]
`;

const RUN_JS = `\
import assert from 'node:assert/strict';
import { inc }    from './a.js';
import { double } from './b.js';
import { negate } from './c.js';
import { isEven } from './d.js';
import { head }   from './e.js';

// node assert short-circuits — only the first failing assertion is reported.
assert.equal(inc(1),       2,    'inc(1) === 2');
assert.equal(double(3),    6,    'double(3) === 6');
assert.equal(negate(5),    -5,   'negate(5) === -5');
assert.equal(isEven(4),    true, 'isEven(4) === true');
assert.equal(head([7,8,9]), 7,   'head([7,8,9]) === 7');
console.log('all-pass');
`;

const PROMPT =
  'run.js executes assertions on five helpers from a.js, b.js, c.js, d.js, ' +
  'and e.js, and exits non-zero on the first failure. There are several ' +
  'bugs across the helper files. Run `node run.js`, observe the failure, ' +
  'fix the responsible helper, then run again. Continue until ' +
  '`node run.js` exits 0 (printing "all-pass"). Do not edit run.js.';

const TIMEOUT = 300_000;

describe(`cascading-bugs: 5 sequential failures, one runner (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'a.js'),    A_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'b.js'),    B_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'c.js'),    C_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'd.js'),    D_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'e.js'),    E_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'run.js'),  RUN_JS);
  });

  it('claw iterates run/fix until run.js exits clean', { timeout: TIMEOUT }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'run.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: run.js must fail before fixes');

    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== cascading-bugs (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'run.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stdout=${post.stdout.trim()} stderr=${post.stderr.slice(0,300).trim()}`);

    assert.equal(post.status, 0, `run.js still fails:\n${post.stderr.slice(0, 800)}`);
    assert.match(post.stdout, /all-pass/, 'expected all-pass marker');
  });
});
