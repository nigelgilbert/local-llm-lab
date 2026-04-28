#!/usr/bin/env bash
# C5 re-checks + mini-vm probe at tier-64 v2 sampler (temp=0.5, presence=0).
# - multi-file-rename × n=10
# - agent-single × n=10
# - mini-vm × n=2 (probe whether sampler v2 changes the outcome)

set -u

REPO=/Users/nigel/Desktop/bench/lab/host
LOG="$REPO/test/logs/a2/C5-MINIVM-$(date +%Y%m%d-%H%M).md"
TESTS_DIR="$REPO/test"

mkdir -p "$(dirname "$LOG")"
{
    echo "# C5 re-checks + mini-vm v2-sampler probe"
    echo "started $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "tier-64 sampler: temp=0.5, presence=0, ctx=65536"
    echo ""
} > "$LOG"

# --- C5 part: agent-single + multi-file-rename × n=10 ---
echo "" >> "$LOG"
echo "## C5: agent-single + multi-file-rename × n=10" >> "$LOG"
for ITER in 1 2 3 4 5 6 7 8 9 10; do
    echo "" >> "$LOG"
    echo "### iter ${ITER} — $(date '+%H:%M:%S')" >> "$LOG"
    echo '```' >> "$LOG"
    ( cd "$TESTS_DIR" && \
      docker compose --env-file ../litellm/.env -f docker-compose.yml run --rm \
        -e BACKEND=llama-server -e TIER=64 \
        test node --test --test-concurrency=1 --test-reporter=spec \
        __tests__/tier-eval/agent-single.test.js \
        __tests__/tier-eval/multi-file-rename.test.js ) >> "$LOG" 2>&1 || echo "  iter exited non-zero" >> "$LOG"
    echo '```' >> "$LOG"
done

# --- mini-vm probe at v2 sampler × n=2 ---
echo "" >> "$LOG"
echo "## mini-vm probe at tier-64 v2 sampler × n=2" >> "$LOG"
for ITER in 1 2; do
    echo "" >> "$LOG"
    echo "### mini-vm iter ${ITER} — $(date '+%H:%M:%S')" >> "$LOG"
    echo '```' >> "$LOG"
    ( cd "$TESTS_DIR" && \
      docker compose --env-file ../litellm/.env -f docker-compose.yml run --rm \
        -e BACKEND=llama-server -e TIER=64 \
        test node --test --test-concurrency=1 --test-reporter=spec \
        __tests__/tier-eval/mini-vm.test.js ) >> "$LOG" 2>&1 || echo "  iter exited non-zero" >> "$LOG"
    echo '```' >> "$LOG"
done

echo "" >> "$LOG"
echo "completed $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG"
echo "DONE: $LOG"
