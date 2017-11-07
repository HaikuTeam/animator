var test = require('tape')
var path = require('path')
var ActiveComponent = require('./../../src/bll/ActiveComponent')
var File = require('./../../src/bll/File')

test('timeline', (t) => {
  t.plan(3)
  var ac = new ActiveComponent({
    alias: 'test',
    uid: path.join(__dirname, '..', 'fixtures', 'projects', 'uno') + '::' + undefined,
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'uno'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  // We would like to see diffs of the operations during this test
  ac.fetchActiveBytecodeFile().doShallowWorkOnly = false
  File.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('update', (what) => {
    if (what === 'application-mounted') {
      ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
      var tl = ac.getCurrentTimeline()
      t.ok(tl, 'timeline can be got')
      tl.play()
      setTimeout(() => {
        tl.pause()
        tl.seek(100)
        t.equal(tl.getCurrentFrame(), 100)
        t.equal(tl.isPlaying(), false)
      }, 100)
    }
  })
})
