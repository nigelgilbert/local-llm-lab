/** @manifest
 * {
 *   "test_id": "cascade-eight",
 *   "test_version": "v1",
 *   "primary_axis": "convergence",
 *   "secondary_axes": ["tool_discipline"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps. Companion to cascading-bugs (5 steps); this extends to 8 to probe long-horizon iteration fatigue.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": ["context_pressure_high"],
 *   "introduced_in": "1.21",
 *   "notes": "H1 hand-authored; extends cascading-bugs.test.js (5-step) to 8 unrelated bugs across 8 files. Single test runner reports only the first failing assertion, so each fix exposes the next failure — model must loop fix→re-run→fix until clean. Bugs are individually trivial; the test measures the LOOP, not per-bug skill."
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { runClaw, writeAssertionResult } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const A_JS = `\
export function inc(n) { return n + 2; }   // bug: should be n + 1
`;

const B_JS = `\
export function double(n) { return n + n + 1; }   // bug: should be n + n (or n * 2)
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

const F_JS = `\
export function last(arr) { return arr[arr.length]; }   // bug: off-by-one; should be arr[arr.length - 1]
`;

const G_JS = `\
export function sumArr(arr) { return arr.reduce((s, x) => s + x, 1); }   // bug: initial value should be 0
`;

const H_JS = `\
export function clamp(n, lo, hi) { return Math.min(lo, Math.max(n, hi)); }   // bug: min and max swapped
`;

const RUN_JS = `\
import assert from 'node:assert/strict';
import { inc }     from './a.js';
import { double }  from './b.js';
import { negate }  from './c.js';
import { isEven } from './d.js';
import { head }    from './e.js';
import { last }    from './f.js';
import { sumArr } from './g.js';
import { clamp }  from './h.js';

// node assert short-circuits — only the first failing assertion is reported.
assert.equal(inc(1),                 2,    'inc(1) === 2');
assert.equal(double(3),              6,    'double(3) === 6');
assert.equal(negate(5),              -5,   'negate(5) === -5');
assert.equal(isEven(4),              true, 'isEven(4) === true');
assert.equal(head([7, 8, 9]),        7,    'head([7,8,9]) === 7');
assert.equal(last([7, 8, 9]),        9,    'last([7,8,9]) === 9');
assert.equal(sumArr([1, 2, 3, 4]),  10,    'sumArr([1,2,3,4]) === 10');
assert.equal(clamp(15, 0, 10),      10,    'clamp(15, 0, 10) === 10');
console.log('all-pass');
`;

const PROMPT =
  'run.js executes assertions on eight helpers from a.js through h.js, ' +
  'and exits non-zero on the first failure. There are several bugs across ' +
  'the helper files. Run `node run.js`, observe the failure, fix the ' +
  'responsible helper, then run again. Continue until `node run.js` exits ' +
  '0 (printing "all-pass"). Do not edit run.js.';

const CLAW_TIMEOUT = 240_000;

describe(`cascade-eight: 8 sequential failures, one runner (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'a.js'),    A_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'b.js'),    B_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'c.js'),    C_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'd.js'),    D_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'e.js'),    E_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'f.js'),    F_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'g.js'),    G_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'h.js'),    H_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'run.js'),  RUN_JS);
  });

  it('claw iterates fix/re-run until run.js exits clean', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'run.js')], {
      encoding: 'utf8',
      timeout: 5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: run.js must fail before fixes');

    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'run.js')], {
      encoding: 'utf8',
      timeout: 5_000,
    });

    const passed = r.code === 0 && post.status === 0 && /all-pass/.test(post.stdout);

    console.log(`\n=== cascade-eight (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);
    console.log(`  node post-fix: exit=${post.status} stdout=${post.stdout.trim()} stderr=${post.stderr.slice(0,300).trim()}`);

    writeAssertionResult(r.runDir, {
      passed,
      claw_exit: r.code,
      target_file_exists: null,
      post_status: post.status,
      post_stderr_tail: post.stderr.slice(0, 800),
    });

    if (r.terminal_status === 'timeout') assert.fail(`claw timed out after ${r.elapsedMs}ms`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(post.status, 0, `run.js still fails:\n${post.stderr.slice(0, 800)}`);
    assert.match(post.stdout, /all-pass/, 'expected all-pass marker');
  });
});
