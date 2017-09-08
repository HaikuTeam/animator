var test = require('tape')
var moveKeyframes = require('./../src/actions/moveKeyframes')

test('moveKeyframes', function (t) {
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
              curve: 'linear'
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
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0,"curve":"linear"},"150":{"value":1}}}}')
  moveKeyframes(bytecode, 'abcdefghijk', 'Default', 'opacity', { 0: { value: 1 }, 150: { value: 3 } }, {})
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":1},"150":{"value":3}}}}')
})
