#!/usr/bin/env python3
"""Compute Cohen's κ + 95% bootstrap CI + raw agreement + confusion matrix
on two W4 classification CSVs (Pass 1 agentic, Pass 2 director).

CSV format (one row per long-tail run):
  run_id,class,primary_signal,justification

Usage:
  cohen-kappa.py --pass1 W4-pass1-agent.csv --pass2 W4-pass2-director.csv

Per the v2 plan acceptance gates:
  - κ ≥ 0.6 AND lower bound of 95% CI ≥ 0.4
  - raw agreement ≥ 70%
  - unclassified rate < 30% on both passes
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import random
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Optional

CLASSES = ["A", "B", "C", "D", "E", "F"]


def cohens_kappa(y1: list[str], y2: list[str]) -> Optional[float]:
    if not y1 or len(y1) != len(y2):
        return None
    n = len(y1)
    agreement = sum(1 for a, b in zip(y1, y2) if a == b)
    po = agreement / n

    counts1 = Counter(y1)
    counts2 = Counter(y2)
    pe = 0.0
    for cls in set(list(counts1.keys()) + list(counts2.keys())):
        pe += (counts1[cls] / n) * (counts2[cls] / n)
    if pe == 1:
        return 1.0
    return (po - pe) / (1 - pe)


def bootstrap_kappa_ci(
    y1: list[str], y2: list[str], *, iterations: int = 10000, alpha: float = 0.05, seed: int = 17
) -> Optional[tuple[float, float, float]]:
    if not y1:
        return None
    rng = random.Random(seed)
    point = cohens_kappa(y1, y2)
    if point is None:
        return None
    n = len(y1)
    samples = []
    for _ in range(iterations):
        idx = [rng.randrange(n) for _ in range(n)]
        sa = [y1[i] for i in idx]
        sb = [y2[i] for i in idx]
        k = cohens_kappa(sa, sb)
        if k is not None:
            samples.append(k)
    samples.sort()
    if not samples:
        return None
    lo = samples[int((alpha / 2) * len(samples))]
    hi = samples[int((1 - alpha / 2) * len(samples)) - 1]
    return point, lo, hi


def confusion_matrix(y1: list[str], y2: list[str]) -> dict:
    classes = sorted({c for c in y1 + y2})
    matrix = {c: {d: 0 for d in classes} for c in classes}
    for a, b in zip(y1, y2):
        matrix[a][b] += 1
    return {"classes": classes, "matrix": matrix}


def load(path: Path) -> dict[str, str]:
    out = {}
    with path.open(newline="") as f:
        for row in csv.DictReader(f):
            rid = row.get("run_id")
            cls = (row.get("class") or "").strip().upper()
            if rid and cls:
                out[rid] = cls
    return out


def load_stratum_index(path: Path) -> dict[str, str]:
    """Returns {run_id: stratum} from _w4-index.jsonl."""
    out = {}
    if not path.exists():
        return out
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        rid = rec.get("run_id")
        stratum = rec.get("stratum")
        if rid and stratum:
            out[rid] = stratum
    return out


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--pass1", type=Path, required=True)
    p.add_argument("--pass2", type=Path, required=True)
    p.add_argument("--bootstrap", type=int, default=10000)
    p.add_argument("--json", action="store_true")
    p.add_argument(
        "--stratum",
        choices=("failed-tail", "successful-tail"),
        default=None,
        help="restrict to one stratum (joined against --index)",
    )
    p.add_argument(
        "--index",
        type=Path,
        default=Path(__file__).resolve().parents[2] / ".claw-runtime" / "_w4-index.jsonl",
        help="path to _w4-index.jsonl (only consulted when --stratum is set)",
    )
    args = p.parse_args()

    a = load(args.pass1)
    b = load(args.pass2)

    if args.stratum:
        stratum_map = load_stratum_index(args.index)
        if not stratum_map:
            print(f"--stratum requires {args.index} (run build-w4-packet.py first)", file=sys.stderr)
            return 2
        keep = {rid for rid, s in stratum_map.items() if s == args.stratum}
        a = {rid: c for rid, c in a.items() if rid in keep}
        b = {rid: c for rid, c in b.items() if rid in keep}
        print(f"--stratum {args.stratum}: kept {len(a)} pass1 + {len(b)} pass2 rows", file=sys.stderr)

    common = sorted(set(a.keys()) & set(b.keys()))
    if not common:
        print("no overlap between passes", file=sys.stderr)
        return 2

    y1 = [a[r] for r in common]
    y2 = [b[r] for r in common]

    kappa = cohens_kappa(y1, y2)
    ci = bootstrap_kappa_ci(y1, y2, iterations=args.bootstrap)
    raw_agreement = sum(1 for x, y in zip(y1, y2) if x == y) / len(y1)
    counts_a = Counter(y1)
    counts_b = Counter(y2)
    unclassified_a = counts_a.get("F", 0) / len(y1)
    unclassified_b = counts_b.get("F", 0) / len(y2)

    cm = confusion_matrix(y1, y2)

    gate_kappa = kappa is not None and kappa >= 0.6
    gate_ci = ci is not None and ci[1] >= 0.4
    gate_agreement = raw_agreement >= 0.70
    gate_unclassified = unclassified_a < 0.30 and unclassified_b < 0.30
    accept = all([gate_kappa, gate_ci, gate_agreement, gate_unclassified])

    report = {
        "n": len(common),
        "kappa": kappa,
        "kappa_ci_95": ci,
        "raw_agreement": raw_agreement,
        "counts_pass1": dict(counts_a),
        "counts_pass2": dict(counts_b),
        "unclassified_rate_pass1": unclassified_a,
        "unclassified_rate_pass2": unclassified_b,
        "confusion_matrix": cm,
        "gates": {
            "kappa>=0.6": gate_kappa,
            "kappa_ci_lower>=0.4": gate_ci,
            "raw_agreement>=0.70": gate_agreement,
            "unclassified_rate<30%": gate_unclassified,
        },
        "accept": accept,
    }

    if args.json:
        json.dump(report, sys.stdout, indent=2, default=str)
        sys.stdout.write("\n")
        return 0

    print(f"n = {len(common)}")
    print(f"κ = {kappa:.3f}" if kappa is not None else "κ = —")
    if ci:
        print(f"95% CI = [{ci[1]:.3f}, {ci[2]:.3f}]")
    print(f"raw agreement = {raw_agreement:.3f}")
    print(f"counts pass1 = {dict(counts_a)}")
    print(f"counts pass2 = {dict(counts_b)}")
    print(f"unclassified rates: pass1={unclassified_a:.2%} pass2={unclassified_b:.2%}")
    print(f"\nGates:")
    for k, v in report["gates"].items():
        print(f"  {'✔' if v else '✘'} {k}")
    print(f"\nAccept: {'YES' if accept else 'NO'}")
    print(f"\nConfusion matrix (rows=pass1, cols=pass2):")
    classes = cm["classes"]
    header = "      " + " ".join(f"{c:>3}" for c in classes)
    print(header)
    for c in classes:
        row = " ".join(f"{cm['matrix'][c][d]:>3}" for d in classes)
        print(f"  {c:>3}  {row}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
