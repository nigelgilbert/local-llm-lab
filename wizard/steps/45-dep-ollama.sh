#!/usr/bin/env bash
# 45-dep-ollama.sh — full-local only. Install Ollama from the official
# macOS .zip (NOT install.sh, which is Linux-only). Symlink CLI into ~/.local/bin.

OLLAMA_ZIP_URL="https://ollama.com/download/Ollama-darwin.zip"

step_45_is_done() {
  command -v ollama >/dev/null 2>&1 \
    && curl -fsS --max-time 3 http://127.0.0.1:11434/api/tags >/dev/null 2>&1
}

step_45_main() {
  hdr "Ollama (host)"
  if [ "$(state_get TOPOLOGY)" = "client-only" ]; then
    skip "client-only topology — Ollama lives on the host"
    return 0
  fi
  if step_45_is_done; then
    skip "ollama daemon up at 127.0.0.1:11434"
    return 0
  fi
  ensure_local_bin
  if [ ! -d "/Applications/Ollama.app" ]; then
    act "downloading Ollama-darwin.zip from ollama.com"
    if ! unzip_install_app "$OLLAMA_ZIP_URL" "Ollama.app"; then
      fail "Ollama install failed"
      return 1
    fi
  else
    act "Ollama.app present in /Applications"
  fi
  # Symlink the CLI tool. Ollama.app exposes the CLI at Contents/Resources/ollama.
  local ollama_cli=""
  for cand in \
    "/Applications/Ollama.app/Contents/Resources/ollama" \
    "/Applications/Ollama.app/Contents/MacOS/ollama"; do
    [ -x "$cand" ] && ollama_cli="$cand" && break
  done
  if [ -n "$ollama_cli" ]; then
    ln -sf "$ollama_cli" "${LOCAL_PREFIX}/bin/ollama"
  fi
  act "starting Ollama.app"
  open -a Ollama || true
  info "waiting up to 30s for daemon..."
  local i
  for i in $(seq 1 15); do
    if step_45_is_done; then ok "ollama daemon up"; return 0; fi
    sleep 2
  done
  fail "Ollama installed but daemon didn't come up — start it manually and re-run"
  return 1
}
