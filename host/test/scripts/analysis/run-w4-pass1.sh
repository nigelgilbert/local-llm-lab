#!/usr/bin/env bash
# W4 Pass 1 — agentic classification of long-tail runs, split by stratum.
#
# After the W4 selection rule was found to mismatch the failure taxonomy
# (65% F-rate on the original Pass 1), runs are now stratified into:
#   - failed-tail: terminal_status != done OR exit_code != 0
#                  → classified against W4-TAXONOMY.md (A–F)
#                  → output: host/llama-server/docs/W4-pass1-failed-agent.csv
#   - successful-tail: terminal_status = done AND exit_code = 0
#                  → classified against W4-TAXONOMY-PRODUCTIVE.md (P1–P5)
#                  → output: host/llama-server/docs/W4-pass1-productive-agent.csv
#
# This script does not actually invoke the classifier. It:
#   1. Verifies the stratified index and packets exist.
#   2. Emits two manifests at host/test/.claw-runtime/_w4-pass1-{failed,productive}-pending.csv
#   3. Initializes both output CSVs with the standard header if absent.
#
# The classifier itself runs in this conversation (or any harness around
# claude-code's Agent tool) — read each packet, apply the appropriate
# taxonomy, append a row to the matching output CSV. Independence
# requirement: each packet is classified without seeing other packets'
# labels and without seeing the director's Pass 2.

set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
TEST_DIR=$(cd "$SCRIPT_DIR/../.." && pwd)
HOST_DIR=$(cd "$TEST_DIR/.." && pwd)
RUNTIME_DIR="$TEST_DIR/.claw-runtime"
INDEX="$RUNTIME_DIR/_w4-index.jsonl"

FAILED_PENDING="$RUNTIME_DIR/_w4-pass1-failed-pending.csv"
SUCC_PENDING="$RUNTIME_DIR/_w4-pass1-productive-pending.csv"
FAILED_OUT="$HOST_DIR/llama-server/docs/W4-pass1-failed-agent.csv"
SUCC_OUT="$HOST_DIR/llama-server/docs/W4-pass1-productive-agent.csv"

[ -f "$INDEX" ] || { echo "no index at $INDEX — run build-w4-packet.py first" >&2; exit 2; }

if [ ! -f "$FAILED_OUT" ]; then
  echo "run_id,class,primary_signal,justification" > "$FAILED_OUT"
  echo "initialized $FAILED_OUT" >&2
fi
if [ ! -f "$SUCC_OUT" ]; then
  echo "run_id,class,primary_signal,justification" > "$SUCC_OUT"
  echo "initialized $SUCC_OUT" >&2
fi

# Walk index, emit pending lists per stratum (excludes already-classified).
already_failed=$(awk -F, 'NR>1 {print $1}' "$FAILED_OUT" | sort -u)
already_succ=$(awk -F, 'NR>1 {print $1}' "$SUCC_OUT" | sort -u)

echo "run_id,packet_path,stratum" > "$FAILED_PENDING"
echo "run_id,packet_path,stratum" > "$SUCC_PENDING"

python3 - "$INDEX" "$already_failed" "$already_succ" "$FAILED_PENDING" "$SUCC_PENDING" <<'PY'
import json, sys
index, af_str, as_str, fp, sp = sys.argv[1:]
already_failed = set(line.strip() for line in af_str.splitlines() if line.strip())
already_succ = set(line.strip() for line in as_str.splitlines() if line.strip())
with open(fp, "a") as f_failed, open(sp, "a") as f_succ:
    for line in open(index):
        rec = json.loads(line)
        rid = rec["run_id"]
        stratum = rec.get("stratum", "failed-tail")
        if stratum == "failed-tail":
            if rid in already_failed:
                continue
            f_failed.write(f"{rid},{rec['packet_path']},{stratum}\n")
        else:
            if rid in already_succ:
                continue
            f_succ.write(f"{rid},{rec['packet_path']},{stratum}\n")
PY

n_failed=$(($(wc -l < "$FAILED_PENDING") - 1))
n_succ=$(($(wc -l < "$SUCC_PENDING") - 1))
echo "Pass 1 pending: failed-tail=$n_failed, successful-tail=$n_succ"
echo "  failed-tail manifest:    $FAILED_PENDING"
echo "  failed-tail output:      $FAILED_OUT"
echo "  failed-tail taxonomy:    $HOST_DIR/llama-server/docs/W4-TAXONOMY.md"
echo "  failed-tail prompt:      $SCRIPT_DIR/classifier-prompt.md"
echo "  productive manifest:     $SUCC_PENDING"
echo "  productive output:       $SUCC_OUT"
echo "  productive taxonomy:     $HOST_DIR/llama-server/docs/W4-TAXONOMY-PRODUCTIVE.md"
echo "  productive prompt:       $SCRIPT_DIR/classifier-prompt-productive.md"
