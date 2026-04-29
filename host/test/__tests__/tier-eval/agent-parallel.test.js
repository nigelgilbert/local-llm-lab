// Agent parallel tool emission: three distinct file writes in one response.
// Verifies the model emits three non-duplicate tool calls and produces the
// correct output. elapsedMs is a throughput signal across tiers.

/** @manifest
 * {
 *   "test_id": "agent-parallel",
 *   "test_version": "v1",
 *   "primary_axis": "tool_discipline",
 *   "secondary_axes": [
 *     "local_usability"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "medium",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 tier-sensitive for parallel-tool-emission throughput.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [
 *     "tool_shape_variance"
 *   ]
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { runClaw, writeAssertionResult } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

// Outcome-focused: describe the desired result, not the tool name. Naming a
// specific tool (write_file) causes the model to call a non-existent tool;
// claw rejects it and no files are written.
const PROMPT =
  "Create three files in one response: " +
  "a.py with one line print(1), " +
  "b.py with one line print(2), " +
  "c.py with one line print(3).";

const EXPECTED = [
  { file: 'a.py', match: /print\(\s*1\s*\)/ },
  { file: 'b.py', match: /print\(\s*2\s*\)/ },
  { file: 'c.py', match: /print\(\s*3\s*\)/ },
];

const TIMEOUT = 300_000;

describe(`agent: parallel file writes (tier=${TIER_LABEL})`, () => {
  beforeEach(() => workspace.reset());

  it('claw creates a.py, b.py, c.py with matching contents', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== agent-parallel (${TIER_LABEL}) ===`);
    console.log(`  exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  stderr (tail):\n${r.stderr.slice(-1500)}`);

    const allFilesPresent = EXPECTED.every(({ file }) => workspace.exists(file));
    const allContentsMatch = allFilesPresent &&
      EXPECTED.every(({ file, match }) => match.test(workspace.read(file)));

    writeAssertionResult(r.runDir, {
      passed: r.code === 0 && allFilesPresent && allContentsMatch,
      claw_exit: r.code,
      target_file_exists: allFilesPresent,
      post_status: allContentsMatch ? 0 : 1,
      post_stderr_tail: null,
    });

    assert.equal(r.code, 0);
    for (const { file, match } of EXPECTED) {
      assert.equal(workspace.exists(file), true, `expected ${file} to exist`);
      assert.match(workspace.read(file), match);
    }
  });
});
