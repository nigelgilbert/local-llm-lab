/** @manifest
 * {
 *   "test_id": "count-power-of-two",
 *   "test_version": "v1",
 *   "primary_axis": "spec_precision",
 *   "secondary_axes": ["stateful_logic"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps. P2 row also serves as contamination-detection control vs spec_precision Aider ports.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": ["bigint_required"],
 *   "introduced_in": "1.21",
 *   "notes": "Problem inspired by AtCoder ARC 216 C 'Count Power of 2' (2026-03-22), https://atcoder.jp/contests/arc216/tasks/arc216_c — paraphrased; author-written sample tests; constraints relaxed to N≤100, A_i≤100 to admit BigInt brute force and honor <10-min hand-solve rule. Released 5 weeks after Qwen3.5 (Feb 2026) — provably post-training-freeze. Editorial published 2026-04-02 describes O(N log² N) approach orthogonal to the relaxed-N path. P2 stream — see host/test/docs/difficulty-pack/p2-decision.md. Cycle-3 tweak (analyze-agent): added input-mutation guard and a hand-derived 5-element carry-chain case (A=[50,50,51,52,53], expected 9) — exposes impls that mutate input or that bail out early on a 'first non-power' subarray."
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
import { countPowerOfTwoSubarrays } from './count-power-of-two.js';

// Reference brute force: O(N² log) using BigInt.
function brute(N, A) {
  let count = 0;
  for (let l = 0; l < N; l++) {
    let sum = 0n;
    for (let r = l; r < N; r++) {
      sum += 1n << BigInt(A[r]);
      if (sum > 0n && (sum & (sum - 1n)) === 0n) count++;
    }
  }
  return count;
}

// Hand-verified sample cases (three are AtCoder's official samples per p2-decision.md)
const cases = [
  { N: 1, A: [0],                          expected: 1,  label: 'singleton (2^0=1)' },
  { N: 4, A: [0, 1, 0, 2],                 expected: 6,  label: 'official sample 1' },
  { N: 4, A: [100, 100, 100, 100],         expected: 8,  label: 'official sample 2 (high-bit / N=4 quad)' },
  { N: 10, A: [3, 2, 2, 3, 2, 4, 1, 1, 0, 0], expected: 19, label: 'official sample 3' },
  { N: 3, A: [0, 0, 0],                    expected: 5,  label: 'three zeros: 3 singletons + 2 pairs' },
  { N: 4, A: [0, 1, 2, 3],                 expected: 4,  label: 'distinct ascending: only singletons' },
  { N: 1, A: [50],                         expected: 1,  label: 'singleton high exponent' },
  { N: 2, A: [5, 5],                       expected: 3,  label: 'pair of equal exponents: 2 singletons + 1 pair (2^5+2^5=2^6)' },
];

for (const { N, A, expected, label } of cases) {
  const got = countPowerOfTwoSubarrays(N, A);
  assert.equal(got, expected, label + ': got ' + got + ', expected ' + expected);
}

// Stress: random N=20 case, compare against brute reference
{
  const N = 20;
  const A = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4];
  const expected = brute(N, A);
  const got = countPowerOfTwoSubarrays(N, A);
  assert.equal(got, expected, 'N=20 random case');
}

// Stress: N=100 with mixed exponents up to 100 (relaxed-N upper bound)
{
  const N = 100;
  const A = Array.from({ length: N }, (_, i) => (i * 7 + 3) % 30);
  const expected = brute(N, A);
  const got = countPowerOfTwoSubarrays(N, A);
  assert.equal(got, expected, 'N=100 stress');
}

// Edge: N=0 → 0 subarrays
assert.equal(countPowerOfTwoSubarrays(0, []), 0, 'N=0 returns 0');

// Return type must be a plain number (not BigInt)
{
  const got = countPowerOfTwoSubarrays(3, [0, 0, 0]);
  assert.equal(typeof got, 'number', 'returns Number not BigInt');
}

// Stress: high-exponent precision — the sum overflows Number.MAX_SAFE_INTEGER
// long before any naive Number-based implementation would notice. Two equal
// large exponents pair into 2^(k+1); the third singleton is itself a power.
// (90 + 90) → 2^91, plus three singletons → 4 power-of-two subarrays.
{
  const got = countPowerOfTwoSubarrays(3, [90, 90, 95]);
  assert.equal(got, 4, 'high-exponent precision: pair (90,90)=2^91 + 3 singletons');
}

// Stress: A_i exactly at the upper bound — a Number-based sum loses precision
// far below this; correct impl must handle 2^100 + 2^100 = 2^101 exactly.
{
  const got = countPowerOfTwoSubarrays(2, [100, 100]);
  assert.equal(got, 3, 'upper-bound exponents: 2 singletons + (100,100)=2^101');
}

// Input array MUST NOT be mutated by the call.
{
  const A = [3, 1, 4, 1, 5, 9, 2, 6];
  const before = JSON.stringify(A);
  countPowerOfTwoSubarrays(A.length, A);
  assert.equal(JSON.stringify(A), before, 'must not mutate the input array A');
}

// Adversarial: a mid-length run of equal exponents triggers a long carry chain.
// [k, k, k+1, k+2, k+3] sums = 2^k + 2^k + 2^(k+1) + 2^(k+2) + 2^(k+3)
//   = 2^(k+1) + 2^(k+1) + 2^(k+2) + 2^(k+3)
//   = 2^(k+2) + 2^(k+2) + 2^(k+3)
//   = 2^(k+3) + 2^(k+3)
//   = 2^(k+4)  — a power of two!
// So the full subarray [50,50,51,52,53] is itself a power of two.
{
  const got = countPowerOfTwoSubarrays(5, [50, 50, 51, 52, 53]);
  // Singletons: 5. Pairs: (50,50) sums to 2^51 ✓. (50,51), (51,52), (52,53)
  // each are distinct exponents whose sum is NOT a power of two. Triples:
  // (50,50,51) = 2^52 ✓. (50,51,52) and (51,52,53) are non-powers. Quads:
  // (50,50,51,52)=2^53 ✓. (50,51,52,53)=2^50+2^51+2^52+2^53 (non-power).
  // Full 5-array: 2^54 ✓ as derived above. Total = 5 + 1 + 1 + 1 + 1 = 9.
  assert.equal(got, 9, 'long carry chain across 5 elements');
}
`;

const PROMPT = `\
Create count-power-of-two.js that exports \`countPowerOfTwoSubarrays(N, A)\`.

You are given an integer N and an array A of length N containing non-negative
integers (0 ≤ A_i ≤ 100, 0 ≤ N ≤ 100).

Count the number of contiguous subarrays (l, r) with 0 ≤ l ≤ r < N such that

    sum_{i=l..r} 2^(A_i)

is itself a power of two (i.e. equal to 2^k for some non-negative integer k).

Examples:
  N=1, A=[0]              → 1   (the single element is 2^0 = 1)
  N=4, A=[0, 1, 0, 2]     → 6   (each subarray sums to a power of 2)
  N=3, A=[0, 0, 0]        → 5   (three singletons + two adjacent pairs;
                                 the full triple sums to 3, NOT a power of 2)

Important:
  - Sum values can far exceed \`Number.MAX_SAFE_INTEGER\` (A_i up to 100
    means individual terms reach 2^100). Choose a numeric representation
    that handles arbitrarily large positive integers exactly.
  - Return the count as a plain JavaScript Number (not a BigInt).
  - For N=0, return 0.
  - Subarrays must be CONTIGUOUS (l ≤ r); subsequences are NOT counted.
  - Single-element subarrays count: a single 2^A_i is itself a power of two.

Then ensure \`node verify.js\` exits 0. Do not edit verify.js.`;

const CLAW_TIMEOUT = 285_000;

describe(`count-power-of-two: subarray power-of-two count with BigInt (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw solves the task', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const targetExists = workspace.exists('count-power-of-two.js');
    let post = null;
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout: 15_000,
      });
    }
    const passed = r.code === 0 && targetExists && post?.status === 0;

    console.log(`\n=== count-power-of-two (${TIER_LABEL}) ===`);
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
    assert.equal(targetExists, true, 'count-power-of-two.js must be created');
    assert.equal(post?.status, 0, `verify.js failed:\n${post?.stderr?.slice(0, 800)}`);
  });
});
