// Large refactor: thread a new parameter through 5 call sites across 6 files.
//
// Difficulty knob: a single API change must cascade through an import graph.
// `formatPrice(amount)` becomes `formatPrice(amount, currency)`. Every caller
// must pass a currency. Some callers receive currency as a parameter
// themselves; others have it on `this`; one reads it from a constant. A
// model that just edits the definition leaves the codebase broken in 5
// places at once.
//
// Target: hard (saturated tier-64 ceiling probe).

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw, writeAssertionResult } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const FORMAT_JS = `\
// formatPrice — formats an amount. Currently currency is hardcoded to USD.
export function formatPrice(amount) {
  return '$' + amount.toFixed(2);
}
`;

const CART_JS = `\
import { formatPrice } from './format.js';

export class Cart {
  constructor(currency) {
    this.currency = currency;
    this.items = [];
  }
  add(item) { this.items.push(item); }
  total() {
    const amt = this.items.reduce((s, i) => s + i.price, 0);
    return formatPrice(amt);
  }
}
`;

const RECEIPT_JS = `\
import { formatPrice } from './format.js';

export function receipt(items, currency) {
  return items.map(i => i.name + ': ' + formatPrice(i.price)).join('\\n');
}
`;

const REPORT_JS = `\
import { formatPrice } from './format.js';

const DEFAULT_CURRENCY = 'EUR';

export function report(amount) {
  return 'Total: ' + formatPrice(amount);
}
`;

const TEST_JS = `\
import assert from 'node:assert/strict';
import { Cart }    from './cart.js';
import { receipt } from './receipt.js';
import { report }  from './report.js';

const c = new Cart('GBP');
c.add({ name: 'a', price: 10 });
c.add({ name: 'b', price: 5.5 });
assert.equal(c.total(), 'GBP 15.50', 'cart total uses cart currency');

const r = receipt([{name:'x', price:3}, {name:'y', price:4.25}], 'JPY');
assert.equal(r, 'x: JPY 3.00\\ny: JPY 4.25', 'receipt uses passed currency');

assert.equal(report(99), 'Total: EUR 99.00', 'report uses module default currency EUR');
`;

const PROMPT =
  'Refactor format.js so that `formatPrice` takes a second parameter ' +
  '`currency` and returns the currency code followed by a space and the ' +
  'amount with two decimals (e.g. formatPrice(15.5, "GBP") → "GBP 15.50"). ' +
  'Then update every caller in cart.js, receipt.js, and report.js so they ' +
  'pass the appropriate currency: cart.js should use this.currency, ' +
  'receipt.js should use its `currency` parameter, and report.js should ' +
  'use the existing DEFAULT_CURRENCY constant. After your edits, running ' +
  '`node test.js` must exit 0. Do not edit test.js.';

const CLAW_TIMEOUT = 240_000;
const TIMEOUT = CLAW_TIMEOUT + 60_000;

describe(`large-refactor: thread currency through 5 call sites (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'format.js'),  FORMAT_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'cart.js'),    CART_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'receipt.js'), RECEIPT_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'report.js'),  REPORT_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'test.js'),    TEST_JS);
  });

  it('claw threads the new parameter through every caller', { timeout: TIMEOUT }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'test.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: test.js must fail before the refactor');

    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    console.log(`\n=== large-refactor (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    let post = null;
    if (r.code === 0) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'test.js')], {
        encoding: 'utf8',
        timeout:  5_000,
      });
      console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);
    }

    writeAssertionResult(r.runDir, {
      passed: r.code === 0 && post != null && post.status === 0,
      claw_exit: r.code,
      target_file_exists: workspace.exists('format.js'),
      post_status: post ? post.status : null,
      post_stderr_tail: post ? post.stderr.slice(0, 800) : null,
    });

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(post.status, 0, `test.js still fails:\n${post.stderr.slice(0, 800)}`);
  });
});
