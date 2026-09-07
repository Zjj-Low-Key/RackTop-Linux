#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ "$(uname -s)" != Linux ] || [ "$(uname -m)" != x86_64 ]; then
  echo 'This release script requires Linux x86_64.' >&2
  exit 1
fi
version="$(node -p "require('./package.json').version")"
npm run tauri -- build --bundles deb,appimage
output="src-tauri/target/release/linux-packages"
mkdir -p "$output"
cp "src-tauri/target/release/bundle/deb/RackTop_${version}_amd64.deb" "$output/RackTop_${version}_linux-amd64.deb"
cp "src-tauri/target/release/bundle/appimage/RackTop_${version}_amd64.AppImage" "$output/RackTop_${version}_linux-x86_64.AppImage"
chmod +x "$output/RackTop_${version}_linux-x86_64.AppImage"
(cd "$output" && sha256sum "RackTop_${version}_linux-amd64.deb" "RackTop_${version}_linux-x86_64.AppImage" > SHA256SUMS)
printf 'Linux packages: %s\n' "$output"
