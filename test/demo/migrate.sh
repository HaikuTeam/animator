#!/usr/bin/env bash

for dir in ./*
do
  echo $dir
  cp ./react-harness.js $dir/code/main/react-dom.js
done
