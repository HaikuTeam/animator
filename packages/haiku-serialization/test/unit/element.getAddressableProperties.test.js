'use strict'

var test = require('tape')
var path = require('path')
var ActiveComponent = require('./../../src/bll/ActiveComponent')
var File = require('./../../src/bll/File')

test('element.getAddressableProperties.test.js', function (t) {
  t.plan(1)
  var ac = new ActiveComponent({
    alias: 'test',
    uid: path.join(__dirname, '..', 'fixtures', 'projects', 'uno') + '::' + undefined,
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'uno'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  ac.fetchActiveBytecodeFile().doShallowWorkOnly = false // We would like to see diffs of the operations during this test
  File.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('update', (what) => {
    if (what === 'application-mounted') {
      ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
      var el = ac.findElementByComponentId('b7f18dbaf7ac')
      var addressables = el.getAddressableProperties()
      t.ok(addressables)
    }
  })
})
