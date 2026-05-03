/** @manifest
 * {
 *   "test_id": "two-bucket",
 *   "test_version": "v1",
 *   "primary_axis": "convergence",
 *   "secondary_axes": ["spec_precision"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [],
 *   "introduced_in": "1.21",
 *   "notes": "Adapted from Exercism JS 'two-bucket' (MIT); mutation depth: HEAVY; key changes: findShortestPath(vesselA,vesselB,target,primary) not solve(...), avoid (3,5,*) and (3,7,*) capacities (use (3,8,*), (4,7,*) instead), result keys actionCount/holder/residual (not moves/goalBucket/otherBucket), holder values 'A'/'B' (not 'one'/'two'), unsolvable returns null (not throws), path: Array<[a,b]> array added (forces BFS-path reconstruction). Per mutations.md §7 mutation-depth gate, the rule-3 'forbid both at same amount < target' twist deferred from v1 to limit ambiguity; revisit after pilot. Canonical at host/test/docs/difficulty-pack/canonicals/two-bucket/. Cycle-3 tweak (analyze-agent): every assertion message in verify.js now includes the model's full returned object via JSON.stringify(r); prompt gained a worked example for findShortestPath(3,8,5,'A') with explicit move-by-move state path. Targets c2 'result_changed_vs_previous_same_call: false' iter-storm — model wrote slightly-different code 12 times without reading what its output looked like."
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
import { findShortestPath } from './two-bucket.js';

// Validate that path is a legal sequence of moves.
function isValidStep(prev, curr, capA, capB) {
  const [a1, b1] = prev;
  const [a2, b2] = curr;
  // fill A
  if (a1 < capA && a2 === capA && b2 === b1) return 'fillA';
  // fill B
  if (b1 < capB && b2 === capB && a2 === a1) return 'fillB';
  // empty A
  if (a1 > 0 && a2 === 0 && b2 === b1) return 'emptyA';
  // empty B
  if (b1 > 0 && b2 === 0 && a2 === a1) return 'emptyB';
  // pour A→B
  {
    const t = Math.min(a1, capB - b1);
    if (t > 0 && a2 === a1 - t && b2 === b1 + t) return 'pourAB';
  }
  // pour B→A
  {
    const t = Math.min(b1, capA - a1);
    if (t > 0 && b2 === b1 - t && a2 === a1 + t) return 'pourBA';
  }
  return null;
}

function checkSolvable(capA, capB, target, primary, expected, label) {
  const r = findShortestPath(capA, capB, target, primary);
  const dump = () => 'returned ' + JSON.stringify(r);
  assert.notEqual(r, null, label + ': must find a solution (got null); expected ' + JSON.stringify(expected));
  assert.equal(typeof r, 'object', label + ': result must be object; ' + dump());
  assert.equal(r.actionCount, expected.actionCount, label + ': actionCount mismatch — expected ' + expected.actionCount + ', ' + dump());
  assert.equal(r.holder, expected.holder, label + ': holder mismatch — expected "' + expected.holder + '", ' + dump());
  assert.equal(r.residual, expected.residual, label + ': residual mismatch — expected ' + expected.residual + ', ' + dump());

  // Path: array of [a,b] state pairs; length === actionCount + 1; starts at [0,0]
  assert.ok(Array.isArray(r.path), label + ': path must be an array; ' + dump());
  assert.equal(r.path.length, r.actionCount + 1, label + ': path length must be actionCount+1 (=' + (r.actionCount + 1) + '), got ' + r.path.length + '; ' + dump());
  assert.deepEqual(r.path[0], [0, 0], label + ': path[0] must be [0,0], got ' + JSON.stringify(r.path[0]) + '; ' + dump());

  // Move 1 must fill the primary bucket (canonical rule)
  if (primary === 'A') {
    assert.deepEqual(r.path[1], [capA, 0], label + ': first move must fill primary A → expected [' + capA + ',0], got ' + JSON.stringify(r.path[1]) + '; ' + dump());
  } else {
    assert.deepEqual(r.path[1], [0, capB], label + ': first move must fill primary B → expected [0,' + capB + '], got ' + JSON.stringify(r.path[1]) + '; ' + dump());
  }

  // Each step is a legal move
  for (let i = 1; i < r.path.length; i++) {
    const op = isValidStep(r.path[i-1], r.path[i], capA, capB);
    assert.ok(op !== null, label + ': illegal step ' + i + ': ' + JSON.stringify(r.path[i-1]) + ' → ' + JSON.stringify(r.path[i]) + ' is not one of fillA/fillB/emptyA/emptyB/pourAB/pourBA; ' + dump());
  }

  // Final state must match holder/residual
  const [finalA, finalB] = r.path[r.path.length - 1];
  if (r.holder === 'A') {
    assert.equal(finalA, target, label + ': final A must equal target ' + target + ', got ' + finalA + '; ' + dump());
    assert.equal(finalB, r.residual, label + ': final B must equal residual ' + r.residual + ', got ' + finalB + '; ' + dump());
  } else {
    assert.equal(finalB, target, label + ': final B must equal target ' + target + ', got ' + finalB + '; ' + dump());
    assert.equal(finalA, r.residual, label + ': final A must equal residual ' + r.residual + ', got ' + finalA + '; ' + dump());
  }
}

// (3,8,3,'A'): trivially fill A as move 1
checkSolvable(3, 8, 3, 'A',
  { actionCount: 1, holder: 'A', residual: 0 },
  '(3,8,3,A) trivial fill A'
);

// (3,8,8,'A'): fill A then fill B (canonical optimization fills the second
// bucket on move 2 if its capacity equals the goal)
checkSolvable(3, 8, 8, 'A',
  { actionCount: 2, holder: 'B', residual: 3 },
  '(3,8,8,A) goal === capB triggers move-2 fill'
);

// (3,8,5,'A'): fill A, fill B, empty A, pour B→A → (3,5)
checkSolvable(3, 8, 5, 'A',
  { actionCount: 4, holder: 'B', residual: 3 },
  '(3,8,5,A) four-move classic'
);

// (3,8,5,'B'): fill B, pour B→A → (3,5) — primary B is faster here
checkSolvable(3, 8, 5, 'B',
  { actionCount: 2, holder: 'B', residual: 3 },
  '(3,8,5,B) primary B is two moves'
);

// (4,7,3,'A'): fill A, fill B, empty A, pour B→A → (4,3)
checkSolvable(4, 7, 3, 'A',
  { actionCount: 4, holder: 'B', residual: 4 },
  '(4,7,3,A) four-move via fill-then-pour'
);

// Unsolvable: gcd doesn't divide target
{
  const r1 = findShortestPath(2, 4, 3, 'A');
  assert.equal(r1, null, '(2,4,3,A) unsolvable: gcd(2,4)=2 does not divide 3');
}
{
  const r2 = findShortestPath(3, 6, 5, 'A');
  assert.equal(r2, null, '(3,6,5,A) unsolvable: gcd(3,6)=3 does not divide 5');
}

// Unsolvable: target exceeds both capacities
{
  const r3 = findShortestPath(3, 8, 9, 'A');
  assert.equal(r3, null, '(3,8,9,A) unsolvable: target > max capacity');
}

// Target equals primary capacity (trivial)
checkSolvable(5, 11, 5, 'A',
  { actionCount: 1, holder: 'A', residual: 0 },
  '(5,11,5,A) trivial primary fill'
);
`;

const PROMPT = `\
Create two-bucket.js that exports \`findShortestPath(vesselA, vesselB, target, primary)\`.

You have two vessels with integer capacities \`vesselA\` and \`vesselB\` (both > 0).
Both start empty (0, 0). Find the SHORTEST sequence of actions that produces
the integer \`target\` amount in either vessel.

Allowed actions on each step:
  - Fill A: pour from infinite source until A is full
  - Fill B: same for B
  - Empty A: dump all of A
  - Empty B: same for B
  - Pour A→B: pour from A into B until A is empty or B is full
  - Pour B→A: same in reverse

Constraints:
  - The FIRST action MUST fill the primary vessel.
    (\`primary === 'A'\` ⇒ first action is "Fill A".)
  - If after the first action the OTHER vessel's capacity equals \`target\`,
    you may take a second action filling that vessel — this is permitted but
    not required by the rules; it just produces a 2-move solution when
    applicable.

Inputs:
  - \`vesselA\`, \`vesselB\`: positive integers (vessel capacities).
  - \`target\`: positive integer (desired amount).
  - \`primary\`: either \`'A'\` or \`'B'\`.

Return value:
  - If no sequence reaches \`target\`: return \`null\`.
  - Otherwise return:
      {
        actionCount: <number of actions in the shortest sequence>,
        holder: <'A' or 'B'>,           // which vessel ends up with the target amount
        residual: <integer>,             // amount in the OTHER vessel at the end
        path: <array of [a, b] state pairs from (0,0) to the final state>
      }
    The \`path\` array must include the initial state \`[0, 0]\` and end with
    the final state. Its length is therefore \`actionCount + 1\`.

Worked example for \`findShortestPath(3, 8, 5, 'A')\`:
  Move 1: Fill A   → state [3, 0]   (mandatory: primary A)
  Move 2: Fill B   → state [3, 8]
  Move 3: Empty A  → state [0, 8]
  Move 4: Pour B→A → state [3, 5]   (target reached in B)
  Result: { actionCount: 4, holder: 'B', residual: 3,
            path: [[0,0],[3,0],[3,8],[0,8],[3,5]] }

Then ensure \`node verify.js\` exits 0. Do not edit verify.js.`;

const CLAW_TIMEOUT = 285_000;

describe(`two-bucket: shortest-path BFS with explicit path reconstruction (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw solves the task', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const targetExists = workspace.exists('two-bucket.js');
    let post = null;
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout: 10_000,
      });
    }
    const passed = r.code === 0 && targetExists && post?.status === 0;

    console.log(`\n=== two-bucket (${TIER_LABEL}) ===`);
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
    assert.equal(targetExists, true, 'two-bucket.js must be created');
    assert.equal(post?.status, 0, `verify.js failed:\n${post?.stderr?.slice(0, 800)}`);
  });
});
