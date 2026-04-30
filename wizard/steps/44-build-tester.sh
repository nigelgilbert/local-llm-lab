#!/usr/bin/env bash
# 44-build-tester.sh — build the tester orb image early so subsequent
# steps can verify themselves through it. Verifies docker via probe.

step_44_is_done() {
  docker image inspect wizard-tester:local >/dev/null 2>&1
}

step_44_main() {
  hdr "tester orb (wizard-tester:local)"
  if step_44_is_done; then
    skip "wizard-tester:local image exists"
  else
    act "building wizard-tester:local"
    ( cd "${WIZARD_ROOT}/tester" && docker compose build ) \
      || { fail "tester orb build failed"; return 1; }
    ok "wizard-tester:local built"
  fi
  act "smoke: docker daemon reachable from inside the orb"
  if probe_docker; then
    ok "tester orb is alive"
  else
    fail "tester orb couldn't reach docker"
    return 1
  fi
}
