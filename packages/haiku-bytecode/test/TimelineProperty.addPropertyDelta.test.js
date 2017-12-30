var test = require('tape')
var TimelineProperty = require('./../src/TimelineProperty')
var ValueBuilder = require('@haiku/player/lib/ValueBuilder').default
function findElementsByHaikuId () {
  return { elementName: 'svg', attributes: {}, children: [] }
}

test('TimelineProperty.addPropertyDelta', function(t) {
  t.plan(4)

  var hostInstance = {}
  hostInstance._builder = new ValueBuilder(hostInstance)
  hostInstance.findElementsByHaikuId = findElementsByHaikuId
  var timelines =  {
    Default: {
      'haiku:abcde': {
        'zilch': {}
      }
    }
  }

  TimelineProperty.addPropertyDelta(
    timelines,
    'Default',
    'abcde',
    'div',
    'translation.x',
    0,
    2,
    hostInstance
  )

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"translation.x":{"0":{"value":2,"edited":true}}}}}')

  TimelineProperty.addPropertyDelta(
    timelines,
    'Default',
    'abcde',
    'div',
    'translation.x',
    0,
    2,
    hostInstance
  )

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"translation.x":{"0":{"value":4,"edited":true}}}}}')

  TimelineProperty.addPropertyDelta(
    timelines,
    'Default',
    'abcde',
    'div',
    'translation.x',
    17,
    2,
    hostInstance
  )

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"translation.x":{"0":{"value":4,"edited":true},"17":{"value":6,"edited":true}}}}}')

  TimelineProperty.addPropertyDelta(
    timelines,
    'Default',
    'abcde',
    'div',
    'translation.x',
    17,
    2,
    hostInstance
  )

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"translation.x":{"0":{"value":4,"edited":true},"17":{"value":8,"edited":true}}}}}')
})
