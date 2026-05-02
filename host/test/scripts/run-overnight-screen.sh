#!/usr/bin/env bash
# Sprint 1 overnight cross-tier screen driver.
#
# Wraps run-tier-eval.sh's plist-swap pattern with N reps per tier and the
# registry-row auto-emit hook (RUN_REGISTRY_EMIT=1). All rows land in a
# sweep-specific JSONL under host/test/.claw-runtime/ so the canonical
# registry stays clean if the run aborts mid-night.
#
# Hardware: single M5 Max MBP, serial — three-machine parallel is not
# available for the foreseeable future (TIER-EVAL-V2-SPRINT-PLAN.md §2).
# Tier 16/32/64 are realized by switching the llama-server plist between
# blocks, NOT by separate machines. Latency rows are therefore
# single-hardware-config latency, not final product-tier latency.
#
# Order: rep-outer × tier-middle × test-inner (via the existing
# `node --test __tests__/tier-eval/*.test.js` runner). True
# tier × test × seed interleave (one plist swap per cell) would add
# ~5 hours of swap overhead on a 600-cell night and is not used here.
# For SCREENING purposes (no admission decisions) the cheaper rep-outer
# pattern is acceptable — see plan §4 "Allowed conclusions."
#
# Pre-flight (operator):
#   1. Start `host/test/scripts/thermal-watch.sh` in another terminal.
#   2. Confirm the bridge is up and the model GGUFs for all requested
#      tiers are on disk (this script's preflight checks them).
#   3. Confirm the working tree is at the SHA you want recorded as
#      harness_version — no rebuilds mid-sweep.
#
# Usage:
#   host/test/scripts/run-overnight-screen.sh
#   EVAL_TIERS="16 32" EVAL_REPS=8 host/test/scripts/run-overnight-screen.sh
#
# Env knobs:
#   EVAL_TIERS    space-separated tiers (default: "16 32 64")
#   EVAL_REPS     full-suite passes per tier (default: 10)
#   SWEEP_LABEL   subdir suffix under .claw-runtime/ (default: a timestamp)
#   DRY_RUN       1 = print plan + tier installs but do not run claw

set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
TEST_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
REPO_DIR=$(cd "$TEST_DIR/../.." && pwd)
INSTALL="$REPO_DIR/host/llama-server/scripts/install"
LABEL="com.mac-llm-lab.llama-server"

COMPOSE="$TEST_DIR/docker-compose.yml"
LLAMA_HEALTH="http://127.0.0.1:11435/health"
BRIDGE_HEALTH="http://127.0.0.1:4000/health/liveliness"

EVAL_TIERS="${EVAL_TIERS:-16 32 64}"
EVAL_REPS="${EVAL_REPS:-10}"
SWEEP_LABEL="${SWEEP_LABEL:-overnight-$(date +%Y%m%d-%H%M)}"
DRY_RUN="${DRY_RUN:-0}"

REGISTRY_PATH="$TEST_DIR/.claw-runtime/run_registry.${SWEEP_LABEL}.jsonl"
EXPECTED_PATH="$TEST_DIR/.claw-runtime/expected_attempts.${SWEEP_LABEL}.csv"
RESULTS_FILE="$TEST_DIR/logs/OVERNIGHT-SCREEN-${SWEEP_LABEL}.md"
mkdir -p "$TEST_DIR/logs" "$TEST_DIR/.claw-runtime"

GIT_SHA="$(cd "$REPO_DIR" && git rev-parse --short HEAD)"

# Tier → model_config_id mapping. Must match an entry in lib/model_configs.json.
# Defaults track the current production models.conf lock-in (Sprint 1.19, 2026-05-01).
tier_config_id() {
  case "$1" in
    16) echo "${T16_CANDIDATE_CONFIG_ID:-qwen35-9b-iq4xs-ctx32k-v6antiloop-pp01}" ;;
    32) echo "${T32_CANDIDATE_CONFIG_ID:-qwen35-9b-q5kxl-ctx64k-v7noreppen-pp01}" ;;
    64) echo "qwen36-35b-a3b-q4kxl-ctx65k-v1prod-pp01" ;;
    *) echo ""; return 1 ;;
  esac
}

log() { printf '%s\n' "$*" >&2; }
err() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---- preflight ----
command -v docker >/dev/null 2>&1 || err "missing: docker"
[ -x "$INSTALL" ] || err "missing or non-executable install script: $INSTALL"
docker image inspect mac-llm-lab-test:local >/dev/null 2>&1 \
  || err "missing image mac-llm-lab-test:local — build it: (cd $TEST_DIR && docker compose build)"
