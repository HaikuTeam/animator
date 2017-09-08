var test = require('tape')
var renameTimeline = require('./../src/actions/renameTimeline')

test('renameTimeline', function (t) {
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
  renameTimeline(bytecode, 'FooBar', 'BazQux')
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"BazQux":{}},"template":{}}')
})
