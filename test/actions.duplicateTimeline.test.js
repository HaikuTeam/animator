var test = require('tape')
var duplicateTimeline = require('./../src/actions/duplicateTimeline')

test('duplicateTimeline', function (t) {
  t.plan(2)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
      },
      FooBar: {
      }
    },
    template: {}
  }
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"FooBar":{}},"template":{}}')
  duplicateTimeline(bytecode, 'FooBar')
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"FooBar":{},"FooBar copy":{}},"template":{}}')
})
