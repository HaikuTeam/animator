var test = require('tape')
var changeSegmentEndpoints = require('./../src/actions/changeSegmentEndpoints')

test('changeSegmentEndpoints', function (t) {
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
  changeSegmentEndpoints(bytecode, 'abcdefghijk', 'Default', 'opacity', 0, 150, 30, 160)
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"30":{"value":0,"curve":"linear"},"160":{"value":1}}}}')
})
