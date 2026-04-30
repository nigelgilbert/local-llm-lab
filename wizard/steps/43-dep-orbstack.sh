#!/usr/bin/env bash
# 43-dep-orbstack.sh — install OrbStack if no Docker daemon is reachable.
# Idempotent: any working `docker info` counts (Docker Desktop is fine too).

ORBSTACK_INSTALL_URL="https://orbstack.dev/install.sh"

step_43_is_done() {
  command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1
}

step_43_main() {
  hdr "OrbStack / Docker"
  if step_43_is_done; then
    local v
    v=$(docker version --format '{{.Server.Version}}' 2>/dev/null || printf '?')
    skip "docker daemon reachable (server ${v})"
    return 0
  fi
  if [ -d "/Applications/OrbStack.app" ]; then
    act "OrbStack present but daemon not up — opening OrbStack.app"
    open -a OrbStack || true
    info "waiting up to 60s for daemon..."
    local i
    for i in $(seq 1 30); do
      if step_43_is_done; then ok "OrbStack daemon up"; return 0; fi
      sleep 2
    done
    fail "OrbStack didn't come up — start it manually and re-run"
    return 1
  fi
  act "installing OrbStack via official install.sh (you may be prompted for sudo)"
  if ! curl -fsSL "$ORBSTACK_INSTALL_URL" | sh; then
    fail "OrbStack install failed"
    return 1
  fi
  open -a OrbStack || true
  info "first-launch may need a GUI accept. Waiting up to 60s..."
  local i
  for i in $(seq 1 30); do
    if step_43_is_done; then
      ok "OrbStack installed and daemon reachable"
      return 0
    fi
    sleep 2
  done
  fail "OrbStack installed but daemon didn't come up — accept any popups and re-run"
  return 1
}
