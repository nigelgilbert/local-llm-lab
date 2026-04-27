// Derive bridge model names from the BACKEND env (set per-phase by run.sh).
// run.sh passes BACKEND=ollama or BACKEND=llama-server; the bridge config
// (host/litellm/litellm-config.yaml) carries the matching `claw-ollama` /
// `claw-llama` route pair plus their `anthropic/*` aliases.

const BACKEND = process.env.BACKEND || 'llama-server';

if (BACKEND !== 'ollama' && BACKEND !== 'llama-server') {
  throw new Error(`BACKEND must be 'ollama' or 'llama-server', got: ${BACKEND}`);
}

const SUFFIX = BACKEND === 'llama-server' ? 'llama' : 'ollama';

module.exports = {
  BACKEND,
  // Used by raw bridge calls (lib/bridge.js).
  bridgeModel: `claw-${SUFFIX}`,
  // Used when invoking claw, which requires the `anthropic/` prefix.
  clawModel: `anthropic/claw-${SUFFIX}`,
  // Per-backend wrap-rate floor (see __tests__/wrap-rate.test.js).
  // llama-server is grammar-constrained → effectively 1.0; ollama is at the
  // mercy of qwen3-coder's wrap discipline (~0.6–0.7 in spot-checks).
  wrapRateThreshold: BACKEND === 'llama-server' ? 0.9 : 0.5,
};
