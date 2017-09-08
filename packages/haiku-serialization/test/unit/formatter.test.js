'use strict'

var test = require('tape')
var format = require('./../../src/formatter/formatStandard')
var fixture = require('./../fixtures/formatter.fixture')

test('formatter', function (t) {
  t.plan(2)
  format(fixture.unf1, null, function (err, code, messages) {
    t.error(err)
    t.ok(code)
  })
})
