var test = require('tape')
var createKeyframe = require('./../src/actions/createKeyframe')

test('createKeyframe (static 1)', function (t) {
  t.plan(1)
  var bc1 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {

        }
      }
    },
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }
  createKeyframe(bc1, 'abcdefghijk', 'Default', 'svg', 'opacity', 150, 0.5)
  t.equal(JSON.stringify(bc1.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":1},"150":{"value":0.5,"edited":true}}}}')
})

var test = require('tape')
var createKeyframe = require('./../src/actions/createKeyframe')

test('createKeyframe (dynamic 1)', function (t) {
  t.plan(1)
  var bc2 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {

        }
      }
    },
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }

  createKeyframe(bc2, 'abcdefghijk', 'Default', 'svg', 'opacity', 150, {
    __function: {
      name: 'foo',
      params: [],
      body: 'return 123;'
    }
  })

  t.equal(bc2.timelines.Default['haiku:abcdefghijk'].opacity[150].value.toString(), 'function foo() {\n  return 123;\n}')
})

test('createKeyframe (dynamic via default 1)', function (t) {
  t.plan(1)
  var bc3 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          'opacity': {
            0: {
              value: function foo () {
                return 123;
              }
            }
          }
        }
      }
    },
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }

  createKeyframe(bc3, 'abcdefghijk', 'Default', 'svg', 'opacity', 150)

  t.equal(bc3.timelines.Default['haiku:abcdefghijk'].opacity[150].value.toString(), 'function foo() {\n  return 123;\n}')
})

test('createKeyframe (static via default 1)', function (t) {
  t.plan(1)
  var bc4 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          'opacity': {
            0: {
              value: 0.234
            }
          }
        }
      }
    },
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }

  createKeyframe(bc4, 'abcdefghijk', 'Default', 'svg', 'opacity', 150)

  t.equal(bc4.timelines.Default['haiku:abcdefghijk'].opacity[150].value, 0.234)
})

test('createKeyframe (static via default 2)', function (t) {
  t.plan(1)
  var bc4 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          'opacity': {
            0: {
              value: 0.234
            },
            140: {
              value: 0.675
            }
          }
        }
      }
    },
    template: { elementName: 'svg', attributes: { 'haiku-id': 'abcdefghijk' } }
  }

  createKeyframe(bc4, 'abcdefghijk', 'Default', 'svg', 'opacity', 150)

  t.equal(bc4.timelines.Default['haiku:abcdefghijk'].opacity[150].value, 0.675)
})
