#!/bin/sh
# Entry shim: write claw's alias table from the BACKEND env, then exec the
# real command.
#
# Why: claw has TWO model knobs — the main loop honors --model, but the
# built-in Agent subagent tool spawns with a hardcoded default
# (claude-opus-4-6, see ultraworkers/claw-code rust/crates/tools/src/lib.rs).
# In production those default IDs land on the bridge's `*` wildcard route,
# which is fine when memory permits. Under test they trip the
# 1-model-resident invariant.
#
# claw's USAGE.md documents an alias table at ~/.claw/settings.json that
# rewrites model names *before* request dispatch. We point every built-in
# alias and bare claude-* id at the same anthropic/claw-<backend> route the
# main loop is using, so all traffic exits via one bridge route.
#
# TEST_SUITE scoping: when TEST_SUITE is set, override $@ to run only that
# subdirectory so run-backend-ab.sh and run-model-ab.sh each fire their own
# tests. Unset (or "all") runs everything under __tests__/.
#
# TIER_EVAL_FILTER: when TEST_SUITE=tier-eval and this is a non-empty space-
# separated list of test_id stems (e.g. "wordy alphametics forth"), restrict
# the run to those files only. Used by Sprint 1.21 explore-cycle.sh for
# scoped pilot sweeps.

set -eu

case "${BACKEND:-llama-server}" in
  llama-server) target="anthropic/claw-llama"  ;;
  ollama)       target="anthropic/claw-ollama" ;;
  *) echo "entrypoint: unknown BACKEND=$BACKEND" >&2; exit 1 ;;
esac

mkdir -p /root/.claw
cat >/root/.claw/settings.json <<EOF
{
  "aliases": {
    "opus":   "$target",
    "sonnet": "$target",
    "haiku":  "$target",
    "claude-opus-4-6":            "$target",
    "claude-sonnet-4-6":          "$target",
    "claude-haiku-4-5-20251213":  "$target"
  }
}
EOF

# Scope to a test subdirectory when TEST_SUITE is set. The glob expands
# inside the container where the files exist.
case "${TEST_SUITE:-}" in
  backend-ab)   set -- node --test --test-concurrency=1 --test-reporter=spec __tests__/backend-ab/*.test.js ;;
  model-ab)     set -- node --test --test-concurrency=1 --test-reporter=spec __tests__/model-ab/*.test.js ;;
  settings-ab)  set -- node --test --test-concurrency=1 --test-reporter=spec __tests__/settings-ab/*.test.js ;;
  tier-eval)
    if [ -n "${TIER_EVAL_FILTER:-}" ]; then
      files=""
      for stem in $TIER_EVAL_FILTER; do
        files="$files __tests__/tier-eval/${stem}.test.js"
      done
      # shellcheck disable=SC2086
      set -- node --test --test-concurrency=1 --test-reporter=spec $files
    else
      set -- node --test --test-concurrency=1 --test-reporter=spec __tests__/tier-eval/*.test.js
    fi
    ;;
  *)            : ;;
esac

exec "$@"
