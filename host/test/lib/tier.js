// Derive tier label and bridge routes for the tier eval suite.
// Mirrors lib/model.js — both phases of model-ab use the same claw-llama route;
// all three tiers here do too (grammar-constrained llama-server for all).

export const TIER       = process.env.TIER ?? '64';
export const TIER_LABEL = `tier-${TIER}`;

export const bridgeModel = 'claw-llama';
export const clawModel   = 'anthropic/claw-llama';

// All tiers run through the same claw.gbnf grammar — expect near-1.0.
// A dip below this threshold signals grammar incompatibility with the model's
// native tool-call format (malformed JSON inside the wrapper).
export const wrapRateThreshold = 0.9;
