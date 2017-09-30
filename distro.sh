#!/usr/bin/env bash

node ./scripts/distro-configure.js --non-interactive
node ./scripts/distro-prepare.js
node ./scripts/distro-electron-rebuild.js
node ./scripts/distro-uglify-sources.js
node ./scripts/distro-build.js
node ./scripts/distro-upload.hs
