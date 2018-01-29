var test = require('tape')
var vanities = require('./../../lib/properties/dom/vanities').default
var fs = require('fs')

test('dom.vanities', function (t) {
  t.plan(1)
  t.ok(typeof vanities.div['rotation.w'] === 'function')
})
