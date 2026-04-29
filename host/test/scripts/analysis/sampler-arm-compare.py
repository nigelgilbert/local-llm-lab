#!/usr/bin/env python3
"""W3 analysis — sampler-arm comparison (v1-prod vs v3-deterministic).

Per the v2 plan (TODO-ITERATION-DISTRIBUTION-TEST.md §"W3 analysis"):

- Median, p75, p90 iter_count and wallclock by sampler.
- Hodges-Lehmann shift estimate for iter_count.
- Bootstrap 95% CIs for median delta, p75 delta, mean-of-top-5 delta
  (B=10000).
- Cliff's δ effect size.
- Mann-Whitney U p-value (supporting evidence only).
- Pass-count delta.
- Practical-equivalence retirement criterion.

Output: appends to host/llama-server/docs/W2-W3-RESULTS-<date>.md or stdout.

Stdlib only.

Usage:
  sampler-arm-compare.py [--runtime DIR] [--out PATH] [--bootstrap N]
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import random
import statistics
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Optional

DEFAULT_RUNTIME = (
    Path(__file__).resolve().parents[3] / "test" / ".claw-runtime"
)
DEFAULT_OUT = (
    Path(__file__).resolve().parents[3]
    / "llama-server"
    / "docs"
    / f"W2-W3-RESULTS-{date.today().isoformat().replace('-', '')}.md"
)


def percentile(values: list[float], q: float) -> Optional[float]:
    if not values:
        return None
    s = sorted(values)
    if len(s) == 1:
        return s[0]
    idx = (len(s) - 1) * q
    lo = math.floor(idx)
    hi = math.ceil(idx)
    if lo == hi:
        return s[lo]
    return s[lo] + (s[hi] - s[lo]) * (idx - lo)


def hodges_lehmann(a: list[float], b: list[float]) -> Optional[float]:
    """Median of all pairwise (a_i − b_j)."""
    if not a or not b:
        return None
    diffs = [ai - bj for ai in a for bj in b]
    return percentile(diffs, 0.5)


def cliffs_delta(a: list[float], b: list[float]) -> Optional[float]:
    """Cliff's δ ∈ [-1, 1]. Positive: a tends to exceed b."""
    if not a or not b:
        return None
    ab = 0
    ba = 0
    for ai in a:
        for bj in b:
            if ai > bj:
                ab += 1
            elif ai < bj:
                ba += 1
    n = len(a) * len(b)
    if n == 0:
        return None
    return (ab - ba) / n


def mann_whitney_u(a: list[float], b: list[float]) -> tuple[Optional[float], Optional[float]]:
    """U statistic and approximate two-sided p-value (normal approximation)."""
    if not a or not b:
        return None, None
    combined = sorted([(v, "a") for v in a] + [(v, "b") for v in b])
    ranks = {}
    i = 0
    n = len(combined)
    while i < n:
        j = i
        while j + 1 < n and combined[j + 1][0] == combined[i][0]:
            j += 1
        avg_rank = (i + j) / 2 + 1
        for k in range(i, j + 1):
            ranks.setdefault("rks", []).append((combined[k][1], avg_rank))
        i = j + 1
    sum_rank_a = sum(r for kind, r in ranks["rks"] if kind == "a")
    n1 = len(a)
    n2 = len(b)
    u1 = sum_rank_a - n1 * (n1 + 1) / 2
    u2 = n1 * n2 - u1
    u = min(u1, u2)
    mu = n1 * n2 / 2
    sigma = math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12)
    if sigma == 0:
        return u, None
    z = (u - mu) / sigma
    # Two-sided p-value via normal approximation.
    p = 2 * (1 - _phi(abs(z)))
    return u, p


def _phi(x: float) -> float:
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def bootstrap_delta_ci(
    a: list[float],
    b: list[float],
    stat_fn,
    *,
    iterations: int = 10000,
    seed: int = 17,
    alpha: float = 0.05,
) -> Optional[tuple[float, float, float]]:
    """Returns (delta, ci_low, ci_high) for stat_fn(a) − stat_fn(b)."""
    if not a or not b:
        return None
    rng = random.Random(seed)
    diffs = []
    for _ in range(iterations):
        ra = [a[rng.randrange(len(a))] for _ in range(len(a))]
        rb = [b[rng.randrange(len(b))] for _ in range(len(b))]
        sa = stat_fn(ra)
        sb = stat_fn(rb)
        if sa is None or sb is None:
            continue
        diffs.append(sa - sb)
    if not diffs:
        return None
    sa0 = stat_fn(a)
    sb0 = stat_fn(b)
    if sa0 is None or sb0 is None:
        return None
    diffs.sort()
    lo_idx = int((alpha / 2) * len(diffs))
    hi_idx = int((1 - alpha / 2) * len(diffs)) - 1
    return (sa0 - sb0, diffs[lo_idx], diffs[hi_idx])


