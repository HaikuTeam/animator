var test = require('tape')
var createTimeline = require('./../src/actions/createTimeline')

test('createTimeline', function (t) {
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
  createTimeline(bytecode, 'FooBar')
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"FooBar":{}},"template":{}}')
})
