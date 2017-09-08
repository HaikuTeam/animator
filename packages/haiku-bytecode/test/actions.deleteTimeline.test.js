var test = require('tape')
var deleteTimeline = require('./../src/actions/deleteTimeline')

test('deleteTimeline', function (t) {
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
  deleteTimeline(bytecode, 'FooBar')
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{}},"template":{}}')
})
