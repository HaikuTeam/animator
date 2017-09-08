var test = require('tape')
var deleteKeyframe = require('./../src/actions/deleteKeyframe')

test('deleteKeyframe', function (t) {
  t.plan(1)
  var bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          'foo': {
            '0': { value: 1 },
            '100': { value: 2, curve: 'linear' },
            '200': { value: 3, curve: 'linear' },
            '300': { value: 4 }
          }
        }
      }
    },
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }
  deleteKeyframe(bytecode, 'abcdefghijk', 'Default', 'foo', 200)
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"foo":{"0":{"value":1},"100":{"value":2},"300":{"value":4}}}}')
})
