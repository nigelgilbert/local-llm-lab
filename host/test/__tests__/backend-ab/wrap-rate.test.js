// Wrap rate: percentage of streamed completions where the assistant
// terminated with `stop_reason: tool_use` for a one-tool prompt.
//
// This is the headline metric that motivated the llama-server backend.
// Ollama on qwen3-coder UD-Q6_K_XL fails to emit the <tool_call>...</tool_call>
// XML wrapper roughly 1-in-3 generations even with a TEMPLATE override; the
// llama-server config uses a GBNF grammar that constrains decoding so the
// wrapper is mathematically required. We expect llama-server ≈ 1.0 and Ollama
// ≈ 0.5–0.7 (thresholds in lib/backend.js are tuned to those bands).

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { streamMessage } from '../../lib/bridge.js';
import { bridgeModel, BACKEND, wrapRateThreshold } from '../../lib/backend.js';

const TOOL = {
  name: 'write_file',
  description: 'Write text content to a file at the given path.',
  input_schema: {
    type: 'object',
    properties: {
      path:    { type: 'string', description: 'Filesystem path to write.' },
      content: { type: 'string', description: 'Body to write.' },
    },
    required: ['path', 'content'],
  },
};

const PROMPT  = "Use the write_file tool to create hello.py with exactly: print('hi')";
const N       = Number(process.env.WRAP_RATE_N) || 10;
const TIMEOUT = 300_000;

// Latency stats so a backend comparison shows speed alongside wrap discipline.
function summarize(latenciesMs) {
  if (latenciesMs.length === 0) return { min: 0, median: 0, p95: 0, mean: 0 };
  const sorted = [...latenciesMs].sort((a, b) => a - b);
  const at = (q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  const mean = sorted.reduce((s, x) => s + x, 0) / sorted.length;
  return { min: sorted[0], median: at(0.5), p95: at(0.95), mean: Math.round(mean) };
}

describe(`wrap-rate (backend=${BACKEND}, model=${bridgeModel})`, () => {
  it(
    `${N} streamed calls land on stop_reason=tool_use ≥ ${wrapRateThreshold * 100}%`,
    { timeout: TIMEOUT },
    async () => {
      const results = [];

      for (let i = 0; i < N; i++) {
        const t0 = Date.now();
        try {
          const r = await streamMessage({
            model: bridgeModel,
            messages: [{ role: 'user', content: PROMPT }],
            tools:    [TOOL],
            maxTokens: 256,
          });
          results.push({
            ok: r.stopReason === 'tool_use' && r.hasToolUse,
            stopReason: r.stopReason,
            hasToolUse: r.hasToolUse,
            ms: Date.now() - t0,
          });
        } catch (err) {
          results.push({ ok: false, error: err.message, ms: Date.now() - t0 });
        }
      }

      const wraps  = results.filter((r) => r.ok).length;
      const rate   = wraps / N;
      const stats  = summarize(results.map((r) => r.ms));

      // Surface the per-attempt detail so a failing run is debuggable from logs alone.
      console.log(`\n=== wrap-rate (${BACKEND}) ===`);
      results.forEach((r, i) => {
        console.log(`  [${i + 1}/${N}] ok=${r.ok} stop=${r.stopReason ?? '?'} tool_use=${r.hasToolUse} ${r.ms}ms${r.error ? ` err=${r.error}` : ''}`);
      });
      console.log(`  rate    = ${wraps}/${N} = ${rate.toFixed(2)}  (threshold ${wrapRateThreshold})`);
      console.log(`  latency = min ${stats.min}ms · median ${stats.median}ms · p95 ${stats.p95}ms · mean ${stats.mean}ms`);

      assert.ok(
        rate >= wrapRateThreshold,
        `wrap rate ${rate.toFixed(2)} below threshold ${wrapRateThreshold}`,
      );
    },
  );
});
