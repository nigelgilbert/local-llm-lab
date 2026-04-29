// Test-manifest accessor for tier-eval v2. Each test file under
// host/test/__tests__/tier-eval/ declares a manifest object in its header
// (Sprint 0.4); analysis tooling reads those headers to drive axis scorecards
// and discrimination-matrix grouping.
//
// Header convention (Sprint 0.4):
//
//   /** @manifest
//    * { "test_id": "expression-eval", "test_version": "v1",
//    *   "primary_axis": "spec_precision", "suite_layer": "B",
//    *   "difficulty_band": "hard", "oracle_type": "public_verifier",
//    *   "keep_drop_rule": "Never drop — axis-critical for spec_precision." }
//    */
//
// The header is parsed by reading the file as text, locating the
// `@manifest` block, and JSON-parsing the body between `{` and `}`. We avoid
// importing the test file because importing has side effects (registers test
// cases with node:test). Fallback: tests can also export a `manifest`
// constant — readManifest accepts either route.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SCHEMA_PATH = path.join(__dirname, 'schemas', 'test_manifest.schema.json');
export const SCHEMA = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

const REQUIRED = SCHEMA.required;
const PROPS = SCHEMA.properties;

const MANIFEST_BLOCK_RE = /\/\*\*\s*@manifest\s+([\s\S]*?)\*\//;

export class TestManifestValidationError extends Error {
  constructor(testFile, errors) {
    super(`test manifest in ${testFile} failed validation: ${errors.join('; ')}`);
    this.name = 'TestManifestValidationError';
    this.testFile = testFile;
    this.errors = errors;
  }
}

export class MissingTestManifestError extends Error {
  constructor(testFile) {
    super(`no @manifest block found in ${testFile}`);
    this.name = 'MissingTestManifestError';
    this.testFile = testFile;
  }
}

export function validateManifest(manifest) {
  const errors = [];
  if (manifest == null || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return ['manifest must be a plain object'];
  }
  for (const key of REQUIRED) {
    if (!(key in manifest) || manifest[key] === undefined) {
      errors.push(`missing required field: ${key}`);
    }
  }
  for (const [key, value] of Object.entries(manifest)) {
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
    if (Array.isArray(value) && def.items?.enum) {
      for (const v of value) {
        if (!def.items.enum.includes(v)) {
          errors.push(`field ${key}: array value ${JSON.stringify(v)} not in enum`);
        }
      }
    }
    if (def.maxItems != null && Array.isArray(value) && value.length > def.maxItems) {
      errors.push(`field ${key}: ${value.length} items > maxItems ${def.maxItems}`);
    }
  }
  // Cross-field check: secondary_axes must not include primary_axis.
  if (Array.isArray(manifest.secondary_axes) && manifest.secondary_axes.includes(manifest.primary_axis)) {
    errors.push(`secondary_axes must not include primary_axis (${manifest.primary_axis})`);
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

export function readManifest(testFile) {
  const body = fs.readFileSync(testFile, 'utf8');
  const m = MANIFEST_BLOCK_RE.exec(body);
  if (!m) throw new MissingTestManifestError(testFile);
  // The block body may have a leading `*` per JSDoc convention; strip them
  // before JSON-parsing.
  const cleaned = m[1]
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new TestManifestValidationError(testFile, [`invalid JSON in @manifest block: ${e.message}`]);
  }
  const errors = validateManifest(parsed);
  if (errors.length) throw new TestManifestValidationError(testFile, errors);
  return parsed;
}

export function readAllManifests(testDir) {
  const out = {};
  for (const fname of fs.readdirSync(testDir)) {
    if (!fname.endsWith('.test.js')) continue;
    const full = path.join(testDir, fname);
    out[fname] = readManifest(full);
  }
  return out;
}