def mean_of_top_n(n: int):
    def f(values: list[float]) -> Optional[float]:
        if len(values) < n:
            return None
        return statistics.fmean(sorted(values, reverse=True)[:n])
    return f


def _safe_float(v) -> Optional[float]:
    if v is None or v == "":
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def load_runs(runtime: Path) -> list[dict]:
    csv_path = runtime / "iter-distribution-runs.csv"
    if not csv_path.exists():
        print(
            f"missing run table at {csv_path}; run build-run-table.py first.",
            file=sys.stderr,
        )
        sys.exit(2)
    with csv_path.open(newline="") as f:
        return list(csv.DictReader(f))


def passed_count(runs: list[dict]) -> int:
    return sum(1 for r in runs if (r.get("passed") in ("True", "true", True, "1", 1))
               or (r.get("terminal_status") == "done" and r.get("exit_code") in ("0", 0)))


def equivalence_band(reference: float, *, abs_min: float, rel_pct: float) -> float:
    return max(abs_min, rel_pct * reference)


# --- main --------------------------------------------------------------------


def per_test_compare(
    runs: list[dict],
    *,
    bootstrap_n: int,
) -> dict:
    cells: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for r in runs:
        key = (r.get("test_id"), r.get("sampler_id"))
        cells[key].append(r)

    out = {}
    tests = sorted({k[0] for k in cells.keys() if k[0]})
    for test in tests:
        v1 = cells.get((test, "v1-prod"), [])
        v3 = cells.get((test, "v3-deterministic"), [])
        # Drop censored runs from the comparison numerics (keep censoring counts separately).
        v1_used = [r for r in v1 if (r.get("terminal_status") or "").lower() == "done"]
        v3_used = [r for r in v3 if (r.get("terminal_status") or "").lower() == "done"]

        v1_iters = [_safe_float(r["iter_count"]) for r in v1_used if _safe_float(r["iter_count"]) is not None]
        v3_iters = [_safe_float(r["iter_count"]) for r in v3_used if _safe_float(r["iter_count"]) is not None]
        v1_wall = [_safe_float(r["wallclock_ms"]) for r in v1_used if _safe_float(r["wallclock_ms"]) is not None]
        v3_wall = [_safe_float(r["wallclock_ms"]) for r in v3_used if _safe_float(r["wallclock_ms"]) is not None]

        u_iter, p_iter = mann_whitney_u(v3_iters, v1_iters)

        median_iter_ci = bootstrap_delta_ci(
            v3_iters, v1_iters, lambda xs: percentile(xs, 0.5), iterations=bootstrap_n,
        )
        p75_iter_ci = bootstrap_delta_ci(
            v3_iters, v1_iters, lambda xs: percentile(xs, 0.75), iterations=bootstrap_n,
        )
        p90_iter_ci = bootstrap_delta_ci(
            v3_iters, v1_iters, lambda xs: percentile(xs, 0.9), iterations=bootstrap_n,
        )
        # Mean of top-5 (more stable than p90 at n=20).
        top5_iter_ci = bootstrap_delta_ci(
            v3_iters, v1_iters, mean_of_top_n(5), iterations=bootstrap_n,
        )

        out[test] = {
            "n_v1": len(v1),
            "n_v3": len(v3),
            "n_v1_used": len(v1_iters),
            "n_v3_used": len(v3_iters),
            "median_iter_v1": percentile(v1_iters, 0.5),
            "median_iter_v3": percentile(v3_iters, 0.5),
            "p75_iter_v1": percentile(v1_iters, 0.75),
            "p75_iter_v3": percentile(v3_iters, 0.75),
            "p90_iter_v1": percentile(v1_iters, 0.9),
            "p90_iter_v3": percentile(v3_iters, 0.9),
            "max_iter_v1": (max(v1_iters) if v1_iters else None),
            "max_iter_v3": (max(v3_iters) if v3_iters else None),
            "mean_top5_iter_v1": mean_of_top_n(5)(v1_iters),
            "mean_top5_iter_v3": mean_of_top_n(5)(v3_iters),
            "median_wallclock_v1": percentile(v1_wall, 0.5),
            "median_wallclock_v3": percentile(v3_wall, 0.5),
            "p75_wallclock_v1": percentile(v1_wall, 0.75),
            "p75_wallclock_v3": percentile(v3_wall, 0.75),
            "p90_wallclock_v1": percentile(v1_wall, 0.9),
            "p90_wallclock_v3": percentile(v3_wall, 0.9),
            "hl_shift_iter": hodges_lehmann(v3_iters, v1_iters),
            "cliffs_delta_iter": cliffs_delta(v3_iters, v1_iters),
            "mwu_u": u_iter,
            "mwu_p_two_sided": p_iter,
            "median_iter_delta_ci": median_iter_ci,
            "p75_iter_delta_ci": p75_iter_ci,
            "p90_iter_delta_ci": p90_iter_ci,
            "mean_top5_iter_delta_ci": top5_iter_ci,
            "passed_v1": passed_count(v1),
            "passed_v3": passed_count(v3),
            "pass_count_delta": passed_count(v3) - passed_count(v1),
        }

    return out


