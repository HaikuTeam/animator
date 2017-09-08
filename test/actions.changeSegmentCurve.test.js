var test = require('tape')
var changeSegmentCurve = require('./../src/actions/changeSegmentCurve')

test('changeSegmentCurve', function (t) {
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
  changeSegmentCurve(bytecode, 'abcdefghijk', 'Default', 'opacity', 0, 'easeOutBounce')
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0,"curve":"easeOutBounce","edited":true},"150":{"value":1}}}}')
})
