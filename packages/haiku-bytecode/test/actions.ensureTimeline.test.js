var test = require('tape')
var ensureTimeline = require('./../src/actions/ensureTimeline')

test('ensureTimeline', function (t) {
  t.plan(2)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
    },
    template: {}
  }
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{}}')
  ensureTimeline(bytecode, 'FooBar')
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"FooBar":{}},"template":{}}')
})
