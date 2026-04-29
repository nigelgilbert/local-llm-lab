#!/usr/bin/env node
// Flatten the run-registry JSONL into a CSV view for quick inspection /
// pivoting in spreadsheets. The JSONL is the source of truth; this is a
// derived projection, not a replacement.
//
// Usage:
//   node scripts/registry-to-csv.mjs \
//        --registry /workspace/.claw-runtime/run_registry.jsonl \
//        --out      /workspace/.claw-runtime/run_registry.csv \
//        [--bucket canonical|legacy-compatible|legacy-asterisked|excluded] \
//                                  # filter by canonical_status
//        [--run-kind overnight_screen|...]
//        [--tier 16|32|64]
//
// Columns are taken from run_registry.schema.json properties in declaration
// order, so the CSV evolves with the schema.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCHEMA = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'lib', 'schemas', 'run_registry.schema.json'),
  'utf8',
));
const COLUMNS = Object.keys(SCHEMA.properties);

function parseArgs(argv) {
  const opts = {};
  const a = argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--registry') opts.registry = a[++i];
    else if (k === '--out') opts.out = a[++i];
    else if (k === '--bucket') opts.bucket = a[++i];
    else if (k === '--run-kind') opts.runKind = a[++i];
    else if (k === '--tier') opts.tier = Number.parseInt(a[++i], 10);
    else if (k === '--help' || k === '-h') { printHelp(); process.exit(0); }
    else { console.error(`unknown arg: ${k}`); printHelp(); process.exit(2); }
  }
  return opts;
}

function printHelp() {
  console.error(`Usage: node registry-to-csv.mjs --registry <jsonl> --out <csv> [--bucket <s>] [--run-kind <s>] [--tier <n>]`);
}

function csvCell(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  if (typeof v === 'object') v = JSON.stringify(v);
  const s = String(v);
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function main() {
  const opts = parseArgs(process.argv);
  if (!opts.registry) { console.error('--registry required'); process.exit(2); }
  if (!opts.out)      { console.error('--out required');      process.exit(2); }
  if (!fs.existsSync(opts.registry)) {
    console.error(`registry not found: ${opts.registry}`);
    process.exit(2);
  }

  const lines = fs.readFileSync(opts.registry, 'utf8').split('\n').filter(Boolean);
  const rows = [];
  let dropped = 0;
  for (const line of lines) {
    let r; try { r = JSON.parse(line); } catch { dropped += 1; continue; }
    if (opts.bucket  && r.canonical_status !== opts.bucket)  continue;
    if (opts.runKind && r.run_kind         !== opts.runKind) continue;
    if (opts.tier    && r.hardware_tier    !== opts.tier)    continue;
    rows.push(r);
  }

  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  const out = fs.openSync(opts.out, 'w');
  fs.writeSync(out, COLUMNS.join(',') + '\n');
  for (const r of rows) {
    fs.writeSync(out, COLUMNS.map((c) => csvCell(r[c])).join(',') + '\n');
  }
  fs.closeSync(out);

  console.log(`wrote ${rows.length} row(s) to ${opts.out} (skipped ${dropped} malformed line(s))`);
}

main();
