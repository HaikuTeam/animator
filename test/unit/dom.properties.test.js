var test = require('tape')
var schema = require('./../../lib/properties/dom/schema')
var fs = require('fs')

test('dom.properties', function (t) {
  t.plan(1)
  t.ok(
    schema.div['style.zIndex'] === 'number'
  )
})
