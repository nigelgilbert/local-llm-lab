/** @manifest
 * {
 *   "test_id": "word-search",
 *   "test_version": "v1",
 *   "primary_axis": "spec_precision",
 *   "secondary_axes": ["multi_file_context"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps. Flagged for floor risk on t16 (difficulty-8 pick) — runner-up swap is ledger (memos/aider-calibration-note.md).",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [],
 *   "introduced_in": "1.21",
 *   "notes": "Adapted from Exercism JS 'word-search' (MIT); mutation depth: STANDARD; key changes: locate(targets, board) free function (not class+find), 4 directions only (drop diagonals — H L→R, H R→L, V T→B, V B→T), 0-indexed coordinates with named axes {begin:{row,col}, finish:{row,col}} (not 1-indexed [r,c] arrays), absent words return null (not undefined). Canonical at host/test/docs/difficulty-pack/canonicals/word-search/. Cycle-3 tweak (analyze-agent): replaced per-key deepEqual with a check() helper that includes expected vs actual + full result object in messages on failure; consolidated the 5-word multi-target case into a single combined assertion so the model sees all word locations and the missing-key sentinel together (one shot vs five iterative debugging cycles). Targets c2 'ran out of budget after 9 iters' pattern."
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
import { locate } from './word-search.js';

function check(label, expected, actual) {
  try {
    assert.deepEqual(actual, expected);
  } catch (e) {
    const msg = label + ' — expected ' + JSON.stringify(expected) +
                ', got ' + JSON.stringify(actual);
    assert.deepEqual(actual, expected, msg);
  }
}

// Trivial: single word, horizontal L→R in row 0
{
  const board = ['CAT', 'XYZ', 'PQR'];
  const r = locate(['CAT'], board);
  check('CAT L→R row 0 / full result', {
    CAT: { begin: { row: 0, col: 0 }, finish: { row: 0, col: 2 } },
  }, r);
}

// Horizontal R→L: word reversed in the grid (begin col > finish col)
{
  const board = ['XCATX', 'YYYYY'];   // contains 'CAT' L→R at (0,1..3)
  const r1 = locate(['CAT'], board);
  check('CAT L→R mid-row at (0,1..3)',
        { begin: { row: 0, col: 1 }, finish: { row: 0, col: 3 } },
        r1.CAT);

  const board2 = ['YTACY'];            // contains 'CAT' R→L at (0,3..1)
  const r2 = locate(['CAT'], board2);
  check('CAT R→L: begin.col > finish.col (3>1)',
        { begin: { row: 0, col: 3 }, finish: { row: 0, col: 1 } },
        r2.CAT);
}

// Vertical T→B
{
  const board = [
    'XCX',
    'XAX',
    'XTX',
  ];
  const r = locate(['CAT'], board);
  check('CAT vertical T→B at col 1',
        { begin: { row: 0, col: 1 }, finish: { row: 2, col: 1 } },
        r.CAT);
}

// Vertical B→T: begin.row > finish.row
{
  const board = [
    'XTX',
    'XAX',
    'XCX',
  ];
  const r = locate(['CAT'], board);
  check('CAT vertical B→T: begin.row > finish.row (2>0)',
        { begin: { row: 2, col: 1 }, finish: { row: 0, col: 1 } },
        r.CAT);
}

// Word not present → null (NOT undefined)
{
  const board = ['ABC', 'DEF', 'GHI'];
  const r = locate(['DOG'], board);
  assert.equal(r.DOG, null,
    'absent word: r.DOG must be null (not undefined / not missing). got ' +
    JSON.stringify(r.DOG) + '; full result ' + JSON.stringify(r));
}

// Diagonal NOT supported: 'CAT' on the diagonal must NOT be found
{
  const board = [
    'CXX',
    'XAX',
    'XXT',
  ];
  const r = locate(['CAT'], board);
  assert.equal(r.CAT, null,
    'diagonal placement is NOT a match (only 4 cardinal directions: H L→R, H R→L, V T→B, V B→T). ' +
    'Diagonals must return null. got ' + JSON.stringify(r.CAT) +
    '; full result ' + JSON.stringify(r));
}

// Multiple words, mixed presence — single combined assertion so the model sees
// all word locations at once instead of debugging one at a time.
{
  const board = [
    'WORDXX',
    'XXFOOX',
    'XXXBAR',
    'BAZXXX',
  ];
  const r = locate(['WORD', 'FOO', 'BAR', 'BAZ', 'MISSING'], board);
  check('multi-word board: 4 words present in 4 directions, MISSING returns null', {
    WORD:    { begin: { row: 0, col: 0 }, finish: { row: 0, col: 3 } },
    FOO:     { begin: { row: 1, col: 2 }, finish: { row: 1, col: 4 } },
    BAR:     { begin: { row: 2, col: 3 }, finish: { row: 2, col: 5 } },
    BAZ:     { begin: { row: 3, col: 0 }, finish: { row: 3, col: 2 } },
    MISSING: null,
  }, r);
}

// Empty targets → empty result object
{
  const r = locate([], ['ABC']);
  check('empty targets returns {}', {}, r);
}

// Single-letter word: begin === finish (same cell)
{
  const board = ['XAX', 'YYY'];
  const r = locate(['A'], board);
  check('single-letter word: begin === finish at (0,1)',
        { begin: { row: 0, col: 1 }, finish: { row: 0, col: 1 } },
        r.A);
}

// Returned object has exactly the keys of targets (no extras)
{
  const board = ['HELLO'];
  const r = locate(['HELLO', 'NOPE'], board);
  const keys = Object.keys(r).sort();
  assert.deepEqual(keys, ['HELLO', 'NOPE'],
    'returned keys must exactly match input targets. expected ["HELLO","NOPE"], got ' +
    JSON.stringify(keys) + '; full result ' + JSON.stringify(r));
}
`;

const PROMPT = `\
Create word-search.js that exports a function \`locate(targets, board)\`.

Inputs:
  - \`targets\`: an array of strings (uppercase letters) to search for.
  - \`board\`: an array of equal-length strings (uppercase letters) — the grid.

Search directions (only these four):
  1. Horizontal left-to-right
  2. Horizontal right-to-left
  3. Vertical top-to-bottom
  4. Vertical bottom-to-top

Diagonal placements are NOT supported and must be ignored.

Coordinates are 0-indexed using \`{ row, col }\` objects.

Return value:
  An object whose keys are exactly the input targets. For each target:
    - If found: \`{ begin: { row, col }, finish: { row, col } }\` where
      \`begin\` is the position of the first letter and \`finish\` is the
      position of the last letter, traced along the search direction.
      For R→L matches, \`begin.col > finish.col\`. For B→T matches,
      \`begin.row > finish.row\`.
    - If not found: \`null\`.

Examples:
  locate(['CAT'], ['XCATX']) →
    { CAT: { begin: { row: 0, col: 1 }, finish: { row: 0, col: 3 } } }

  locate(['DOG'], ['ABC']) →
    { DOG: null }

  locate([], ['ABC']) →
    {}

Then ensure \`node verify.js\` exits 0. Do not edit verify.js.`;

const CLAW_TIMEOUT = 285_000;

describe(`word-search: 4-direction grid search with named axes (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw solves the task', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const targetExists = workspace.exists('word-search.js');
    let post = null;
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout: 10_000,
      });
    }
    const passed = r.code === 0 && targetExists && post?.status === 0;

    console.log(`\n=== word-search (${TIER_LABEL}) ===`);
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
    assert.equal(targetExists, true, 'word-search.js must be created');
    assert.equal(post?.status, 0, `verify.js failed:\n${post?.stderr?.slice(0, 800)}`);
  });
});
