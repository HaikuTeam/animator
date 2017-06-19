#!/usr/bin/env bash

echo "compiling plumbing"
cd libs/plumbing
npm run compile
cd ../..

echo "transpiling cli"
cd libs/plumbing/node_modules/haiku-cli
npm install
npm run transpile
cd ../../../..

echo "transpiling creator"
NODE_ENV=production ./node_modules/.bin/babel libs/plumbing/node_modules/haiku-creator-electron --out-dir libs/plumbing/node_modules/haiku-creator-electron --ignore libs/plumbing/node_modules/haiku-creator-electron/node_modules
sed -i '' "s/require('babel-register')/\/\/ require('babel-register')/" libs/plumbing/node_modules/haiku-creator-electron/index.html

echo "transpiling glass"
NODE_ENV=production ./node_modules/.bin/babel libs/plumbing/node_modules/haiku-glass --out-dir libs/plumbing/node_modules/haiku-glass --ignore libs/plumbing/node_modules/haiku-glass/node_modules
sed -i '' "s/require('babel-register')/\/\/ require('babel-register')/" libs/plumbing/node_modules/haiku-glass/index.html

echo "transpiling timeline"
NODE_ENV=production ./node_modules/.bin/babel libs/plumbing/node_modules/haiku-timeline --out-dir libs/plumbing/node_modules/haiku-timeline --ignore libs/plumbing/node_modules/haiku-timeline/node_modules
sed -i '' "s/require('babel-register')/\/\/ require('babel-register')/" libs/plumbing/node_modules/haiku-timeline/index.html

echo $PWD
