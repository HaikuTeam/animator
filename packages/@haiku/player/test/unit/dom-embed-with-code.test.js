var test = require('tape')
var pkg = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var HaikuDOMAdapter = require('./../../dom')

test('dom-embed-with-code', function (t) {
  t.plan(1)

  TestHelpers.createDOM((err, win, mount) => {
    if (err) throw err
    HaikuDOMAdapter.defineOnWindow()
    var adapter = window.HaikuPlayer[pkg.version]
    var HaikuComponentFactory = adapter(require('./../fixtures/code1.js'))
    var component = HaikuComponentFactory(mount)
    component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
    t.ok(true)
  })
})
