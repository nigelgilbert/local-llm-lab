#!/usr/bin/env sh
# Settings A/B: compare baseline vs optimised llama-server inference flags.
#
# What changes between phases (same model, same backend, same bridge):
#   Phase A — BASELINE:   --ctx-size 131072, default --batch-size (2048)
#   Phase B — OPTIMISED:  --ctx-size 32768,  --batch-size 4096
#
# Test suite (settings-ab):
#   ttft          — time to first token with a 25-tool prompt (prefill signal)
#   tool-latency  — N=20 single-tool round-trips (decode-speed signal)
#   agent-timing  — N=5 single + N=3 parallel agent loops via real claw CLI
#   prose-density — N=5 structured-markdown samples (quality regression guard)
#
# A cleanup trap always restores the production (optimised) plist so a
# crashed run leaves the lab in its normal state.

set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_DIR=$(cd "$SCRIPT_DIR/../.." && pwd)

PLIST_INSTALL="${HOME}/Library/LaunchAgents/com.mac-llm-lab.llama-server.plist"
PLIST_BASELINE="${REPO_DIR}/host/llama-server/launchd/com.mac-llm-lab.llama-server-baseline.plist"
PLIST_OPTIMISED="${REPO_DIR}/host/llama-server/launchd/com.mac-llm-lab.llama-server.plist"

COMPOSE="${SCRIPT_DIR}/docker-compose.yml"
LLAMA_HEALTH="http://127.0.0.1:11435/health"
BRIDGE_HEALTH="http://127.0.0.1:4000/health/liveliness"

log() { printf '%s\n' "$*" >&2; }
err() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---- preflight ----
command -v docker >/dev/null 2>&1 || err "missing: docker"
[ -f "$PLIST_BASELINE" ]  || err "missing baseline plist: $PLIST_BASELINE"
[ -f "$PLIST_OPTIMISED" ] || err "missing optimised plist: $PLIST_OPTIMISED"
docker image inspect claw-code:local >/dev/null 2>&1 \
  || err "missing image claw-code:local — build it: (cd $REPO_DIR/client/claw-code && docker compose build)"
curl -fsS "$BRIDGE_HEALTH" >/dev/null 2>&1 \
  || err "bridge unreachable at $BRIDGE_HEALTH — start it: (cd $REPO_DIR/host/litellm && docker compose up -d)"

# ---- cleanup: always restore production (optimised) plist ----
cleanup() {
  log "[cleanup] restoring optimised (production) plist..."
  launchctl bootout "gui/$(id -u)/com.mac-llm-lab.llama-server" >/dev/null 2>&1 || true
  cp "$PLIST_OPTIMISED" "$PLIST_INSTALL"
  launchctl bootstrap "gui/$(id -u)" "$PLIST_INSTALL" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

# ---- health wait ----
wait_llama() {
  label="$1"
  i=0
  log "[$label] waiting for llama-server health..."
  while [ "$i" -lt 90 ]; do
    if curl -fsS "$LLAMA_HEALTH" >/dev/null 2>&1; then
      log "[$label] healthy after ${i}s"
      return 0
    fi
    i=$((i + 1))
    sleep 2
  done
  err "[$label] llama-server did not become healthy within 180s — check /tmp/llama-server.log"
}

# ---- swap plist helper ----
swap_plist() {
  src="$1"
  label="$2"
  log "[$label] stopping llama-server..."
  launchctl bootout "gui/$(id -u)/com.mac-llm-lab.llama-server" >/dev/null 2>&1 || true
  sleep 2
  log "[$label] installing plist: $(basename "$src")"
  cp "$src" "$PLIST_INSTALL"
  launchctl bootstrap "gui/$(id -u)" "$PLIST_INSTALL"
}

# ---- Phase A: baseline ----
log "==> Phase A: BASELINE (ctx=131072, batch=2048)"
swap_plist "$PLIST_BASELINE" "A"
wait_llama "A"

log "[A] running settings-ab suite..."
phase_a_rc=0
docker compose --env-file "$REPO_DIR/host/litellm/.env" -f "$COMPOSE" \
  run --rm \
  -e BACKEND=llama-server \
  -e SETTINGS_LABEL=baseline \
  -e TEST_SUITE=settings-ab \
  test || phase_a_rc=$?
log "[A] done (exit=${phase_a_rc})."

# ---- Phase B: optimised ----
log "==> Phase B: OPTIMISED (ctx=32768, batch=4096)"
swap_plist "$PLIST_OPTIMISED" "B"
wait_llama "B"

log "[B] running settings-ab suite..."
phase_b_rc=0
docker compose --env-file "$REPO_DIR/host/litellm/.env" -f "$COMPOSE" \
  run --rm \
  -e BACKEND=llama-server \
  -e SETTINGS_LABEL=optimised \
  -e TEST_SUITE=settings-ab \
  test || phase_b_rc=$?
log "[B] done (exit=${phase_b_rc})."
log "==> Both phases complete. Optimised plist restored as production."
log "    Phase A exit: ${phase_a_rc}   Phase B exit: ${phase_b_rc}"
