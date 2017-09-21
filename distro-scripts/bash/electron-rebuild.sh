#!/usr/bin/env bash

# note: must be run *after* 'install.sh'
# expect this to take several minutes per entry

# 1. Plumbing
echo "rebuilding electron"
./node_modules/.bin/electron-rebuild --version 1.7.0 --module-dir $PWD/libs/plumbing
