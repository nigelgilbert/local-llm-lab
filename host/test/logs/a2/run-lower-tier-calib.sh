#!/usr/bin/env bash
# B4: tier-32 + tier-16 calibration of round-2 + round-3 evals.
# 6 tests × n=3 per tier = 18 runs/tier.
# Restores tier-64 at end.

set -u

REPO=/Users/nigel/Desktop/bench/lab/host
INSTALL="$REPO/llama-server/scripts/install"
LABEL=com.mac-llm-lab.llama-server
LOG="$REPO/test/logs/a2/LOWER-TIER-CALIB-$(date +%Y%m%d-%H%M).md"
TESTS_DIR="$REPO/test"
TESTS=(csv-parser lru-cache json-schema-validate cascading-bugs expression-eval mini-vm)

cleanup() {
    echo "[cleanup] restoring tier-64..." >&2
    launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
    sleep 2
    LLAMA_TIER=64 "$INSTALL" >/dev/null 2>&1 || echo "[cleanup] WARN: tier-64 reinstall failed" >&2
}
trap cleanup EXIT INT TERM

reload_for_tier() {
    local tier="$1"
    launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
    j=0
    while [ "$j" -lt 30 ] && launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; do
        j=$((j + 1)); sleep 1
    done
    LLAMA_TIER="$tier" "$INSTALL" >/dev/null 2>&1 || return 1
    i=0
    while [ "$i" -lt 60 ]; do
        if curl -fsS http://127.0.0.1:11435/health >/dev/null 2>&1; then return 0; fi
        i=$((i + 1)); sleep 2
    done
    return 1
}

mkdir -p "$(dirname "$LOG")"
{
    echo "# Lower-tier calibration: round-2 + round-3 evals"
    echo "started $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "Tiers: 32, 16"
    echo "Tests (n=3 each): ${TESTS[*]}"
    echo ""
} > "$LOG"

for TIER in 32 16; do
    echo "" >> "$LOG"
    echo "## Tier ${TIER}GB ($(date '+%H:%M:%S'))" >> "$LOG"
    if ! reload_for_tier "$TIER"; then
        echo "  daemon failed to start at tier $TIER; skipping" >> "$LOG"
        continue
    fi
    for ITER in 1 2 3; do
        echo "" >> "$LOG"
        echo "### iter ${ITER} — $(date '+%H:%M:%S')" >> "$LOG"
        echo '```' >> "$LOG"
        test_files=()
        for t in "${TESTS[@]}"; do
            test_files+=("__tests__/tier-eval/${t}.test.js")
        done
        ( cd "$TESTS_DIR" && \
          docker compose --env-file ../litellm/.env -f docker-compose.yml run --rm \
            -e BACKEND=llama-server -e TIER="$TIER" \
            test node --test --test-concurrency=1 --test-reporter=spec \
            "${test_files[@]}" ) >> "$LOG" 2>&1 || echo "  iter exited non-zero" >> "$LOG"
        echo '```' >> "$LOG"
    done
done

echo "" >> "$LOG"
echo "completed $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG"
echo "DONE: $LOG"
