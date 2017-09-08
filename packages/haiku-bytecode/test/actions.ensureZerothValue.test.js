var test = require('tape')
var ensureZerothValue = require('./../src/actions/ensureZerothValue')

test('ensureZerothValue', function (t) {
  t.plan(2)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
      }
    },
    template: {}
  }
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{}},"template":{}}')
  ensureZerothValue(bytecode, 'abcd', 'Default', 'svg', 'translation.x', {}, {})
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{"haiku:abcd":{"translation.x":{"0":{"value":0}}}}},"template":{}}')
})
