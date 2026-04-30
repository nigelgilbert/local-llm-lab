#!/usr/bin/env bash
# 20-chat.sh — chat sub-wizard placeholder.
# y/n: if yes, print "under construction" and skip. If no, skip silently.

step_20_main() {
  hdr "Chat sub-wizard"
  if prompt_yn "Install the chat stack (Open WebUI + Ollama profiles)?" n; then
    warn "🚧 chat sub-wizard is under construction — skipping for now."
    info "today: \`docker compose up -d\` in host/ + manual OWUI signup."
    info "see host/README.md for the current manual steps."
    state_set CHAT_REQUESTED yes
  else
    state_set CHAT_REQUESTED no
    skip "chat sub-wizard skipped (declined)"
  fi
}
