#!/usr/bin/env bash
# 46-model-fetch.sh — full-local only. Download the GGUF for the chosen tier
# into ~/.ollama/gguf/. Resumable via curl -C -. Idempotent: skips if file
# exists with sane size.

step_46_resolve() {
  # Loads TIER_<N>_{GGUF,URL,MIN_BYTES} from wizard/models.urls into the
  # shell, then sets TARGET_GGUF / TARGET_URL / TARGET_MIN for the chosen tier.
  local tier="$1"
  # shellcheck disable=SC1090
  source "${WIZARD_ROOT}/models.urls"
  eval "TARGET_GGUF=\"\${TIER_${tier}_GGUF}\""
  eval "TARGET_URL=\"\${TIER_${tier}_URL}\""
  eval "TARGET_MIN=\"\${TIER_${tier}_MIN_BYTES}\""
  # Expand $HOME inside the loaded value.
  TARGET_GGUF=$(eval "printf '%s' \"$TARGET_GGUF\"")
}

step_46_is_done() {
  local tier="$1"
  step_46_resolve "$tier"
  [ -f "$TARGET_GGUF" ] || return 1
  local sz
  sz=$(stat -f%z "$TARGET_GGUF" 2>/dev/null || echo 0)
  [ "$sz" -ge "$TARGET_MIN" ] 2>/dev/null
}

step_46_main() {
  hdr "Model GGUF (tier $(state_get TIER))"
  if [ "$(state_get TOPOLOGY)" = "client-only" ]; then
    skip "client-only topology — model lives on the host"
    return 0
  fi
  local tier
  tier=$(state_get TIER)
  step_46_resolve "$tier"
  if step_46_is_done "$tier"; then
    skip "GGUF present at ${TARGET_GGUF}"
    return 0
  fi
  mkdir -p "$(dirname "$TARGET_GGUF")"
  act "downloading $(basename "$TARGET_GGUF") (resumable)"
  info "from: ${TARGET_URL}"
  info "this is a multi-GB file; coffee break recommended"
  if ! curl --fail --location --continue-at - \
            --output "$TARGET_GGUF" "$TARGET_URL"; then
    fail "model download failed (resume with: ./wizard/wizard install)"
    return 1
  fi
  if step_46_is_done "$tier"; then
    ok "model present: $(basename "$TARGET_GGUF")"
  else
    fail "download finished but file size is unexpectedly small"
    return 1
  fi
}
