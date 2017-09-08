var test = require('tape')
var changePlaybackSpeed = require('./../src/actions/changePlaybackSpeed')

test('changePlaybackSpeed', function (t) {
  t.plan(2)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {},
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{"elementName":"svg","attributes":{"haiku-id":"abcdefghijk"}}}')
  changePlaybackSpeed(bytecode, 63)
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{"elementName":"svg","attributes":{"haiku-id":"abcdefghijk"}},"options":{"fps":60}}')
})
