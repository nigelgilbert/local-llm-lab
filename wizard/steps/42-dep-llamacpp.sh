#!/usr/bin/env bash
# 42-dep-llamacpp.sh — git clone + cmake build llama.cpp with Metal.
# Lives in ~/.local/share/mac-llm-lab/llama.cpp; symlink llama-server into
# ~/.local/bin so host/llama-server/scripts/install can find it.

LLAMA_DIR="${HOME}/.local/share/mac-llm-lab/llama.cpp"
LLAMA_BIN="${LOCAL_PREFIX}/bin/llama-server"

step_42_is_done() {
  [ -x "$LLAMA_BIN" ] && "$LLAMA_BIN" --version >/dev/null 2>&1
}

step_42_main() {
  hdr "llama.cpp (Metal build)"
  if step_42_is_done; then
    skip "llama-server present at $LLAMA_BIN"
    return 0
  fi
  ensure_local_bin
  if [ ! -d "$LLAMA_DIR/.git" ]; then
    act "cloning llama.cpp into ${LLAMA_DIR}"
    mkdir -p "$(dirname "$LLAMA_DIR")"
    git clone --depth 1 https://github.com/ggerganov/llama.cpp "$LLAMA_DIR" \
      || { fail "git clone failed"; return 1; }
  else
    act "llama.cpp clone present at ${LLAMA_DIR}"
  fi
  act "configuring (cmake -B build -DGGML_METAL=ON)"
  ( cd "$LLAMA_DIR" && cmake -B build -DGGML_METAL=ON -DLLAMA_CURL=OFF >/dev/null ) \
    || { fail "cmake configure failed"; return 1; }
  act "building (cmake --build build -j) — this can take a few minutes"
  ( cd "$LLAMA_DIR" && cmake --build build --config Release -j ) \
    || { fail "cmake build failed"; return 1; }
  if [ ! -x "${LLAMA_DIR}/build/bin/llama-server" ]; then
    fail "build succeeded but ${LLAMA_DIR}/build/bin/llama-server missing"
    return 1
  fi
  ln -sf "${LLAMA_DIR}/build/bin/llama-server" "$LLAMA_BIN"
  if step_42_is_done; then
    ok "llama-server built and linked"
  else
    fail "llama-server not runnable after build"
    return 1
  fi
}
