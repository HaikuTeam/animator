set -e
for f in `find ./test -name *.test.js | sort`; do
    yarn electron ./node_modules/.bin/tape $f | yarn tap-spec
done
