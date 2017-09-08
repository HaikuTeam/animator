var test = require('tape')
var ensureTimelineProperty = require('./../src/actions/ensureTimelineProperty')

test('ensureTimelineProperty', function (t) {
  t.plan(2)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
    },
    template: {}
  }
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{}}')
  ensureTimelineProperty(bytecode, 'FooBar', 'abcd', 'opacity')
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"FooBar":{"haiku:abcd":{"opacity":{}}}},"template":{}}')
})
