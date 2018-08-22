import * as tape from 'tape';

import Layout3D from '@core/Layout3D';

const ignoredSize = {x: 0, y: 0, z: 0};

const roundMatrix = (matrix: number[]) => matrix.map((entry) => Number(entry.toFixed(5)));

tape('layout.computeMatrix', (suite) => {
  suite.test('identity', (test) => {
    test.deepEqual(
      Layout3D.computeMatrix(Layout3D.createLayoutSpec(), ignoredSize),
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      'default layout spec produces identity matrix',
    );
    test.end();
  });

  suite.test('translation', (test) => {
    const layoutSpec = Layout3D.createLayoutSpec();
    layoutSpec.translation = {x: 1, y: 2, z: 3};
    test.deepEqual(
      Layout3D.computeMatrix(layoutSpec, ignoredSize),
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1],
      'translation populates fourth column',
    );
    test.end();
  });

  suite.test('rotation', (test) => {
    const layoutSpec = Layout3D.createLayoutSpec();
    layoutSpec.rotation.z = Math.PI / 4;
    test.deepEqual(
      Layout3D.computeMatrix(layoutSpec, ignoredSize),
      [
        Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), 0, 0,
        -Math.sin(Math.PI / 4), Math.cos(Math.PI / 4), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ],
      'rotation.z produces a normal Euclidean rotation matrix',
    );

    layoutSpec.rotation.x = -Math.PI / 4;
    test.deepEqual(
      roundMatrix(Layout3D.computeMatrix(layoutSpec, ignoredSize)),
      roundMatrix([
        Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), 0, 0,
        -0.5, 0.5, -Math.sin(Math.PI / 4), 0,
        -0.5, 0.5, Math.cos(Math.PI / 4), 0,
        0, 0, 0, 1,
      ]),
      '3D rotation composes correctly',
    );

    test.end();
  });

  suite.test('shear', (test) => {
    const layoutSpec = Layout3D.createLayoutSpec();
    layoutSpec.shear.xy = 1;
    test.deepEqual(
      Layout3D.computeMatrix(layoutSpec, ignoredSize),
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      'shear.xy skews X over Y',
    );

    layoutSpec.shear.xz = 0.5;
    test.deepEqual(
      Layout3D.computeMatrix(layoutSpec, ignoredSize),
      [1, 0, 0, 0, 1, 1, 0, 0, 0.5, 0, 1, 0, 0, 0, 0, 1],
      'shear.xz skews X over Z and composes cleanly',
    );

    layoutSpec.shear.yz = 0.5;
    test.deepEqual(
      Layout3D.computeMatrix(layoutSpec, ignoredSize),
      [1, 0, 0, 0, 1, 1, 0, 0, 1, 0.5, 1, 0, 0, 0, 0, 1],
      'shear.yz skews Y over Z and composes cleanly',
    );
    test.end();
  });

  suite.test('origin', (test) => {
    // When we pass `true` to createLayoutSpec, we get a default center-origin.
    const layoutSpec = Layout3D.createLayoutSpec(true);
    test.deepEqual(
      Layout3D.computeMatrix(layoutSpec, {x: 100, y: 200, z: 0}),
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -50, -100, 0, 1],
      'origin offsets translation proportional to layout size',
    );
    test.end();
  });

  suite.test('scale', (test) => {
    const layoutSpec = Layout3D.createLayoutSpec();
    layoutSpec.scale = {x: 1.1, y: 1.2, z: 1.3};
    test.deepEqual(
      Layout3D.computeMatrix(layoutSpec, ignoredSize),
      [1.1, 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 1.3, 0, 0, 0, 0, 1],
      'scale creates a pure scaling matrix',
    );
    test.end();
  });

  suite.test('offset', (test) => {
    const layoutSpec = Layout3D.createLayoutSpec();
    layoutSpec.offset = {x: 1, y: 2, z: 3};
    test.deepEqual(
      Layout3D.computeMatrix(layoutSpec, ignoredSize),
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1],
      'offset offsets translation',
    );
    test.end();
  });

  suite.test('e2e', (test) => {
    const layoutSpec = Layout3D.createLayoutSpec(true);
    layoutSpec.translation = {x: 1, y: 2, z: 3};
    layoutSpec.rotation.z = Math.PI / 4;
    layoutSpec.rotation.x = -Math.PI / 4;
    layoutSpec.shear.xy = 1;
    layoutSpec.shear.xz = 0.5;
    layoutSpec.shear.yz = 0.5;
    layoutSpec.scale = {x: 1.1, y: 1.2, z: 1.3};
    layoutSpec.offset = {x: 1, y: 2, z: 3};

    test.deepEqual(
      roundMatrix(Layout3D.computeMatrix(layoutSpec, {x: 100, y: 200, z: 0})),
      roundMatrix([
        0.77782, 0.77782, 0, 0,
        0.24853, 1.44853, -0.84853, 0,
        -0.05576, 1.89424, 0.45962, 0,
        -61.74369, -179.74369, 90.85281, 1,
      ]),
      'computeMatrix composes rotation, then shear, then scale, then origin- and explicit-offset translation',
    );
    test.end();
  });

  suite.end();
});
