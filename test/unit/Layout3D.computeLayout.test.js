var test = require('tape');
var Layout3D = require('./../../lib/Layout3D').default;

test('Layout3D.computeLayout', function (t) {
  t.plan(1);

  const args1 = [
    {
      shown: true,
      opacity: 1,
      mount: {x: 0, y: 0, z: 0},
      align: {x: 0, y: 0, z: 0},
      origin: {x: 0, y: 0, z: 0},
      translation: {x: 33, y: 0, z: 0},
      rotation: {x: 0, y: 0, z: 0, w: 0},
      orientation: {x: 0, y: 0, z: 0, w: 0},
      scale: {x: 1, y: 1, z: 1},
      sizeProportional: {x: 0.5, y: 1, z: 1},
      sizeMode: {x: 0, y: 0, z: 0},
      sizeDifferential: {x: 0, y: 0, z: 0},
      sizeAbsolute: {x: 0, y: 0, z: 0}
    },
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    {x: 852, y: 839, z: 0}
  ];

  t.deepEqual(
    Layout3D.computeLayout(...args1),
    {
      align: {x: 0, y: 0, z: 0},
      matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 33, 0, 0, 1],
      mount: {x: 0, y: 0, z: 0},
      offset: {x: 33, y: 0, z: 0},
      opacity: 1,
      origin: {x: 0, y: 0, z: 0},
      shown: true,
      size: {x: 426, y: 839, z: 0},
    }
  );
});
