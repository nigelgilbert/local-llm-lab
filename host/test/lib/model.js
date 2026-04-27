// Derive display label and bridge routes for the model A/B eval.
// Unlike backend.js (which swaps routes per backend), both model-ab phases
// use the same llama-server alias (`claw`) and the same LiteLLM bridge routes.
// MODEL_LABEL is for output labelling only.

export const MODEL_LABEL = process.env.MODEL_LABEL || 'unknown';

// Both phases route through the existing claw-llama / anthropic/claw-llama
// bridge entries — no new LiteLLM config needed.
export const bridgeModel = 'claw-llama';
export const clawModel   = 'anthropic/claw-llama';

// Grammar-constrained via claw.gbnf → expect near-1.0 for both models.
// A dip below this threshold signals the model's native tool format is
// incompatible with the grammar's expected wrapping schema.
export const wrapRateThreshold = 0.9;
