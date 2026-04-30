#!/usr/bin/env bash
# detect.sh — host fingerprinting: tier, arch, sane topology default.

# Echoes one of: 16, 32, 64. Falls back to 16 on parse failure.
detect_tier() {
  local bytes gb
  bytes=$(sysctl -n hw.memsize 2>/dev/null || echo 0)
  if [ "$bytes" -le 0 ] 2>/dev/null; then
    printf '16\n'; return 0
  fi
  gb=$(( bytes / 1024 / 1024 / 1024 ))
  if [ "$gb" -ge 56 ]; then
    printf '64\n'
  elif [ "$gb" -ge 28 ]; then
    printf '32\n'
  else
    printf '16\n'
  fi
}

detect_arch() {
  uname -m 2>/dev/null || printf 'unknown\n'
}

# detect_topology_default — full-local if we look like the host (mac-llm-lab),
# else client-only.
detect_topology_default() {
  local h
  h=$(scutil --get LocalHostName 2>/dev/null || hostname -s 2>/dev/null || printf '')
  case "$h" in
    mac-llm-lab|mac-llm-lab.*) printf 'full-local\n' ;;
    *) printf 'client-only\n' ;;
  esac
}
