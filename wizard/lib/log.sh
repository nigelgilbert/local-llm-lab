#!/usr/bin/env bash
# log.sh — tee the wizard's stdout+stderr to wizard/.logs/install-<ts>.log.

log_init() {
  local logdir="${WIZARD_ROOT:-.}/.logs"
  mkdir -p "$logdir"
  WIZARD_LOG_FILE="$logdir/install-$(date +%Y%m%d-%H%M%S).log"
  export WIZARD_LOG_FILE
}

log_path() {
  printf '%s\n' "${WIZARD_LOG_FILE:-}"
}
