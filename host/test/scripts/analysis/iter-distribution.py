#!/usr/bin/env python3
"""W2 analysis — iteration-count distribution + wallclock decomposition.

Implements the v2 plan (TODO-ITERATION-DISTRIBUTION-TEST.md §"W2 analysis").
Reads the normalized run table and produces:

  1. Per-test (and pooled) descriptive stats: median, IQR, p75, p90, max for
     iter_count and wallclock.
  2. Tail-shape ratios (`p90/median`, `max/median`, top-quartile share).
  3. Censoring counts per cell.
  4. Wallclock decomposition: model_share / non_model_gap_share /
     unaccounted_share. Component models on iter_count + tokens + test fixed
     effects.
  5. Association statistics: Spearman ρ, univariate / multivariate /
     incremental R², partial R².
  6. H1 multi-outcome verdict (supported / not supported / mixed).

Output: a Markdown report at host/llama-server/docs/W2-W3-RESULTS-<date>.md
plus stdout printout. Only stdlib + pure-python implementations — no scipy.

Usage:
  iter-distribution.py [--runtime DIR] [--out PATH]
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import statistics
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Iterable, Optional

DEFAULT_RUNTIME = (
    Path(__file__).resolve().parents[3] / "test" / ".claw-runtime"
)
DEFAULT_OUT = (
    Path(__file__).resolve().parents[3]
    / "llama-server"
    / "docs"
    / f"W2-W3-RESULTS-{date.today().isoformat().replace('-', '')}.md"
)


# --- generic stats helpers ---------------------------------------------------


def _to_floats(values: Iterable, *, allow_none: bool = False) -> list[float]:
    out = []
    for v in values:
        if v is None or v == "":
            if not allow_none:
                continue
            out.append(float("nan"))
            continue
        try:
            out.append(float(v))
        except (TypeError, ValueError):
            continue
    return out


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


def descriptive(values: list[float]) -> dict:
    if not values:
        return {
            "n": 0, "median": None, "mean": None, "iqr": None,
            "p25": None, "p75": None, "p90": None, "max": None, "min": None,
        }
    s = sorted(values)
    p25 = percentile(s, 0.25)
    p75 = percentile(s, 0.75)
    return {
        "n": len(s),
        "median": percentile(s, 0.5),
        "mean": statistics.fmean(s),
        "p25": p25,
        "p75": p75,
        "iqr": (p75 - p25) if (p25 is not None and p75 is not None) else None,
        "p90": percentile(s, 0.9),
        "max": s[-1],
        "min": s[0],
    }


def tail_shape(iter_counts: list[float]) -> dict:
    if not iter_counts:
        return {
            "p90_over_median": None,
            "max_over_median": None,
            "top_quartile_share": None,
        }
    s = sorted(iter_counts)
    med = percentile(s, 0.5)
    p90 = percentile(s, 0.9)
    mx = s[-1]
    total = sum(s)
    if med in (None, 0) or total == 0:
        return {
            "p90_over_median": None,
            "max_over_median": None,
            "top_quartile_share": None,
        }
    cutoff = math.ceil(len(s) * 0.75)
    top = s[cutoff:]
    return {
        "p90_over_median": p90 / med if med else None,
        "max_over_median": mx / med if med else None,
        "top_quartile_share": (sum(top) / total) if total else None,
    }


def spearman_rho(xs: list[float], ys: list[float]) -> Optional[float]:
    if len(xs) != len(ys) or len(xs) < 2:
        return None
    rx = _ranks(xs)
    ry = _ranks(ys)
    return _pearson(rx, ry)


def _pearson(xs: list[float], ys: list[float]) -> Optional[float]:
    if len(xs) != len(ys) or len(xs) < 2:
        return None
    mx = statistics.fmean(xs)
    my = statistics.fmean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx2 = sum((x - mx) ** 2 for x in xs)
    dy2 = sum((y - my) ** 2 for y in ys)
    denom = math.sqrt(dx2 * dy2)
    if denom == 0:
        return None
    return num / denom


def _ranks(values: list[float]) -> list[float]:
    """Average ranks (handles ties by averaging)."""
    n = len(values)
    indexed = sorted(range(n), key=lambda i: values[i])
    ranks = [0.0] * n
    i = 0
    while i < n:
        j = i
        while j + 1 < n and values[indexed[j + 1]] == values[indexed[i]]:
            j += 1
        avg_rank = (i + j) / 2 + 1
        for k in range(i, j + 1):
            ranks[indexed[k]] = avg_rank
        i = j + 1
    return ranks


# --- linear regression (closed-form, OLS, no external deps) -----------------


def _solve_normal(X: list[list[float]], y: list[float]) -> Optional[list[float]]:
    """Solve OLS via the normal equations using Gaussian elimination on
    a small system. Returns coefficient list or None if singular."""
    n = len(y)
    p = len(X[0])
    XtX = [[0.0] * p for _ in range(p)]
    Xty = [0.0] * p
    for i in range(n):
        xi = X[i]
        for a in range(p):
            Xty[a] += xi[a] * y[i]
            for b in range(a, p):
                XtX[a][b] += xi[a] * xi[b]
    for a in range(p):
        for b in range(a + 1, p):
            XtX[b][a] = XtX[a][b]

    M = [row + [Xty[i]] for i, row in enumerate(XtX)]
    for col in range(p):
        pivot = col
        for r in range(col, p):
            if abs(M[r][col]) > abs(M[pivot][col]):
                pivot = r
        if abs(M[pivot][col]) < 1e-12:
            return None
        if pivot != col:
            M[col], M[pivot] = M[pivot], M[col]
        for r in range(p):
            if r == col:
                continue
            factor = M[r][col] / M[col][col]
            for c in range(col, p + 1):
                M[r][c] -= factor * M[col][c]
    return [M[i][p] / M[i][i] for i in range(p)]


def ols_r2(X: list[list[float]], y: list[float]) -> Optional[float]:
    if len(X) < 3 or len(X) != len(y):
        return None
    coefs = _solve_normal(X, y)
    if coefs is None:
        return None
    pred = [sum(c * x for c, x in zip(coefs, row)) for row in X]
    ymean = statistics.fmean(y)
    ss_tot = sum((yi - ymean) ** 2 for yi in y)
    ss_res = sum((yi - pi) ** 2 for yi, pi in zip(y, pred))
    if ss_tot == 0:
        return None
    return 1.0 - ss_res / ss_tot


def add_intercept(rows: list[list[float]]) -> list[list[float]]:
    return [[1.0] + r for r in rows]


# --- W2 analysis -------------------------------------------------------------


def load_runs(runtime: Path) -> list[dict]:
    csv_path = runtime / "iter-distribution-runs.csv"
    if not csv_path.exists():
        print(f"missing run table at {csv_path}; run build-run-table.py first.", file=sys.stderr)
        sys.exit(2)
    with csv_path.open(newline="") as f:
        return list(csv.DictReader(f))


def cell_runs(runs: list[dict]) -> dict[tuple[str, str], list[dict]]:
    cells: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for r in runs:
        key = (r.get("test_id") or "?", r.get("sampler_id") or "?")
        cells[key].append(r)
    return cells


def censoring_counts(runs: list[dict]) -> dict:
    out = {"completed": 0, "timeout": 0, "context_overflow": 0, "harness_error": 0}
    for r in runs:
        ts = (r.get("terminal_status") or "").lower()
        if ts == "done":
            out["completed"] += 1
        elif ts == "timeout":
            out["timeout"] += 1
        elif ts == "context_overflow":
            out["context_overflow"] += 1
        else:
            out["harness_error"] += 1
    return out


def wallclock_decomposition(runs: list[dict]) -> dict:
    rows = []
    for r in runs:
        wallclock = _safe_float(r.get("wallclock_ms"))
        model = _safe_float(r.get("total_model_elapsed_ms")) or 0.0
        gap = _safe_float(r.get("total_non_model_gap_ms")) or 0.0
        if wallclock is None or wallclock <= 0:
            continue
        ms = model / wallclock
        gs = gap / wallclock
        us = max(0.0, 1 - ms - gs)
        rows.append({"model_share": ms, "non_model_gap_share": gs, "unaccounted_share": us})
    if not rows:
        return {"model_share_median": None, "non_model_gap_share_median": None, "unaccounted_share_median": None}
    return {
        "model_share_median": percentile([r["model_share"] for r in rows], 0.5),
        "non_model_gap_share_median": percentile([r["non_model_gap_share"] for r in rows], 0.5),
        "unaccounted_share_median": percentile([r["unaccounted_share"] for r in rows], 0.5),
    }


def _safe_float(v) -> Optional[float]:
    if v is None or v == "":
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def association_stats(runs: list[dict]) -> dict:
    """Computes Spearman ρ and OLS R² for wallclock vs candidate predictors."""
    rows = [
        (
            _safe_float(r.get("wallclock_ms")),
            _safe_float(r.get("iter_count")),
            _safe_float(r.get("total_output_tokens")),
            _safe_float(r.get("total_input_tokens")),
            _safe_float(r.get("max_input_tokens")),
        )
        for r in runs
    ]
    rows = [r for r in rows if all(v is not None for v in r)]
    if len(rows) < 5:
        return {"rho_iter_wallclock": None, "univariate_r2_iter": None,
                "univariate_r2_output_tokens": None, "univariate_r2_input_tokens": None,
                "incremental_r2_iter_over_output_tokens": None,
                "multivariate_r2_iter_plus_output_tokens": None,
                "n": len(rows)}

    wallclock = [r[0] for r in rows]
    iters = [r[1] for r in rows]
    outt = [r[2] for r in rows]
    int_t = [r[3] for r in rows]
    maxt = [r[4] for r in rows]

    rho = spearman_rho(iters, wallclock)
    r2_iter = ols_r2(add_intercept([[v] for v in iters]), wallclock)
    r2_outt = ols_r2(add_intercept([[v] for v in outt]), wallclock)
    r2_intt = ols_r2(add_intercept([[v] for v in int_t]), wallclock)
    r2_full = ols_r2(add_intercept([[a, b] for a, b in zip(outt, iters)]), wallclock)
    incremental = None
    if r2_full is not None and r2_outt is not None:
        incremental = r2_full - r2_outt

    return {
        "rho_iter_wallclock": rho,
        "rho_outt_wallclock": spearman_rho(outt, wallclock),
        "rho_intt_wallclock": spearman_rho(int_t, wallclock),
        "univariate_r2_iter": r2_iter,
        "univariate_r2_output_tokens": r2_outt,
        "univariate_r2_input_tokens": r2_intt,
        "multivariate_r2_iter_plus_output_tokens": r2_full,
        "incremental_r2_iter_over_output_tokens": incremental,
        "n": len(rows),
    }


def h1_verdict(per_test: dict[str, dict]) -> tuple[str, list[str]]:
    """Multi-outcome H1 verdict (supported / not supported / mixed). Each test
    gets its own mini-verdict; if they disagree, the overall is 'mixed'."""
    test_verdicts = {}
    notes = []
    for test, stats in per_test.items():
        ts = stats["tail"]
        ass = stats["assoc"]
        tail_heavy = (
            (ts.get("p90_over_median") is not None and ts["p90_over_median"] >= 2.0)
            or (ts.get("max_over_median") is not None and ts["max_over_median"] >= 3.0)
            or (ts.get("top_quartile_share") is not None and ts["top_quartile_share"] >= 0.40)
        )
        rho = ass.get("rho_iter_wallclock") or 0
        r2 = ass.get("univariate_r2_iter") or 0
        strong_assoc = (rho > 0.6) or (r2 >= 0.6)
        if tail_heavy and strong_assoc:
            test_verdicts[test] = "supported"
        elif (not tail_heavy) and (rho < 0.4 and r2 < 0.4):
            test_verdicts[test] = "not_supported"
        else:
            test_verdicts[test] = "mixed_or_unresolved"

    distinct = set(test_verdicts.values())
    if distinct == {"supported"}:
        overall = "supported"
    elif distinct == {"not_supported"}:
        overall = "not_supported"
    else:
        overall = "mixed_or_unresolved"
    notes.append(f"per-test: {test_verdicts}")
    return overall, notes


# --- output formatting -------------------------------------------------------


def _fmt(v: Optional[float], ndigits: int = 2, na: str = "—") -> str:
    if v is None:
        return na
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return na
    if isinstance(v, float):
        return f"{v:.{ndigits}f}"
    return str(v)


def render_md(report: dict) -> str:
    lines = []
    lines.append(f"# W2 + W3 results — {report['date']}")
    lines.append("")
    lines.append(f"Source: `host/test/.claw-runtime/iter-distribution-runs.csv`")
    lines.append(f"Manifest: `host/test/.claw-runtime/_sweep-manifest.json`")
    lines.append(f"Total runs: {report['n_runs']}")
    lines.append("")
    lines.append("## Censoring (overall)")
    lines.append("| status | count |")
    lines.append("|---|---|")
    for k, v in report["censoring"].items():
        lines.append(f"| {k} | {v} |")
    lines.append("")

    lines.append("## Per-cell descriptive stats (v1-prod arm only — H1 evidence)")
    lines.append("")
    lines.append("Wallclock (ms):")
    lines.append("| test | n | median | p75 | p90 | max | IQR |")
    lines.append("|---|---|---|---|---|---|---|")
    for test, s in report["per_test_v1_prod"].items():
        d = s["wallclock_desc"]
        lines.append(
            f"| {test} | {d['n']} | {_fmt(d['median'], 0)} | {_fmt(d['p75'], 0)} | "
            f"{_fmt(d['p90'], 0)} | {_fmt(d['max'], 0)} | {_fmt(d['iqr'], 0)} |"
        )
    lines.append("")
    lines.append("Iteration count:")
    lines.append("| test | n | median | p75 | p90 | max | IQR |")
    lines.append("|---|---|---|---|---|---|---|")
    for test, s in report["per_test_v1_prod"].items():
        d = s["iter_desc"]
        lines.append(
            f"| {test} | {d['n']} | {_fmt(d['median'], 1)} | {_fmt(d['p75'], 1)} | "
            f"{_fmt(d['p90'], 1)} | {_fmt(d['max'], 0)} | {_fmt(d['iqr'], 1)} |"
        )
    lines.append("")
    lines.append("Tail-shape ratios (iteration count):")
    lines.append("| test | p90/median | max/median | top-quartile share |")
    lines.append("|---|---|---|---|")
    for test, s in report["per_test_v1_prod"].items():
        t = s["tail"]
        lines.append(
            f"| {test} | {_fmt(t['p90_over_median'])} | {_fmt(t['max_over_median'])} | "
            f"{_fmt(t['top_quartile_share'])} |"
        )
    lines.append("")
    lines.append("## Association statistics (v1-prod, per test)")
    lines.append("| test | n | ρ(iter,wallclock) | R²(wall~iter) | R²(wall~out_tok) | R²(wall~iter+out_tok) | ΔR² (iter\\|out_tok) |")
    lines.append("|---|---|---|---|---|---|---|")
    for test, s in report["per_test_v1_prod"].items():
        a = s["assoc"]
        lines.append(
            f"| {test} | {a.get('n')} | {_fmt(a.get('rho_iter_wallclock'), 3)} | "
            f"{_fmt(a.get('univariate_r2_iter'), 3)} | "
            f"{_fmt(a.get('univariate_r2_output_tokens'), 3)} | "
            f"{_fmt(a.get('multivariate_r2_iter_plus_output_tokens'), 3)} | "
            f"{_fmt(a.get('incremental_r2_iter_over_output_tokens'), 3)} |"
        )
    lines.append("")
    lines.append("## Wallclock decomposition (v1-prod)")
    lines.append("| test | model_share (median) | non_model_gap_share (median) | unaccounted_share (median) |")
    lines.append("|---|---|---|---|")
    for test, s in report["per_test_v1_prod"].items():
        d = s["decomp"]
        lines.append(
            f"| {test} | {_fmt(d.get('model_share_median'), 3)} | "
            f"{_fmt(d.get('non_model_gap_share_median'), 3)} | "
            f"{_fmt(d.get('unaccounted_share_median'), 3)} |"
        )
    lines.append("")

    lines.append("## H1 verdict")
    lines.append(f"**{report['h1_verdict']}**")
    for note in report["h1_notes"]:
        lines.append(f"- {note}")
    lines.append("")
    lines.append("Decision rule:")
    lines.append("- **supported:** every test shows tail-heavy distribution AND strong iter-count association.")
    lines.append("- **not_supported:** every test is tight on tail ratios AND iter-count association is weak.")
    lines.append("- **mixed_or_unresolved:** otherwise; proceed to W4 trace inspection per the v2 plan.")
    return "\n".join(lines) + "\n"


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--runtime", type=Path, default=DEFAULT_RUNTIME)
    p.add_argument("--out", type=Path, default=DEFAULT_OUT)
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    runs = load_runs(args.runtime)
    censoring_all = censoring_counts(runs)

    cells = cell_runs(runs)
    per_test_v1: dict[str, dict] = {}
    for (test, sampler), rs in cells.items():
        if sampler != "v1-prod":
            continue
        # Drop censored runs from the regression / shape stats; keep counts.
        non_censored = [
            r for r in rs
            if r.get("censored") not in ("True", "true", True, "1", 1)
            and (r.get("terminal_status") or "").lower() == "done"
        ]
        wallclock = _to_floats([r["wallclock_ms"] for r in non_censored])
        iters = _to_floats([r["iter_count"] for r in non_censored])
        per_test_v1[test] = {
            "wallclock_desc": descriptive(wallclock),
            "iter_desc": descriptive(iters),
            "tail": tail_shape(iters),
            "decomp": wallclock_decomposition(non_censored),
            "assoc": association_stats(non_censored),
            "censoring_in_cell": censoring_counts(rs),
        }

    h1, h1_notes = h1_verdict(per_test_v1)

    report = {
        "date": date.today().isoformat(),
        "n_runs": len(runs),
        "censoring": censoring_all,
        "per_test_v1_prod": per_test_v1,
        "h1_verdict": h1,
        "h1_notes": h1_notes,
    }

    if args.json:
        json.dump(report, sys.stdout, indent=2, default=str)
        sys.stdout.write("\n")
        return 0

    md = render_md(report)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(md, encoding="utf-8")
    print(md)
    print(f"\n→ wrote {args.out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
