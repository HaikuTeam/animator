var test = require('tape')
var getSortedKeyframeKeys = require('./../src/actions/getSortedKeyframeKeys')

test('getSortedKeyframeKeys', function (t) {
  t.plan(1)
  var keys = getSortedKeyframeKeys({
    "0": { value: 123 },
    "10": { value: 123 },
    "1000": { value: 123 },
    "44": { value: 123 },
    "346": { value: 123 },
    "2": { value: 123 },
    "100": { value: 123 },
  })
  t.equal(JSON.stringify(keys), '[0,2,10,44,100,346,1000]')
})
