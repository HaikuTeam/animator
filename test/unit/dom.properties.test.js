var test = require('tape')
var properties = require('./../../src/properties/dom/properties')
var fs = require('fs')

test('dom.properties', function (t) {
  t.plan(1)
  t.ok(properties.div.addressableProperties['style.zIndex'].typedef === 'number')
})
