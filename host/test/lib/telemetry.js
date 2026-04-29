// Thermal + throughput telemetry (Sprint 0.7, Sprint 1.12 split).
//
// Sprint 1.12 (research-team direction, 2026-04-29 memo): throughput-drift
// no longer escalates `thermal_status` — it is a separate boolean advisory
// column. `thermal_status` is sourced exclusively from the pmset sidecar
// hint file. Reasoning: drift fired on the cleanest tier (5/31 tier-64
// rows) in the 1.10 smoke, suggesting it tracks warmup-phase decode rather
// than thermal events. Keep the signal as raw telemetry; don't let it
// degrade the per-row inclusion label.
//
// New shape:
//   thermal_status ∈ {clean, warning, pmset_contaminated, unknown}
//                    (drops the drift-only `contaminated` value)
//   thermal_drift_advisory ∈ {true, false}
//
// Pmset hint sidecar (unchanged):
//   1. host/test/scripts/thermal-watch.sh polls `pmset -g therm` once per
//      second and writes the latest result to
//      host/test/.claw-runtime/.thermal-hint.json (visible inside the
//      container at /workspace/.claw-runtime/.thermal-hint.json via the
//      existing volume mount).
//   2. If the sidecar is not running, the hint file is missing/stale and we
//      report `thermal_status = unknown`.
//
// Hint-file schema:
//   {
//     "captured_at_ms": 1777439500000,
//     "thermal_warning": null | "Nominal" | "Moderate" | "Heavy" | "Trapping" | "Sleeping",
//     "performance_warning": null | <same enum>,
//     "cpu_power": null | "OK" | <other>,
//     "raw": "<verbatim pmset output>"
//   }
//
// Throughput drift advisory (informational only post-1.12):
//   captureThroughputAdvisory(iterRecords) computes a tokens/sec trend from
//   per-iteration server_decode_ms + output_tokens. Returns
//   `{ advisory: boolean, drop_pct, ... }`. The advisory boolean fires when
//   median throughput drops by warningDropPct (default 25%) from the
//   run's first-third to its final-third. Sprint 2's matrix uses this as
//   diagnostic context, not an inclusion gate.

import fs from 'node:fs';
import path from 'node:path';

import { WORKSPACE } from './workspace.js';

// Match thermal-watch.sh's default write location. The .claw-runtime/
// subdirectory is the existing host-mount point shared with run sidecars,
// so the sidecar's writes are immediately visible here without adding a
// second volume.
const HINT_PATH = path.join(WORKSPACE, '.claw-runtime', '.thermal-hint.json');

// Hint is considered stale if it was written more than 10 seconds ago — the
// sidecar polls every 1s, so 10s gap = sidecar dead/paused.
const HINT_STALENESS_MS = 10_000;

// pmset thermal_warning levels in escalating order. Anything from "Heavy"
// upward forces `pmset_contaminated`; "Moderate" yields `warning`.
const PMSET_LEVELS = {
  Nominal:    'clean',
  Moderate:   'warning',
  Heavy:      'pmset_contaminated',
  Trapping:   'pmset_contaminated',
  Sleeping:   'pmset_contaminated',
};

const STATUS_ORDER = { unknown: -1, clean: 0, warning: 1, pmset_contaminated: 2 };

export function captureThermalStatus({ now = Date.now(), hintPath = HINT_PATH } = {}) {
  if (!fs.existsSync(hintPath)) return { status: 'unknown', source: 'no_hint_file' };
  let hint;
  try {
    hint = JSON.parse(fs.readFileSync(hintPath, 'utf8'));
  } catch {
    return { status: 'unknown', source: 'hint_file_unparseable' };
  }
  const ageMs = now - (hint.captured_at_ms ?? 0);
  if (ageMs > HINT_STALENESS_MS) {
    return { status: 'unknown', source: 'hint_file_stale', age_ms: ageMs };
  }
  // pmset reports null when no warning level has been recorded — that is the
  // "no thermal events have happened" baseline. Treat as `clean`.
  const tw = hint.thermal_warning;
  const pw = hint.performance_warning;
  const fromTw = tw == null ? 'clean' : (PMSET_LEVELS[tw] ?? 'unknown');
  const fromPw = pw == null ? 'clean' : (PMSET_LEVELS[pw] ?? 'unknown');
  const status = worst([fromTw, fromPw]);
  return {
    status,
    source: 'pmset_hint',
    thermal_warning: tw,
    performance_warning: pw,
    cpu_power: hint.cpu_power ?? null,
    age_ms: ageMs,
  };
}

// Compute a throughput-drift advisory from per-iteration records produced
// by claw.js. Sprint 1.12: returns an advisory boolean rather than a
// thermal_status escalation — drift is informational, not an inclusion
// gate. Schema column: `thermal_drift_advisory`.
//
// We use server_total_ms (LiteLLM-observed upstream wallclock) divided by
// output_tokens as a per-iteration tokens-per-ms proxy. The decode-only
// signal (server_decode_ms) is preferred when present but is null in
// streaming-only configs (see claw.js timing_caveats).
export function captureThroughputAdvisory(iterRecords, {
  warningDropPct = 25,
  minIterations = 6,
} = {}) {
  if (!Array.isArray(iterRecords) || iterRecords.length < minIterations) {
    return { advisory: false, source: 'too_few_iterations', n: iterRecords?.length ?? 0 };
  }
  const tokSec = iterRecords
    .map((r) => {
      const decode = r.server_decode_ms;
      const total = r.server_total_ms;
      const ms = decode ?? total;
      if (ms == null || ms <= 0) return null;
      const out = r.output_tokens;
      if (out == null || out <= 0) return null;
      return (out / ms) * 1000; // tokens per second
    })
    .filter((x) => x != null);

  if (tokSec.length < minIterations) {
    return { advisory: false, source: 'insufficient_throughput_samples', n: tokSec.length };
  }

  const median = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };

  const baseline = median(tokSec.slice(0, Math.max(1, Math.floor(tokSec.length / 3))));
  const tail = median(tokSec.slice(-Math.max(1, Math.floor(tokSec.length / 3))));
  if (baseline <= 0) return { advisory: false, source: 'baseline_nonpositive' };
  const dropPct = ((baseline - tail) / baseline) * 100;

  return {
    advisory: dropPct >= warningDropPct,
    source: 'throughput_drift',
    baseline_tokens_per_sec: baseline,
    tail_tokens_per_sec: tail,
    drop_pct: dropPct,
    n: tokSec.length,
  };
}

function worst(statuses) {
  let s = statuses[0];
  for (const x of statuses) {
    if (STATUS_ORDER[x] > STATUS_ORDER[s]) s = x;
  }
  return s;
}
