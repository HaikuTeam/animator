var test = require('tape')
var joinKeyframes = require('./../src/actions/joinKeyframes')

test('joinKeyframes', function (t) {
  t.plan(2)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            "0": {
              value: 0,
            },
            "150": {
              value: 1,
            }
          }
        }
      }
    },
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0},"150":{"value":1}}}}')
  joinKeyframes(bytecode, 'abcdefghijk', 'Default', 'svg', 'opacity', 0, 150, 'easeOutBounce')
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0,"curve":"easeOutBounce","edited":true},"150":{"value":1}}}}')
})
