# W2-W4 iter-distribution + sampler-arm analysis (attic)

Era: Sprint W1-W4 (~April 2026). Drivers + analysis for the iteration-distribution pilot
and the sampler-arm comparison work that informed the H1 verdict and the
practical-equivalence retirement criterion.

## Why archived

Superseded by registry-direct analysis from Sprint 1.5 onwards (run rows are emitted
straight to `.claw-runtime/run_registry.*.csv` and analyzed with task-specific
ad-hoc scripts). See `host/test/docs/base/TIER-EVAL-V2-SPRINT-PLAN.md` row 1.5+.

## What's preserved

The Python files contain hand-rolled stdlib-only statistical machinery:

- Hodges-Lehmann shift estimate
- Bootstrap 95% CIs (B=10000)
- Cliff's delta
- Mann-Whitney U (normal-approx z + p)
- Spearman rho + OLS R^2 (univariate, multivariate, incremental)
- Decision rules: practical-equivalence retirement criterion; H1 multi-outcome verdict

A cleaned-up reference with formulas + thresholds + provenance lives at
`host/test/docs/base/W2-W4-ANALYSIS-METHODS-LIBRARY.md`. Read that first; only crack
open the `.py` files here for the exact implementation.

## Do not run

Input paths and harness assumptions (run-table CSV layout, `.claw-runtime/` shape, etc.)
have drifted since W4. These files are reference material, not executable. The shell
scripts' internal cross-reference (`$SCRIPT_DIR/build-run-table.py`) was updated at
move time so the path read consistently across the attic, but the upstream data they
depend on is no longer produced in the same form.
