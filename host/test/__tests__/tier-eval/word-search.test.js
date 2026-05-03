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
 *   "notes": "Adapted from Exercism JS 'word-search' (MIT); mutation depth: STANDARD; key changes: locate(targets, board) free function (not class+find), 4 directions only (drop diagonals — H L→R, H R→L, V T→B, V B→T), 0-indexed coordinates with named axes {begin:{row,col}, finish:{row,col}} (not 1-indexed [r,c] arrays), absent words return null (not undefined). Canonical at host/test/docs/difficulty-pack/canonicals/word-search/"
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

// Trivial: single word, horizontal L→R in row 0
{
  const board = ['CAT', 'XYZ', 'PQR'];
  const r = locate(['CAT'], board);
  assert.deepEqual(r, {
    CAT: { begin: { row: 0, col: 0 }, finish: { row: 0, col: 2 } },
  }, 'CAT horizontal L→R in row 0');
}

// Horizontal R→L: word reversed in the grid (begin col > finish col)
{
  const board = ['XCATX', 'YYYYY'];   // contains 'CAT' L→R at (0,1..3)
  const r1 = locate(['CAT'], board);
  assert.deepEqual(r1.CAT, { begin: { row: 0, col: 1 }, finish: { row: 0, col: 3 } }, 'CAT in middle of row');

  const board2 = ['YTACY'];            // contains 'CAT' R→L at (0,3..1)
  const r2 = locate(['CAT'], board2);
  assert.deepEqual(r2.CAT, { begin: { row: 0, col: 3 }, finish: { row: 0, col: 1 } }, 'CAT R→L: begin > finish');
}

// Vertical T→B
{
  const board = [
    'XCX',
    'XAX',
    'XTX',
  ];
  const r = locate(['CAT'], board);
  assert.deepEqual(r.CAT, { begin: { row: 0, col: 1 }, finish: { row: 2, col: 1 } }, 'CAT vertical T→B');
}

// Vertical B→T
{
  const board = [
    'XTX',
    'XAX',
    'XCX',
  ];
  const r = locate(['CAT'], board);
  assert.deepEqual(r.CAT, { begin: { row: 2, col: 1 }, finish: { row: 0, col: 1 } }, 'CAT vertical B→T: begin row > finish row');
}

// Word not present → null
{
  const board = ['ABC', 'DEF', 'GHI'];
  const r = locate(['DOG'], board);
  assert.equal(r.DOG, null, 'absent word returns null (not undefined)');
}

// Diagonal NOT supported: 'CAT' on the diagonal must NOT be found
{
  const board = [
    'CXX',
    'XAX',
    'XXT',
  ];
  const r = locate(['CAT'], board);
  assert.equal(r.CAT, null, 'diagonal placement is NOT a match (only 4 directions supported)');
}

// Multiple words, mixed presence
{
  const board = [
    'WORDXX',
    'XXFOOX',
    'XXXBAR',
    'BAZXXX',
  ];
  const r = locate(['WORD', 'FOO', 'BAR', 'BAZ', 'MISSING'], board);
  assert.deepEqual(r.WORD, { begin: { row: 0, col: 0 }, finish: { row: 0, col: 3 } }, 'WORD');
  assert.deepEqual(r.FOO,  { begin: { row: 1, col: 2 }, finish: { row: 1, col: 4 } }, 'FOO');
  assert.deepEqual(r.BAR,  { begin: { row: 2, col: 3 }, finish: { row: 2, col: 5 } }, 'BAR');
  assert.deepEqual(r.BAZ,  { begin: { row: 3, col: 0 }, finish: { row: 3, col: 2 } }, 'BAZ');
  assert.equal(r.MISSING, null, 'MISSING returns null');
}

// Empty targets → empty result object
{
  const r = locate([], ['ABC']);
  assert.deepEqual(r, {}, 'empty targets returns {}');
}

// Single-letter word: begin === finish
{
  const board = ['XAX', 'YYY'];
  const r = locate(['A'], board);
  assert.deepEqual(r.A, { begin: { row: 0, col: 1 }, finish: { row: 0, col: 1 } }, 'single letter');
}

// Returned object has exactly the keys of targets (no extras)
{
  const board = ['HELLO'];
  const r = locate(['HELLO', 'NOPE'], board);
  assert.deepEqual(Object.keys(r).sort(), ['HELLO', 'NOPE'], 'exactly target keys present');
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
