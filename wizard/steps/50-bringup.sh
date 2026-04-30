#!/usr/bin/env bash
# 50-bringup.sh — `docker compose up -d` for litellm + claw-code, idempotent.
# Skips per-service if already running (does NOT recreate). After bridge is
# up, runs probe_bridge to verify reachability from inside the tester orb.

step_50_running() {
  local name="$1"
  [ "$(docker inspect --format '{{.State.Running}}' "$name" 2>/dev/null)" = "true" ]
}

step_50_main() {
  hdr "Bring-up"
  local topo
  topo=$(state_get TOPOLOGY)

  # LiteLLM bridge — full-local only.
  if [ "$topo" = "full-local" ]; then
    if step_50_running mac-llm-lab-litellm; then
      skip "mac-llm-lab-litellm already running"
    else
      act "starting mac-llm-lab-litellm"
      ( cd "${REPO_ROOT}/host/litellm" && docker compose up -d ) \
        || { fail "litellm compose up failed"; return 1; }
      ok "mac-llm-lab-litellm started"
    fi
    act "verifying bridge from inside tester orb"
    if probe_bridge; then
      ok "bridge reachable from container network"
    else
      warn "bridge built but not reachable from inside a container — check Docker networking"
    fi
  fi

  # claw-code container — both topologies.
  if step_50_running claw-code; then
    skip "claw-code already running"
  else
    act "starting claw-code"
    ( cd "${REPO_ROOT}/client/claw-code" && docker compose up -d ) \
      || { fail "claw-code compose up failed"; return 1; }
    ok "claw-code started"
  fi
}
