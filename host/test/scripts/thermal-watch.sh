#!/bin/bash
# Sprint 0.7 thermal-telemetry sidecar.
#
# Runs on the macOS host (NOT inside the container). Polls `pmset -g therm`
# once per second and writes the latest result as JSON to the host-mounted
# .claw-runtime/.thermal-hint.json file, where lib/telemetry.js inside the
# container can read it.
#
# pmset -g therm output shape (sudo-free, Apple Silicon):
#
#   No event recorded:
#     "Note: No thermal warning level has been recorded"
#     "Note: No performance warning level has been recorded"
#     "Note: No CPU power status has been recorded"
#
#   Active event:
#     "CPU_Speed_Limit          = 50"
#     "CPU_Available_CPUs       = 8"
#     "CPU_Scheduler_Limit      = 50"
#     and/or named levels in human-readable form.
#
# We capture the raw output verbatim plus a parsed status code so the
# container can decide without re-parsing on every read.
#
# Usage:
#   host/test/scripts/thermal-watch.sh                    # writes to default path
#   THERMAL_HINT_PATH=/some/path host/test/scripts/thermal-watch.sh
#
# Stop with Ctrl-C. Run from a separate terminal during the overnight screen.

set -eu

DEFAULT_HINT_PATH="$(cd "$(dirname "$0")/.." && pwd)/.claw-runtime/.thermal-hint.json"
HINT_PATH="${THERMAL_HINT_PATH:-$DEFAULT_HINT_PATH}"
INTERVAL_SEC="${THERMAL_INTERVAL_SEC:-1}"

mkdir -p "$(dirname "$HINT_PATH")"

echo "thermal-watch: polling every ${INTERVAL_SEC}s"
echo "thermal-watch: writing to $HINT_PATH"
echo "thermal-watch: Ctrl-C to stop"

while :; do
  RAW="$(pmset -g therm 2>&1 || true)"
  NOW_MS=$(($(date +%s) * 1000))

  THERMAL_WARNING=null
  PERFORMANCE_WARNING=null
  CPU_POWER=null

  # Heuristic parsing: pmset -g therm prints either "No ... has been recorded"
  # (no event) or a key/value table when the kernel has logged an event.
  while IFS= read -r line; do
    case "$line" in
      *"No thermal warning level"*)        THERMAL_WARNING=null ;;
      *"No performance warning level"*)    PERFORMANCE_WARNING=null ;;
      *"No CPU power status"*)             CPU_POWER=null ;;
      *thermal_warning_level*|*Thermal_Pressure*|*Thermal_Warning*)
        THERMAL_WARNING="\"$(printf '%s' "$line" | sed 's/.*= *//' | tr -d '"')\"" ;;
      *performance_warning_level*|*Performance_Warning*)
        PERFORMANCE_WARNING="\"$(printf '%s' "$line" | sed 's/.*= *//' | tr -d '"')\"" ;;
      *CPU_Speed_Limit*|*CPU_Available_CPUs*|*CPU_Scheduler_Limit*)
        # When pmset emits these throttling fields, treat as Moderate
        # thermal_warning unless we already have a higher one from the
        # named-level branch.
        if [ "$THERMAL_WARNING" = "null" ]; then THERMAL_WARNING='"Moderate"'; fi ;;
      *)
        : ;;
    esac
  done <<EOF
$RAW
EOF

  RAW_ESCAPED=$(printf '%s' "$RAW" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

  cat >"$HINT_PATH.tmp" <<EOF
{
  "captured_at_ms": $NOW_MS,
  "thermal_warning": $THERMAL_WARNING,
  "performance_warning": $PERFORMANCE_WARNING,
  "cpu_power": $CPU_POWER,
  "raw": $RAW_ESCAPED
}
EOF
  mv "$HINT_PATH.tmp" "$HINT_PATH"

  sleep "$INTERVAL_SEC"
done
