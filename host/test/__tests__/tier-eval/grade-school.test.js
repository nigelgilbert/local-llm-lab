/** @manifest
 * {
 *   "test_id": "grade-school",
 *   "test_version": "v1",
 *   "primary_axis": "stateful_logic",
 *   "secondary_axes": ["spec_precision"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps. Flagged for ceiling risk on t32 — runner-up swap is robot-name (memos/aider-calibration-note.md).",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [],
 *   "introduced_in": "1.21",
 *   "notes": "Adapted from Exercism JS 'grade-school' (MIT); mutation depth: STANDARD; key changes: class ClassRoster (not GradeSchool), enroll(name,year) returns {enrolled, transferredFrom} with transfer semantic (re-enroll moves student between years; canonical refuses), withdraw(name) added, cohort() sorts reverse-alpha (not forward), everyone() returns [{name,year}] objects (not flat names). Canonical at host/test/docs/difficulty-pack/canonicals/grade-school/"
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

const VERIFY_JS = `\
import assert from 'node:assert/strict';
import { ClassRoster } from './grade-school.js';

// Empty roster
{
  const r = new ClassRoster();
  assert.deepEqual(r.cohort(1), [], 'empty cohort');
  assert.deepEqual(r.everyone(), [], 'empty everyone');
}

// Single enrollment
{
  const r = new ClassRoster();
  const result = r.enroll('Anna', 1);
  assert.deepEqual(result, { enrolled: true, transferredFrom: null }, 'fresh enrollment');
  assert.deepEqual(r.cohort(1), ['Anna'], 'cohort(1) after enroll');
}

// Transfer: re-enrolling moves the student
{
  const r = new ClassRoster();
  r.enroll('Anna', 1);
  const result = r.enroll('Anna', 2);
  assert.deepEqual(result, { enrolled: true, transferredFrom: 1 }, 'transfer reports old year');
  assert.deepEqual(r.cohort(1), [], 'cohort(1) empty after transfer');
  assert.deepEqual(r.cohort(2), ['Anna'], 'cohort(2) has Anna after transfer');
}

// Self-transfer (re-enroll in same year): treated as transferredFrom: same year? Or null?
// Spec: "transferredFrom" describes the previous year. Self re-enroll → previous year IS the same year.
// Safer convention: self re-enroll is a no-op transfer reporting transferredFrom: <same year>.
{
  const r = new ClassRoster();
  r.enroll('Anna', 1);
  const result = r.enroll('Anna', 1);
  assert.deepEqual(result, { enrolled: true, transferredFrom: 1 }, 'self-transfer reports same year');
  assert.deepEqual(r.cohort(1), ['Anna'], 'still in cohort(1)');
}

// Reverse-alpha sort within a cohort
{
  const r = new ClassRoster();
  r.enroll('Bob', 2);
  r.enroll('Anna', 2);
  r.enroll('Charlie', 2);
  assert.deepEqual(r.cohort(2), ['Charlie', 'Bob', 'Anna'], 'cohort sorted reverse-alpha');
}

// everyone(): year ascending, then alpha ascending within year
{
  const r = new ClassRoster();
  r.enroll('Bob', 2);
  r.enroll('Anna', 2);
  r.enroll('Zara', 1);
  r.enroll('Yuri', 1);
  r.enroll('Charlie', 3);
  assert.deepEqual(
    r.everyone(),
    [
      { name: 'Yuri', year: 1 },
      { name: 'Zara', year: 1 },
      { name: 'Anna', year: 2 },
      { name: 'Bob', year: 2 },
      { name: 'Charlie', year: 3 },
    ],
    'everyone() sorted year-asc then alpha-asc'
  );
}

// withdraw existing student
{
  const r = new ClassRoster();
  r.enroll('Anna', 1);
  r.enroll('Bob', 1);
  assert.equal(r.withdraw('Anna'), true, 'withdraw existing');
  assert.deepEqual(r.cohort(1), ['Bob'], 'Anna gone from cohort');
}

// withdraw non-existent
{
  const r = new ClassRoster();
  assert.equal(r.withdraw('Ghost'), false, 'withdraw never-enrolled returns false');
}

// withdraw twice — second time false
{
  const r = new ClassRoster();
  r.enroll('Anna', 1);
  assert.equal(r.withdraw('Anna'), true, 'first withdraw true');
  assert.equal(r.withdraw('Anna'), false, 'second withdraw false');
}

// Combined: enroll, transfer, withdraw, verify everyone()
{
  const r = new ClassRoster();
  r.enroll('Anna', 1);
  r.enroll('Bob', 2);
  r.enroll('Charlie', 1);
  r.enroll('Anna', 2);     // Anna transfers from 1 to 2
  r.withdraw('Bob');        // Bob leaves
  assert.deepEqual(r.cohort(1), ['Charlie'], 'cohort(1) after transfer-out');
  assert.deepEqual(r.cohort(2), ['Anna'], 'cohort(2) after transfer-in and withdraw');
  assert.deepEqual(
    r.everyone(),
    [
      { name: 'Charlie', year: 1 },
      { name: 'Anna', year: 2 },
    ],
    'final roster'
  );
}

// Cohort for unknown year: empty array (not throw)
{
  const r = new ClassRoster();
  r.enroll('Anna', 1);
  assert.deepEqual(r.cohort(99), [], 'unknown year returns []');
}
`;

const PROMPT = `\
Create grade-school.js that exports a class \`ClassRoster\`.

The class manages a student roster across grade-year cohorts. Each student
is enrolled in exactly one year at a time.

API:

  \`enroll(name, year)\` — Enroll the student in the given year.
    - If \`name\` is not currently enrolled, place them in \`year\`.
    - If \`name\` is already enrolled (in some year, possibly the same one),
      MOVE them to \`year\`. This is a "transfer".
    - Returns \`{ enrolled: true, transferredFrom: <number> | null }\` where
      \`transferredFrom\` is the previous year (or \`null\` if this was a
      fresh enrollment). For a self-transfer (same year), report the same
      year value.

  \`withdraw(name)\` — Remove the student from the roster entirely.
    - Returns \`true\` if the student was enrolled.
    - Returns \`false\` if the student was not on the roster.

  \`cohort(year)\` — Return the names enrolled in \`year\`, sorted in
    REVERSE alphabetical order (Z first). Return \`[]\` for unknown years
    (do not throw).

  \`everyone()\` — Return all enrolled students as an array of objects
    \`{ name, year }\`, sorted by year ascending, then by name ascending
    within each year.

Names are case-sensitive strings. Years are positive integers.

Then ensure \`node verify.js\` exits 0. Do not edit verify.js.`;

const CLAW_TIMEOUT = 240_000;

describe(`grade-school: roster with transfers and withdrawals (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw solves the task', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const targetExists = workspace.exists('grade-school.js');
    let post = null;
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout: 10_000,
      });
    }
    const passed = r.code === 0 && targetExists && post?.status === 0;

    console.log(`\n=== grade-school (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);
    if (post) console.log(`  verify: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    writeAssertionResult(r.runDir, {
      passed,
      claw_exit: r.code,
      target_file_exists: targetExists,
      post_status: post?.status ?? null,
      post_stderr_tail: post?.stderr?.slice(0, 800) ?? null,
    });

    if (r.terminal_status === 'timeout') assert.fail(`claw timed out after ${r.elapsedMs}ms`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(targetExists, true, 'grade-school.js must be created');
    assert.equal(post?.status, 0, `verify.js failed:\n${post?.stderr?.slice(0, 800)}`);
  });
});
