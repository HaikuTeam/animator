#!/usr/bin/env bash

aws s3 cp \
  --profile=haiku-player-test-uploader \
  --recursive \
  --acl=public-read \
  ./build/ \
  s3://haiku-misc-public/player-tests/
