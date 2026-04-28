// Prose quality: does the model format structured markdown correctly through claw?
//
// NOT skipped — all three tiers are tested. The 16GB model may exhibit the
// markdown-smush bug seen with qwen3-coder on Ollama (newlines stripped,
// output collapses to one run-on line). The 30B models should pass reliably.
//
// Thresholds mirror model-ab/prose-density.test.js so results are directly
// comparable with prior runs.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { runClaw } from '../../lib/claw.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const PROMPT =
  'Write a short markdown explainer about React components. ' +
  'Use 2 headers (## style) and at least 4 bullet points. ' +
  'Aim for around 250 words. Do not call any tools, just respond with the markdown.';

const N            = Number(process.env.PROSE_N) || 3;
const TIMEOUT      = 300_000;
const MIN_TEXT_LEN = 600;
const MIN_NEWLINES = 5;
const MIN_BULLETS  = 3;

const ANSI_RE  = /\x1b\[[0-9;]*[A-Za-z]/g;
const stripAnsi = (s) => s.replace(ANSI_RE, '');

describe(`prose quality via claw (tier=${TIER_LABEL})`, () => {
  it(
    `${N}× markdown response: len ≥ ${MIN_TEXT_LEN}, newlines ≥ ${MIN_NEWLINES}, bullets ≥ ${MIN_BULLETS}`,
    { timeout: TIMEOUT },
    async () => {
      const results = [];
      for (let i = 0; i < N; i++) {
        const r     = await runClaw({ prompt: PROMPT, model: clawModel });
        const clean    = stripAnsi(r.stdout);
        const newlines = (r.stdout.match(/\n/g) ?? []).length;
        // Leading-bullet lines are the strongest smush signal: in smushed output
        // bullet chars exist but without a leading newline, this count drops to ~0.
        const bullets  = (clean.match(/^[ \t]*[-*•]\s/gm) ?? []).length;
        results.push({ code: r.code, elapsedMs: r.elapsedMs, rawLen: r.stdout.length, cleanLen: clean.length, newlines, bullets, stdout: r.stdout, clean });
      }

      console.log(`\n=== prose-quality (${TIER_LABEL}) ===`);
      results.forEach((r, i) => {
        console.log(`  [${i + 1}/${N}] exit=${r.code} ${r.elapsedMs}ms rawLen=${r.rawLen} cleanLen=${r.cleanLen} newlines=${r.newlines} bullets=${r.bullets}`);
      });
      const sample = stripAnsi(results[0]?.stdout ?? '').slice(0, 320);
      console.log(`  sample[0] (first 320 chars, ANSI stripped, \\n shown literal):`);
      console.log(`    ${sample.replace(/\n/g, '\\n')}`);

      for (const [i, r] of results.entries()) {
        assert.equal(r.code, 0, `[${i + 1}] claw exited non-zero`);
        assert.ok(r.cleanLen >= MIN_TEXT_LEN,
          `[${i + 1}] response too short: cleanLen=${r.cleanLen} < ${MIN_TEXT_LEN}`);
        assert.ok(r.newlines >= MIN_NEWLINES,
          `[${i + 1}] markdown smush: ${r.newlines} newlines in ${r.cleanLen} chars`);
        assert.ok(r.bullets >= MIN_BULLETS,
          `[${i + 1}] missing bullet structure: ${r.bullets} bullet-lines`);
      }
    },
  );
});
