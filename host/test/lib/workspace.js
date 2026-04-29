// Filesystem helpers around the test workspace (/workspace inside the
// container — purely ephemeral, gone when --rm fires).

import fs from 'node:fs';
import path from 'node:path';

export const WORKSPACE = '/workspace';

// `.claw-runtime` is the host-mounted iter-distribution telemetry directory
// (TODO-ITERATION-DISTRIBUTION-TEST.md W1). It must survive between test
// invocations or each new run wipes the bridge log + prior run sidecars
// before the analysis scripts get to read them.
const PRESERVE_BETWEEN_RUNS = new Set(['.claw-runtime']);

export function reset() {
  if (fs.existsSync(WORKSPACE)) {
    for (const entry of fs.readdirSync(WORKSPACE)) {
      if (PRESERVE_BETWEEN_RUNS.has(entry)) continue;
      fs.rmSync(path.join(WORKSPACE, entry), { recursive: true, force: true });
    }
  } else {
    fs.mkdirSync(WORKSPACE, { recursive: true });
  }
}

export function exists(rel) {
  return fs.existsSync(path.join(WORKSPACE, rel));
}

export function read(rel) {
  return fs.readFileSync(path.join(WORKSPACE, rel), 'utf8');
}

export function list() {
  return fs.existsSync(WORKSPACE) ? fs.readdirSync(WORKSPACE) : [];
}
