/** @manifest
 * {
 *   "test_id": "needle-haystack",
 *   "test_version": "v1",
 *   "primary_axis": "multi_file_context",
 *   "secondary_axes": ["tool_discipline"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps. Promote to ctx_discriminator class (R9-A) if t16 ctx-overflow ≥66% AND t32 pass ≥66% across two consecutive sweeps.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": ["context_pressure_high"],
 *   "introduced_in": "1.21",
 *   "notes": "H5 hand-authored (added cycle 4). NIAH apply-the-needle: 30 small JS files (~1.25kb each, ~38kb total) seeded into a synthetic workspace across lib/utils/, lib/core/, lib/handlers/, data/, and config/ subdirs. Contents generated programmatically via sha256(VERSION_SEED + filepath) PRNG so each file is stable per seed but differs across test versions to defeat memorization. Exactly ONE file (NEEDLE_FILE = lib/handlers/auth.js for v1) places `export const REGION_KEY = '<6-char hex>'` at line 47; the other 29 files place a similarly-shaped distractor (`export const REGION_PREFIX = ...`, REGION_FALLBACK, etc.) at the same position. The model must locate the constant named EXACTLY REGION_KEY and write solve.js exporting getMagicCode() that returns the value. Cycle-5 v1 pilot saturated 100/100% at both tiers in 8-11s per rep — model uses `grep -rn REGION_KEY` in 1 iter and writes solve.js immediately. tool_discipline is fine at IQ4_XS for this task; the haystack of ~9.4k tokens is too small to pressure 32k ctx because grep never loads file bodies. v2 needs a multi-step retrieval (e.g., split needle, indirect lookup) to defeat single-grep-then-done. Schema note: `retrieval_over_distance` was the original v1 secondary_axis but is not in the schema enum (cycle-5 manifest validation failure caused empty registry); replaced with `tool_discipline` which is the closer match within the existing axis taxonomy."
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

// Bumping VERSION_SEED rotates REGION_KEY's value AND every file's deterministic
// pseudo-random content, breaking any cross-version memorization path. Keep the
// manifest test_version in lockstep with the seed string when rotating.
const VERSION_SEED = 'needle-v1-2026-05-03-seed-ax9q3z';

// 30 files distributed across five subdirs. Order is deterministic; the
// needle's index is fixed (NEEDLE_FILE) so the test is reproducible without
// peeking at PRNG output.
const FILES = [
  'lib/utils/format.js',     'lib/utils/validate.js',  'lib/utils/parse.js',
  'lib/utils/normalize.js',  'lib/utils/transform.js', 'lib/utils/encode.js',
  'lib/utils/decode.js',     'lib/utils/hash.js',
  'lib/core/engine.js',      'lib/core/scheduler.js',  'lib/core/registry.js',
  'lib/core/dispatch.js',    'lib/core/lifecycle.js',  'lib/core/runtime.js',
  'lib/handlers/request.js', 'lib/handlers/response.js','lib/handlers/error.js',
  'lib/handlers/retry.js',   'lib/handlers/timeout.js','lib/handlers/auth.js',
  'lib/handlers/session.js',
  'data/seeds.js',           'data/samples.js',         'data/fixtures.js',
  'data/presets.js',         'data/defaults.js',
  'config/env.js',           'config/flags.js',         'config/routes.js',
  'config/limits.js',
];

// Mid-range index, not first or last alphabetically — discourages the
// "just read the first/last file" shortcut from working.
const NEEDLE_FILE = 'lib/handlers/auth.js';

// Deterministic per-file PRNG. Returns a 64-char hex string from which we
// slice content fragments; same VERSION_SEED + filepath always returns the
// same hex.
function prngHex(filename) {
  return crypto.createHash('sha256').update(VERSION_SEED + ':' + filename).digest('hex');
}

// The canonical REGION_KEY value the model must discover and return.
// Computed once from VERSION_SEED so the verifier can compare strict-equality.
const REGION_KEY_VALUE = crypto
  .createHash('sha256')
  .update(VERSION_SEED + ':REGION_KEY')
  .digest('hex')
  .slice(0, 6);

// Distractor constant names — all start with `REGION_` so a coarse
// `grep -r REGION_` returns 30 hits; the discriminator is between using
// `grep REGION_KEY` (the right approach) vs reading files individually
// (the iter-storm approach that pressures t16 ctx).
const DISTRACTOR_NAMES = [
  'REGION_PREFIX', 'REGION_FALLBACK', 'REGION_DEFAULT',
  'REGION_LIMIT',  'REGION_VERSION',  'REGION_BUCKET',
];

// Generate one file's content (~1.5kb of plausible JS). Line 47 holds either
// the needle (`export const REGION_KEY = '<value>';`) or a distractor.
// Same shape for every file so the needle file isn't structurally distinguishable.
function generateFile(filepath, isNeedle) {
  const r = prngHex(filepath);
  const helperA = 'helper_' + r.slice(0, 6);
  const helperB = 'helper_' + r.slice(6, 12);
  const constA  = r.slice(12, 18);
  const constB  = r.slice(18, 24);
  const constC  = r.slice(24, 30);
  const distractorName  = DISTRACTOR_NAMES[parseInt(r.slice(30, 32), 16) % DISTRACTOR_NAMES.length];
  const distractorValue = r.slice(32, 38);
  const tableKeyA = r.slice(38, 44);
  const tableValA = r.slice(44, 50);
  const tableKeyB = r.slice(50, 56);
  const tableValB = r.slice(56, 62);

  const lines = [
    '// ' + filepath + ' — auto-generated module (haystack v1)',                 // 1
    '// Part of a synthetic workspace seeded for retrieval-over-distance tests.',// 2
    '// Contents are deterministic per VERSION_SEED; do not hand-edit.',         // 3
    '',                                                                          // 4
    "export const MODULE_ID  = '" + constA + "';",                               // 5
    "export const MODULE_TAG = '" + constB + "';",                               // 6
    '',                                                                          // 7
    '/**',                                                                       // 8
    ' * ' + helperA + ' — opaque helper. Reverses an input string.',             // 9
    ' * @param {string} input',                                                  // 10
    ' * @returns {string}',                                                      // 11
    ' */',                                                                       // 12
    'export function ' + helperA + '(input) {',                                  // 13
    "  if (typeof input !== 'string') throw new TypeError('expected string');",  // 14
    "  return input.split('').reverse().join('');",                              // 15
    '}',                                                                         // 16
    '',                                                                          // 17
    '/**',                                                                       // 18
    ' * ' + helperB + ' — opaque helper. Sums an array of numbers.',             // 19
    ' * @param {Array<number>} arr',                                             // 20
    ' * @returns {number}',                                                      // 21
    ' */',                                                                       // 22
    'export function ' + helperB + '(arr) {',                                    // 23
    '  return arr.reduce((s, x) => s + x, 0);',                                  // 24
    '}',                                                                         // 25
    '',                                                                          // 26
    '// Internal lookup; not exported. Used by lookup() below.',                 // 27
    'const LOOKUP = {',                                                          // 28
    "  '" + tableKeyA + "': '" + tableValA + "',",                               // 29
    "  '" + tableKeyB + "': '" + tableValB + "',",                               // 30
    '};',                                                                        // 31
    '',                                                                          // 32
    'export function lookup(key) {',                                             // 33
    '  return LOOKUP[key] ?? null;',                                             // 34
    '}',                                                                         // 35
    '',                                                                          // 36
    '// Module-scoped counter; reset on import.',                                // 37
    'let _state = { count: 0, last: null };',                                    // 38
    '',                                                                          // 39
    'export function tick() {',                                                  // 40
    '  _state.count++;',                                                         // 41
    '  _state.last = Date.now();',                                               // 42
    '  return _state.count;',                                                    // 43
    '}',                                                                         // 44
    '',                                                                          // 45
    "export const STATE_VERSION = '" + constC + "';",                            // 46
    isNeedle                                                                     // 47 ← needle
      ? "export const REGION_KEY = '" + REGION_KEY_VALUE + "';"
      : 'export const ' + distractorName + " = '" + distractorValue + "';",
    '',                                                                          // 48
    'export default { ' + helperA + ', ' + helperB + ', lookup, tick };',        // 49
  ];
  return lines.join('\n') + '\n';
}

