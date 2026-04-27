// Eval C: prose density. Catches the markdown-smush regression where the
// claw sampler suppresses newline tokens across long markdown responses,
// collapsing structured output into one run-on line. Symptom observed in
// claw-code on 2026-04-27 — final-message text rendered with bold and
// header markers intact but every \n stripped.
//
// Tested through `claw -p` (not the raw bridge) because the bug only
// manifests under claw's full agent context — system prompt + tool catalog
// + discipline rules combine with the sampler to suppress newlines. The
// raw-bridge path produces well-formatted markdown for the same prompt and
// model.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { runClaw } from '../lib/claw.js';
import { clawModel, BACKEND } from '../lib/backend.js';

const PROMPT =
  'Write a short markdown explainer about React components. ' +
  'Use 2 headers (## style) and at least 4 bullet points. ' +
  'Aim for around 250 words. Do not call any tools, just respond with the markdown.';

const N            = Number(process.env.PROSE_N) || 3;
const TIMEOUT      = 300_000;
const MIN_TEXT_LEN = 600;
const MIN_NEWLINES = 5;
const MIN_BULLETS  = 3;

// Strip ANSI escape sequences (claw colorizes headers and bullets) before
// counting structure markers. Newlines aren't ANSI-wrapped, so the newline
// count is taken from raw stdout.
const ANSI_RE = /\x1b\[[0-9;]*[A-Za-z]/g;
const stripAnsi = (s) => s.replace(ANSI_RE, '');

describe(`prose density via claw (backend=${BACKEND}, model=${clawModel})`, () => {
  it(
    `${N}× markdown response: len ≥ ${MIN_TEXT_LEN}, newlines ≥ ${MIN_NEWLINES}, bullets ≥ ${MIN_BULLETS}`,
    { timeout: TIMEOUT },
    async () => {
      const results = [];
      for (let i = 0; i < N; i++) {
        const r = await runClaw({ prompt: PROMPT, model: clawModel });
        const clean    = stripAnsi(r.stdout);
        const newlines = (r.stdout.match(/\n/g) ?? []).length;
        // Bullet at start of a line — the strongest smush signal. In
        // smushed output the bullet glyphs end up inline (no leading \n),
        // so this count goes to ~0 even if `•` characters exist in the body.
        const bullets  = (clean.match(/^[ \t]*[-*•]\s/gm) ?? []).length;
        results.push({
          code: r.code,
          elapsedMs: r.elapsedMs,
          rawLen: r.stdout.length,
          cleanLen: clean.length,
          newlines,
          bullets,
          stdout: r.stdout,
          clean,
        });
      }

      console.log(`\n=== prose-density via claw (${BACKEND}) ===`);
      results.forEach((r, i) => {
        console.log(`  [${i + 1}/${N}] exit=${r.code} ${r.elapsedMs}ms rawLen=${r.rawLen} cleanLen=${r.cleanLen} newlines=${r.newlines} bullets=${r.bullets}`);
      });
      const sample = stripAnsi(results[0]?.stdout ?? '').slice(0, 320);
      console.log(`  sample[0] (first 320, ANSI stripped, \\n shown literal):`);
      console.log(`    ${sample.replace(/\n/g, '\\n')}`);

      for (const [i, r] of results.entries()) {
        assert.equal(r.code, 0, `[${i + 1}] claw exited non-zero`);
        assert.ok(r.cleanLen >= MIN_TEXT_LEN,
          `[${i + 1}] response too short: cleanLen=${r.cleanLen} < ${MIN_TEXT_LEN}`);
        assert.ok(r.newlines >= MIN_NEWLINES,
          `[${i + 1}] markdown smush: ${r.newlines} newlines in ${r.cleanLen} chars (sampler suppressed line breaks)`);
        assert.ok(r.bullets >= MIN_BULLETS,
          `[${i + 1}] missing bullet structure: ${r.bullets} bullet-lines (smushed bullets render inline)`);
      }
    },
  );
});
