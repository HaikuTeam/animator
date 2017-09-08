var test = require('tape')
var path = require('path')
var ActiveComponent = require('./../../src/model/ActiveComponent')

test('activeComponent.pasteThing', (t) => {
  t.plan(4)
  var ac = new ActiveComponent({
    alias: 'test',
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'uno'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  // We would like to see diffs of the operations during this test
  ac.fetchActiveBytecodeFile().set('doShallowWorkOnly', false)
  ac.FileModel.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('component:mounted', () => {
    ac._componentInstance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
    // Reload the full content from the file system, including the ast so we can diff log etc
    ac.fetchActiveBytecodeFile().read((err) => {
      var el = ac._elements.find('b7f18dbaf7ac')
      var pasteable = el.getClipboardPayload('test')
      ac.pasteThing(pasteable, { x: 100, y: 100 }, { from: 'test' }, (err) => {
        t.error(err, 'no err from pasteThing')
        // Wait for the commit debounce to complete
        setTimeout(() => {
          var bytecode = ac.getSerializedBytecode()
          t.equal(JSON.stringify(bytecode.timelines.Default[`haiku:b7f18dbaf7ac`]), JSON.stringify({"viewBox":{"0":{"value":"0 0 46 50"}},"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":46}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":50}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":214,"edited":true}},"translation.y":{"0":{"value":138.5,"edited":true}},"style.zIndex":{"0":{"value":1}}}), 'the original properties are correct')
          t.equal(JSON.stringify(bytecode.timelines.Default[`haiku:d2dc9833792b`]), JSON.stringify({"viewBox":{"0":{"value":"0 0 46 50"}},"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":46}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":50}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":77,"edited":true}},"translation.y":{"0":{"value":75,"edited":true}},"style.zIndex":{"0":{"value":1}}}), 'the new properties were copied over')
          t.ok(true)
        }, 64 * 2)
      })
    })
  })
})