def retirement_check(per_test: dict) -> dict:
    """Practical-equivalence retirement criterion (v2 plan §W3)."""
    reasons = []
    all_pass = True
    for test, s in per_test.items():
        v1_med = s.get("median_iter_v1")
        v1_p75 = s.get("p75_iter_v1")
        v1_top5 = s.get("mean_top5_iter_v1")

        if v1_med is None or v1_p75 is None or v1_top5 is None:
            reasons.append(f"{test}: insufficient data — {s.get('n_v1_used')} v1 used, {s.get('n_v3_used')} v3 used")
            all_pass = False
            continue

        median_band = equivalence_band(v1_med, abs_min=1, rel_pct=0.20)
        p75_band = equivalence_band(v1_p75, abs_min=1, rel_pct=0.20)
        top5_band = equivalence_band(v1_top5, abs_min=2, rel_pct=0.25)

        med_ci = s["median_iter_delta_ci"]
        p75_ci = s["p75_iter_delta_ci"]
        top5_ci = s["mean_top5_iter_delta_ci"]

        if med_ci is None or p75_ci is None or top5_ci is None:
            reasons.append(f"{test}: bootstrap CI unavailable (likely too few non-censored runs)")
            all_pass = False
            continue

        med_inside = -median_band <= med_ci[1] and med_ci[2] <= median_band
        p75_inside = -p75_band <= p75_ci[1] and p75_ci[2] <= p75_band
        top5_inside = -top5_band <= top5_ci[1] and top5_ci[2] <= top5_band
        pass_guard = s["pass_count_delta"] >= -1

        if not (med_inside and p75_inside and top5_inside and pass_guard):
            reasons.append(
                f"{test}: median_inside={med_inside} p75_inside={p75_inside} "
                f"top5_inside={top5_inside} pass_count_delta={s['pass_count_delta']} "
                f"(bands: median±{median_band}, p75±{p75_band}, top5±{top5_band})"
            )
            all_pass = False
    return {
        "retire": all_pass,
        "notes": reasons,
        "language": (
            "At n=20 per arm, this design is powered only for large distributional shifts. "
            "The result can support deprioritizing sampler tuning as a primary wallclock-variance "
            "lever when practical-equivalence criteria are met, but it does not prove sampler has "
            "no effect. Moderate sampler effects may remain unresolved; resolving them would "
            "require n ≥ 50 per arm."
        ),
    }


def _fmt(v, ndigits: int = 2, na: str = "—"):
    if v is None:
        return na
    if isinstance(v, tuple):
        return f"Δ={_fmt(v[0], ndigits)} (CI {_fmt(v[1], ndigits)}, {_fmt(v[2], ndigits)})"
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return na
    if isinstance(v, float):
        return f"{v:.{ndigits}f}"
    return str(v)


