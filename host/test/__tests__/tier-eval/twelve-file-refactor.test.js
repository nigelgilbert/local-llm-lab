/** @manifest
 * {
 *   "test_id": "twelve-file-refactor",
 *   "test_version": "v1",
 *   "primary_axis": "multi_file_context",
 *   "secondary_axes": ["convergence"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps. Companion to large-refactor (6 files); this extends to 12 files threading TWO parameters (currency + locale).",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": ["repo_size_dependent", "context_pressure_high"],
 *   "introduced_in": "1.21",
 *   "notes": "H2 hand-authored; extends large-refactor.test.js (6-file, 1-param) to 12 files threading 2 params (currency + locale) through 8 call sites. Each call site reads its params from a different idiomatic source (this.x, parameter, module-level constant, options bag, config object on this, jurisdiction record, etc.). PLAN.md spec mentioned a circular-import trap; deferred to v2. Cycle 1+2 saturated 100/100% — added thousands-separator requirement (de uses '.' for thousands, en omits) and stricter format spec; partial impls that only swap '.' for ',' on decimal now fail the larger-amount assertions. Cycle-3 tweak (analyze-agent): added negative-amount sign-placement spec (minus prefix, not accounting parens) plus multi-thousands grouping (7-digit numbers) — pushes a naive `toFixed(2)+swap-chars` impl below threshold without changing the refactor surface."
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

// formatPrice — formats an amount. Currency and locale are currently hardcoded.
// Refactor: take currency and locale as second and third params and emit
//   "<CCY> <amount-with-2-decimals>" for locale=en (period decimal, no thousands sep)
//   "<amount>,<2-decimals> <CCY>"    for locale=de (comma decimal,
//                                                   period as thousands sep,
//                                                   e.g. 1.234,56)
// Both locales use exactly two fraction digits; integer thousands grouping
// applies for de but not en.
const FORMAT_JS = `\
export function formatPrice(amount) {
  return 'USD ' + amount.toFixed(2);
}
`;

const CART_JS = `\
import { formatPrice } from './format.js';

export class Cart {
  constructor(currency, locale) {
    this.currency = currency;
    this.locale = locale;
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

export function receipt(items, currency, locale) {
  return items.map(i => i.name + ': ' + formatPrice(i.price)).join('\\n');
}
`;

const REPORT_JS = `\
import { formatPrice } from './format.js';

const DEFAULT_CURRENCY = 'EUR';
const DEFAULT_LOCALE = 'de';

export function report(amount) {
  return 'Total: ' + formatPrice(amount);
}
`;

const INVOICE_JS = `\
import { formatPrice } from './format.js';

export class Invoice {
  constructor(config) {
    // config = { currency, locale }
    this.config = config;
    this.lines = [];
  }
  addLine(line) { this.lines.push(line); }
  render() {
    const total = this.lines.reduce((s, l) => s + l.amount, 0);
    return 'INVOICE: ' + formatPrice(total);
  }
}
`;

const AUDIT_JS = `\
import { formatPrice } from './format.js';

// logFinancial returns a string for an audit log row.
// record shape: { amount, currency, locale, kind }
export function logFinancial(record) {
  return record.kind + '|' + formatPrice(record.amount);
}
`;

const SUMMARY_JS = `\
import { formatPrice } from './format.js';

// summaryRow takes an items array and an options bag.
// opts = { currency, locale }
export function summaryRow(items, opts) {
  const total = items.reduce((s, i) => s + i.price, 0);
  return formatPrice(total);
}
`;

const TAXES_JS = `\
import { formatPrice } from './format.js';

// taxLine prints a tax line for a jurisdiction.
// jurisdiction = { name, rate, currency, locale }
export function taxLine(amount, jurisdiction) {
  const tax = amount * jurisdiction.rate;
  return jurisdiction.name + ' tax: ' + formatPrice(tax);
}
`;

const NOTIFY_JS = `\
// notify.js — utility module. Does NOT import format directly. Distractor.
export function notify(channel, message) {
  return '[' + channel + '] ' + message;
}
`;

const HELPER_JS = `\
// helper.js — math utilities. Distractor for the refactor (no formatPrice).
export const round2 = (x) => Math.round(x * 100) / 100;
export const sumByKey = (arr, key) => arr.reduce((s, x) => s + x[key], 0);
`;

const CONSTANTS_JS = `\
// constants.js — currency code lookups. Distractor (no formatPrice).
export const CCY_NAMES = { USD: 'US Dollar', EUR: 'Euro', GBP: 'Pound', JPY: 'Yen' };
export const LOCALE_NAMES = { en: 'English', de: 'German', fr: 'French' };
`;

const TEST_JS = `\
import assert from 'node:assert/strict';
import { Cart }          from './cart.js';
import { receipt }       from './receipt.js';
import { report }        from './report.js';
import { Invoice }       from './invoice.js';
import { logFinancial } from './audit.js';
import { summaryRow }   from './summary.js';
import { taxLine }      from './taxes.js';

// Cart uses this.currency + this.locale.
const c = new Cart('GBP', 'en');
c.add({ name: 'a', price: 10 });
c.add({ name: 'b', price: 5.5 });
assert.equal(c.total(), 'GBP 15.50', 'cart: en locale uses period');

// receipt uses passed-in currency + locale; here de locale uses comma decimal.
const r = receipt([{ name: 'x', price: 3 }, { name: 'y', price: 4.25 }], 'JPY', 'de');
assert.equal(r, 'x: 3,00 JPY\\ny: 4,25 JPY', 'receipt: de locale uses comma');

// report uses module-level DEFAULT_CURRENCY=EUR, DEFAULT_LOCALE=de.
assert.equal(report(99), 'Total: 99,00 EUR', 'report: module defaults EUR/de');

// Invoice uses this.config.currency + this.config.locale.
const inv = new Invoice({ currency: 'USD', locale: 'en' });
inv.addLine({ amount: 100 });
inv.addLine({ amount: 50 });
assert.equal(inv.render(), 'INVOICE: USD 150.00', 'invoice: USD/en');

// audit uses fields on the record itself.
const log = logFinancial({ amount: 42, currency: 'CHF', locale: 'de', kind: 'PAY' });
assert.equal(log, 'PAY|42,00 CHF', 'audit: de from record');

// summary uses options bag.
const sum = summaryRow([{ price: 1.1 }, { price: 2.2 }], { currency: 'AUD', locale: 'en' });
assert.equal(sum, 'AUD 3.30', 'summary: en from opts');

// taxes uses jurisdiction record.
const tx = taxLine(200, { name: 'CA', rate: 0.10, currency: 'CAD', locale: 'en' });
assert.equal(tx, 'CA tax: CAD 20.00', 'tax line: en from jurisdiction');

// Thousands grouping: de uses '.' as thousands separator, en uses none.
{
  const big = receipt([{ name: 'big', price: 1234.5 }], 'EUR', 'de');
  assert.equal(big, 'big: 1.234,50 EUR', 'receipt: de uses period as thousands separator');
}
{
  const bigEn = new Cart('USD', 'en');
  bigEn.add({ name: 'p', price: 12345.67 });
  assert.equal(bigEn.total(), 'USD 12345.67', 'cart: en omits thousands separator');
}

// Negative amounts: minus sign is the FIRST character before any digits or
// thousands separators (parenthesized accounting style is NOT used).
{
  const negEn = logFinancial({ amount: -42.5, currency: 'USD', locale: 'en', kind: 'REFUND' });
  assert.equal(negEn, 'REFUND|USD -42.50', 'audit: negative en — minus directly before number');
}
{
  const negDe = logFinancial({ amount: -1234.5, currency: 'EUR', locale: 'de', kind: 'REFUND' });
  assert.equal(negDe, 'REFUND|-1.234,50 EUR', 'audit: negative de — minus before thousands group');
}

// Multi-thousands grouping: 7-digit amount in de
{
  const huge = receipt([{ name: 'm', price: 1234567.89 }], 'EUR', 'de');
  assert.equal(huge, 'm: 1.234.567,89 EUR', 'receipt: de groups every three digits');
}
`;

const PROMPT = `\
This workspace contains 12 files. The function \`formatPrice\` in format.js
currently hardcodes the currency to "USD" and the locale to a period decimal.

Refactor format.js so that \`formatPrice(amount, currency, locale)\`:
  - For locale === 'en': returns "<CCY> <amount.toFixed(2)>" with NO
      thousands separator. e.g.
        formatPrice(15.5,    'GBP', 'en') → "GBP 15.50"
        formatPrice(12345.67,'USD', 'en') → "USD 12345.67"
  - For locale === 'de': returns "<amount> <CCY>" where the integer
      portion uses '.' as thousands separator and the decimal point is
      replaced by ',' . e.g.
        formatPrice(99,     'EUR', 'de') → "99,00 EUR"
        formatPrice(1234.5, 'EUR', 'de') → "1.234,50 EUR"

  Always emit exactly two fraction digits (use \`amount.toFixed(2)\` as the
  starting point and adjust the formatting from there).

  Negative amounts: prepend a single '-' immediately before the first digit
  (or the first thousands group). Do NOT use parenthesized accounting style.
  Examples:
    formatPrice(-42.5,    'USD', 'en') → "USD -42.50"
    formatPrice(-1234.5,  'EUR', 'de') → "-1.234,50 EUR"

  Multi-thousands grouping in de: group every three digits, e.g.
    formatPrice(1234567.89, 'EUR', 'de') → "1.234.567,89 EUR"

Then update every caller so it threads BOTH \`currency\` and \`locale\`
through to formatPrice. Each caller obtains them from its own idiomatic
source — read each file to find out where the values come from:
  - cart.js:    Cart instance fields (this.currency, this.locale)
  - receipt.js: function parameters
  - report.js:  module-level constants DEFAULT_CURRENCY, DEFAULT_LOCALE
  - invoice.js: this.config.currency, this.config.locale
  - audit.js:   record.currency, record.locale (the parameter is the record)
  - summary.js: opts.currency, opts.locale (options-bag pattern)
  - taxes.js:   jurisdiction.currency, jurisdiction.locale

After your edits, running \`node test.js\` must exit 0. Do not edit test.js.

Files notify.js, helper.js, and constants.js are distractors that do NOT
call formatPrice — leave them alone.`;

const CLAW_TIMEOUT = 285_000;

describe(`twelve-file-refactor: thread two params through 7 call sites in 12 files (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'format.js'),    FORMAT_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'cart.js'),      CART_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'receipt.js'),   RECEIPT_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'report.js'),    REPORT_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'invoice.js'),   INVOICE_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'audit.js'),     AUDIT_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'summary.js'),   SUMMARY_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'taxes.js'),     TAXES_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'notify.js'),    NOTIFY_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'helper.js'),    HELPER_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'constants.js'), CONSTANTS_JS);
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'test.js'),      TEST_JS);
  });

  it('claw threads two parameters through every caller', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const pre = spawnSync('node', [path.join(workspace.WORKSPACE, 'test.js')], {
      encoding: 'utf8',
      timeout: 5_000,
    });
    assert.notEqual(pre.status, 0, 'pre-condition: test.js must fail before the refactor');

    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    let post = null;
    if (r.code === 0) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'test.js')], {
        encoding: 'utf8',
        timeout: 5_000,
      });
    }

    const passed = r.code === 0 && post != null && post.status === 0;

    console.log(`\n=== twelve-file-refactor (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);
    if (post) console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    writeAssertionResult(r.runDir, {
      passed,
      claw_exit: r.code,
      target_file_exists: workspace.exists('format.js'),
      post_status: post ? post.status : null,
      post_stderr_tail: post ? post.stderr.slice(0, 800) : null,
    });

    if (r.terminal_status === 'timeout') assert.fail(`claw timed out after ${r.elapsedMs}ms`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(post.status, 0, `test.js still fails:\n${post.stderr.slice(0, 800)}`);
  });
});
