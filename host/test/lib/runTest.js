// Sprint 1.22: prelude + postlude split for tier-eval tests.
//
// The 32 Family A/B tier-eval tests share a fixed prelude (workspace reset →
// seed-write → optional pre-condition → runner → log header) and a fixed
// postlude (writeAssertionResult → timeout-guard → declarative asserts).
// The middle — *when* the post-script runs and *what* extra checks the test
// makes — genuinely varies. This helper owns prelude + postlude only;
// per-test JS lives between them.
//
// Sprints 1.10 and 1.16a were postlude changes (registry payload schema;
// timeout-guard semantics). Centralising the postlude here is the property
// 1.22 must preserve so the next such change is a one-file edit.
//
// Family A (fix-and-rerun) and Family B (create-and-verify) both fit. Family
// C (`prose-quality`, `latency`, `tool-discipline` — streamMessage-only, no
// registry row) is intentionally out of scope.
//
// Usage:
//   const ctx = await runAgentSetup({ prompt, seedFiles, ... });
//   if (ctx.r.code === 0 && ctx.workspace.exists('foo.js')) ctx.runPost('verify.js');
//   await ctx.finish({ targetFile: 'foo.js', expect: { agentExit: 0, postExit: 0 } });
//
// RunnerResult contract — any injected `runner` must resolve with:
//   {
//     code:              number | null,    // null on timeout
//     stdout:            string,
//     stderr:            string,
//     elapsedMs:         number,
//     terminal_status?:  'timeout' | undefined,
//     runDir:            string,           // for writeAssertionResult sidecar
//     // …additional telemetry fields are passed through unchanged.
//   }
// Default runner = runClaw + clawModel. Pass a custom `runner` to evaluate a
// different agent (Aider/Codex/etc.) under the same harness — field names on
// the helper API use `agent*` for harness-agnosticism. The on-disk registry
// payload still uses `claw_exit` to avoid a registry-side breaking change.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw, writeAssertionResult } from './claw.js';
import * as workspace from './workspace.js';
import { clawModel, TIER_LABEL } from './tier.js';

const POST_SCRIPT_TIMEOUT_MS = 10_000;
const PRE_CONDITION_TIMEOUT_MS = 5_000;
const AGENT_STDERR_TAIL = 1_500;
const POST_STDERR_TAIL = 800;

export async function runAgentSetup({
  prompt,
  seedFiles = {},
  preconditionMustFail = null,
  timeoutMs = 240_000,
  testLabel,
  runner = defaultRunner,
}) {
  if (!prompt) throw new Error('runAgentSetup: prompt required');
  if (!testLabel) throw new Error('runAgentSetup: testLabel required');

  workspace.reset();
  for (const [name, body] of Object.entries(seedFiles)) {
    fs.writeFileSync(path.join(workspace.WORKSPACE, name), body);
  }

  if (preconditionMustFail) {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, preconditionMustFail)], {
      encoding: 'utf8',
      timeout:  PRE_CONDITION_TIMEOUT_MS,
    });
    assert.notEqual(
      pre.status, 0,
      `pre-condition: ${preconditionMustFail} must fail before the fix`,
    );
  }

  const r = await runner({ prompt, timeoutMs });

  console.log(`\n=== ${testLabel} (${TIER_LABEL}) ===`);
  console.log(`  agent: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
  if (r.code !== 0) console.log(`  agent stderr (tail):\n${r.stderr.slice(-AGENT_STDERR_TAIL)}`);

  let post = null;

  function runPost(filename) {
    post = spawnSync('node', [path.join(workspace.WORKSPACE, filename)], {
      encoding: 'utf8',
      timeout:  POST_SCRIPT_TIMEOUT_MS,
      cwd:      workspace.WORKSPACE,
    });
    console.log(`  node post: ${filename} exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);
    return post;
  }

  async function finish({ targetFile = null, expect = { agentExit: 0, postExit: 0 } } = {}) {
    const targetFileExists = targetFile == null ? null : workspace.exists(targetFile);

    const passed = r.code === 0
      && (targetFile == null || targetFileExists === true)
      && post != null
      && post.status === 0;

    const payload = {
      passed,
      claw_exit:           r.code,
      target_file_exists:  targetFileExists,
      post_status:         post ? post.status : null,
      post_stderr_tail:    post ? post.stderr.slice(0, POST_STDERR_TAIL) : null,
    };
    writeAssertionResult(r.runDir, payload);

    if (r.terminal_status === 'timeout') {
      assert.fail(`agent timed out after ${r.elapsedMs}ms (terminal_status=timeout)`);
    }

    if (expect !== 'manual') {
      if (expect.agentExit !== undefined) {
        assert.equal(r.code, expect.agentExit, 'agent must exit cleanly');
      }
      if (expect.targetFileExists !== undefined) {
        assert.equal(
          targetFileExists, expect.targetFileExists,
          `${targetFile} must ${expect.targetFileExists ? 'be created' : 'not exist'}`,
        );
      }
      if (expect.postExit !== undefined) {
        assert.equal(
          post?.status, expect.postExit,
          `post-script failed:\n${post?.stderr?.slice(0, POST_STDERR_TAIL) ?? '(post-script did not run)'}`,
        );
      }
    }

    return { r, post, payload };
  }

  return { r, workspace, runPost, finish };
}

function defaultRunner({ prompt, timeoutMs }) {
  return runClaw({ prompt, model: clawModel, timeoutMs });
}
