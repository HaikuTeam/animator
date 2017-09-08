var test = require('tape')
var splitSegment = require('./../src/actions/splitSegment')

test('splitSegment', function (t) {
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
  splitSegment(bytecode, 'abcdefghijk', 'Default', 'svg', 'opacity', 0)
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0},"150":{"value":1}}}}')
})
