var test = require('tape')
var pkg = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var HaikuDOMAdapter = require('./../../dom')

test('dom-embed', function (t) {
  t.plan(8)

  TestHelpers.createDOM((err, win, mount) => {
    if (err) throw err

    HaikuDOMAdapter.defineOnWindow()

    t.ok(window.HaikuPlayer[pkg.version], 'player attached to window') // #LEGACY
    t.ok(window.HaikuCore[pkg.version], 'core attached to window')

    var adapter = window.HaikuCore[pkg.version]

    t.equal(adapter, HaikuDOMAdapter, 'adapter is adapter')

    var HaikuComponentFactory = adapter({
      timelines: { Default: { foo: {} } },
      template: { elementName: 'div', attributes: { id: 'foo '}, children: [] }
    })

    t.equal(HaikuComponentFactory.PLAYER_VERSION, pkg.version, 'player version equal') // #LEGACY
    t.equal(HaikuComponentFactory.CORE_VERSION, pkg.version, 'core version equal')


    var component = HaikuComponentFactory(mount)

    t.equal(component.constructor.name, 'HaikuComponent', 'component is component')
    t.equal(component.PLAYER_VERSION, pkg.version, 'player version equal') // #LEGACY
    t.equal(component.CORE_VERSION, pkg.version, 'core version equal')

    component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
  })
})
