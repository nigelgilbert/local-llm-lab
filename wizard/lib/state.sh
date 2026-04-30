#!/usr/bin/env bash
# state.sh — flat KEY=VAL state file at wizard/.state. Source-only.

WIZARD_STATE_FILE="${WIZARD_STATE_FILE:-${WIZARD_ROOT:-.}/.state}"

state_get() {
  local key="$1"
  [ -f "$WIZARD_STATE_FILE" ] || return 1
  local line
  line=$(grep "^${key}=" "$WIZARD_STATE_FILE" 2>/dev/null | tail -n1)
  [ -z "$line" ] && return 1
  printf '%s\n' "${line#${key}=}"
}

state_set() {
  local key="$1" val="$2"
  mkdir -p "$(dirname "$WIZARD_STATE_FILE")"
  touch "$WIZARD_STATE_FILE"
  # Strip prior entries for the key, then append.
  local tmp
  tmp=$(mktemp)
  grep -v "^${key}=" "$WIZARD_STATE_FILE" > "$tmp" 2>/dev/null || true
  printf '%s=%s\n' "$key" "$val" >> "$tmp"
  mv "$tmp" "$WIZARD_STATE_FILE"
}

state_has() {
  state_get "$1" >/dev/null 2>&1
}
