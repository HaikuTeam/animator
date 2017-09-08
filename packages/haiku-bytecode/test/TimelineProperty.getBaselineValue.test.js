var test = require('tape')
var TimelineProperty = require('./../src/TimelineProperty')
var ValueBuilder = require('@haiku/player/src/ValueBuilder')
function _findElementsByHaikuId () {
  return { elementName: 'svg', attributes: {}, children: [] }
}

test('TimelineProperty.getBaselineValue', function(t) {
  t.plan(6)

  var hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance._findElementsByHaikuId = _findElementsByHaikuId
  var inputValues = {}
  var bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 123, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          'zilch': {},
          'opacity': {
            0: { value: 0 },
            100: { value: 1 },
            200: { value: 2 },
            300: { value: 3 },
            400: { value: 4 }
          }
        }
      }
    }
  }, hostInstance, inputValues)
  t.equal(bv, 1, 'first is correct')

  var hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance._findElementsByHaikuId = _findElementsByHaikuId
  var inputValues = {}
  var bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 0, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          'zilch': {},
          'opacity': {
            0: { value: 0 },
            100: { value: 1 },
            200: { value: 2 },
            300: { value: 3 },
            400: { value: 4 }
          }
        }
      }
    }
  }, hostInstance, inputValues)
  t.equal(bv, 0, 'second is correct')

  // This is the important test - ensuring we load the PREVIOUS keyframe when we have an exact fit!
  var hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance._findElementsByHaikuId = _findElementsByHaikuId
  var inputValues = {}
  var bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 100, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          'zilch': {},
          'opacity': {
            0: { value: 0 },
            100: { value: 1 },
            200: { value: 2 },
            300: { value: 3 },
            400: { value: 4 }
          }
        }
      }
    }
  }, hostInstance, inputValues)
  t.equal(bv, 0, 'third is correct - got previous keyframe')

  var hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance._findElementsByHaikuId = _findElementsByHaikuId
  var inputValues = {}
  var bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 1000000, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          'zilch': {},
          'opacity': {
            0: { value: 0 },
            100: { value: 1 },
            200: { value: 2 },
            300: { value: 3 },
            400: { value: 4 }
          }
        }
      }
    }
  }, hostInstance, inputValues)
  t.equal(bv, 4, 'fourth is correct')

  // Another important one: Ensure we use the dom.properties-defined fallback if there is no previous
  var hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance._findElementsByHaikuId = _findElementsByHaikuId
  var inputValues = {}
  var bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 99, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          'zilch': {},
          'opacity': {
            // Opacity actually has a fallback of 1.
            100: { value: 1 },
            200: { value: 2 },
            300: { value: 3 },
            400: { value: 4 }
          }
        }
      }
    }
  }, hostInstance, inputValues)
  t.equal(bv, 1, 'fifth correct - prop defined fallback ok')

  // Another important one: Ensure we use the dom.properties-defined fallback if there is no previous
  var hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance._findElementsByHaikuId = _findElementsByHaikuId
  var inputValues = {}
  var bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'boovador', 'Default', 99, undefined, {
    timelines: {
      Default: {
        'haiku:abcde': {
          'zilch': {},
          'opacity': {
            // Opacity actually has a fallback of 1.
            100: { value: 1 },
            200: { value: 2 },
            300: { value: 3 },
            400: { value: 4 }
          }
        }
      }
    }
  }, hostInstance, inputValues)
  t.equal(bv, undefined, 'sixth ok - prop defined fallback ok')
})