const VERIFY_JS = `\
import assert from 'node:assert/strict';
import { getMagicCode } from './solve.js';

const expected = '${REGION_KEY_VALUE}';
const actual = getMagicCode();
assert.equal(typeof actual, 'string', 'getMagicCode must return a string');
assert.equal(
  actual,
  expected,
  \`getMagicCode must return REGION_KEY value (expected '\${expected}', got '\${actual}')\`,
);
console.log('all-pass');
`;

const PROMPT = `\
There is a constant named REGION_KEY somewhere in the workspace's lib/,
data/, or config/ subdirectories. Create solve.js that exports a function
\`getMagicCode()\` returning the value of REGION_KEY (a short hex string).

Then ensure \`node verify.js\` exits 0. Do not edit verify.js.

Notes:
  - There are many files containing constants whose names START with
    "REGION_" (REGION_PREFIX, REGION_FALLBACK, REGION_DEFAULT, …). You want
    the one named exactly REGION_KEY — only one file in the workspace
    contains it.
  - The constant is exported as a string literal, e.g.
        export const REGION_KEY = '<six-character-hex>';
  - solve.js should be at the workspace root (sibling of verify.js).
  - You may use any retrieval strategy (grep, read files individually,
    list directories, etc.).`;

const CLAW_TIMEOUT = 285_000;

describe(`needle-haystack: 30-file NIAH apply-the-needle (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    // Subdirs need explicit creation; workspace.reset() blows them away each run.
    const subdirs = new Set(FILES.map(f => path.dirname(f)));
    for (const d of subdirs) {
      fs.mkdirSync(path.join(workspace.WORKSPACE, d), { recursive: true });
    }
    for (const f of FILES) {
      fs.writeFileSync(
        path.join(workspace.WORKSPACE, f),
        generateFile(f, f === NEEDLE_FILE),
      );
    }
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw locates REGION_KEY and writes solve.js', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const targetExists = workspace.exists('solve.js');
    let post = null;
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout: 10_000,
      });
    }
    const passed = r.code === 0 && targetExists && post?.status === 0;

    console.log(`\n=== needle-haystack (${TIER_LABEL}) ===`);
    console.log(`  needle: ${NEEDLE_FILE} = '${REGION_KEY_VALUE}'`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms solve.js=${targetExists}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);
    if (post) console.log(`  verify: exit=${post.status} stdout=${post.stdout.trim()} stderr=${post.stderr.slice(0, 400).trim()}`);

    writeAssertionResult(r.runDir, {
      passed,
      claw_exit: r.code,
      target_file_exists: targetExists,
      post_status: post?.status ?? null,
      post_stderr_tail: post?.stderr?.slice(0, 800) ?? null,
    });

    if (r.terminal_status === 'timeout') assert.fail(`claw timed out after ${r.elapsedMs}ms`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(targetExists, true, 'solve.js must be created at workspace root');
    assert.equal(post?.status, 0, `verify.js failed:\n${post?.stderr?.slice(0, 800)}`);
  });
});
