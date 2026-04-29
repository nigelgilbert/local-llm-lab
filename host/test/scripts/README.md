# host/test/scripts

Helper scripts that run on the macOS host (not inside the test container).

## Sprint 0.7: thermal telemetry sidecar

`thermal-watch.sh` is the sudo-free thermal data source for tier-eval v2.
The container (where claw and the test harness live) cannot read
`pmset` / `powermetrics` / `IOReport` directly. This sidecar runs on the
host, polls `pmset -g therm` once per second, and writes the latest result
to `host/test/.claw-runtime/.thermal-hint.json`. That path is on the
existing volume mount, so `lib/telemetry.js` inside the container reads it
without any new plumbing.

### Why `pmset -g therm`

It is sudo-free, available on every Mac, and produces an event-driven
signal that maps cleanly to the registry's `thermal_status` enum
(`clean` / `warning` / `pmset_contaminated` / `unknown`, post Sprint 1.12).
It does not give you absolute SoC temperature in degrees — but the
registry schema does not need that, only a contamination flag.

If you later want quantitative temperature, add `macmon` (Rust, Apple
Silicon native) plus a passwordless-sudo sudoers entry scoped to that one
binary, and replace the parser inside `thermal-watch.sh`. Hint-file
schema stays the same; only the source upgrades.

### Running it

Open a separate terminal and start the sidecar before kicking off any
sweep that should record `thermal_status`:

```sh
host/test/scripts/thermal-watch.sh
# or, custom path / interval:
THERMAL_HINT_PATH=/some/path THERMAL_INTERVAL_SEC=2 host/test/scripts/thermal-watch.sh
```

Stop it with `Ctrl-C` when the sweep finishes. A missing or stale
(>10s old) hint file makes the in-container hook return
`thermal_status=unknown` rather than crashing the run.

### Hint-file schema

```json
{
  "captured_at_ms": 1777484440000,
  "thermal_warning": null,
  "performance_warning": null,
  "cpu_power": null,
  "raw": "Note: No thermal warning level has been recorded\n..."
}
```

`thermal_warning` is `null` when the kernel has not logged a thermal
event since boot — the baseline "everything is fine" state, which the
hook maps to `thermal_status=clean`. When a real event fires
(throttling, sustained heat), the field populates with the pmset level
name and the hook escalates to `warning` or `pmset_contaminated` per
`PMSET_LEVELS` in `lib/telemetry.js`. Throughput-drift is no longer
combined into `thermal_status` (Sprint 1.12); it lands in the separate
`thermal_drift_advisory` boolean column via `captureThroughputAdvisory()`.

### Wiring into a sweep (Sprint 1)

The hook is library-only in Sprint 0; the actual registry-row assembly
that calls `captureThermalStatus()` + `captureThroughputAdvisory()`
lives in `lib/run_row.js`, exercised by the overnight-screen driver and
the harvester. The building blocks are:

- `lib/telemetry.js` — the read-side hook.
- `lib/registry.js` — the registry writer; `thermal_status` is one of
  the enum-validated fields.
- `scripts/thermal-watch.sh` — the host-side data source.

The sign-off gate for Sprint 0 (a smoke run that emits
`thermal_status` end-to-end) will be exercised once Sprint 1 wires
these together.
