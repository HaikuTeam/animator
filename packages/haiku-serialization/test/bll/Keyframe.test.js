const tape = require('tape')
const path = require('path')
const ActiveComponent = require('./../../src/bll/ActiveComponent')
const Row = require('./../../src/bll/Row')

tape('Keyframe', (t) => {
  t.plan(28)
  const ac = ActiveComponent.upsert({
    alias: 'test',
    uid: path.join(__dirname, '..', 'fixtures', 'projects', 'hydratetest') + '::' + undefined,
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'hydratetest'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {}, action: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  ac.mountApplication()
  let once = true
  ac.on('update', (what) => {
    if (once && what === 'application-mounted') {
      once = false
      ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()

      const top = ac.getCurrentRows({ parent: null })[0]

      const kfs = top.children[3].children[0].getKeyframes()
      t.equal(kfs.length, 4)
      t.equal(kfs[2].getPixelOffsetLeft(0, 10, 16.666), 130)
      t.ok(kfs[1].isTransitionSegment())
      t.ok(kfs[0].isConstantSegment())
      t.ok(!kfs[3].isConstantSegment())
      t.ok(!kfs[3].isTransitionSegment())
      t.equal(kfs[0].next(), kfs[1])
      t.equal(kfs[0].next(), kfs[2].prev())
      t.equal(kfs[3].next(), undefined)
      t.equal(kfs[0].prev(), undefined)

      const r1 = Row.findPropertyRowsByParentComponentId('cccccccccccc').filter((row) => row.getPropertyName() === 'opacity' )[0]
      t.equal(r1.getKeyframes().length, 1, 'row has 1 keyframe to begin')
      r1.createKeyframe(0.11, 0, { from: 'test' })
      t.equal(r1.getKeyframes().length, 1, 'row still has 1 keyframe (was upsert)')
      r1.createKeyframe(0.21, 67, { from: 'test' })
      t.equal(r1.getKeyframes().length, 2, 'row now has 2 keyframes')
      t.ok(r1.getKeyframe(0).next(), 'kf 0 has a next kf')
      r1.createKeyframe(0.22, 67, { from: 'test' })
      t.equal(r1.getKeyframes().length, 2, 'row still has 2 keyframes')
      t.ok(r1.getKeyframe(0).next(), 'kf 0 has a next kf')
      r1.createKeyframe(0.31, 133, { from: 'test' })
      t.equal(r1.getKeyframes().length, 3, 'row now has 3 keyframes')
      t.ok(r1.getKeyframe(0).next(), 'kf 0 still has a next kf')
      t.ok(r1.getKeyframe(1).next(), 'kf 1 now has a next kf')
      r1.getKeyframe(0).select()
      r1.getKeyframe(1).select({ skipDeselect: 1 })
      t.equal(ac.getSelectedKeyframes().length, 2, '2 selected kfs')
      ac.joinSelectedKeyframes('linear', { from: 'test' })
      t.equal(r1.getKeyframe(0).getCurve(), 'linear', 'kf 0 is linear')
      t.equal(r1.getKeyframe(1).getCurve(), 'linear', 'kf 1 is linear')
      t.equal(r1.getKeyframe(2).getCurve(), undefined, 'kf 2 is nil curve')
      t.ok(r1.getKeyframe(0).next(), 'kf 0 still has a next kf')
      t.ok(r1.getKeyframe(1).next(), 'kf 1 still has a next kf')
      r1.createKeyframe(0.23, 67, { from: 'test' })
      t.ok(r1.getKeyframe(0).next(), 'kf 0 still has a next kf')
      t.ok(r1.getKeyframe(1).next(), 'kf 1 still has a next kf')
      t.equal(r1.getKeyframes().length, 3, '3 total kfs')
    }
  })
})
