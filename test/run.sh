set -e
for f in `find ./test/e2e -name *.test.js | sort`; do
    yarn electron ./node_modules/.bin/tape $f | yarn tap-spec
done
