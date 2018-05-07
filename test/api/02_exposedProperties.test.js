var test = require('tape')
var PACKAGE = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var HaikuDOMAdapter = require('./../../lib/adapters/dom').default
test('exposedProperties', function (t) {
  t.plan(6)
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

    t.equal(HaikuComponentFactory.PLAYER_VERSION, PACKAGE.version, 'player version is present on factory') // #LEGACY
    t.equal(HaikuComponentFactory.CORE_VERSION, PACKAGE.version, 'core version is present on factory')

    var mount = win.document.createElement('div')
    mount.style.width = '800px'
    mount.style.height = '600px'
    win.document.body.appendChild(mount)

    var component = HaikuComponentFactory(mount, {})

    // These get assigned when the component factory runs
    t.ok(HaikuComponentFactory.renderer)
    t.ok(HaikuComponentFactory.bytecode)

    t.equal(component.PLAYER_VERSION, PACKAGE.version, 'player version is present on component') // #LEGACY
    t.equal(component.CORE_VERSION, PACKAGE.version, 'core version is present on component')

    component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
  })
})
