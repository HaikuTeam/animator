const tape = require('tape')
const ValueBuilder = require('@haiku/core/lib/ValueBuilder').default
const TimelineProperty = require('./../../src/bll/TimelineProperty')

function findElementsByHaikuId () {
  return { elementName: 'svg', attributes: {}, children: [] }
}

tape('TimelineProperty.addProperty', function(t) {
  t.plan(4)

  const timelines = {
    Default: {
      'haiku:abcde': {
        'zilch': {}
      }
    }
  }

  TimelineProperty.addProperty(
    timelines,
    'Default',
    'abcde',
    'div',
    'opacity',
    0,
    0
  )

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"opacity":{"0":{"value":0,"edited":true}}}}}')

  TimelineProperty.addProperty(
    timelines,
    'Default',
    'abcde',
    'div',
    'opacity',
    0,
    0.5
  )

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"opacity":{"0":{"value":0.5,"edited":true}}}}}')

  TimelineProperty.addProperty(
    timelines,
    'Default',
    'abcde',
    'div',
    'opacity',
    100,
    0.75
  )

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"opacity":{"0":{"value":0.5,"edited":true},"100":{"value":0.75,"edited":true}}}}}')

  TimelineProperty.addProperty(
    timelines,
    'Default',
    'abcde',
    'div',
    'opacity',
    200,
    0.95,
    'linear'
  )

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"opacity":{"0":{"value":0.5,"edited":true},"100":{"value":0.75,"edited":true},"200":{"value":0.95,"curve":"linear","edited":true}}}}}')
})

tape('TimelineProperty.getAssignedBaselineValueObject', function(t) {
  t.plan(4)

  const bvo1 = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 123, {
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
  })
  t.equal(JSON.stringify(bvo1), '{"value":1}')

  const bvo2 = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 99, {
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
  })
  t.equal(JSON.stringify(bvo2), '{"value":0}')

  const bvo3 = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 100, {
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
  })
  t.equal(JSON.stringify(bvo3), '{"value":1}')

  const bvo4 = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 3333300, {
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
  })
  t.equal(JSON.stringify(bvo4), '{"value":4}')
})

tape('TimelineProperty.getBaselineValue', function(t) {
  t.plan(6)

  let hostInstance
  let inputValues
  let bv

  hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance.findElementsByHaikuId = findElementsByHaikuId
  hostInstance._shouldPerformFullFlush = () => {}
  inputValues = {}
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 123, 0.666, {
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

  hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance.findElementsByHaikuId = findElementsByHaikuId
  hostInstance._shouldPerformFullFlush = () => {}
  inputValues = {}
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 0, 0.666, {
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
  hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance.findElementsByHaikuId = findElementsByHaikuId
  hostInstance._shouldPerformFullFlush = () => {}
  inputValues = {}
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 100, 0.666, {
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

  hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance.findElementsByHaikuId = findElementsByHaikuId
  hostInstance._shouldPerformFullFlush = () => {}
  inputValues = {}
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 1000000, 0.666, {
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
  }, hostInstance)
  t.equal(bv, 4, 'fourth is correct')

  // Another important one: Ensure we use the dom.properties-defined fallback if there is no previous
  hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance.findElementsByHaikuId = findElementsByHaikuId
  hostInstance._shouldPerformFullFlush = () => {}
  inputValues = {}
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 99, 0.666, {
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
  }, hostInstance)
  t.equal(bv, 1, 'fifth correct - prop defined fallback ok')

  // Another important one: Ensure we use the dom.properties-defined fallback if there is no previous
  hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance.findElementsByHaikuId = findElementsByHaikuId
  hostInstance._shouldPerformFullFlush = () => {}
  inputValues = {}
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'boovador', 'Default', 99, undefined, {
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
  }, hostInstance)
  t.equal(bv, undefined, 'sixth ok - prop defined fallback ok')
})
