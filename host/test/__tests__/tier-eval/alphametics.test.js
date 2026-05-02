/** @manifest
 * {
 *   "test_id": "alphametics",
 *   "test_version": "v1",
 *   "primary_axis": "spec_precision",
 *   "secondary_axes": ["convergence"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [],
 *   "introduced_in": "1.21",
 *   "notes": "Adapted from Exercism JS 'alphametics' (MIT); mutation depth: HEAVY; key changes: assignDigits(equation) not solve(puzzle), result is sorted [{symbol,code}] array not letter→digit map, equation grammar supports + and * operators (not just +), '=' may appear on either side, non-canonical word sets (no SEND+MORE=MONEY); canonical at host/test/docs/difficulty-pack/canonicals/alphametics/"
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
import { assignDigits } from './alphametics.js';

// Helper: turn the [{symbol,code}] array back into a {sym: code} map for checking
function toMap(result) {
  if (result === null) return null;
  const m = {};
  for (const { symbol, code } of result) m[symbol] = code;
  return m;
}

// Helper: evaluate a word with a given letter→digit map (base 10)
function valueOf(word, m) {
  let v = 0;
  for (const ch of word) v = v * 10 + m[ch];
  return v;
}

// Helper: validate that a returned solution actually satisfies the equation,
// has all-distinct codes, no leading zero on any multi-letter word, and the
// returned array is sorted by symbol.
function validate(result, leftTerms, leftOps, rightWord) {
  if (result === null) return false;
  const m = toMap(result);
  // sorted by symbol
  const symbols = result.map(r => r.symbol);
  for (let i = 1; i < symbols.length; i++) {
    if (symbols[i] <= symbols[i-1]) return false;
  }
  // distinct codes 0..9
  const codes = result.map(r => r.code);
  if (new Set(codes).size !== codes.length) return false;
  for (const c of codes) if (typeof c !== 'number' || c < 0 || c > 9) return false;
  // no leading zero on multi-letter words
  for (const w of [...leftTerms, rightWord]) {
    if (w.length > 1 && m[w[0]] === 0) return false;
  }
  // arithmetic: standard precedence — collect *-chains, then sum them
  for (const op of leftOps) if (op !== '+' && op !== '*') return false;
  const groups = [[valueOf(leftTerms[0], m)]];
  for (let i = 0; i < leftOps.length; i++) {
    const v = valueOf(leftTerms[i+1], m);
    if (leftOps[i] === '*') groups[groups.length - 1].push(v);
    else groups.push([v]);
  }
  const acc = groups.reduce((sum, g) => sum + g.reduce((p, x) => p * x, 1), 0);
  return acc === valueOf(rightWord, m);
}

// Solvable, addition-only
{
  const r = assignDigits('CAT + DOG = PET');
  assert.ok(validate(r, ['CAT', 'DOG'], ['+'], 'PET'), 'CAT + DOG = PET solution must satisfy the equation');
}

// Solvable, '=' on the left
{
  const r = assignDigits('PET = CAT + DOG');
  assert.ok(validate(r, ['CAT', 'DOG'], ['+'], 'PET'), 'reversed = sides must still solve');
}

// Solvable with multiplication
{
  // A * B = AB  (single-digit × single-digit = two-digit)
  // Hand-solvable: e.g. A=3, B=5 → 3*5=15 → A=1, B=5? No, A appears in both.
  // Try: A=2, B=8 → 2*8=16, but result is "AB" so A=1, B=6, but then 1*6=6 not 16.
  // The constraint: A * B = 10*A + B. For A=1: B = 10 + B, impossible.
  // For A=2: 2B = 20 + B → B = 20, no. So this equation is unsolvable in base 10.
  const r = assignDigits('A * B = AB');
  assert.equal(r, null, 'A * B = AB has no base-10 solution');
}

// Solvable with multiplication: I * IS = HIS (two-digit-ish)
{
  // Easier: BOY * 2 isn't valid (we need words). Try IF + IT = IS, well-known solvable.
  // Pure multiplication with solution: try simple "BE * BE = BEE" — likely unsolvable.
  // Use a constructed solvable mult equation: AB * C = DBC
  // Skip the constructed-mult and use a confirmed addition case to keep this clean.
  // Replace this slot with a verified-solvable addition.
  const r = assignDigits('IF + IT = IS');
  // I appears in both terms and result. F+T = S (with possible carry into the I column).
  // F + T = S (no carry): I + I = I means I=0, but I is a leading letter. No.
  // F + T = S + 10 (carry 1): then I + I + 1 = I → I = -1. No.
  // So actually unsolvable. Confirm null.
  assert.equal(r, null, 'IF + IT = IS has no base-10 solution');
}

// Solvable: AS + A = MOM  (small, hand-verified)
// A + A in ones col: 2A = M (mod 10), carry c1 = floor(2A / 10)
// S + 0 + c1 in tens? Wait, AS + A: AS is two-digit (A tens, S ones). A is one-digit.
// ones: S + A = M (mod 10), carry c1
// tens: A + 0 + c1 = O (mod 10), carry c2
// hundreds: c2 = M
// So M = c2 ∈ {0,1}; M is leading so M = 1. Therefore c2 = 1.
// Then A + c1 ≥ 10, so O = A + c1 - 10.
// S + A = M + 10 → S + A = 11.
// All distinct, leading letters {A, M} ≠ 0.
// Try A=4, S=7: c1=1, A+c1=5, so O=5-10? No, 5 < 10. Need A+c1 ≥ 10.
// A=9, S=2: S+A=11 ✓, c1=1, A+c1=10, O=0, c2=1 ✓, M=1.
//   Check distinct: A=9, S=2, O=0, M=1. All distinct. ✓
// So solution exists.
{
  const r = assignDigits('AS + A = MOM');
  assert.ok(validate(r, ['AS', 'A'], ['+'], 'MOM'), 'AS + A = MOM must solve');
}

// Multi-term: A + B + C = ABC  (3-term addition)
// A+B+C = 100A + 10B + C → 99A + 9B = 0 → impossible for A≥1. So unsolvable.
{
  const r = assignDigits('A + B + C = ABC');
  assert.equal(r, null, 'A + B + C = ABC has no base-10 solution');
}

// Mixed-operator equation: A * B + C = DE
// Construct one we know solves: e.g. A=2, B=3, C=4 → 2*3+4 = 10 → DE=10, D=1, E=0.
// Distinct: A=2, B=3, C=4, D=1, E=0. All distinct. ✓
// Leading letters: A, D — both nonzero. ✓
{
  const r = assignDigits('A * B + C = DE');
  assert.ok(validate(r, ['A', 'B', 'C'], ['*', '+'], 'DE'),
    'A * B + C = DE must produce a valid digit assignment');
}

// Unsolvable: AB = BA in pure equation form (no operator on left)
// AB = BA means 10a+b = 10b+a → a=b, violates distinctness.
{
  const r = assignDigits('AB = BA');
  assert.equal(r, null, 'AB = BA forces a=b which violates distinctness');
}

// Whitespace tolerance
{
  const r = assignDigits('  CAT   +   DOG   =   PET  ');
  assert.ok(validate(r, ['CAT', 'DOG'], ['+'], 'PET'), 'extra whitespace must be tolerated');
}
`;

const PROMPT = `\
Create alphametics.js that exports \`assignDigits(equation)\`.

The function solves a cryptarithmetic puzzle: each distinct letter (uppercase A-Z)
maps to a distinct digit 0-9 such that the arithmetic equation holds in base 10.

Equation grammar:
  <left> = <right>      OR      <right> = <left>

where <right> is a single word (uppercase letters) and <left> is one or more
words connected by binary operators '+' (addition) and '*' (multiplication).
Operators are evaluated with standard precedence: '*' before '+'.

Examples:
  "CAT + DOG = PET"
  "PET = CAT + DOG"
  "A * B + C = DE"

Constraints on a valid solution:
  - Each letter maps to a unique digit 0-9
  - No multi-letter word may have a leading-zero digit
  - The arithmetic must hold

Return value:
  - If a valid solution exists: an array of \`{ symbol, code }\` objects sorted
    ascending by \`symbol\` (e.g. \`[{symbol:'A', code:2}, {symbol:'B', code:3}, ...]\`)
  - If no valid solution exists: \`null\`

Whitespace inside the equation may be uneven; tolerate runs of spaces.

Then ensure \`node verify.js\` exits 0. Do not edit verify.js.`;

const CLAW_TIMEOUT = 240_000;

describe(`alphametics: cryptarithmetic with + and * (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw solves the task', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const targetExists = workspace.exists('alphametics.js');
    let post = null;
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout: 10_000,
      });
    }
    const passed = r.code === 0 && targetExists && post?.status === 0;

    console.log(`\n=== alphametics (${TIER_LABEL}) ===`);
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
    assert.equal(targetExists, true, 'alphametics.js must be created');
    assert.equal(post?.status, 0, `verify.js failed:\n${post?.stderr?.slice(0, 800)}`);
  });
});
