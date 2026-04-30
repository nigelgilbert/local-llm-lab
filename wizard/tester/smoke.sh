#!/usr/bin/env bash
# smoke.sh — runs inside wizard-tester:local. Modes: docker | ollama | bridge | models | deep.
# Egress-only; never publishes ports.
set -eu

MODE="${1:-${MODE:-models}}"
BRIDGE_HOST="${BRIDGE_HOST:-host.docker.internal}"
BRIDGE_PORT="${BRIDGE_PORT:-4000}"
KEY="${LITELLM_MASTER_KEY:-}"
URL="http://${BRIDGE_HOST}:${BRIDGE_PORT}"

ok()   { printf "  [tester] \033[32m✓\033[0m %s\n" "$*"; }
fail() { printf "  [tester] \033[31m✗\033[0m %s\n" "$*"; exit 1; }

case "$MODE" in
  docker)
    ok "tester orb is running (docker daemon reachable)"
    ;;

  ollama)
    if curl -fsS --max-time 5 "http://${BRIDGE_HOST}:11434/api/tags" >/dev/null; then
      n=$(curl -fsS "http://${BRIDGE_HOST}:11434/api/tags" | jq '.models | length')
      ok "ollama up at ${BRIDGE_HOST}:11434 (${n} models)"
    else
      fail "ollama not reachable at ${BRIDGE_HOST}:11434"
    fi
    ;;

  bridge)
    if curl -fsS --max-time 5 "${URL}/health/liveliness" >/dev/null; then
      ok "bridge reachable at ${URL}"
    else
      fail "bridge not reachable at ${URL}"
    fi
    ;;

  models)
    if [ -z "$KEY" ]; then fail "LITELLM_MASTER_KEY not set"; fi
    resp=$(curl -fsS --max-time 5 \
              -H "Authorization: Bearer ${KEY}" \
              "${URL}/v1/models") || fail "could not GET ${URL}/v1/models"
    n=$(printf '%s' "$resp" | jq '.data | length')
    if [ "${n:-0}" -lt 1 ]; then
      printf '%s\n' "$resp"
      fail "/v1/models returned 0 entries"
    fi
    ok "/v1/models returned ${n} model(s)"
    printf '%s' "$resp" | jq -r '.data[].id' | sed 's/^/         - /'
    ;;

  deep)
    if [ -z "$KEY" ]; then fail "LITELLM_MASTER_KEY not set"; fi
    model=$(curl -fsS -H "Authorization: Bearer ${KEY}" "${URL}/v1/models" \
              | jq -r '.data[0].id') || fail "could not list models"
    body=$(jq -nc --arg m "$model" \
      '{model:$m, messages:[{role:"user",content:"ok"}], max_tokens:1, stream:false}')
    if curl -fsS --max-time 30 \
          -H "Authorization: Bearer ${KEY}" \
          -H "Content-Type: application/json" \
          -d "$body" \
          "${URL}/v1/chat/completions" >/dev/null; then
      ok "1-token round-trip ok (${model})"
    else
      fail "1-token round-trip failed against ${model}"
    fi
    ;;

  *)
    fail "unknown mode: ${MODE}"
    ;;
esac
