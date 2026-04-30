#!/usr/bin/env bash
# 30-claw-code.sh — gate. If user declines, the wizard exits cleanly.

step_30_main() {
  hdr "claw-code (the code stack)"
  if prompt_yn "Install the claw-code stack?" y; then
    state_set CLAW_REQUESTED yes
    ok "proceeding with claw-code install"
    return 0
  fi
  state_set CLAW_REQUESTED no
  skip "claw-code declined — nothing to install"
  printf "\n  done.\n\n"
  exit 0
}
