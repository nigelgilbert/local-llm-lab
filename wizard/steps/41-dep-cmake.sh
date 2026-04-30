#!/usr/bin/env bash
# 41-dep-cmake.sh — install cmake from the official Kitware signed .dmg.
# Pin a known-good version. Symlink CLI tools into ~/.local/bin.

CMAKE_VERSION="3.30.5"
CMAKE_DMG_URL="https://cmake.org/files/v${CMAKE_VERSION%.*}/cmake-${CMAKE_VERSION}-macos-universal.dmg"

step_41_is_done() {
  command -v cmake >/dev/null 2>&1 \
    && cmake --version 2>/dev/null \
       | awk '/^cmake version/ { split($3,a,"."); exit !((a[1]>=3) && ((a[1]>3) || (a[2]>=22))) }'
}

step_41_main() {
  hdr "cmake (≥ 3.22)"
  if step_41_is_done; then
    skip "cmake $(cmake --version | head -n1 | awk '{print $3}') present"
    return 0
  fi
  ensure_local_bin
  act "downloading cmake ${CMAKE_VERSION} from kitware..."
  if ! hdiutil_install_app "$CMAKE_DMG_URL" "CMake.app"; then
    fail "cmake install failed"
    return 1
  fi
  # Symlink the CLI tools out of the .app bundle.
  local cmake_bin="/Applications/CMake.app/Contents/bin"
  local t
  for t in cmake ctest cpack ccmake cmake-gui; do
    if [ -x "${cmake_bin}/${t}" ]; then
      ln -sf "${cmake_bin}/${t}" "${LOCAL_PREFIX}/bin/${t}"
    fi
  done
  if step_41_is_done; then
    ok "cmake installed at /Applications/CMake.app, symlinked into ~/.local/bin"
  else
    fail "cmake not detected after install — check ~/.local/bin is on PATH"
    return 1
  fi
}
