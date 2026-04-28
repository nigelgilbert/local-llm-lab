#!/usr/bin/env bash
# Sampler grid sweep at tier-64 (ctx=65536).
# Cells: temp ∈ {0.3, 0.5, 0.7, 0.9} × presence_penalty ∈ {0, 1.5}.
# top_p, top_k, repeat_penalty held fixed at v1 values.
# Tests per cell, n=3: csv-parser, lru-cache, json-schema-validate,
#                      multi-bug-decoy, expression-eval.
# (mini-vm omitted — 240s wallclock × 3 × 8 = 96 min lost on a known-failing
#  test that doesn't differentiate sampler. Probe at chosen cell post-grid.)
#
# Usage: bash run-sampler-grid.sh
# Restores TIER_64_TEMP and TIER_64_PRESENCE_PENALTY to their original
# values on exit (normal, interrupted, or errored).

set -u

REPO=/Users/nigel/Desktop/bench/lab/host
CONF="$REPO/llama-server/models.conf"
INSTALL="$REPO/llama-server/scripts/install"
LABEL=com.mac-llm-lab.llama-server
LOG="$REPO/test/logs/a2/SAMPLER-GRID-$(date +%Y%m%d-%H%M).md"
TESTS_DIR="$REPO/test"
TESTS=(csv-parser lru-cache json-schema-validate multi-bug-decoy expression-eval)

ORIG_TEMP=$(grep '^TIER_64_TEMP=' "$CONF" | cut -d= -f2)
ORIG_PRESENCE=$(grep '^TIER_64_PRESENCE_PENALTY=' "$CONF" | cut -d= -f2)

cleanup() {
    echo "[cleanup] restoring sampler temp=${ORIG_TEMP} presence=${ORIG_PRESENCE}" >&2
    sed -i.bak -E "s/^TIER_64_TEMP=.*/TIER_64_TEMP=${ORIG_TEMP}/" "$CONF"
    sed -i.bak -E "s/^TIER_64_PRESENCE_PENALTY=.*/TIER_64_PRESENCE_PENALTY=${ORIG_PRESENCE}/" "$CONF"
    rm -f "${CONF}.bak"
    launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
    sleep 2
    LLAMA_TIER=64 "$INSTALL" >/dev/null 2>&1 || echo "[cleanup] WARN: reinstall failed" >&2
}
trap cleanup EXIT INT TERM

set_sampler() {
    sed -i.bak -E "s/^TIER_64_TEMP=.*/TIER_64_TEMP=${1}/" "$CONF"
    sed -i.bak -E "s/^TIER_64_PRESENCE_PENALTY=.*/TIER_64_PRESENCE_PENALTY=${2}/" "$CONF"
    rm -f "${CONF}.bak"
}

reload_daemon() {
    launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
    j=0
    while [ "$j" -lt 30 ] && launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; do
        j=$((j + 1)); sleep 1
    done
    LLAMA_TIER=64 "$INSTALL" >/dev/null 2>&1 || return 1
    i=0
    while [ "$i" -lt 60 ]; do
        if curl -fsS http://127.0.0.1:11435/health >/dev/null 2>&1; then
            return 0
        fi
        i=$((i + 1)); sleep 2
    done
    return 1
}

mkdir -p "$(dirname "$LOG")"
{
    echo "# Sampler grid sweep at tier-64 (ctx=65536)"
    echo "started $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "Cells: temp ∈ {0.3, 0.5, 0.7, 0.9} × presence ∈ {0, 1.5}"
    echo "Fixed: top_p=0.8, top_k=20, repeat_penalty=1.0, ctx=65536"
    echo "Tests (n=3 each): ${TESTS[*]}"
    echo "Original sampler: temp=${ORIG_TEMP} presence=${ORIG_PRESENCE}"
    echo ""
} > "$LOG"

CELL=0
for T in 0.3 0.5 0.7 0.9; do
    for P in 0 1.5; do
        CELL=$((CELL + 1))
        echo "" >> "$LOG"
        echo "## Cell ${CELL}/8 — temp=${T} presence=${P} ($(date '+%H:%M:%S'))" >> "$LOG"
        set_sampler "$T" "$P"
        if ! reload_daemon; then
            echo "  daemon failed to start with temp=${T} presence=${P}; skipping cell" >> "$LOG"
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
                -e BACKEND=llama-server -e TIER=64 \
                test node --test --test-concurrency=1 --test-reporter=spec \
                "${test_files[@]}" ) >> "$LOG" 2>&1 || echo "  iter exited non-zero" >> "$LOG"
            echo '```' >> "$LOG"
        done
    done
done

echo "" >> "$LOG"
echo "completed $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG"
echo "DONE: $LOG"
