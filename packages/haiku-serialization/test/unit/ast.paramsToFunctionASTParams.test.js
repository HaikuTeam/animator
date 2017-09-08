'use strict'

var test = require('tape')
var parseCode = require('./../../src/ast/parseCode')
var paramsToFunctionASTParams = require('./../../src/ast/paramsToFunctionASTParams')

test('ast.paramsToFunctionASTParams', function (t) {
  t.plan(1)

  var astParams = paramsToFunctionASTParams([{"a":"a","b":"b","c":"c","d":{"e":"e","f":"f","j":{"k":"k"}},"g":["h","i",{"l":"l"},["m"]]},"foo","bar"])

  t.equal(JSON.stringify(astParams),  '[{"type":"ObjectPattern","properties":[{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"a"},"value":{"type":"Identifier","name":"a"}},{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"b"},"value":{"type":"Identifier","name":"b"}},{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"c"},"value":{"type":"Identifier","name":"c"}},{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"d"},"value":{"type":"ObjectPattern","properties":[{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"e"},"value":{"type":"Identifier","name":"e"}},{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"f"},"value":{"type":"Identifier","name":"f"}},{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"j"},"value":{"type":"ObjectPattern","properties":[{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"k"},"value":{"type":"Identifier","name":"k"}}]}}]}},{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"g"},"value":{"type":"ArrayPattern","elements":[{"type":"Identifier","name":"h"},{"type":"Identifier","name":"i"},{"type":"ObjectPattern","properties":[{"type":"ObjectProperty","key":{"type":"StringLiteral","value":"l"},"value":{"type":"Identifier","name":"l"}}]},{"type":"ArrayPattern","elements":[{"type":"Identifier","name":"m"}]}]}}]},{"type":"Identifier","name":"foo"},{"type":"Identifier","name":"bar"}]')
})
