// Tier-eval v2 run registry. One row per claw run (production / pilot /
// smoke / dry_run / overnight_screen / confirmatory / admission). The schema
// is the source of truth — see lib/schemas/run_registry.schema.json. This
// module loads the schema, validates rows, and appends them to a JSONL log.
//
// Design notes:
//   - The registry is append-only JSONL so concurrent runs (e.g. the iteration
//     sweep driver and a manual smoke) cannot corrupt each other. One write =
//     one fs.appendFileSync of one JSON line.
//   - Validation is structural only (required fields + enum membership). It
//     does not cross-check that model_config_id resolves against the manifest
//     — that join lives in the analysis layer, not the writer.
//   - Hardware fields are deliberately minimal. tier-16/32/64 each map to a
//     single physical machine, so hardware_id and soc_generation are omitted
//     (see TIER-EVAL-V2-SPRINT-PLAN.md §2). Reintroduce a `machine_label`
//     field if a future iteration adds a second physical unit at the same
//     tier.
//
// Usage:
//   import { appendRow, validateRow, REGISTRY_PATH } from './registry.js';
//   const row = { run_id, run_kind: 'overnight_screen', ... };
//   appendRow(row);  // throws if validation fails

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SCHEMA_PATH = path.join(__dirname, 'schemas', 'run_registry.schema.json');
export const SCHEMA = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

// Default registry location: under the host-mounted .claw-runtime root so it
// survives container teardown alongside the W1 telemetry sidecars.
const DEFAULT_REGISTRY_DIR = '/workspace/.claw-runtime';
const REGISTRY_FILENAME = 'run_registry.jsonl';

export const REGISTRY_PATH =
  process.env.RUN_REGISTRY_PATH ||
  path.join(DEFAULT_REGISTRY_DIR, REGISTRY_FILENAME);

const REQUIRED = SCHEMA.required;
const PROPS = SCHEMA.properties;

export class RegistryValidationError extends Error {
  constructor(errors, row) {
    super(`run registry row failed validation: ${errors.join('; ')}`);
    this.name = 'RegistryValidationError';
    this.errors = errors;
    this.row = row;
  }
}

export function validateRow(row) {
  const errors = [];
  if (row == null || typeof row !== 'object' || Array.isArray(row)) {
    return ['row must be a plain object'];
  }

  for (const key of REQUIRED) {
    if (!(key in row) || row[key] === undefined) {
      errors.push(`missing required field: ${key}`);
    }
  }

  for (const [key, value] of Object.entries(row)) {
    const def = PROPS[key];
    if (!def) {
      errors.push(`unknown field: ${key}`);
      continue;
    }
    const typeErr = checkType(key, value, def);
    if (typeErr) errors.push(typeErr);
    if (def.enum && value != null && !def.enum.includes(value)) {
      errors.push(`field ${key}: value ${JSON.stringify(value)} not in enum [${def.enum.join(', ')}]`);
    }
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

export function appendRow(row, { registryPath = REGISTRY_PATH } = {}) {
  const errors = validateRow(row);
  if (errors.length) throw new RegistryValidationError(errors, row);
  fs.mkdirSync(path.dirname(registryPath), { recursive: true });
  fs.appendFileSync(registryPath, JSON.stringify(row) + '\n');
  return registryPath;
}

export function readRegistry({ registryPath = REGISTRY_PATH } = {}) {
  if (!fs.existsSync(registryPath)) return [];
  const body = fs.readFileSync(registryPath, 'utf8');
  const rows = [];
  for (const line of body.split('\n')) {
    const trim = line.trim();
    if (!trim) continue;
    try {
      rows.push(JSON.parse(trim));
    } catch {
      // skip malformed; analysis layer can flag.
    }
  }
  return rows;
}