curl -fsS "$BRIDGE_HEALTH" >/dev/null 2>&1 \
  || err "bridge unreachable at $BRIDGE_HEALTH — start it: (cd $REPO_DIR/host/litellm && docker compose up -d)"

# Verify each tier has its GGUF and a manifest entry.
# shellcheck source=../../llama-server/models.conf
source "$REPO_DIR/host/llama-server/models.conf"
for t in $EVAL_TIERS; do
  case "$t" in 16|32|64) ;; *) err "invalid tier: $t (expected 16, 32, or 64)" ;; esac
  gguf_var="TIER_${t}_GGUF"
  gguf_path="${!gguf_var}"
  [ -f "$gguf_path" ] || err "tier ${t}GB: GGUF not found at $gguf_path"
  cfg_id="$(tier_config_id "$t")"
  [ -n "$cfg_id" ] || err "tier ${t}GB: no model_config_id mapping"
  grep -q "\"$cfg_id\"" "$TEST_DIR/lib/model_configs.json" \
    || err "tier ${t}GB: model_config_id '$cfg_id' missing from lib/model_configs.json"
done

# Friendly reminder — thermal-watch is silent and easy to forget.
HINT_PATH="$TEST_DIR/.claw-runtime/.thermal-hint.json"
if [ ! -f "$HINT_PATH" ]; then
  log ""
  log "WARNING: $HINT_PATH not present."
  log "         Without thermal-watch.sh running in a separate terminal, every"
  log "         row's thermal_status will fall back to throughput-drift only"
  log "         (clean baseline + drift detection still works, but the pmset"
  log "         hint is the load-bearing signal)."
  log ""
fi

# ---- cleanup: always restore production (64GB) plist on exit ----
# Skipped under DRY_RUN — we never touched the plist, so don't re-bootstrap.
cleanup() {
  if [ "$DRY_RUN" = "1" ]; then return 0; fi
  log ""
  log "[cleanup] restoring tier-64 (production) plist..."
  launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
  sleep 1
  LLAMA_TIER=64 "$INSTALL" >/dev/null 2>&1 || log "[cleanup] WARN: tier-64 reinstall failed; check $INSTALL manually"
}
trap cleanup EXIT INT TERM

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
  err "[$label] llama-server did not become healthy within 120s"
}

if [ "$DRY_RUN" = "1" ]; then
  log "DRY_RUN=1 — printing plan and exiting before any plist swap or claw call."
  log "  Tiers:    $EVAL_TIERS"
  log "  Reps:     $EVAL_REPS"
  log "  Sweep:    $SWEEP_LABEL"
  log "  Reg:      $REGISTRY_PATH (would be created on real run)"
  log "  Expected: $EXPECTED_PATH (would be created on real run)"
  log "  Log:      $RESULTS_FILE  (would be created on real run)"
  for t in $EVAL_TIERS; do
    log "    tier-${t} → $(tier_config_id "$t")"
  done
  exit 0
fi

# ---- write expected-attempts manifest (Sprint 1.14) ----
log ""
log "==> writing expected-attempts manifest..."
docker run --rm \
  -v "$TEST_DIR:/test" \
  -w /test \
  node:24-bookworm-slim \
  node /test/scripts/expected-attempts.mjs plan \
    --tests-dir /test/__tests__/tier-eval \
    --tiers "$EVAL_TIERS" \
    --reps "$EVAL_REPS" \
    --out "/test/.claw-runtime/$(basename "$EXPECTED_PATH")" \
  || err "failed to write expected-attempts manifest"

# ---- header ----
{
  echo "# Overnight Cross-Tier Screen — $SWEEP_LABEL"
  echo ""
  echo "- Date: $(date '+%Y-%m-%d %H:%M')"
  echo "- Tiers: $EVAL_TIERS"
  echo "- Reps per tier: $EVAL_REPS"
  echo "- Harness git SHA: $GIT_SHA"
  echo "- Registry: $REGISTRY_PATH"
  echo "- Hint file: $([ -f "$HINT_PATH" ] && echo "present" || echo "MISSING — thermal_status will be throughput-drift only")"
  echo "- Order: rep-outer × tier-middle × test-inner (cheap interleave)"
  echo ""
} > "$RESULTS_FILE"

