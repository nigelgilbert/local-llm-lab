// End-to-end tool-call latency — N=20 samples for statistical stability.
//
// Tests the full round-trip: request → prefill → decode → stop_reason=tool_use.
// Uses a single tool (write_file) so the prompt is well under the 2048-token
// batch boundary, making this a clean decode-speed signal rather than a
// prefill signal. Expect similar numbers between settings; any delta reflects
// the ctx-size memory-pressure change, not batch-size.
//
// Also captures wrap rate as a sanity check — grammar must hold at ≥ 0.9.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { streamMessage } from '../../lib/bridge.js';
import { bridgeModel }   from '../../lib/model.js';

const SETTINGS_LABEL    = process.env.SETTINGS_LABEL || 'unknown';
const N                 = Number(process.env.WRAP_N) || 20;
const TIMEOUT           = 300_000;
const WRAP_THRESHOLD    = 0.9;

const TOOL = {
  name: 'write_file',
  description: 'Write text content to a file.',
  input_schema: {
    type: 'object',
    properties: {
      path:    { type: 'string', description: 'File path.' },
      content: { type: 'string', description: 'Content to write.' },
    },
    required: ['path', 'content'],
  },
};

const PROMPT = "Use the write_file tool to create hello.py with exactly: print('hi')";

function stats(arr) {
  if (!arr.length) return { min: 0, median: 0, p95: 0, mean: 0 };
  const s = [...arr].sort((a, b) => a - b);
  const at = (q) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  return {
    min:    s[0],
    median: at(0.5),
    p95:    at(0.95),
    mean:   Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
  };
}

describe(`tool-call latency — N=${N} (settings=${SETTINGS_LABEL})`, () => {
  it(
    `${N} round-trips: wrap rate ≥ ${WRAP_THRESHOLD * 100}%, latency distribution reported`,
    { timeout: TIMEOUT },
    async () => {
      const results = [];

      for (let i = 0; i < N; i++) {
        const t0 = Date.now();
        try {
          const r = await streamMessage({
            model:     bridgeModel,
            messages:  [{ role: 'user', content: PROMPT }],
            tools:     [TOOL],
            maxTokens: 256,
          });
          const ms = Date.now() - t0;
          const ok = r.stopReason === 'tool_use' && r.hasToolUse;
          results.push({ ok, stopReason: r.stopReason, ms });
          console.log(`  [${i + 1}/${N}] ok=${ok} stop=${r.stopReason} ${ms}ms`);
        } catch (err) {
          results.push({ ok: false, error: err.message, ms: Date.now() - t0 });
          console.log(`  [${i + 1}/${N}] ERROR: ${err.message}`);
        }
      }

      const wraps = results.filter((r) => r.ok).length;
      const rate  = wraps / N;
      const s     = stats(results.map((r) => r.ms));

      console.log(`\n=== tool-latency (${SETTINGS_LABEL}) ===`);
      console.log(`  wrap rate = ${wraps}/${N} = ${rate.toFixed(2)}  (threshold ${WRAP_THRESHOLD})`);
      console.log(`  latency   = min ${s.min}ms · median ${s.median}ms · p95 ${s.p95}ms · mean ${s.mean}ms`);

      assert.ok(
        rate >= WRAP_THRESHOLD,
        `wrap rate ${rate.toFixed(2)} below threshold ${WRAP_THRESHOLD} — grammar may have regressed`,
      );
    },
  );
});
