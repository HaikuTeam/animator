var test = require('tape')
var PACKAGE = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var HaikuDOMAdapter = require('./../../lib/adapters/dom').default
var Config = require('./../../lib/Config').default
test('passingOptions', function (t) {
  t.plan(6)

  var bytecode = {
    // Checking that the bytecode itself can define options
    options: {
      contextMenu: 'foobar123'
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
    var HaikuComponentFactory = HaikuDOMAdapter(bytecode, {
      position: 'yaya890',
      options: {
        overflowX: 'uio66'
      }
    }, win)

    // Pass loop at root level
    var component = HaikuComponentFactory(mount, {
      loop: true,
      onHaikuComponentDidMount: function(){},
      states: {
        bux: {
          value: 9000
        }
      }
    })

    t.equal(component.config.options.loop, true, 'loop was set')
    t.equal(component.config.options.contextMenu, 'foobar123', 'ctx menu was set')
    t.equal(component.config.options.position, 'yaya890', 'pos was set')
    t.equal(component.config.options.overflowX, 'uio66', 'overflow was set')

    t.ok(component.config.onHaikuComponentDidMount)

    t.equal(component._states.bux, 9000, 'states were set')

    component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
  })
})
