'use strict'

var test = require('tape')
var parseCode = require('./../../src/ast/parseCode')
var getFunctionNodeParams = require('./../../src/ast/getFunctionNodeParams')

test('ast.getFunctionNodeParams', function (t) {
  t.plan(1)

  var fnnode = parseCode(`
    (function({ a, b, c, d: { e, f, j: { k } }, g: [ h, i, { l }, [ m ] ] }, foo, bar){return 1})
  `).program.body[0].expression

  var params = getFunctionNodeParams(fnnode)

  t.equal(JSON.stringify(params), '[{"a":"a","b":"b","c":"c","d":{"e":"e","f":"f","j":{"k":"k"}},"g":["h","i",{"l":"l"},["m"]]},"foo","bar"]')
})
