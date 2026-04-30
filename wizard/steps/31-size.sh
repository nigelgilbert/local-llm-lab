#!/usr/bin/env bash
# 31-size.sh — memory tier slider. Only meaningful in full-local topology;
# in client-only mode the tier of the remote host is whatever it is. We
# still record an "expected" tier here for informational purposes.

step_31_main() {
  hdr "Memory tier"
  local detected
  detected=$(detect_tier)
  info "detected: $(sysctl -n hw.memsize 2>/dev/null | awk '{printf "%.0f GB\n", $1/1024/1024/1024}') → tier ${detected}"
  SLIDER_DEFAULT="$detected"
  local picked
  picked=$(slider_pick "Pick a tier" 16 32 64)
  state_set TIER "$picked"
  ok "tier: ${picked}"
  case "$picked" in
    16) info "model: Qwen2.5-7B-Instruct Q5_K_M (~5.07 GB)" ;;
    32) info "model: Qwen3-14B Q4_K_M (~8.4 GB)" ;;
    64) info "model: Qwen3.6-35B-A3B UD-Q4_K_XL (~21 GB)" ;;
  esac
}