# ---- main loop ----
run_one_pass() {
  rep="$1"
  tier="$2"
  cfg_id="$(tier_config_id "$tier")"
  log ""
  log "==> rep=${rep}/${EVAL_REPS} tier=${tier} cfg=${cfg_id}"

  if launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; then
    launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
    j=0
    while [ "$j" -lt 30 ] && launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; do
      j=$((j + 1)); sleep 1
    done
  fi

  log "[tier-${tier}] installing plist..."
  if [ -n "${INSTALL_OVERRIDE:-}" ]; then
    log "[tier-${tier}] using INSTALL_OVERRIDE=$INSTALL_OVERRIDE"
    eval "$INSTALL_OVERRIDE"
  else
    LLAMA_TIER="$tier" "$INSTALL"
  fi
  wait_llama "tier-${tier}"

  {
    echo "## rep=${rep} tier=${tier}"
    echo ""
    echo '```'
  } >> "$RESULTS_FILE"

  rc=0
  set -o pipefail
  docker compose --env-file "$REPO_DIR/host/litellm/.env" -f "$COMPOSE" \
    run --rm \
    -e BACKEND=llama-server \
    -e TIER="$tier" \
    -e TEST_SUITE=tier-eval \
    -e RUN_REGISTRY_EMIT=1 \
    -e RUN_REGISTRY_KIND=overnight_screen \
    -e RUN_REGISTRY_HARDWARE_TIER="$tier" \
    -e RUN_REGISTRY_MEMORY_GB="$tier" \
    -e RUN_REGISTRY_MODEL_CONFIG_ID="$cfg_id" \
    -e RUN_REGISTRY_HARNESS_VERSION="$GIT_SHA" \
    -e RUN_REGISTRY_CANONICAL_STATUS="canonical" \
    -e RUN_REGISTRY_PATH="/workspace/.claw-runtime/$(basename "$REGISTRY_PATH")" \
    test 2>&1 | tee -a "$RESULTS_FILE" || rc=$?
  set +o pipefail

  {
    echo '```'
    echo ""
    echo "Exit code: ${rc} (rep=${rep} tier=${tier})"
    echo ""
  } >> "$RESULTS_FILE"

  log "[tier-${tier}] rep=${rep} done (exit=${rc})"
}

for rep in $(seq 1 "$EVAL_REPS"); do
  for tier in $EVAL_TIERS; do
    run_one_pass "$rep" "$tier"
  done
done

# ---- post-sweep CSV view ----
# Run via the test image — `node` is not installed on the host.
log ""
log "==> sweep complete; exporting CSV view"
CSV_OUT="${REGISTRY_PATH%.jsonl}.csv"
docker run --rm \
  -v "$TEST_DIR:/test" \
  -w /test \
  node:24-bookworm-slim \
  node /test/scripts/registry-to-csv.mjs \
    --registry "/test/.claw-runtime/$(basename "$REGISTRY_PATH")" \
    --out      "/test/.claw-runtime/$(basename "$CSV_OUT")" \
  || log "WARN: registry-to-csv.mjs failed; jsonl is still authoritative"

ROW_COUNT=$(wc -l < "$REGISTRY_PATH" 2>/dev/null || echo 0)

# ---- post-sweep observed-vs-expected diff (Sprint 1.14) ----
log ""
log "==> diffing observed JSONL vs expected manifest..."
DIFF_OUT="$TEST_DIR/.claw-runtime/expected_attempts.${SWEEP_LABEL}.diff.txt"
docker run --rm \
  -v "$TEST_DIR:/test" \
  -w /test \
  node:24-bookworm-slim \
  node /test/scripts/expected-attempts.mjs diff \
    --expected "/test/.claw-runtime/$(basename "$EXPECTED_PATH")" \
    --registry "/test/.claw-runtime/$(basename "$REGISTRY_PATH")" \
  | tee "$DIFF_OUT" \
  || log "WARN: observed diverged from expected; see $DIFF_OUT"

log ""
log "==> done"
log "    sweep label:  $SWEEP_LABEL"
log "    registry:     $REGISTRY_PATH ($ROW_COUNT rows)"
log "    csv view:     ${REGISTRY_PATH%.jsonl}.csv"
log "    expected:     $EXPECTED_PATH"
log "    diff:         $DIFF_OUT"
log "    log:          $RESULTS_FILE"
