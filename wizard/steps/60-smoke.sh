#!/usr/bin/env bash
# 60-smoke.sh — full-stack pass via tester orb /v1/models probe.

step_60_main() {
  hdr "Final smoke test"
  if probe_models; then
    ok "stack is alive — /v1/models returned models via the bridge"
  else
    fail "smoke test failed — see output above"
    info "run './wizard/wizard doctor' for a state dump"
    return 1
  fi
}
