'use strict'

var test = require('tape')
var parseCode = require('./../../src/ast/parseCode')
var jsxElementNodeToSerializedManaObject = require('./../../src/jsx/jsxElementNodeToSerializedManaObject')
// var fixture = require('./fixtures/jsx.fixture')

test('jsx', function (t) {
  t.plan(1)
  var jsxast1 = parseCode('<div id="foo"><div className="baz"><span/></div></div>').program.body[0].expression
  var jsxobj1 = jsxElementNodeToSerializedManaObject(jsxast1)
  t.equal(JSON.stringify(jsxobj1), `{"elementName":"div","attributes":{"id":"foo"},"children":[{"elementName":"div","attributes":{"className":"baz"},"children":[{"elementName":"span","attributes":{},"children":[]}]}]}`, 'jsx obj is correct')
})
