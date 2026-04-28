#!/usr/bin/env bash
# Tier eval: sequential evaluation of the 16GB / 32GB / 64GB tiers.
#
# Each tier is installed via host/llama-server/scripts/install (which renders
# the plist from models.conf, boots out any existing service, and bootstraps
# the new one), health-polled, tested, then unloaded before the next tier.
#
# Test suite (tier-eval):
#   tool-discipline  — wrap rate ≥ 0.9 (grammar health)
#   agent-single     — single-file agentic write
#   agent-parallel   — three-file parallel emission
#   code-self-test   — fibonacci.js validates itself under node
#   refactor         — fixes a seeded off-by-one in buggy.js
#   latency          — TTFT (N=10) + tool roundtrip (N=20)
#   prose-quality    — structured markdown (N=3)
#
# Override the tier list with: EVAL_TIERS="16 64" ./run-tier-eval.sh
# A cleanup trap restores tier 64 (production) on any exit.

set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_DIR=$(cd "$SCRIPT_DIR/../.." && pwd)
INSTALL="$REPO_DIR/host/llama-server/scripts/install"
LABEL="com.mac-llm-lab.llama-server"

COMPOSE="$SCRIPT_DIR/docker-compose.yml"
LLAMA_HEALTH="http://127.0.0.1:11435/health"
BRIDGE_HEALTH="http://127.0.0.1:4000/health/liveliness"

EVAL_TIERS="${EVAL_TIERS:-16 32 64}"
RESULTS_FILE="$SCRIPT_DIR/logs/TIER-EVAL-RESULTS-$(date +%Y%m%d-%H%M).md"
mkdir -p "$SCRIPT_DIR/logs"

log() { printf '%s\n' "$*" >&2; }
err() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---- preflight ----
command -v docker >/dev/null 2>&1 || err "missing: docker"
[ -x "$INSTALL" ] || err "missing or non-executable install script: $INSTALL"
docker image inspect mac-llm-lab-test:local >/dev/null 2>&1 \
  || err "missing image mac-llm-lab-test:local — build it: (cd $SCRIPT_DIR && docker compose build)"
curl -fsS "$BRIDGE_HEALTH" >/dev/null 2>&1 \
  || err "bridge unreachable at $BRIDGE_HEALTH — start it: (cd $REPO_DIR/host/litellm && docker compose up -d)"

# Verify all requested tiers have their GGUF on disk before kicking off.
# shellcheck source=../llama-server/models.conf
source "$REPO_DIR/host/llama-server/models.conf"
for t in $EVAL_TIERS; do
  case "$t" in 16|32|64) ;; *) err "invalid tier: $t (expected 16, 32, or 64)" ;; esac
  gguf_var="TIER_${t}_GGUF"
  gguf_path="${!gguf_var}"
  [ -f "$gguf_path" ] || err "tier ${t}GB: GGUF not found at $gguf_path (see models.conf for the curl command)"
done

# ---- cleanup: always restore production (64GB) plist ----
cleanup() {
  log ""
  log "[cleanup] restoring tier-64 (production) plist..."
  launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
  sleep 1
  LLAMA_TIER=64 "$INSTALL" >/dev/null 2>&1 || log "[cleanup] WARN: tier-64 reinstall failed; check $INSTALL manually"
}
trap cleanup EXIT INT TERM

# ---- health wait — up to 120s (60 × 2s); 64GB cold-load can take ~35s ----
wait_llama() {
  label="$1"
  i=0
  log "[$label] waiting for llama-server..."
  while [ "$i" -lt 60 ]; do
    if curl -fsS "$LLAMA_HEALTH" >/dev/null 2>&1; then
      log "[$label] healthy after $((i * 2))s"
      return 0
    fi
    i=$((i + 1))
    sleep 2
  done
  err "[$label] llama-server did not become healthy within 120s — check /tmp/llama-server.log"
}

# ---- results header ----
{
  echo "# Tier Eval Results — $(date '+%Y-%m-%d %H:%M')"
  echo ""
  echo "Tiers: $EVAL_TIERS"
  echo ""
  echo "Models (per models.conf):"
  echo "- 16GB → Qwen2.5-7B-Instruct Q5_K_M"
  echo "- 32GB → Qwen3-14B Q4_K_M"
  echo "- 64GB → Qwen3-Coder-30B Q6_K_XL"
  echo ""
} > "$RESULTS_FILE"

# Capture per-tier exit codes for the summary table.
# (macOS ships bash 3.2 with no associative arrays — use indirect var names.)
tier_rc_var() { printf 'TIER_RC_%s' "$1"; }

for TIER in $EVAL_TIERS; do
  log ""
  log "==> Tier ${TIER}GB"

  # Bootout any prior service and wait until it's gone — install's own bootout
  # races bootstrap on macOS and can fail with "Bootstrap failed: 5: I/O error".
  if launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; then
    log "[tier-${TIER}] booting out previous service..."
    launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
    j=0
    while [ "$j" -lt 30 ] && launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; do
      j=$((j + 1)); sleep 1
    done
  fi

  log "[tier-${TIER}] installing plist (renders + bootstrap)..."
  LLAMA_TIER="$TIER" "$INSTALL"
  wait_llama "tier-${TIER}"

  {
    echo "## Tier ${TIER}GB"
    echo ""
    echo '```'
  } >> "$RESULTS_FILE"

  rc=0
  # pipefail-style: capture docker compose's real exit code, not tee's.
  set -o pipefail
  docker compose --env-file "$REPO_DIR/host/litellm/.env" -f "$COMPOSE" \
    run --rm \
    -e BACKEND=llama-server \
    -e TIER="$TIER" \
    -e TEST_SUITE=tier-eval \
    test 2>&1 | tee -a "$RESULTS_FILE" || rc=$?
  set +o pipefail

  {
    echo '```'
    echo ""
    echo "Exit code: ${rc}"
    echo ""
  } >> "$RESULTS_FILE"

  eval "$(tier_rc_var "$TIER")=$rc"
  log "[tier-${TIER}] done (exit=${rc})"

  # Free unified memory before the next tier loads.
  log "[tier-${TIER}] unloading..."
  launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
  sleep 2
done

# ---- summary table ----
{
  echo "## Summary"
  echo ""
  echo "| Tier  | Exit code |"
  echo "|-------|-----------|"
  for TIER in $EVAL_TIERS; do
    var=$(tier_rc_var "$TIER")
    echo "| ${TIER}GB | ${!var} |"
  done
  echo ""
} >> "$RESULTS_FILE"

log ""
log "==> All tiers complete."
for TIER in $EVAL_TIERS; do
  var=$(tier_rc_var "$TIER")
  log "    tier-${TIER}GB exit: ${!var}"
done
log "    Results: $RESULTS_FILE"
