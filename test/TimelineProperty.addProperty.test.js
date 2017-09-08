var test = require('tape')
var TimelineProperty = require('./../src/TimelineProperty')

test('TimelineProperty.addProperty', function(t) {
  t.plan(4)

  var timelines = {
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
