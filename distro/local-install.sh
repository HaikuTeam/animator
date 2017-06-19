#!/usr/bin/env bash

echo "running local install of application"

rm -rf /Applications/Haiku.app

cp -R $PWD/dist/mac/Haiku.app /Applications

node ./bins/cli-cloud-installer.js
