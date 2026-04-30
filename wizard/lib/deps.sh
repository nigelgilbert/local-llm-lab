#!/usr/bin/env bash
# deps.sh — shared install helpers. curl-only; no Homebrew.

LOCAL_PREFIX="${HOME}/.local"

ensure_local_bin() {
  mkdir -p "${LOCAL_PREFIX}/bin"
  case ":$PATH:" in
    *":${LOCAL_PREFIX}/bin:"*) ;;
    *) export PATH="${LOCAL_PREFIX}/bin:${PATH}" ;;
  esac
}

# curl_to FILE URL — resumable, fails on HTTP error.
curl_to() {
  local file="$1" url="$2"
  mkdir -p "$(dirname "$file")"
  curl --fail --location --continue-at - --silent --show-error \
       --output "$file" "$url"
}

# hdiutil_install_app DMG_URL APP_NAME -> attaches DMG, copies APP_NAME from
# /Volumes/<vol>/<APP_NAME> to /Applications, detaches. Idempotent: if the app
# is already in /Applications, no-op.
hdiutil_install_app() {
  local url="$1" app="$2"
  if [ -d "/Applications/${app}" ]; then
    return 0
  fi
  local tmp
  tmp=$(mktemp -d)
  local dmg="${tmp}/install.dmg"
  curl_to "$dmg" "$url" || { rm -rf "$tmp"; return 1; }
  local mount_out vol
  mount_out=$(hdiutil attach -nobrowse -readonly "$dmg" 2>&1)
  vol=$(printf '%s' "$mount_out" | awk -F'\t' '/\/Volumes\// {print $NF; exit}')
  if [ -z "$vol" ] || [ ! -d "$vol" ]; then
    rm -rf "$tmp"
    return 1
  fi
  if [ -d "${vol}/${app}" ]; then
    cp -R "${vol}/${app}" /Applications/ 2>/dev/null \
      || sudo cp -R "${vol}/${app}" /Applications/
  fi
  hdiutil detach -quiet "$vol" >/dev/null 2>&1 || true
  rm -rf "$tmp"
  [ -d "/Applications/${app}" ]
}

# unzip_install_app ZIP_URL APP_NAME — same idea, but for zip distros (Ollama).
unzip_install_app() {
  local url="$1" app="$2"
  if [ -d "/Applications/${app}" ]; then
    return 0
  fi
  if ! command -v unzip >/dev/null 2>&1; then
    fail "unzip not found — required to install ${app}"
    return 1
  fi
  local tmp
  tmp=$(mktemp -d)
  local zipf="${tmp}/install.zip"
  curl_to "$zipf" "$url" || { rm -rf "$tmp"; return 1; }
  ( cd "$tmp" && unzip -q "$zipf" ) || { rm -rf "$tmp"; return 1; }
  if [ -d "${tmp}/${app}" ]; then
    cp -R "${tmp}/${app}" /Applications/ 2>/dev/null \
      || sudo cp -R "${tmp}/${app}" /Applications/
  fi
  rm -rf "$tmp"
  [ -d "/Applications/${app}" ]
}
