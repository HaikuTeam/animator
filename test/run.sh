set -e
yarn electron ./node_modules/.bin/tape "./test/e2e/000*.test.js" | tap-spec
yarn electron ./node_modules/.bin/tape "./test/e2e/001*.test.js" | tap-spec
yarn electron ./node_modules/.bin/tape "./test/e2e/002*.test.js" | tap-spec
yarn electron ./node_modules/.bin/tape "./test/e2e/003*.test.js" | tap-spec
