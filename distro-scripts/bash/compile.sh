#!/usr/bin/env bash

echo "compiling plumbing"
cd packages/haiku-plumbing
npm run compile
cd ../..

echo "transpiling cli"
cd packages/haiku-plumbing/node_modules/haiku-cli
npm install
npm run transpile
cd ../../../..

echo $PWD
