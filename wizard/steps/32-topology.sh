#!/usr/bin/env bash
# 32-topology.sh — full-local vs client-only. In client-only we ask for the
# host address (default mac-llm-lab.local) and probe the bridge.

step_32_main() {
  hdr "Topology"
  local default
  default=$(detect_topology_default)
  info "default: ${default}"
  SLIDER_DEFAULT="$default"
  local picked
  picked=$(slider_pick "Topology" "full-local" "client-only")
  state_set TOPOLOGY "$picked"

  case "$picked" in
    full-local)
      ok "topology: full-local (host + client on this Mac)"
      state_set BRIDGE_HOST host.docker.internal
      state_set BRIDGE_PORT 4000
      ;;
    client-only)
      ok "topology: client-only (LAN host)"
      local host
      host=$(prompt_str "Bridge host" "mac-llm-lab.local")
      state_set BRIDGE_HOST "$host"
      state_set BRIDGE_PORT 4000
      info "probing http://${host}:4000/health/liveliness ..."
      if curl -fsS --max-time 4 "http://${host}:4000/health/liveliness" >/dev/null 2>&1; then
        ok "bridge reachable at ${host}:4000"
      else
        warn "bridge not reachable yet at ${host}:4000 — install will continue."
        info "if the host is the M5, check it's powered on and on the LAN."
      fi
      ;;
  esac
}
