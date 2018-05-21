import * as tape from 'tape';
// tslint:disable-next-line:variable-name
const Layout3D = require('./../../lib/Layout3D').default;

tape('Layout3D.computeLayout', (t) => {
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
      shear: {xy: 0, xz: 0, yz: 0},
      sizeProportional: {x: 0.5, y: 1, z: 1},
      sizeMode: {x: 0, y: 0, z: 0},
      sizeDifferential: {x: 0, y: 0, z: 0},
      sizeAbsolute: {x: 0, y: 0, z: 0},
      computed: {},  // Should be removed
    },
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    {x: 852, y: 839, z: 0},
    null,
  ];

  const {align, matrix, mount, opacity, origin, shown, size, computed} = Layout3D.computeLayout(...args1);

  t.deepEqual(align, {x: 0, y: 0, z: 0});
  t.deepEqual(matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 33, 0, 0, 1]);
  t.deepEqual(mount, {x: 0, y: 0, z: 0});
  t.equal(opacity, 1);
  t.deepEqual(origin, {x: 0, y: 0, z: 0});
  t.true(shown);
  t.deepEqual(size, {x: 426, y: 839, z: 0});
  t.is(undefined, computed);
  t.end();
});
