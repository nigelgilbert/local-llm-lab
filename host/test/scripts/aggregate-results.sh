#!/usr/bin/env bash
# Aggregate per-test pass-rates across multiple TIER-EVAL-RESULTS-*.md files.
#
# Usage: ./aggregate-results.sh logs/TIER-EVAL-RESULTS-*.md
#
# For each test name, prints pass-count / total per tier (16, 32, 64) across
# all input files. The signal we want: a smooth gradient from "always pass on
# every tier" through "passes on big, fails on small" to "always fails."
#
# Implementation notes: BSD awk (macOS default) lacks asort/asorti, so we
# emit (tier, name, pass, total) tuples and let `sort` order them.

set -eu

[ $# -ge 1 ] || { echo "usage: $0 <result-file>..." >&2; exit 1; }

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

awk '
  /^## Tier ([0-9]+)GB/ {
    match($0, /[0-9]+/); tier = substr($0, RSTART, RLENGTH)
    next
  }
  /^▶ / {
    # strip trailing " (tier=tier-NN…)" and the leading marker
    sub(/[ \t]+\(tier=tier-[0-9]+[^)]*\)[ \t]*$/, "")
    sub(/^▶ /, "")
    pending_name = $0
    next
  }
  /^  ✔ / && pending_name { print tier "\t" pending_name "\tpass"; pending_name = ""; next }
  /^  ✖ / && pending_name { print tier "\t" pending_name "\tfail"; pending_name = ""; next }
' "$@" > "$TMP"

# Roll up: tier|name -> pass-count + total-count
awk -F '\t' '
  { key = $1 "|" $2; total[key]++; if ($3 == "pass") pass[key]++ }
  END {
    for (k in total) {
      split(k, p, "|")
      printf "%s\t%s\t%d\t%d\n", p[1], p[2], (k in pass ? pass[k] : 0), total[k]
    }
  }
' "$TMP" | sort -k2,2 -k1,1n > "${TMP}.rolled"

# Pivot to a wide table
awk -F '\t' '
  BEGIN { tiers[1]=16; tiers[2]=32; tiers[3]=64 }
  { tier=$1; name=$2; cnt[name "|" tier]=$3 "/" $4; names[name]=1 }
  END {
    printf "%-58s", "test"
    for (i=1; i<=3; i++) printf " | tier-%-3s", tiers[i]
    print ""
    printf "%-58s", "----"
    for (i=1; i<=3; i++) printf " | --------"
    print ""
    n=0; for (nm in names) seen[++n]=nm
    # bubble sort for portability
    for (i=1; i<=n; i++) for (j=i+1; j<=n; j++) if (seen[i] > seen[j]) { t=seen[i]; seen[i]=seen[j]; seen[j]=t }
    for (i=1; i<=n; i++) {
      printf "%-58s", seen[i]
      for (k=1; k<=3; k++) {
        key=seen[i] "|" tiers[k]
        if (key in cnt) printf " | %-8s", cnt[key]
        else            printf " | %-8s", "-"
      }
      print ""
    }
  }
' "${TMP}.rolled"

rm -f "${TMP}.rolled"
