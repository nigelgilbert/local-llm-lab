#!/usr/bin/env bash
# 00-banner.sh — welcome banner. Always runs. Read-only.

step_00_main() {
  banner
  printf '  This wizard installs the \033[1mcode stack\033[0m for mac-llm-lab.\n'
  printf '  Strict idempotency: anything already in place is skipped, not redone.\n'
  printf '  Press \033[2mCtrl-C\033[0m at any time to abort cleanly.\n\n'
}
