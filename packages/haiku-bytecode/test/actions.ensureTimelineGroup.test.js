var test = require('tape')
var ensureTimelineGroup = require('./../src/actions/ensureTimelineGroup')

test('ensureTimelineGroup', function (t) {
  t.plan(2)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
    },
    template: {}
  }
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{}}')
  ensureTimelineGroup(bytecode, 'FooBar', 'abcd')
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"FooBar":{"haiku:abcd":{}}},"template":{}}')
})
