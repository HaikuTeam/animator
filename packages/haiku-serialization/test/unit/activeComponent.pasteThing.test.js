var test = require('tape')
var path = require('path')
var ActiveComponent = require('./../../src/bll/ActiveComponent')
var File = require('./../../src/bll/File')

test('activeComponent.pasteThing', (t) => {
  t.plan(3)
  var ac = new ActiveComponent({
    alias: 'test',
    uid: path.join(__dirname, '..', 'fixtures', 'projects', 'uno') + '::' + undefined,
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'uno'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {}, action: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  // We would like to see diffs of the operations during this test
  ac.fetchActiveBytecodeFile().doShallowWorkOnly = false
  File.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('component:mounted', () => {
    ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
    var el = ac.findElementByComponentId('b7f18dbaf7ac')
    var pasteable = el.getClipboardPayload('test')
    ac.pasteThing(pasteable, { x: 100, y: 100 }, { from: 'test' }, (err) => {
      t.error(err, 'no err from pasteThing')
      t.equal(JSON.stringify(ac.getReifiedBytecode().timelines.Default[`haiku:b7f18dbaf7ac`]), JSON.stringify({"viewBox":{"0":{"value":"0 0 46 50"}},"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":46}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":50}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":214,"edited":true}},"translation.y":{"0":{"value":138.5,"edited":true}},"style.zIndex":{"0":{"value":1}}}), 'the original properties are correct')
      t.equal(JSON.stringify(ac.getReifiedBytecode().timelines.Default[`haiku:d2dc9833792b`]), JSON.stringify({"viewBox":{"0":{"value":"0 0 46 50"}},"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":46}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":50}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":77,"edited":true}},"translation.y":{"0":{"value":75,"edited":true}},"style.zIndex":{"0":{"value":1}}}), 'the new properties were copied over')
    })
  })
})
