// Model-config manifest accessor for tier-eval v2. Each entry in the manifest
// answers "what does this `model_config_id` mean?" — model + quantization +
// context limit + sampler + harness + prompt pack. Run-registry rows
// (lib/registry.js) reference manifest entries by `model_config_id`.
//
// Storage: a JSON file at lib/model_configs.json (committed alongside the
// schema). The file is an object map: `{ "<model_config_id>": { ...entry } }`.
// Override the path with MODEL_CONFIG_MANIFEST_PATH for tests.
//
// This module:
//   - Loads + parses the manifest.
//   - Validates each entry against model_config.schema.json.
//   - Provides resolveConfig(id) -> entry, listConfigs() -> ids.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SCHEMA_PATH = path.join(__dirname, 'schemas', 'model_config.schema.json');
export const SCHEMA = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

export const MANIFEST_PATH =
  process.env.MODEL_CONFIG_MANIFEST_PATH ||
  path.join(__dirname, 'model_configs.json');

const REQUIRED = SCHEMA.required;
const PROPS = SCHEMA.properties;

export class ModelConfigValidationError extends Error {
  constructor(modelConfigId, errors) {
    super(`model_config '${modelConfigId}' failed validation: ${errors.join('; ')}`);
    this.name = 'ModelConfigValidationError';
    this.modelConfigId = modelConfigId;
    this.errors = errors;
  }
}

export class UnknownModelConfigError extends Error {
  constructor(modelConfigId) {
    super(`unknown model_config_id: ${modelConfigId}`);
    this.name = 'UnknownModelConfigError';
    this.modelConfigId = modelConfigId;
  }
}

export function validateEntry(entry) {
  const errors = [];
  if (entry == null || typeof entry !== 'object' || Array.isArray(entry)) {
    return ['entry must be a plain object'];
  }
  for (const key of REQUIRED) {
    if (!(key in entry) || entry[key] === undefined) {
      errors.push(`missing required field: ${key}`);
    }
  }
  for (const [key, value] of Object.entries(entry)) {
    const def = PROPS[key];
    if (!def) {
      errors.push(`unknown field: ${key}`);
      continue;
    }
    const typeErr = checkType(key, value, def);
    if (typeErr) errors.push(typeErr);
    if (def.minimum != null && typeof value === 'number' && value < def.minimum) {
      errors.push(`field ${key}: ${value} < minimum ${def.minimum}`);
    }
  }
  return errors;
}

function checkType(key, value, def) {
  const declared = Array.isArray(def.type) ? def.type : [def.type];
  if (value === null) {
    return declared.includes('null') ? null : `field ${key}: null not allowed`;
  }
  for (const t of declared) {
    if (t === 'null') continue;
    if (t === 'string' && typeof value === 'string') return null;
    if (t === 'integer' && Number.isInteger(value)) return null;
    if (t === 'number' && typeof value === 'number') return null;
    if (t === 'boolean' && typeof value === 'boolean') return null;
    if (t === 'object' && value && typeof value === 'object' && !Array.isArray(value)) return null;
    if (t === 'array' && Array.isArray(value)) return null;
  }
  return `field ${key}: expected ${declared.join('|')}, got ${typeof value}`;
}

export function loadManifest({ manifestPath = MANIFEST_PATH } = {}) {
  if (!fs.existsSync(manifestPath)) {
    return {};
  }
  const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`manifest at ${manifestPath} must be an object map of id -> entry`);
  }
  for (const [id, entry] of Object.entries(raw)) {
    if (entry?.model_config_id !== id) {
      throw new Error(
        `manifest entry under key '${id}' has model_config_id '${entry?.model_config_id}'; key and id must match`,
      );
    }
    const errors = validateEntry(entry);
    if (errors.length) throw new ModelConfigValidationError(id, errors);
  }
  return raw;
}

export function resolveConfig(modelConfigId, opts) {
  const manifest = loadManifest(opts);
  if (!(modelConfigId in manifest)) {
    throw new UnknownModelConfigError(modelConfigId);
  }
  return manifest[modelConfigId];
}

export function listConfigs(opts) {
  return Object.keys(loadManifest(opts));
}
