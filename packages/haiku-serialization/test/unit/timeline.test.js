var test = require('tape')
var path = require('path')
var ActiveComponent = require('./../../src/model/ActiveComponent')

test('timeline', (t) => {
  t.plan(3)
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
    var tl = ac.getCurrentTimeline()
    t.ok(tl, 'timeline can be got')
    tl.play()
    setTimeout(() => {
      tl.pause()
      tl.seek(100)
      t.equal(tl.currentFrame, 100)
      t.equal(tl.playing, false)
    }, 100)
  })
})
