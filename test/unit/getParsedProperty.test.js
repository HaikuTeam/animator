'use strict'

var test = require('tape')
var getParsedProperty = require('./../../lib/helpers/getParsedProperty').default

test('getParsedProperty', function (t) {
  t.plan(1)

  var rawProps = {options: {sizing: 'cover'}}
  var parsedProp = getParsedProperty(rawProps, 'options')
  t.deepEqual(parsedProp, {sizing: 'cover'}, 'flattens out items if they are contained in a poperty named "options"')
})

test('getParsedProperty', function (t) {
  t.plan(2)

  var rawProps = {haikuOptions: {loop: true}, haikuStates: {count: 1}}
  var parsedProp = getParsedProperty(rawProps, 'haikuOptions')
  t.equal(parsedProp.loop, true, 'remaps deprecated property names')

  parsedProp = getParsedProperty(rawProps, 'haikuStates')
  t.deepEqual(parsedProp.states, {count: 1}, 'remaps deprecated property names')
})

test('getParsedProperty', function (t) {
  t.plan(2)

  var rawProps = {loop: true, alwaysComputeSizing: false}
  var parsedProp = getParsedProperty(rawProps, 'loop')
  t.equal(parsedProp.loop, true)

  parsedProp = getParsedProperty(rawProps, 'alwaysComputeSizing')
  t.equal(parsedProp.alwaysComputeSizing, false)
})
