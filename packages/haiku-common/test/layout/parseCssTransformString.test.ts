/* tslint:disable:max-line-length */
import * as tape from 'tape';

import parseCssTransformString from '@common/layout/parseCssTransformString';

tape(
  'layout.parseCssTransformString',
  (test) => {
    const data: [string, {}][] = [
      [
        null,
        {},
      ],
      [
        'none',
        {},
      ],
      [
        '',
        {},
      ],
      [
        'none  ',
        {},
      ],
      [
        'none;  ',
        {},
      ],
      [
        'translate(88.000000,87.000000)',
        {
          'translation.x': 88,
          'translation.y': 87,
        },
      ],
      [
        'translate(88.000000,87.000000) translate(-88.000000,-87.000000)',
        {},
      ],
      [
        'translate(88.000000,87.000000) rotate(-90.00) translate(-88.000000,-87.000000)',
        {
          'translation.x': 1,
          'translation.y': 175,
          'rotation.z': 4.712,
        },
      ],
      [
        'translate(55.500000, 68.500000) rotate(-9.000000) translate(-55.500000, -68.500000) translate(10.000000, 7.000000)',
        {
          'translation.x': 0.939,
          'translation.y': 14.875,
          'rotation.z': 6.126,
        },
      ],
      [
        'translate(88.000000,87.000000) scale(1.5,1.5)',
        {
          'translation.x': 88,
          'translation.y': 87,
          'scale.x': 1.5,
          'scale.y': 1.5,
        },
      ],
      [
        'rotate(45) translate(0.25,1.56)',
        {
          'translation.x': -0.926,
          'translation.y': 1.28,
          'rotation.z': 0.785,
        },
      ],
      [
        'rotate(217) rotate(-32) rotate(56)',
        {'rotation.z': 4.206},
      ],
      [
        'matrix3d(1.5,0,0,0,0,1.5,0,0,0,0,1.5,0,1,1,1,1);',
        {
          'scale.x': 1.5,
          'scale.y': 1.5,
          'scale.z': 1.5,
          'translation.x': 1,
          'translation.y': 1,
          'translation.z': 1,
        },
      ],
      [
        'matrix(1.5,0,0,1.5,1,1);',
        {
          'scale.x': 1.5,
          'scale.y': 1.5,
          'translation.x': 1,
          'translation.y': 1,
        },
      ],
      [
        'matrix(1.5,1,1,1.5,0,0);',
        {
          'rotation.z': 0.588,
          'scale.x': 1.803,
          'scale.y': 0.693,
          'shear.xy': 2.4,
        },
      ],
      [
        'translate3d(1,2,3);',
        {
          'translation.x': 1,
          'translation.y': 2,
          'translation.z': 3,
        },
      ],
      [
        'scale3d(1,2,3);',
        {
          'scale.y': 2,
          'scale.z': 3,
        },
      ],
      [
        'rotate3d(0,90deg,120deg);',
        {
          'scale.x': 0, // Because the horizon has vanished.
        },
      ],
      [
        'matrix3d(1,0,0,.1,-0.2,-.22,30000,1,0,0,0,1,0.2,0,0,1) translate3d(10px,20,20) matrix(0,6,4,3,2.2,0) scale3d(0,0,0) rotate3d(0,0.5,0,0) rotateZ(1.2);',
        {
          'scale.x': 0,
        },
      ],
      [
        'translate(33.000000, 92.000000) rotate(10.000000) translate(-33.000000, -92.000000) translate(-2.000000, 1.000000)',
        {
          'translation.x': 14.334,
          'translation.y': -3.695,
          'rotation.z': 0.175,
        },
      ],
      [
        'translate(43.270256, 92.695192) scale(-1, 1) rotate(10.000000) translate(-43.270256, -92.695192) translate(8.270256, 1.695192)',
        {
          'translation.x': 61.937,
          'translation.y': -3,
          'rotation.x': 3.142,
          'rotation.z': 6.109,
          'scale.x': -1,
          'scale.y': -1,
          'scale.z': -1,
        },
      ],
      [
        'translate(3.14)',
        {
          'translation.x': 3.14,
        },
      ],
      [
        'scale(2.72)',
        {
          'scale.x': 2.72,
          'scale.y': 2.72,
        },
      ],
      // Test for rotation about a point other than (0, 0)
      [
        'rotate(90 10 10)',
        {
          'translation.x': 20,
          'rotation.z': 1.571,
        },
      ],
    ];

    test.plan(data.length);

    data.forEach(([transformString, expected], idx) => {
      test.deepEqual(
        parseCssTransformString(transformString),
        expected, 'output is expected (' + idx + ')',
      );
    });
  },
);
