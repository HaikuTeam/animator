#!/usr/bin/env bash

set -e
node ./scripts/distro-configure.js --non-interactive # 0m
node ./scripts/distro-download-secrets.js
yarn relink
node ./scripts/distro-prepare.js # 3m
node ./scripts/distro-electron-rebuild.js # 5m
# node ./scripts/distro-uglify-sources.js # 1m
node ./scripts/distro-build.js # 8m
node ./scripts/distro-upload.js # 2m
