var test = require('tape')
var TimelineProperty = require('./../src/TimelineProperty')

test('TimelineProperty.getAssignedBaselineValueObject', function(t) {
  t.plan(4)

  var bvo = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 123, {
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
  t.equal(JSON.stringify(bvo), '{"value":1}')

  var bvo = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 99, {
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
  t.equal(JSON.stringify(bvo), '{"value":0}')

  var bvo = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 100, {
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
  t.equal(JSON.stringify(bvo), '{"value":1}')

  var bvo = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 3333300, {
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
  t.equal(JSON.stringify(bvo), '{"value":4}')
})
