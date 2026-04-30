#!/usr/bin/env bash
# 48-build-litellm.sh — full-local only. Generate host/litellm/.env and
# `docker compose build` (which also pulls the upstream image).

step_48_is_done() {
  [ -f "${REPO_ROOT}/host/litellm/.env" ] \
    && docker image inspect ghcr.io/berriai/litellm:main-stable >/dev/null 2>&1
}

step_48_main() {
  hdr "LiteLLM bridge (host)"
  if [ "$(state_get TOPOLOGY)" = "client-only" ]; then
    skip "client-only topology — bridge lives on the host"
    return 0
  fi
  local key
  key=$(ensure_litellm_key) || return 1
  if [ ! -f "${REPO_ROOT}/host/litellm/.env" ]; then
    act "writing host/litellm/.env"
    render_template \
      "${WIZARD_ROOT}/templates/litellm.env.template" \
      "${REPO_ROOT}/host/litellm/.env" \
      "LITELLM_MASTER_KEY=${key}" \
      || { fail "could not render litellm .env"; return 1; }
    ok "host/litellm/.env written"
  else
    skip "host/litellm/.env exists — leaving as-is"
  fi
  if docker image inspect ghcr.io/berriai/litellm:main-stable >/dev/null 2>&1; then
    skip "litellm image already pulled"
  else
    act "pulling/building LiteLLM image (compose build)"
    ( cd "${REPO_ROOT}/host/litellm" && docker compose build ) \
      || { fail "litellm compose build failed"; return 1; }
    ok "litellm image ready"
  fi
}
