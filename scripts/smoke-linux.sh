#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
version="$(node -p "require('./package.json').version")"
packages="$PWD/src-tauri/target/release/linux-packages"
deb="$packages/RackTop_${version}_linux-amd64.deb"
appimage="$packages/RackTop_${version}_linux-x86_64.AppImage"
test "$(dpkg-deb -f "$deb" Version)" = "$version"
test "$(dpkg-deb -f "$deb" Architecture)" = amd64
sudo apt-get install -y "$deb"
test "$(dpkg-query -W -f='${Version}' rack-top)" = "$version"
smoke_home=$(mktemp -d)
trap 'rm -rf "$smoke_home"' EXIT
# Isolate smoke-test data from the runner's desktop profile.
run_smoke() {
  local status=0
  local profile
  profile=$(mktemp -d "$smoke_home/profile.XXXXXX")
  timeout 15s xvfb-run -a dbus-run-session -- env \
    XDG_DATA_HOME="$profile/data" XDG_CONFIG_HOME="$profile/config" \
    LIBGL_ALWAYS_SOFTWARE=1 WEBKIT_DISABLE_DMABUF_RENDERER=1 \
    "$@" > "$smoke_home/startup.log" 2>&1 || status=$?
  cat "$smoke_home/startup.log"
  test "$status" = 124
  test -s "$profile/data/com.racktop.desktop/racktop.sqlite"
  if grep -Ei 'panicked at|error while loading shared libraries|symbol lookup error' "$smoke_home/startup.log"; then
    return 1
  fi
}
run_smoke /usr/bin/racktop
chmod +x "$appimage"
run_smoke "$appimage" --appimage-extract-and-run
sudo apt-get remove -y rack-top
