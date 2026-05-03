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
 *   "notes": "H1 hand-authored; extends cascading-bugs.test.js (5-step) to 9 unrelated bugs across 9 files (test_id retained for registry continuity, not literally 'eight'). Single test runner reports only the first failing assertion, so each fix exposes the next failure — model must loop fix→re-run→fix until clean. Cycle 1+2 saturated 100/100% — hardened isEven (subtle zero-handling bug masked by short-circuit; needs both isEven(4)=true AND isEven(0)=true assertions) and sumArr (string-concat masquerading as numeric reduce); naive 'fix the obvious bug' heuristic now fails. Cycle-3 tweak (analyze-agent): added a 9th file i.js with a NaN/indexOf trap; the bug requires the model to know that indexOf uses === so NaN is unfindable and the fix must use Array.prototype.includes (which uses SameValueZero). Cycle-4 enforcement (post c3-evidence-of-bypass): added SHA256 checksum gate on run.js — c3 showed all 6 reps trivially solved by editing run.js to remove the 9th-file import despite 'do not edit' instruction. Test now hard-fails if run.js disk hash != seeded RUN_JS_HASH."
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
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
// bug: misses zero-handling — isEven(0) returns false because 0 || ... short-circuits
export function isEven(n) { return (n % 2 === 0) && n !== 0; }
`;

const E_JS = `\
export function head(arr) { return arr[1]; }   // bug: should be arr[0]
`;

const F_JS = `\
export function last(arr) { return arr[arr.length]; }   // bug: off-by-one; should be arr[arr.length - 1]
`;

const G_JS = `\
// bug: subtle — uses Array.prototype.reduce with initial value but accumulator
// is a string concat instead of numeric sum. Returns "01234" instead of 10.
export function sumArr(arr) { return arr.reduce((s, x) => '' + s + x, 0); }
`;

const H_JS = `\
export function clamp(n, lo, hi) { return Math.min(lo, Math.max(n, hi)); }   // bug: min and max swapped
`;

// Subtle: indexOf-based contains misses NaN because NaN !== NaN.
// The "obvious" fix (return arr.includes(x)) PASSES the visible test but
// also requires the model to recognize that includes() handles NaN where
// indexOf does not — a JS quirk that distinguishes "fix the symptom" from
// "fix the cause."
const I_JS = `\
export function contains(arr, x) { return arr.indexOf(x) !== -1; }   // bug: NaN never equals itself
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
import { contains } from './i.js';

// node assert short-circuits — only the first failing assertion is reported.
assert.equal(inc(1),                 2,    'inc(1) === 2');
assert.equal(double(3),              6,    'double(3) === 6');
assert.equal(negate(5),              -5,   'negate(5) === -5');
assert.equal(isEven(4),              true, 'isEven(4) === true');
assert.equal(isEven(0),              true, 'isEven(0) === true (zero is even)');
assert.equal(head([7, 8, 9]),        7,    'head([7,8,9]) === 7');
assert.equal(last([7, 8, 9]),        9,    'last([7,8,9]) === 9');
assert.equal(sumArr([1, 2, 3, 4]),  10,    'sumArr([1,2,3,4]) === 10 (numeric sum, not string concat)');
assert.equal(clamp(15, 0, 10),      10,    'clamp(15, 0, 10) === 10');
assert.equal(contains([1, 2, NaN, 3], NaN), true, 'contains: NaN must be findable (indexOf does not find NaN)');
assert.equal(contains([1, 2, 3], 4),         false, 'contains: missing element returns false');
console.log('all-pass');
`;

const PROMPT =
  'run.js executes assertions on nine helpers from a.js through i.js, ' +
  'and exits non-zero on the first failure. There are several bugs across ' +
  'the helper files. Run `node run.js`, observe the failure, fix the ' +
  'responsible helper, then run again. Continue until `node run.js` exits ' +
  '0 (printing "all-pass"). Do not edit run.js — it is checksum-protected ' +
  'and any modification will fail the test.';

const RUN_JS_HASH = crypto.createHash('sha256').update(RUN_JS).digest('hex');

const CLAW_TIMEOUT = 285_000;

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
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'i.js'),    I_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'run.js'),  RUN_JS);
  });

  it('claw iterates fix/re-run until run.js exits clean', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'run.js')], {
      encoding: 'utf8',
      timeout: 5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: run.js must fail before fixes');

    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    // Post-1.21 cycle-3 enforcement: model is told "do not edit run.js" in the
    // prompt, but c3 evidence showed all 6 reps modified run.js to remove the
    // 9th-file (i.js) import line and bypass the bug-trap. Compare a SHA256
    // of run.js against the seeded version; fail loudly if it changed.
    const runJsPath = path.join(workspace.WORKSPACE, 'run.js');
    const runJsExists = fs.existsSync(runJsPath);
    const runJsDiskHash = runJsExists
      ? crypto.createHash('sha256').update(fs.readFileSync(runJsPath)).digest('hex')
      : null;
    const runJsTampered = runJsExists && runJsDiskHash !== RUN_JS_HASH;

    const post = spawnSync('node', [runJsPath], {
      encoding: 'utf8',
      timeout: 5_000,
    });

    const passed = !runJsTampered && r.code === 0 && post.status === 0 && /all-pass/.test(post.stdout);

    console.log(`\n=== cascade-eight (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);
    console.log(`  run.js: exists=${runJsExists} hash_ok=${!runJsTampered} (expected ${RUN_JS_HASH.slice(0,12)}, got ${runJsDiskHash?.slice(0,12) ?? 'n/a'})`);
    console.log(`  node post-fix: exit=${post.status} stdout=${post.stdout.trim()} stderr=${post.stderr.slice(0,300).trim()}`);

    writeAssertionResult(r.runDir, {
      passed,
      claw_exit: r.code,
      target_file_exists: null,
      run_js_tampered: runJsTampered,
      post_status: post.status,
      post_stderr_tail: post.stderr.slice(0, 800),
    });

    if (r.terminal_status === 'timeout') assert.fail(`claw timed out after ${r.elapsedMs}ms`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(runJsTampered, false, 'model edited run.js — bug-trap cannot fire (prompt forbids editing run.js)');
    assert.equal(post.status, 0, `run.js still fails:\n${post.stderr.slice(0, 800)}`);
    assert.match(post.stdout, /all-pass/, 'expected all-pass marker');
  });
});
