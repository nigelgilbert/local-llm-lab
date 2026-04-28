// Agent single-file: minimum-viable agentic loop. One tool call, one file, done.
// If this fails the model is not usable for any agent work through this stack.
// elapsedMs doubles as a throughput signal when comparing tiers.
//
// Prompt is INTENTIONALLY minimal — no "Use the write_file tool…" framing.
// A real user asking the agent for a one-line file shouldn't need to spell
// out the tool name. Qwen3-Coder on tier-64 flakes here ~1-in-3 (exits with
// prose, no tool call); we keep this test sensitive to that behavior rather
// than masking it. Same fingerprint as host/test/docs/SETTINGS-AB-RESULTS.md
// "838 ms, only `.claw/` written" note. Tracked in
// host/llama-server/docs/TODO-AGENT-SINGLE-FLAKE.md.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { runClaw } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const PROMPT  = "create hello.py with one line: print('hello')";
const TIMEOUT = 300_000;

describe(`agent: single-file write (tier=${TIER_LABEL})`, () => {
  beforeEach(() => workspace.reset());

  it('claw creates hello.py with the requested content', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== agent-single (${TIER_LABEL}) ===`);
    console.log(`  exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0);
    assert.equal(workspace.exists('hello.py'), true);
    assert.match(workspace.read('hello.py'), /print\(\s*['"]hello['"]\s*\)/);
  });
});
