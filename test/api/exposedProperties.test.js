var test = require('tape')
var PACKAGE = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var HaikuDOMAdapter = require('./../../lib/adapters/dom')
test('exposedProperties', function (t) {
  t.plan(4)
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
  TestHelpers.createDOM(function (err, win) {
    var HaikuComponentFactory = HaikuDOMAdapter(bytecode, {}, win)

    t.equal(HaikuComponentFactory.PLAYER_VERSION, PACKAGE.version, 'version is present on factory')

    var mount = win.document.createElement('div')
    mount.style.width = '800px'
    mount.style.height = '600px'
    win.document.body.appendChild(mount)

    var component = HaikuComponentFactory(mount, {})

    // These get assigned when the component factory runs
    t.ok(HaikuComponentFactory.renderer)
    t.ok(HaikuComponentFactory.bytecode)

    t.equal(component.PLAYER_VERSION, PACKAGE.version, 'version is present on component')

    component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
  })
})
