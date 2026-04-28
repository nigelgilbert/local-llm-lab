#!/usr/bin/env bash
# Closure data for TODO-MULTI-FILE-RENAME-FLAKE.md "7B/14B reliability at n=5+".
# multi-file-rename × n=5 at tier-16 and tier-32. Restores tier-64 at end.

set -u

REPO=/Users/nigel/Desktop/bench/lab/host
INSTALL="$REPO/llama-server/scripts/install"
LABEL=com.mac-llm-lab.llama-server
LOG="$REPO/test/logs/a2/MULTIFILE-LOWER-TIER-$(date +%Y%m%d-%H%M).md"
TESTS_DIR="$REPO/test"

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
    echo "# multi-file-rename at lower tiers (n=5 each)"
    echo "started $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "Closes 7B/14B reliability question in TODO-MULTI-FILE-RENAME-FLAKE.md."
    echo ""
} > "$LOG"

for TIER in 16 32; do
    echo "" >> "$LOG"
    echo "## Tier ${TIER}GB ($(date '+%H:%M:%S'))" >> "$LOG"
    if ! reload_for_tier "$TIER"; then
        echo "  daemon failed to start at tier $TIER; skipping" >> "$LOG"
        continue
    fi
    for ITER in 1 2 3 4 5; do
        echo "" >> "$LOG"
        echo "### iter ${ITER} — $(date '+%H:%M:%S')" >> "$LOG"
        echo '```' >> "$LOG"
        ( cd "$TESTS_DIR" && \
          docker compose --env-file ../litellm/.env -f docker-compose.yml run --rm \
            -e BACKEND=llama-server -e TIER="$TIER" \
            test node --test --test-concurrency=1 --test-reporter=spec \
            __tests__/tier-eval/multi-file-rename.test.js ) >> "$LOG" 2>&1 || echo "  iter exited non-zero" >> "$LOG"
        echo '```' >> "$LOG"
    done
done

echo "" >> "$LOG"
echo "completed $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG"
echo "DONE: $LOG"
