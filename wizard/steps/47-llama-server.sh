#!/usr/bin/env bash
# 47-llama-server.sh — full-local only. Wrap host/llama-server/scripts/install.
#
# CRITICAL: the existing install script does `launchctl bootout` unconditionally,
# which interrupts a running service (and therefore an active eval). We refuse
# to invoke it if the service is already loaded AND healthy — strict idempotency
# is what makes this safe to run on the M5 mid-eval.

LLAMA_LABEL="com.mac-llm-lab.llama-server"

step_47_loaded() {
  launchctl print "gui/$(id -u)/${LLAMA_LABEL}" >/dev/null 2>&1 \
    || launchctl list 2>/dev/null | grep -q "${LLAMA_LABEL}\$"
}

step_47_healthy() {
  curl -fsS --max-time 3 http://127.0.0.1:11435/health >/dev/null 2>&1
}

step_47_is_done() {
  step_47_loaded && step_47_healthy
}

step_47_main() {
  hdr "llama-server (launchd: ${LLAMA_LABEL})"
  if [ "$(state_get TOPOLOGY)" = "client-only" ]; then
    skip "client-only topology — llama-server lives on the host"
    return 0
  fi
  if step_47_is_done; then
    skip "llama-server already loaded and healthy on :11435"
    info "refusing to call \`launchctl bootout\` on a running service"
    return 0
  fi
  if step_47_loaded && ! step_47_healthy; then
    warn "service loaded but :11435/health not responding"
    info "this may be a model that's still loading; not touching it"
    info "wait 60s and re-run the wizard if the issue persists"
    return 0
  fi
  local tier
  tier=$(state_get TIER)
  act "invoking host/llama-server/scripts/install --size ${tier}"
  ( cd "${REPO_ROOT}/host/llama-server" && LLAMA_TIER="$tier" ./scripts/install --size "$tier" ) \
    || { fail "llama-server install failed"; return 1; }
  info "waiting up to 60s for service to come up..."
  local i
  for i in $(seq 1 30); do
    if step_47_healthy; then ok "llama-server healthy on :11435"; return 0; fi
    sleep 2
  done
  warn "service installed but health probe didn't pass in 60s"
  info "the model may still be loading (~10–20s typical); continuing"
}
