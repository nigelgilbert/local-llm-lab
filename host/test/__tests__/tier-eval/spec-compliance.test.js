// Spec-compliance: implement to a multi-requirement spec.
//
// Difficulty knob (rule #6): four explicit requirements in the prompt, all
// asserted on. The naive 1-liner satisfies 1–2 of them; a careful read
// satisfies all four. This separates "model dashed off the obvious solution"
// from "model worked the spec."
//
// Hidden adversarial inputs in the assertions (rule #7): zero, large numbers
// that exercise thousands separators, currency symbols longer than one char.
// None of those are mentioned in the prompt — the spec implies them, but
// only if the model reads carefully.

/** @manifest
 * {
 *   "test_id": "spec-compliance",
 *   "test_version": "v1",
 *   "primary_axis": "spec_precision",
 *   "secondary_axes": [
 *     "convergence"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "medium",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 multi-requirement spec is canonical spec_precision exercise.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": []
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const VERIFY_JS = `\
import assert from 'node:assert/strict';
import { formatPrice } from './price.js';

assert.equal(formatPrice(100,     'USD'), '$1.00',       'basic USD');
assert.equal(formatPrice(99,      'EUR'), '€0.99',       'sub-1 EUR');
assert.equal(formatPrice(0,       'USD'), '$0.00',       'zero must keep two decimals');
assert.equal(formatPrice(123456,  'USD'), '$1,234.56',   'thousands separator on USD');
assert.equal(formatPrice(1000000, 'EUR'), '€10,000.00',  'thousands separator on EUR');
assert.equal(formatPrice(50,      'JPY'), '¥0.50',       'JPY symbol');
`;

const PROMPT =
  'Create price.js that exports a single function `formatPrice(cents, currency)`. ' +
  'Requirements: ' +
  '(1) divide cents by 100 to get the major-unit value; ' +
  '(2) always render exactly two decimal places, even for whole or zero values; ' +
  '(3) insert comma thousands separators in the integer portion (e.g., 1234567 cents → "12,345.67"); ' +
  '(4) prefix with the currency symbol — USD → "$", EUR → "€", JPY → "¥". ' +
  'Then ensure that running `node verify.js` exits 0. Do not edit verify.js.';

const TIMEOUT = 300_000;

describe(`spec compliance: multi-requirement formatPrice (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw implements formatPrice satisfying all four requirements', { timeout: TIMEOUT }, async () => {
    // No pre-condition check — price.js doesn't exist yet, verify.js fails on import.

    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== spec-compliance (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(workspace.exists('price.js'), true, 'price.js must be created');

    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    assert.equal(
      post.status,
      0,
      `verify.js failed:\n${post.stderr.slice(0, 800)}`,
    );
  });
});
