var test = require('tape')
var pkg = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var HaikuDOMAdapter = require('./../../dom')

test('dom-embed', function (t) {
  t.plan(13)

  TestHelpers.createDOM((err, win, mount) => {
    if (err) throw err

    HaikuDOMAdapter.defineOnWindow()

    t.ok(window.HaikuCore[pkg.version], 'core attached to window')

    var adapter = window.HaikuCore[pkg.version]

    t.is(adapter, HaikuDOMAdapter, 'adapter is adapter')
    t.is(window.HaikuResolve(pkg.version), adapter, 'HaikuResolve can resolve the adapter at current version')
    t.is(window.HaikuResolve('99.99.99'), undefined, 'HaikuResolve does not resolve a version that is too high')
    t.is(window.HaikuResolve('0.0.1'), undefined, 'HaikuResolve does not resolve a version that is too low')
    const originalVersionParts = pkg.version.split('.').map(Number)
    const onePatchBehind = [...originalVersionParts]
    onePatchBehind[2] = Math.max(onePatchBehind[2] - 1, 0)
    console.log(onePatchBehind.join('.'))
    t.is(window.HaikuResolve(onePatchBehind.join('.')), adapter, 'HaikuResolve can resolve from an earlier patch')
    const onePatchAhead = [...originalVersionParts]
    onePatchAhead[2] += 1
    t.is(window.HaikuResolve(onePatchAhead.join('.')), undefined, 'HaikuResolve cannot resolve from a later patch')

    var HaikuComponentFactory = adapter({
      timelines: { Default: { foo: {} } },
      template: { elementName: 'div', attributes: { id: 'foo '}, children: [] }
    })

    t.equal(HaikuComponentFactory.PLAYER_VERSION, pkg.version, 'player version equal') // #LEGACY
    t.equal(HaikuComponentFactory.CORE_VERSION, pkg.version, 'core version equal')


    var component = HaikuComponentFactory(mount)

    t.equal(component.constructor.__name__, 'HaikuComponent', 'component is component')
    t.equal(component.constructor.name, 'HaikuComponent', 'component is component')
    t.equal(component.PLAYER_VERSION, pkg.version, 'player version equal') // #LEGACY
    t.equal(component.CORE_VERSION, pkg.version, 'core version equal')

    component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
  })
})
