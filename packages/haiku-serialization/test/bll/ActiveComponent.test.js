const tape = require('tape')
const path = require('path')
const ActiveComponent = require('./../../src/bll/ActiveComponent')
const Row = require('./../../src/bll/Row')

tape('ActiveComponent', (t) => {
  t.plan(16)
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
  ac.on('updated', (what) => {
    if (what === 'application-mounted') {
      ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()

      const top = ac.getCurrentRows({ parent: null })[0]
      t.ok(top, 'top row present')
      t.equal(top.uid, 'aaaaaaaaaaaa-heading', 'top is the heading')
      t.equal(top.children.length, 6, 'has correct children')
      t.equal(top.children[0].property.name, 'backgroundColor', 'has prop')
      t.equal(top.children[3].children[2].children[0].property.name, 'rotation.x', 'has child with cluster prop')

      top.children[5].children[3].children[1].focus() // Very bottom
      Row.focusSelectNext(1, true) // Should jump to top
      const out = Row.dumpHierarchyInfo()
      t.equal(out, 'element-heading.0|0.0.0 {e}\n    property.1|0.0.1.backgroundColor {s} {f} {e}\n    property.2|0.0.2.opacity {e}\n    cluster-heading.3|0.0.3.sizeAbsolute[]\n        property.4|0.0.4.sizeAbsolute[].sizeAbsolute.x {e}\n        property.5|0.0.5.sizeAbsolute[].sizeAbsolute.y {e}\n    element-heading.6|1.0.0\n        property.7|1.0.1.opacity {e}\n        cluster-heading.8|1.0.2.translation[]\n            property.9|1.0.3.translation[].translation.x {e}\n            property.10|1.0.4.translation[].translation.y {e}\n        cluster-heading.11|1.0.5.rotation[]\n            property.12|1.0.6.rotation[].rotation.x {e}\n            property.13|1.0.7.rotation[].rotation.y {e}\n            property.14|1.0.8.rotation[].rotation.z {e}\n        cluster-heading.15|1.0.9.scale[]\n            property.16|1.0.10.scale[].scale.x {e}\n            property.17|1.0.11.scale[].scale.y {e}\n    element-heading.18|1.1.0\n        property.19|1.1.1.opacity {e}\n        cluster-heading.20|1.1.2.translation[]\n            property.21|1.1.3.translation[].translation.x {e}\n            property.22|1.1.4.translation[].translation.y {e}\n        cluster-heading.23|1.1.5.rotation[]\n            property.24|1.1.6.rotation[].rotation.x {e}\n            property.25|1.1.7.rotation[].rotation.y {e}\n            property.26|1.1.8.rotation[].rotation.z {e}\n        cluster-heading.27|1.1.9.scale[]\n            property.28|1.1.10.scale[].scale.x {e}\n            property.29|1.1.11.scale[].scale.y {e}\n        element-heading.30|2.0.0\n    element-heading.31|1.2.0\n        property.32|1.2.1.opacity {e}\n        cluster-heading.33|1.2.2.translation[]\n            property.34|1.2.3.translation[].translation.x {e}\n            property.35|1.2.4.translation[].translation.y {e}\n        cluster-heading.36|1.2.5.rotation[]\n            property.37|1.2.6.rotation[].rotation.x {e}\n            property.38|1.2.7.rotation[].rotation.y {e}\n            property.39|1.2.8.rotation[].rotation.z {e}\n        cluster-heading.40|1.2.9.scale[]\n            property.41|1.2.10.scale[].scale.x {e}\n            property.42|1.2.11.scale[].scale.y {e}', 'tree string out is ok')

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
    }
  })
})
