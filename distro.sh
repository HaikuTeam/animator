#!/usr/bin/env bash

node ./scripts/distro-configure.js --non-interactive # 0m
node ./scripts/distro-prepare.js # 3m
node ./scripts/distro-electron-rebuild.js # 5m
# node ./scripts/distro-uglify-sources.js
node ./scripts/distro-build.js # 8m
node ./scripts/distro-upload.js
