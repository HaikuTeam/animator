#!/usr/bin/env bash

set -e
node ./scripts/distro-configure.js --non-interactive
node ./scripts/distro-download-secrets.js
node ./scripts/distro-prepare.js
node ./scripts/distro-build.js
node ./scripts/distro-upload.js
