var test = require('tape')
var sliceSegment = require('./../src/actions/sliceSegment')

test('sliceSegment', function (t) {
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
  sliceSegment(bytecode, 'abcdefghijk', 'Default', 'svg', 'opacity', 0, 70)
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0,"curve":"linear"},"70":{"curve":"linear","value":0,"edited":true},"150":{"value":1}}}}')
})
