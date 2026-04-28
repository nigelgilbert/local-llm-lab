// Code self-test: does the model produce functionally correct code?
//
// claw is asked to write a fib.js that validates itself using node:assert/strict.
// After claw exits, the test runner executes the file with node and asserts
// exit 0. This separates the correctness of the generated code from claw's
// own exit behaviour — the model must understand the algorithm, not just emit
// syntactically valid JS.
//
// Expected differentiator: the 14B tier may produce off-by-one errors or
// iterate incorrectly; the 30B models should handle this reliably.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

import { runClaw } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const PROMPT =
  'Write a file called fib.js that implements fibonacci(n) iteratively ' +
  'and validates the results using import assert from "node:assert/strict". ' +
  'Assert: fibonacci(1)===1, fibonacci(5)===5, fibonacci(10)===55. ' +
  'Do not wrap in try/catch — let assertion failures propagate as uncaught errors.';

const TIMEOUT = 300_000;

describe(`code self-test: fibonacci implementation (tier=${TIER_LABEL})`, () => {
  beforeEach(() => workspace.reset());

  it('claw writes fib.js that passes its own assertions under node', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== code-self-test (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(workspace.exists('fib.js'), true, 'fib.js must be created');

    const result = spawnSync('node', ['/workspace/fib.js'], {
      encoding: 'utf8',
      timeout:  10_000,
    });

    console.log(`  node: exit=${result.status} stdout=${result.stdout.slice(0, 200).trim()} stderr=${result.stderr.slice(0, 400).trim()}`);

    assert.equal(
      result.status,
      0,
      `fib.js failed when run with node:\n${result.stderr.slice(0, 800)}`,
    );
  });
});
