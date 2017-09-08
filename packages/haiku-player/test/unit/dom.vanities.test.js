var test = require('tape')
var vanities = require('./../../src/properties/dom/vanities')
var fs = require('fs')

test('dom.vanities', function (t) {
  t.plan(1)
  t.ok(typeof vanities.div['rotation.w'] === 'function')
})
