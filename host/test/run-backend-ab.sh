#!/usr/bin/env sh
# A/B test driver for the two `claw` backends (Ollama vs llama-server).
#
# Apple Silicon's unified memory means the two 26 GB GGUF runners cannot be
# resident simultaneously, so we swap: unload llama-server → run Phase A
# against Ollama → unload Ollama → reload llama-server → run Phase B.
#
# An ephemeral Ollama alias `claw-test` is created from the production claw
# Modelfile for Phase A, and removed before the user can ever see it in OWUI.
# A trap cleans up on early exit so a crashed run leaves the lab in its
# normal production state (llama-server loaded, no test alias).

set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_DIR=$(cd "$SCRIPT_DIR/../.." && pwd)
PLIST="$HOME/Library/LaunchAgents/com.mac-llm-lab.llama-server.plist"
MODELFILE="$REPO_DIR/host/ollama/Modelfiles/claw.Modelfile"
COMPOSE="$SCRIPT_DIR/docker-compose.yml"
LLAMA_HEALTH="http://127.0.0.1:11435/health"
BRIDGE_HEALTH="http://127.0.0.1:4000/health/liveliness"

log() { printf '%s\n' "$*" >&2; }
err() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---- preflight ----
command -v docker  >/dev/null 2>&1 || err "missing: docker"
command -v ollama  >/dev/null 2>&1 || err "missing: ollama (CLI)"
[ -f "$PLIST" ]      || err "missing launchd plist: $PLIST  (see host/llama-server/README.md)"
[ -f "$MODELFILE" ]  || err "missing modelfile: $MODELFILE"
docker image inspect claw-code:local >/dev/null 2>&1 \
  || err "missing image claw-code:local — build it first: (cd $REPO_DIR/client/claw-code && docker compose build)"
curl -fsS "$BRIDGE_HEALTH" >/dev/null 2>&1 \
  || err "bridge unreachable at $BRIDGE_HEALTH — start it: (cd $REPO_DIR/host/litellm && docker compose up -d)"

# ---- cleanup-on-exit: always restore production state ----
cleanup() {
  log "[cleanup] restoring production state..."
  ollama stop claw-test >/dev/null 2>&1 || true
  ollama rm   claw-test >/dev/null 2>&1 || true
  launchctl load -w "$PLIST" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

# ---- Phase A: Ollama backend ----
log "==> Phase A: Ollama backend"
log "[A] unloading llama-server..."
launchctl unload "$PLIST" >/dev/null 2>&1 || true

log "[A] creating ephemeral claw-test alias from $MODELFILE..."
ollama create claw-test -f "$MODELFILE" >/dev/null

log "[A] running tests..."
docker compose --env-file "$REPO_DIR/host/litellm/.env" -f "$COMPOSE" \
  run --rm -e BACKEND=ollama -e TEST_SUITE=backend-ab test

log "[A] unloading claw-test (free unified memory before Phase B)..."
ollama stop claw-test >/dev/null 2>&1 || true
ollama rm   claw-test >/dev/null

# ---- Phase B: llama-server backend ----
log "==> Phase B: llama-server backend"
log "[B] loading llama-server..."
launchctl load -w "$PLIST"

log "[B] waiting for llama-server health..."
i=0
while [ "$i" -lt 60 ]; do
  if curl -fsS "$LLAMA_HEALTH" >/dev/null 2>&1; then
    break
  fi
  i=$((i + 1))
  sleep 1
done
[ "$i" -lt 60 ] || err "llama-server did not become healthy within 60s — check 'log show --predicate \"process == \\\"llama-server\\\"\" --last 2m'"

log "[B] running tests..."
docker compose --env-file "$REPO_DIR/host/litellm/.env" -f "$COMPOSE" \
  run --rm -e BACKEND=llama-server -e TEST_SUITE=backend-ab test

log "==> Both phases complete"
