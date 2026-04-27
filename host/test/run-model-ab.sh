#!/usr/bin/env sh
# Model A/B test driver — qwen3-coder vs qwen3.6-35B, both via llama-server.
#
# Unlike run-backend-ab.sh (which swaps backends), this harness swaps the model
# loaded by llama-server while keeping every other variable constant: same port,
# same GBNF grammar, same sampler, same bridge routes (claw-llama). This isolates
# model capability as the single changing variable.
#
# Phase A loads the production claw plist (qwen3-coder). Phase B renders the
# qwen36 plist template (QWEN36_GGUF_PATH substituted at runtime) and installs it
# over the production slot. The cleanup trap always restores production state so a
# crashed run leaves the lab on qwen3-coder.
#
# QWEN36_GGUF is auto-discovered from ~/.ollama/gguf/Qwen3.6*.gguf. Override:
#   QWEN36_GGUF=/path/to/model.gguf ./run-model-ab.sh

set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_DIR=$(cd "$SCRIPT_DIR/../.." && pwd)
PLIST_INSTALL="$HOME/Library/LaunchAgents/com.cyberia.llama-server.plist"
PLIST_CODER="$REPO_DIR/host/llama-server/launchd/com.cyberia.llama-server.plist"
PLIST_QWEN36_TMPL="$REPO_DIR/host/llama-server/launchd/com.cyberia.llama-server-qwen36.plist"
COMPOSE="$SCRIPT_DIR/docker-compose.yml"
LLAMA_HEALTH="http://127.0.0.1:11435/health"
BRIDGE_HEALTH="http://127.0.0.1:4000/health/liveliness"

log() { printf '%s\n' "$*" >&2; }
err() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---- preflight ----
command -v docker >/dev/null 2>&1 || err "missing: docker"
command -v ollama >/dev/null 2>&1 || err "missing: ollama (CLI)"
[ -f "$PLIST_CODER" ]       || err "missing coder plist: $PLIST_CODER"
[ -f "$PLIST_QWEN36_TMPL" ] || err "missing qwen36 plist template: $PLIST_QWEN36_TMPL"
docker image inspect claw-code:local >/dev/null 2>&1 \
  || err "missing image claw-code:local — build it first: (cd $REPO_DIR/client/claw-code && docker compose build)"
curl -fsS "$BRIDGE_HEALTH" >/dev/null 2>&1 \
  || err "bridge unreachable at $BRIDGE_HEALTH — start it: (cd $REPO_DIR/host/litellm && docker compose up -d)"

# Discover qwen3.6 GGUF path from ~/.ollama/gguf/ (override with QWEN36_GGUF env var).
if [ -z "${QWEN36_GGUF:-}" ]; then
  QWEN36_GGUF=$(ls "$HOME/.ollama/gguf/Qwen3.6"*.gguf 2>/dev/null | head -1)
fi
[ -n "$QWEN36_GGUF" ] || err "could not discover qwen3.6 GGUF — set QWEN36_GGUF=/path/to/model.gguf"
[ -f "$QWEN36_GGUF" ] || err "qwen3.6 GGUF not found at: $QWEN36_GGUF — set QWEN36_GGUF=/path/to/model.gguf"
log "[preflight] qwen3.6 GGUF: $QWEN36_GGUF"

# ---- cleanup-on-exit: always restore production state ----
cleanup() {
  log "[cleanup] restoring production state (coder plist)..."
  launchctl unload "$PLIST_INSTALL" >/dev/null 2>&1 || true
  cp "$PLIST_CODER" "$PLIST_INSTALL"
  launchctl load -w "$PLIST_INSTALL" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

# ---- health wait helper ----
wait_llama_health() {
  i=0
  while [ "$i" -lt 60 ]; do
    if curl -fsS "$LLAMA_HEALTH" >/dev/null 2>&1; then return 0; fi
    i=$((i + 1))
    sleep 1
  done
  err "llama-server did not become healthy within 60s — check 'log show --predicate \"process == \\\"llama-server\\\"\" --last 2m'"
}

# ---- Phase A: qwen3-coder ----
log "==> Phase A: qwen3-coder"
log "[A] unloading any running llama-server..."
launchctl unload "$PLIST_INSTALL" >/dev/null 2>&1 || true

log "[A] installing and loading coder plist..."
cp "$PLIST_CODER" "$PLIST_INSTALL"
launchctl load -w "$PLIST_INSTALL"

log "[A] waiting for llama-server health..."
wait_llama_health

log "[A] running tests..."
docker compose --env-file "$REPO_DIR/host/litellm/.env" -f "$COMPOSE" \
  run --rm -e BACKEND=llama-server -e MODEL_LABEL=qwen3-coder -e TEST_SUITE=model-ab test

log "[A] unloading llama-server..."
launchctl unload "$PLIST_INSTALL"

# ---- Phase B: qwen3.6-35B ----
log "==> Phase B: qwen3.6-35B"
log "[B] generating qwen36 plist (model=$QWEN36_GGUF)..."
sed "s|QWEN36_GGUF_PATH|$QWEN36_GGUF|g" "$PLIST_QWEN36_TMPL" > /tmp/cyberia-llama-qwen36.plist

log "[B] installing and loading qwen36 plist..."
cp /tmp/cyberia-llama-qwen36.plist "$PLIST_INSTALL"
launchctl load -w "$PLIST_INSTALL"

log "[B] waiting for llama-server health..."
wait_llama_health

log "[B] running tests..."
docker compose --env-file "$REPO_DIR/host/litellm/.env" -f "$COMPOSE" \
  run --rm -e BACKEND=llama-server -e MODEL_LABEL=qwen3.6-35B-Q4 -e TEST_SUITE=model-ab test

log "[B] unloading llama-server..."
launchctl unload "$PLIST_INSTALL"

log "==> Both phases complete"
