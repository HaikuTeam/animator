var test = require('tape')
var TestHelpers = require('./../TestHelpers')
test('index', function (t) {
  t.plan(1)
  var bytecode = {
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            0: {
              value: 1
            }
          }
        }
      }
    },
    template: {
      elementName: 'div',
      attributes: { 'haiku-id': 'abcdefghijk' },
      children: []
    }
  }
  TestHelpers.createComponent(bytecode, {}, function (core, teardown) {
    teardown()
    t.ok(true)
  })
})
