// Wrap rate: percentage of streamed completions where the assistant
// terminated with `stop_reason: tool_use` for a one-tool prompt.
//
// This is the headline metric that motivated the llama-server backend.
// Ollama on qwen3-coder UD-Q6_K_XL fails to emit the <tool_call>...</tool_call>
// XML wrapper roughly 1-in-3 generations even with a TEMPLATE override; the
// llama-server config uses a GBNF grammar that constrains decoding so the
// wrapper is mathematically required. We expect llama-server ≈ 1.0 and Ollama
// ≈ 0.5–0.7 (thresholds in lib/backend.js are tuned to those bands).

const { streamMessage } = require('../lib/bridge');
const { bridgeModel, BACKEND, wrapRateThreshold } = require('../lib/backend');

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

const PROMPT = "Use the write_file tool to create hello.py with exactly: print('hi')";

const N = 10;

describe(`wrap-rate (backend=${BACKEND}, model=${bridgeModel})`, () => {
  test(`${N} streamed calls land on stop_reason=tool_use ≥ ${wrapRateThreshold * 100}%`, async () => {
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

    const wraps = results.filter((r) => r.ok).length;
    const rate  = wraps / N;

    // Surface the per-attempt detail so a failing run is debuggable from logs alone.
    /* eslint-disable no-console */
    console.log(`\n=== wrap-rate (${BACKEND}) ===`);
    results.forEach((r, i) => {
      console.log(`  [${i + 1}/${N}] ok=${r.ok} stop=${r.stopReason || '?'} tool_use=${r.hasToolUse} ${r.ms}ms${r.error ? ` err=${r.error}` : ''}`);
    });
    console.log(`  rate = ${wraps}/${N} = ${rate.toFixed(2)}  (threshold ${wrapRateThreshold})`);
    /* eslint-enable no-console */

    expect(rate).toBeGreaterThanOrEqual(wrapRateThreshold);
  });
});
