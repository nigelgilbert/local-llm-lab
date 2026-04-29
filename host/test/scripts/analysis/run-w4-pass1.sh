#!/usr/bin/env bash
# W4 Pass 1 — agentic classification of long-tail runs.
#
# This script does not actually invoke the agent. The classifier prompt is
# at host/test/scripts/analysis/classifier-prompt.md; the frozen taxonomy is
# at host/llama-server/docs/W4-TAXONOMY.md; per-run packets are at
# host/test/.claw-runtime/<run-id>/w4-packet.md.
#
# What this script does:
#   1. Verifies long-tail packets exist (run build-w4-packet.py first if not).
#   2. Emits a manifest at host/test/.claw-runtime/_w4-pass1-pending.csv that
#      lists every packet to classify, in stable order.
#   3. Initializes the output CSV at host/llama-server/docs/W4-pass1-agent.csv
#      with the header `run_id,class,primary_signal,justification` if it does
#      not exist.
#
# The classifier itself runs in this conversation (or any harness around
# claude-code's Agent tool) — read each packet, apply the taxonomy, append a
# row to W4-pass1-agent.csv. Independence requirement: each packet is
# classified without seeing other packets' labels and without seeing the
# director's Pass 2.

set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
TEST_DIR=$(cd "$SCRIPT_DIR/../.." && pwd)
HOST_DIR=$(cd "$TEST_DIR/.." && pwd)
RUNTIME_DIR="$TEST_DIR/.claw-runtime"
PENDING_CSV="$RUNTIME_DIR/_w4-pass1-pending.csv"
PASS1_CSV="$HOST_DIR/llama-server/docs/W4-pass1-agent.csv"
INDEX="$RUNTIME_DIR/_w4-index.jsonl"

[ -f "$INDEX" ] || { echo "no index at $INDEX — run build-w4-packet.py first" >&2; exit 2; }

if [ ! -f "$PASS1_CSV" ]; then
  echo "run_id,class,primary_signal,justification" > "$PASS1_CSV"
  echo "initialized $PASS1_CSV" >&2
fi

# Walk index, emit pending list (excludes already-classified runs).
already=$(awk -F, 'NR>1 {print $1}' "$PASS1_CSV" | sort -u)
echo "run_id,packet_path" > "$PENDING_CSV"
python3 - "$INDEX" "$already" "$PENDING_CSV" <<'PY'
import json, sys
index, already_str, pending = sys.argv[1:]
already = set(line.strip() for line in already_str.splitlines() if line.strip())
with open(pending, "a") as out:
    for line in open(index):
        rec = json.loads(line)
        if rec["run_id"] in already:
            continue
        out.write(f"{rec['run_id']},{rec['packet_path']}\n")
PY

n_pending=$(($(wc -l < "$PENDING_CSV") - 1))
echo "Pass 1 pending: $n_pending packet(s)"
echo "  manifest:  $PENDING_CSV"
echo "  output:    $PASS1_CSV"
echo "  taxonomy:  $HOST_DIR/llama-server/docs/W4-TAXONOMY.md"
echo "  prompt:    $SCRIPT_DIR/classifier-prompt.md"
