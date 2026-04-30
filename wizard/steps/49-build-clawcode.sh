#!/usr/bin/env bash
# 49-build-clawcode.sh — generate client/claw-code/.env and build the image.
# Runs in both topologies.

step_49_is_done() {
  [ -f "${REPO_ROOT}/client/claw-code/.env" ] \
    && docker image inspect claw-code:local >/dev/null 2>&1
}

step_49_main() {
  hdr "claw-code (client)"
  local key bridge_host bridge_port workspace
  key=$(ensure_litellm_key) || return 1
  bridge_host=$(state_get BRIDGE_HOST 2>/dev/null || printf 'mac-llm-lab.local')
  bridge_port=$(state_get BRIDGE_PORT 2>/dev/null || printf '4000')

  if [ ! -f "${REPO_ROOT}/client/claw-code/.env" ]; then
    workspace=$(prompt_str "Path to bind-mount as /workspace inside claw-code" "${HOME}/Desktop/code")
    if [ ! -d "$workspace" ]; then
      warn "workspace path doesn't exist yet: $workspace"
      info "creating it"
      mkdir -p "$workspace"
    fi
    state_set WORKSPACE "$workspace"
    act "writing client/claw-code/.env"
    render_template \
      "${WIZARD_ROOT}/templates/claw-code.env.template" \
      "${REPO_ROOT}/client/claw-code/.env" \
      "WORKSPACE=${workspace}" \
      "BRIDGE_HOST=${bridge_host}" \
      "BRIDGE_PORT=${bridge_port}" \
      "LITELLM_MASTER_KEY=${key}" \
      || { fail "could not render claw-code .env"; return 1; }
    ok "client/claw-code/.env written"
  else
    skip "client/claw-code/.env exists — leaving as-is"
  fi

  if docker image inspect claw-code:local >/dev/null 2>&1; then
    skip "claw-code:local image exists"
  else
    act "building claw-code:local"
    ( cd "${REPO_ROOT}/client/claw-code" && docker compose build ) \
      || { fail "claw-code compose build failed"; return 1; }
    ok "claw-code:local built"
  fi
}
