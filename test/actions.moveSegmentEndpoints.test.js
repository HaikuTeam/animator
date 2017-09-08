var test = require('tape')
var moveSegmentEndpoints = require('./../src/actions/moveSegmentEndpoints')

test('moveSegmentEndpoints', function (t) {
  t.plan(1)

  var bc1 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            '0':{value:1,curve:'linear'},
            '100':{value:1,curve:'linear'},
            '200':{value:1,curve:'linear'},
            '300':{value:1,curve:'linear'},
            '400':{value:1,curve:'linear'},
            '500':{value:1,curve:'linear'},
            '600':{value:1,curve:'linear'},
            '700':{value:1,curve:'linear'},
            '800':{value:1,curve:'linear'},
          }
        }
      }
    },
    template: { elementName: 'div', attributes: { 'haiku-id': 'abcdefghijk' } }
  }
  moveSegmentEndpoints(bc1, 'abcdefghijk', 'Default', 'opacity', 'left', 2, 200, 250, {mspf:16.666})
  t.equal(JSON.stringify(bc1.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":1,"curve":"linear"},"100":{"value":1,"curve":"linear"},"250":{"value":1,"curve":"linear"},"300":{"value":1,"curve":"linear"},"400":{"value":1,"curve":"linear"},"500":{"value":1,"curve":"linear"},"600":{"value":1,"curve":"linear"},"700":{"value":1,"curve":"linear"},"800":{"value":1,"curve":"linear"}}}}')
})
