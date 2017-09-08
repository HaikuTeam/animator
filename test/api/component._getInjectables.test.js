var test = require('tape')
var PACKAGE = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var HaikuDOMAdapter = require('./../../src/adapters/dom')
test('component._getInjectables', function (t) {
  t.plan(16)

  var bytecode = {
    // Checking that the bytecode itself can define options
    options: {
      contextMenu: 'foobar123'
    },
    states: {
      baz: {
        value: 'abc'
      }
    },
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

  TestHelpers.createDOM(function (err, win) {
    // Combo passing options at root and nested
    var HaikuComponentFactory = HaikuDOMAdapter(bytecode, {}, win)

    // Pass loop at root level
    var component = HaikuComponentFactory(mount, {
      states: {
        bux: {
          value: 9000
        }
      }
    })

    var injectables = component._getInjectables()

    t.ok(injectables.baz)
    t.equal(injectables.baz, 'string')

    t.ok(injectables.bux)
    t.equal(injectables.bux, 'number')

    t.ok(injectables.$global)
    t.ok(injectables.$player)
    t.ok(injectables.$component)
    t.ok(injectables.$root)

    t.ok(injectables.$element)
    t.ok(injectables.$element.properties)

    t.ok(injectables.$tree)
    t.ok(injectables.$flow)
    t.ok(injectables.$user)

    t.ok(injectables.$helpers)
    t.equal(injectables.$helpers.rand, 'function') // We loaded the _schema_ not the helpers
    t.equal(injectables.$helpers.now, 'function')

    component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
  })
})
