#!/usr/bin/env bash
# Aggregate per-test pass-rates across multiple TIER-EVAL-RESULTS-*.md files.
#
# Usage:
#   ./aggregate-results.sh logs/TIER-EVAL-RESULTS-*.md
#   ./aggregate-results.sh --wilson logs/TIER-EVAL-RESULTS-*.md
#
# Default output: per-tier pass-count / trials.
# With --wilson, also shows Wilson 95% CI lower bound — the conservative pass
# probability given small N. Tests with low Wilson lower bounds at n≥5 are
# trustworthy fails; tests with high Wilson lower bounds are trustworthy
# passes; the middle is "needs more N" per Inspect AI / METR.

set -eu

WILSON=0
if [ "${1:-}" = "--wilson" ]; then
  WILSON=1
  shift
fi

[ $# -ge 1 ] || { echo "usage: $0 [--wilson] <result-file>..." >&2; exit 1; }

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

awk '
  /^## Tier ([0-9]+)GB/ {
    match($0, /[0-9]+/); tier = substr($0, RSTART, RLENGTH)
    next
  }
  /^▶ / {
    sub(/[ \t]+\(tier=tier-[0-9]+[^)]*\)[ \t]*$/, "")
    sub(/^▶ /, "")
    pending_name = $0
    next
  }
  /^  ✔ / && pending_name { print tier "\t" pending_name "\tpass"; pending_name = ""; next }
  /^  ✖ / && pending_name { print tier "\t" pending_name "\tfail"; pending_name = ""; next }
' "$@" > "$TMP"

awk -F '\t' '
  { key = $1 "|" $2; total[key]++; if ($3 == "pass") pass[key]++ }
  END {
    for (k in total) {
      split(k, p, "|")
      printf "%s\t%s\t%d\t%d\n", p[1], p[2], (k in pass ? pass[k] : 0), total[k]
    }
  }
' "$TMP" | sort -k2,2 -k1,1n > "${TMP}.rolled"

# Wilson 95% CI lower bound: ((p̂ + z²/2N) - z·sqrt(p̂(1-p̂)/N + z²/4N²)) / (1 + z²/N)
# with z = 1.96. Returns 0 when N=0.
awk -F '\t' -v wilson="$WILSON" '
  BEGIN {
    z = 1.96; zsq = z*z
    tiers[1]=16; tiers[2]=32; tiers[3]=64
    if (wilson) col_w = 17; else col_w = 9
  }
  function lo_bound(p, n,    phat, denom, center, margin) {
    if (n == 0) return 0
    phat = p / n
    denom = 1 + zsq / n
    center = (phat + zsq / (2*n)) / denom
    margin = z * sqrt(phat*(1-phat)/n + zsq/(4*n*n)) / denom
    bound = center - margin
    if (bound < 0) bound = 0
    return bound
  }
  function fmt_cell(p, n) {
    if (wilson) return sprintf("%2d/%-2d (lo %2d%%)", p, n, int(lo_bound(p, n) * 100))
    else        return sprintf("%2d/%-2d", p, n)
  }
  { tier=$1; name=$2; pass=$3; total=$4; cell[name "|" tier]=fmt_cell(pass, total); names[name]=1 }
  END {
    printf "%-58s", "test"
    for (i=1; i<=3; i++) {
      lbl = "tier-" tiers[i]
      printf " | %-*s", col_w, lbl
    }
    print ""
    printf "%-58s", "----"
    for (i=1; i<=3; i++) {
      printf " | "
      for (j=0; j<col_w; j++) printf "-"
    }
    print ""
    n=0; for (nm in names) seen[++n]=nm
    for (i=1; i<=n; i++) for (j=i+1; j<=n; j++) if (seen[i] > seen[j]) { t=seen[i]; seen[i]=seen[j]; seen[j]=t }
    for (i=1; i<=n; i++) {
      printf "%-58s", seen[i]
      for (k=1; k<=3; k++) {
        key=seen[i] "|" tiers[k]
        if (key in cell) printf " | %-*s", col_w, cell[key]
        else             printf " | %-*s", col_w, "-"
      }
      print ""
    }
  }
' "${TMP}.rolled"

rm -f "${TMP}.rolled"