def render_md(per_test: dict, retirement: dict) -> str:
    lines = []
    lines.append("## W3 — sampler arm comparison (v3-deterministic vs v1-prod)")
    lines.append("")
    lines.append("Iteration count central + tail:")
    lines.append("| test | n_v1/n_v3 | median v1 | median v3 | p75 v1 | p75 v3 | p90 v1 | p90 v3 | top5 v1 | top5 v3 |")
    lines.append("|---|---|---|---|---|---|---|---|---|---|")
    for test, s in per_test.items():
        lines.append(
            f"| {test} | {s['n_v1_used']}/{s['n_v3_used']} | {_fmt(s['median_iter_v1'])} | {_fmt(s['median_iter_v3'])} | "
            f"{_fmt(s['p75_iter_v1'])} | {_fmt(s['p75_iter_v3'])} | "
            f"{_fmt(s['p90_iter_v1'])} | {_fmt(s['p90_iter_v3'])} | "
            f"{_fmt(s['mean_top5_iter_v1'])} | {_fmt(s['mean_top5_iter_v3'])} |"
        )
    lines.append("")
    lines.append("Effect sizes and shifts:")
    lines.append("| test | HL shift | Cliff's δ | MWU U | MWU p (2-sided) |")
    lines.append("|---|---|---|---|---|")
    for test, s in per_test.items():
        lines.append(
            f"| {test} | {_fmt(s['hl_shift_iter'])} | {_fmt(s['cliffs_delta_iter'], 3)} | "
            f"{_fmt(s['mwu_u'])} | {_fmt(s['mwu_p_two_sided'], 4)} |"
        )
    lines.append("")
    lines.append("Bootstrap 95% CI on (v3 − v1) deltas:")
    lines.append("| test | median Δ | p75 Δ | mean-top5 Δ | p90 Δ (descriptive) |")
    lines.append("|---|---|---|---|---|")
    for test, s in per_test.items():
        lines.append(
            f"| {test} | {_fmt(s['median_iter_delta_ci'])} | {_fmt(s['p75_iter_delta_ci'])} | "
            f"{_fmt(s['mean_top5_iter_delta_ci'])} | {_fmt(s['p90_iter_delta_ci'])} |"
        )
    lines.append("")
    lines.append("Wallclock comparison (ms):")
    lines.append("| test | median v1 | median v3 | p75 v1 | p75 v3 | p90 v1 | p90 v3 |")
    lines.append("|---|---|---|---|---|---|---|")
    for test, s in per_test.items():
        lines.append(
            f"| {test} | {_fmt(s['median_wallclock_v1'], 0)} | {_fmt(s['median_wallclock_v3'], 0)} | "
            f"{_fmt(s['p75_wallclock_v1'], 0)} | {_fmt(s['p75_wallclock_v3'], 0)} | "
            f"{_fmt(s['p90_wallclock_v1'], 0)} | {_fmt(s['p90_wallclock_v3'], 0)} |"
        )
    lines.append("")
    lines.append("Pass-count guard:")
    lines.append("| test | passed v1 | passed v3 | Δ |")
    lines.append("|---|---|---|---|")
    for test, s in per_test.items():
        lines.append(
            f"| {test} | {s['passed_v1']}/{s['n_v1']} | {s['passed_v3']}/{s['n_v3']} | "
            f"{s['pass_count_delta']:+d} |"
        )
    lines.append("")
    lines.append("### Retirement criterion")
    if retirement["retire"]:
        lines.append("✔ **Sampler tuning may be retired as a recurring wallclock-variance lever.** All practical-equivalence criteria pass.")
    else:
        lines.append("✘ **Practical-equivalence criteria do NOT all pass.** Sampler tuning cannot be retired on this evidence:")
        for n in retirement["notes"]:
            lines.append(f"- {n}")
    lines.append("")
    lines.append(f"_{retirement['language']}_")
    return "\n".join(lines) + "\n"


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--runtime", type=Path, default=DEFAULT_RUNTIME)
    p.add_argument("--out", type=Path, default=DEFAULT_OUT)
    p.add_argument("--bootstrap", type=int, default=10000)
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    runs = load_runs(args.runtime)
    per_test = per_test_compare(runs, bootstrap_n=args.bootstrap)
    retirement = retirement_check(per_test)

    if args.json:
        json.dump({"per_test": per_test, "retirement": retirement}, sys.stdout, indent=2, default=str)
        sys.stdout.write("\n")
        return 0

    md = render_md(per_test, retirement)
    # Append to the W2 file if it exists so the doc holds both analyses.
    if args.out.exists():
        existing = args.out.read_text(encoding="utf-8")
        args.out.write_text(existing.rstrip() + "\n\n" + md, encoding="utf-8")
    else:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(md, encoding="utf-8")
    print(md)
    print(f"\n→ {args.out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
