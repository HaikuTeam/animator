var test = require('tape')
var componentIdToSelector = require('./../src/actions/componentIdToSelector')

test('componentIdToSelector', function (t) {
  t.plan(1)
  t.equal(componentIdToSelector('abcd'), 'haiku:abcd')
})
