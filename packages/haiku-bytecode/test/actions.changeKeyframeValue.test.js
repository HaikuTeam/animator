var test = require('tape')
var changeKeyframeValue = require('./../src/actions/changeKeyframeValue')

test('changeKeyframeValue', function (t) {
  t.plan(2)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            "150": {
              value: 1
            }
          }
        }
      }
    },
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"150":{"value":1}}}}')
  changeKeyframeValue(bytecode, 'abcdefghijk', 'Default', 'opacity', 150, 0.5)
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"150":{"value":0.5,"edited":true}}}}')
})
