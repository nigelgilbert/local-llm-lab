# `twelve-file-refactor` v2/v3 redesign — c18-c20 loop

**Cycles:** c18, c19, c20 (used 3 of a ≤5-cycle budget)
**Branch:** feature/harder-test-suite-1
**Authored:** 2026-05-04

## Goal

Defeat v1 saturation (t16 18 iters / t64 10 iters across c1-c2). Triage hypothesis: the verifier embedded literal expected strings (`'GBP 15.50'`, `'99,00 EUR'`, `'1.234.567,89 EUR'`, ...) and the prompt repeated worked `formatPrice → string` examples — the model never had to derive the locale rules.

Constraint: edits scoped to `host/test/__tests__/tier-eval/twelve-file-refactor.test.js` and `host/test/docs/difficulty-pack/`. No `lib/*`, no `scripts/*`, no `CLAW_TIMEOUT` bumps.

## Per-cycle log

### c18 — v2 redesign (round-trip + config + parser)

Change: introduced `format-config.js` (locale rules as data) and `format-parse.js` (strict, anchored, config-driven parser). Replaced `test.js` so it imports `parsePrice` and asserts `parsePrice(formatPrice(amount, currency, locale), locale)` round-trips to `{ amount, currency }` for every call site. Removed every literal price string from the verifier. Stripped worked examples from the prompt.

Result: **t16 1/1 pass, 20 iters, 60s** — still saturating.

Trace: model read all 14 files in iters 1-5 (config + parser + 7 source + test + 3 distractors), wrote a config-driven `formatPrice` in iter 6, threaded params through 7 callers in iters 7-13, ran `node test.js` (iter 14), hit one floating-point precision failure (the `(amt % 1) * 100` form), debugged with two `node -e` calls, rewrote with `Math.round` (iter 16), passed (iter 20). No oracle remained, but the structural change wasn't enough friction — reading the config and writing a config-driven formatter is a one-shot task at 32k ctx.

### c19 — v3 (per-currency fractions, two-step parse)

Change: split `fractionDigits` off the locale into a new `currency-config.js` (`USD/EUR/GBP/CHF/CAD/AUD: 2`, `JPY/KRW: 0`, `BHD/KWD: 3`). `format-parse.js` now does a two-step parse: extract the `[A-Z]{3}` currency at the locale's known position, look up `CURRENCIES[ccy].fractionDigits`, then build the per-currency amount regex (no decimal sub-pattern at all when `fractionDigits === 0`). Test additions: `receipt(...,'JPY','de')` with integer prices (forces 0-decimal output `"3 JPY"`); `summaryRow(...,'BHD','en')` with 3-decimal prices (forces `BHD x.yyy`); `receipt(...,'KRW','de')` at 7 digits (forces thousands grouping × 0 fraction digits → `"1.234.567 KRW"`). Bumped manifest to v3.

Result: **t16 0/1 fail, 21 iters, 104s, terminal_status=error** — clean defeat.

Trace (snapshots/twelve-file-refactor.t16.jsonl, run `4a4e1d66`):
- iters 1-3: read all config + source files (model used `workspace/...` first, got "not found", retried with `/workspace/...`)
- iter 6: wrote first `formatPrice` — had `const intPart` reassignment → `TypeError: Assignment to constant variable`
- iters 7-13: threaded params through 7 callers
- iter 14: ran test → `TypeError`
- iters 15-21: four more `formatPrice` rewrites cycling through:
  1. `parsePrice rejected "015.50 GBP"` (leading-zero bug + currency in suffix instead of prefix for en)
  2. `parsePrice rejected "15.50 GBP"` (still suffix-position bug for en)
  3. `parsePrice rejected "99.00 EUR"` (period decimal instead of comma for de)
  4. (cycle repeats; iter cap reached, `run_status: error`)

The model conflated locale rules (en uses `.`, de uses `,`) with currency-position rules across rewrites — couldn't hold all four config dimensions (`decimal`, `thousands`, `currencyPosition`, currency-table fraction count) consistent at 32k ctx. Same iter-storm-→-error class as word-search v2.1; distinct from R9-A ctx-overflow.

### c20 — t32 confirmation

Change: none. Re-ran v3 at tier 32.

Result: **t32 1/1 pass, 21 iters, 119s** — clean tier discrimination.

Implication: monotonic_improving signature confirmed at N=1. The model needs the larger ctx (or longer model_elapsed budget — both scale with tier) to keep all four config dimensions straight while debugging.

## Provisional verdict

`twelve-file-refactor` v3 is a **debug-capacity-class tier discriminator** — same shape as `word-search` v2.1: t16 fails via iter-storm + claw error, t32 passes clean. Distinct from R9-A (ctx-overflow) — neither tier hit the 32k window; t16 burned its budget cycling rewrites.

**Pending confirmatory sweeps:** N≥3 at both tiers (deferred; same posture as word-search v2.1 entry in `good-tests.md`).

**Risk to flag if confirmatory sweeps move:** if t16 starts passing at N≥3 due to sampling variance, demote to "set aside". If t32 also starts failing, the change has made it harder for everyone (not a discriminator) — pause and surface.

## What's in the workspace now

15 files at `beforeEach`:

| file | role | model edits? |
|---|---|---|
| `format.js` | hardcoded `'USD ' + amount.toFixed(2)` — refactor target | yes |
| `format-config.js` | locale rules: `decimal`, `thousands`, `currencyPosition`, `sep`, `negativeSign` | **forbidden** |
| `currency-config.js` | per-currency `{ fractionDigits }` map | **forbidden** |
| `format-parse.js` | strict two-step `parsePrice(s, locale)` | **forbidden** |
| `cart.js` | `Cart#total` — uses `this.currency`/`this.locale` | yes |
| `receipt.js` | `receipt(items, currency, locale)` — function params | yes |
| `report.js` | `report(amount)` — module-level `DEFAULT_CURRENCY`/`DEFAULT_LOCALE` | yes |
| `invoice.js` | `Invoice#render` — `this.config.{currency,locale}` | yes |
| `audit.js` | `logFinancial(record)` — fields on the record | yes |
| `summary.js` | `summaryRow(items, opts)` — options bag | yes |
| `taxes.js` | `taxLine(amount, jurisdiction)` — record param | yes |
| `notify.js` | distractor (no `formatPrice` import) | no — leave alone |
| `helper.js` | distractor (math utilities) | no — leave alone |
| `constants.js` | distractor (CCY/LOCALE name lookup tables) | no — leave alone |
| `test.js` | round-trip verifier | **forbidden** |
