#!/usr/bin/env bash

tmpfile=footprint.ignore.min.js
zipfile=footprint.ignore.min.js.gz

player="./index.js"
domrenderer="./src/renderers/dom/index.js"

echo "player bundled size:"
browserify -p bundle-collapser/plugin $player > $tmpfile && ls -lah $tmpfile | awk '{print $5}'

echo "player bundled + uglified size:"
browserify -p bundle-collapser/plugin $player | uglifyjs --compress --mangle > $tmpfile && ls -lah $tmpfile | awk '{print $5}'

echo "player bundled + uglified + gzipped size:"
browserify -p bundle-collapser/plugin $player | uglifyjs --compress --mangle > $tmpfile && gzip -f $tmpfile && ls -lah $zipfile | awk '{print $5}'

echo "dom renderer bundled size:"
browserify -p bundle-collapser/plugin $domrenderer > $tmpfile && ls -lah $tmpfile | awk '{print $5}'

echo "dom renderer bundled + uglified size:"
browserify -p bundle-collapser/plugin $domrenderer | uglifyjs --compress --mangle > $tmpfile && ls -lah $tmpfile | awk '{print $5}'

echo "dom renderer bundled + uglified + gzipped size:"
browserify -p bundle-collapser/plugin $domrenderer | uglifyjs --compress --mangle > $tmpfile && gzip -f $tmpfile && ls -lah $zipfile | awk '{print $5}'

rm $zipfile
