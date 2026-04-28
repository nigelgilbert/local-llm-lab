#!/usr/bin/env bash
# Classify each ✖ failure in TIER-EVAL-RESULTS-*.md files into one of:
#
#   timeout         — test elapsed ≥ 240s. Likely claw retry-storm; harness, not capability.
#   discipline      — claw elapsed < 5s AND files = [".claw"] only.
#                     Model emitted prose-only response without tool calls.
#                     Grammar permits this branch; not capability.
#   capability      — everything else. Test failed for the right reason:
#                     model engaged, output was wrong / incomplete.
#
# Usage: ./classify-failures.sh logs/TIER-EVAL-RESULTS-*.md
#
# Output: flat list of (tier, category, test, claw_elapsed, files) +
#         summary table.

set -eu

[ $# -ge 1 ] || { echo "usage: $0 <result-file>..." >&2; exit 1; }

awk '
  /^## Tier ([0-9]+)GB/ {
    match($0, /[0-9]+/); tier = substr($0, RSTART, RLENGTH); next
  }

  # Reset per-test state on the test block boundary OR on a new ▶ marker.
  /^=== / || /^▶ / {
    if ($0 ~ /^▶ /) {
      pretty = $0
      sub(/[ \t]+\(tier=tier-[0-9]+[^)]*\)[ \t]*$/, "", pretty)
      sub(/^▶ /, "", pretty)
      pending_pretty = pretty
    } else {
      claw_elapsed = ""
      files = ""
    }
    next
  }

  # claw-line parsing — BSD awk has no array-form match(), use idiom
  /elapsed=[0-9]+ms/ && /^  claw: / {
    s = $0; sub(/^.*elapsed=/, "", s); sub(/ms.*$/, "", s); claw_elapsed = s
  }
  /files=\[/ && /^  claw: / {
    s = $0; sub(/^.*files=/, "", s); sub(/\].*$/, "]", s); files = s
  }

  /^  ✔ / && pending_pretty {
    pending_pretty = ""; claw_elapsed = ""; files = ""; next
  }

  /^  ✖ / && pending_pretty {
    # Extract test_elapsed from the parenthetical at end of the ✖ line
    s = $0; sub(/^.*\(/, "", s); sub(/ms\).*$/, "", s); te = s + 0
    if (te >= 239000) {
      cat = "timeout"
    } else if (claw_elapsed != "" && (claw_elapsed + 0) < 5000 && files == "[\".claw\"]") {
      cat = "discipline"
    } else {
      cat = "capability"
    }
    printf "tier-%-2s  %-12s  %-50s  test=%6dms  claw=%s  files=%s\n",
           tier, cat, pending_pretty, te,
           (claw_elapsed == "" ? "?     " : sprintf("%6sms", claw_elapsed)),
           (files == "" ? "?" : files)
    count[tier "|" cat]++; total[tier]++
    pending_pretty = ""; claw_elapsed = ""; files = ""
  }

  END {
    print ""
    print "=== Summary by tier × category ==="
    printf "%-10s %-10s %-12s %-12s %-8s\n", "tier", "timeout", "discipline", "capability", "total"
    printf "%-10s %-10s %-12s %-12s %-8s\n", "----", "-------", "----------", "----------", "-----"
    n = 0; for (t in total) { if (!seen[t]) { seen[t]=1; sorted[++n] = t } }
    for (i=1; i<=n; i++) for (j=i+1; j<=n; j++) if (sorted[i]+0 > sorted[j]+0) { tmp=sorted[i]; sorted[i]=sorted[j]; sorted[j]=tmp }
    for (i=1; i<=n; i++) {
      t = sorted[i]
      printf "tier-%-5s %-10d %-12d %-12d %-8d\n", t,
        (t "|timeout"    in count ? count[t "|timeout"]    : 0),
        (t "|discipline" in count ? count[t "|discipline"] : 0),
        (t "|capability" in count ? count[t "|capability"] : 0),
        total[t]
    }
  }
' "$@"
