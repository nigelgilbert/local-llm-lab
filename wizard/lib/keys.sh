#!/usr/bin/env bash
# keys.sh — generate-once-and-reuse LITELLM_MASTER_KEY across .env files.

# Returns the key on stdout. Reads from (in order):
#   1. wizard/.state LITELLM_MASTER_KEY
#   2. existing client/claw-code/.env
#   3. existing host/litellm/.env
#   4. fresh openssl rand -hex 32
# The chosen key is persisted to wizard/.state.
ensure_litellm_key() {
  local key=""
  if state_has LITELLM_MASTER_KEY; then
    key=$(state_get LITELLM_MASTER_KEY)
  fi
  if [ -z "$key" ] && [ -f "${REPO_ROOT}/client/claw-code/.env" ]; then
    key=$(grep -E '^LITELLM_MASTER_KEY=' "${REPO_ROOT}/client/claw-code/.env" 2>/dev/null \
            | tail -n1 | cut -d= -f2- | tr -d '"' | tr -d "'")
  fi
  if [ -z "$key" ] && [ -f "${REPO_ROOT}/host/litellm/.env" ]; then
    key=$(grep -E '^LITELLM_MASTER_KEY=' "${REPO_ROOT}/host/litellm/.env" 2>/dev/null \
            | tail -n1 | cut -d= -f2- | tr -d '"' | tr -d "'")
  fi
  if [ -z "$key" ]; then
    if ! command -v openssl >/dev/null 2>&1; then
      fail "openssl not found — cannot generate LITELLM_MASTER_KEY"
      return 1
    fi
    key="sk-$(openssl rand -hex 32)"
  fi
  state_set LITELLM_MASTER_KEY "$key"
  printf '%s\n' "$key"
}

# render_template SRC DST KEY=VAL [KEY=VAL ...]
# Substitutes ${KEY} occurrences in SRC and writes to DST. Refuses to overwrite.
render_template() {
  local src="$1" dst="$2"; shift 2
  if [ -e "$dst" ]; then
    return 0   # idempotent: never overwrite
  fi
  if [ ! -f "$src" ]; then
    fail "template not found: $src"
    return 1
  fi
  # Bash 5.2 enables `patsub_replacement` by default, which makes `&` in the
  # replacement string mean "the matched text" — that would corrupt any value
  # containing &. Disable it for this scope; on bash 3.2 the shopt doesn't
  # exist, so the call no-ops and `&` is already literal.
  shopt -u patsub_replacement 2>/dev/null || true
  local body
  body=$(cat "$src")
  local kv k v needle
  for kv in "$@"; do
    k="${kv%%=*}"
    v="${kv#*=}"
    needle="\${${k}}"
    body="${body//$needle/$v}"
  done
  mkdir -p "$(dirname "$dst")"
  printf '%s\n' "$body" > "$dst"
  chmod 600 "$dst"
}
