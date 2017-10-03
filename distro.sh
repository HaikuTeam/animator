#!/usr/bin/env bash

if [ ${CIRCLE_BRANCH} ]
then
  export NODE_ENV=${CIRCLE_BRANCH}
  yarn install # 1m
  yarn run yarn-install # 5m
  yarn relink
  node ./scripts/distro-download-certs.js
fi

node ./scripts/distro-configure.js --non-interactive # 0m
node ./scripts/distro-prepare.js # 3m
node ./scripts/distro-electron-rebuild.js # 5m
node ./scripts/distro-uglify-sources.js # 1m
node ./scripts/distro-build.js # 8m
node ./scripts/distro-upload.js # 2m
