/** @manifest
 * {
 *   "test_id": "book-store",
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
 *   "notes": "Adapted from Exercism JS 'book-store' (MIT); mutation depth: HEAVY; key changes: totalPrice(packageIds) not cost(books), 6 discount tiers (not 5) with non-canonical values [1,0.93,0.85,0.76,0.66,0.62], UNIT_PRICE=1200 cents (not 800), domain shifted to 6-tier subscription packages, return {totalCents, groupingChoice} not plain integer. Discounts hand-tuned so [1,2,3,4,5,6,1,2,3,4] has 5+5 vs 6+4 trap (5+5=7920 beats 6+4=8112). Canonical at host/test/docs/difficulty-pack/canonicals/book-store/"
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
import { totalPrice } from './book-store.js';

function check(packageIds, expectedCents, expectedGroups, label) {
  const r = totalPrice(packageIds);
  assert.equal(typeof r, 'object', label + ': must return an object');
  assert.equal(r.totalCents, expectedCents, label + ': totalCents');
  assert.ok(Array.isArray(r.groupingChoice), label + ': groupingChoice must be array');
  // Validate groupingChoice as a multiset (order-agnostic).
  const sortActual = [...r.groupingChoice].sort((a,b) => b-a);
  const sortExpected = [...expectedGroups].sort((a,b) => b-a);
  assert.deepEqual(sortActual, sortExpected, label + ': groupingChoice (multiset)');
  // Sum of group sizes must equal basket length.
  const sumSizes = r.groupingChoice.reduce((s, x) => s + x, 0);
  assert.equal(sumSizes, packageIds.length, label + ': group sizes must sum to basket length');
}

// Empty basket
check([], 0, [], 'empty basket');

// Single item
check([3], 1200, [1], 'single package');

// Two of same item — cannot group, so two singletons
check([3, 3], 2400, [1, 1], 'two of same package');

// All 6 distinct — best single group of 6
// 6 * 1200 * 0.62 = 4464
check([1, 2, 3, 4, 5, 6], 4464, [6], 'six distinct packages');

// 5 distinct — best single group of 5
// 5 * 1200 * 0.66 = 3960
check([1, 2, 3, 4, 5], 3960, [5], 'five distinct');

// 4 distinct — best single group of 4
// 4 * 1200 * 0.76 = 3648
check([1, 2, 3, 4], 3648, [4], 'four distinct');

// 3 distinct
// 3 * 1200 * 0.85 = 3060
check([1, 2, 3], 3060, [3], 'three distinct');

// 2 distinct
// 2 * 1200 * 0.93 = 2232
check([1, 2], 2232, [2], 'two distinct');

// THE TRAP: 5+5 beats 6+4
// basket = [1,2,3,4,5,6,1,2,3,4]: counts {1:2, 2:2, 3:2, 4:2, 5:1, 6:1}
//   6+4 grouping: 4464 + 3648 = 8112
//   5+5 grouping: 2 * 3960 = 7920  ← optimal
check([1, 2, 3, 4, 5, 6, 1, 2, 3, 4], 7920, [5, 5], '5+5 beats 6+4 (the trap)');

// Three copies of one item, plus 5 distinct others — best is 6+1+1+1
// basket = [1,2,3,4,5,6,1,1]: counts {1:3, 2:1, 3:1, 4:1, 5:1, 6:1}
// One group of 6 (all six distinct using one of each) + 2 leftover singletons of 1
//   6+1+1: 4464 + 1200 + 1200 = 6864
//   5+1+1+1: 3960 + 3*1200 = 7560 — worse
//   2+2+2+1+1: 3*2232 + 2*1200 = 6696 + 2400 = 9096 — much worse
check([1, 2, 3, 4, 5, 6, 1, 1], 6864, [6, 1, 1], 'six-pack plus two singleton extras');

// Order independence: same multiset reordered must give same result
{
  const r1 = totalPrice([1, 2, 3, 4, 5]);
  const r2 = totalPrice([5, 4, 3, 2, 1]);
  assert.equal(r1.totalCents, r2.totalCents, 'totalPrice independent of input order');
}

// Larger trap stress: 12 packages = 6+6 distinct
// counts {1..6 each appearing 2x}
//   6+6: 2 * 4464 = 8928
//   5+5+1+1: 2*3960 + 2*1200 = 10320
//   6+5+1: 4464 + 3960 + 1200 = 9624
//   4+4+4: 3*3648 = 10944
// 6+6 wins
check([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6], 8928, [6, 6], 'two full six-packs');
`;

const PROMPT = `\
Create book-store.js that exports \`totalPrice(packageIds)\`.

Domain: a 6-tier subscription bundle. There are 6 distinct package types,
identified by integer IDs (in our examples 1..6, but treat IDs as opaque
distinct labels). Each package costs UNIT_PRICE = 1200 cents at retail.

Customers receive a discount when buying a *group* of distinct packages:

  Group size  | Discount | Per-package multiplier
  ------------|----------|----------------------
  1           | 0%       | 1.00
  2 distinct  | 7%       | 0.93
  3 distinct  | 15%      | 0.85
  4 distinct  | 24%      | 0.76
  5 distinct  | 34%      | 0.66
  6 distinct  | 38%      | 0.62

A group's cost is \`groupSize * UNIT_PRICE * multiplier\`, with the multiplier
indexed by group size. A group must contain *distinct* package types (no
duplicates within a single group).

The function takes \`packageIds\`, an array of package IDs (with possible
repeats), and returns the *minimum total cents* achievable by partitioning
the basket into groups, along with the chosen partition shape:

  {
    totalCents: <integer cents>,
    groupingChoice: <array of group sizes, in any order>
  }

Examples:
  totalPrice([])                     → { totalCents: 0,    groupingChoice: [] }
  totalPrice([3])                    → { totalCents: 1200, groupingChoice: [1] }
  totalPrice([1, 2, 3, 4, 5])        → { totalCents: 3960, groupingChoice: [5] }

Important: the greedy "always make the biggest group first" strategy is
NOT always optimal under this discount table. Some baskets are cheaper
when split into two equal-size groups instead of one large + one small.
Your solution must find the true optimum.

Then ensure \`node verify.js\` exits 0. Do not edit verify.js.`;

const CLAW_TIMEOUT = 285_000;

describe(`book-store: minimum-cost partition with non-greedy trap (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw solves the task', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const targetExists = workspace.exists('book-store.js');
    let post = null;
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout: 10_000,
      });
    }
    const passed = r.code === 0 && targetExists && post?.status === 0;

    console.log(`\n=== book-store (${TIER_LABEL}) ===`);
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
    assert.equal(targetExists, true, 'book-store.js must be created');
    assert.equal(post?.status, 0, `verify.js failed:\n${post?.stderr?.slice(0, 800)}`);
  });
});
