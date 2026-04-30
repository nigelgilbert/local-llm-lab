#!/usr/bin/env bash
# 40-dep-xcode.sh — Xcode Command Line Tools.
# Idempotent: skip if `xcode-select -p` already returns a path.
# `xcode-select --install` opens a GUI prompt; we poll until the user clicks
# Install (5-min timeout).

step_40_is_done() {
  xcode-select -p >/dev/null 2>&1
}

step_40_main() {
  hdr "Xcode Command Line Tools"
  if step_40_is_done; then
    skip "Xcode CLT present at $(xcode-select -p 2>/dev/null)"
    return 0
  fi
  act "triggering Xcode CLT install — a GUI popup will appear"
  xcode-select --install >/dev/null 2>&1 || true
  info "click 'Install' in the popup. Waiting up to 5 minutes..."
  local i
  for i in $(seq 1 60); do
    if step_40_is_done; then
      ok "Xcode CLT installed"
      return 0
    fi
    sleep 5
  done
  fail "Xcode CLT not installed after 5 minutes — re-run when ready"
  return 1
}
