#!/usr/bin/env bash

cd packages/haiku-bytecode && rm -rf node_modules && cd ../..
cd packages/haiku-cli && rm -rf node_modules && cd ../..
cd packages/haiku-common && rm -rf node_modules && cd ../..
cd packages/haiku-creator && rm -rf node_modules && cd ../..
cd packages/haiku-formats && rm -rf node_modules && cd ../..
cd packages/haiku-glass && rm -rf node_modules && cd ../..
cd packages/haiku-player && rm -rf node_modules && cd ../..
cd packages/haiku-plumbing && rm -rf node_modules && cd ../..
cd packages/haiku-sdk-client && rm -rf node_modules && cd ../..
cd packages/haiku-sdk-creator && rm -rf node_modules && cd ../..
cd packages/haiku-sdk-inkstone && rm -rf node_modules && cd ../..
cd packages/haiku-serialization && rm -rf node_modules && cd ../..
cd packages/haiku-state-object && rm -rf node_modules && cd ../..
cd packages/haiku-testing && rm -rf node_modules && cd ../..
cd packages/haiku-timeline && rm -rf node_modules && cd ../..
cd packages/haiku-websockets && rm -rf node_modules && cd ../..

cd packages/haiku-bytecode && yarn install && cd ../..
cd packages/haiku-cli && yarn install && cd ../..
cd packages/haiku-common && yarn install && cd ../..
cd packages/haiku-creator && yarn install && cd ../..
cd packages/haiku-formats && yarn install && cd ../..
cd packages/haiku-glass && yarn install && cd ../..
cd packages/haiku-player && yarn install && cd ../..
cd packages/haiku-plumbing && yarn install && cd ../..
cd packages/haiku-sdk-client && yarn install && cd ../..
cd packages/haiku-sdk-creator && yarn install && cd ../..
cd packages/haiku-sdk-inkstone && yarn install && cd ../..
cd packages/haiku-serialization && yarn install && cd ../..
cd packages/haiku-state-object && yarn install && cd ../..
cd packages/haiku-testing && yarn install && cd ../..
cd packages/haiku-timeline && yarn install && cd ../..
cd packages/haiku-websockets && yarn install && cd ../..

rm .last-sync 2> /dev/null
yarn sync
