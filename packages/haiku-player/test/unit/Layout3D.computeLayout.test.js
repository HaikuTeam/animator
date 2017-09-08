var test = require('tape')
var Layout3D = require('./../../src/Layout3D')

test('Layout3D.computeLayout', function (t) {
  t.plan(1)

  var args1 = [
    {
      size: { x: 0, y: 0, z: 0 },
      matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      shown: true,
      opacity: 1
    },
    {
      shown: true,
      opacity: 1,
      mount: { x: 0, y: 0, z: 0 },
      align: { x: 0, y: 0, z: 0 },
      origin: { x: 0, y: 0, z: 0 },
      translation: { x: 33, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 0 },
      scale: { x: 1, y: 1, z: 1 },
      sizeProportional: { x: 0.5, y: 1, z: 1 },
      sizeMode: { x: 0, y: 0, z: 0 },
      sizeDifferential: { x: 0, y: 0, z: 0 },
      sizeAbsolute: { x: 0, y: 0, z: 0 }
    },
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    { x: 852, y: 839, z: 0 }
  ]
  var output1 = Layout3D.computeLayout.apply(null, args1)
  t.equal(
    JSON.stringify(output1),
    `{"size":{"x":426,"y":839,"z":0},"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,33,0,0,1],"shown":true,"opacity":1,"align":{"x":0,"y":0,"z":0},"mount":{"x":0,"y":0,"z":0},"origin":{"x":0,"y":0,"z":0},"offset":{"x":33,"y":0,"z":0}}`
  )
})
