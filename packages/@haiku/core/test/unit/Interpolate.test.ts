import {Curve} from '@core/api';
import {interpolate} from '@core/Interpolate';
import * as tape from 'tape';

tape('Interpolate', (suite) => {
  suite.test('number', (test) => {
    test.is(interpolate(0, Curve.Linear, 0, 1, 0, 1), 0);
    test.is(interpolate(0.5, Curve.Linear, 0, 1, 0, 1), 0.5);
    test.is(interpolate(1, Curve.Linear, 0, 1, 0, 1), 1);
    test.end();
  });

  suite.test('array', (test) => {
    test.deepEqual(interpolate(0, Curve.Linear, 0, 1, [0, 10], [1, 11]), [0, 10]);
    test.deepEqual(interpolate(0.5, Curve.Linear, 0, 1, [0, 10], [1, 11]), [0.5, 10.5]);
    test.deepEqual(interpolate(1, Curve.Linear, 0, 1, [0, 10], [1, 11]), [1, 11]);
    test.end();
  });

  suite.test('object', (test) => {
    test.deepEqual(interpolate(0, Curve.Linear, 0, 1, {a: 0, b: 10}, {a: 1, b: 11}), {a: 0, b: 10});
    test.deepEqual(interpolate(0.5, Curve.Linear, 0, 1, {a: 0, b: 10}, {a: 1, b: 11}), {a: 0.5, b: 10.5});
    test.deepEqual(interpolate(1, Curve.Linear, 0, 1, {a: 0, b: 10}, {a: 1, b: 11}), {a: 1, b: 11});
    test.end();
  });

  suite.test('untweenable string', (test) => {
    test.is(interpolate(0, Curve.Linear, 0, 1, 'foo', 'bar'), 'foo');
    test.is(interpolate(0.5, Curve.Linear, 0, 1, 'foo', 'bar'), 'foo');
    test.is(interpolate(1, Curve.Linear, 0, 1, 'foo', 'bar'), 'foo');
    test.end();
  });

  suite.test('tweenable string', (test) => {
    test.is(interpolate(0, Curve.Linear, 0, 1, '0%', '100%'), '0%');
    test.is(interpolate(0.5, Curve.Linear, 0, 1, '0%', '100%'), '50%');
    test.is(interpolate(1, Curve.Linear, 0, 1, '0%', '100%'), '100%');
    test.end();
  });

  suite.test('e2e', (test) => {
    test.deepEqual(
      interpolate(
        0,
        Curve.Linear,
        0,
        1,
        {
          a: [0, 10],
          b: '0%',
        },
        {
          a: [1, 11],
          b: '100%',
        },
      ),
      {
        a: [0, 10],
        b: '0%',
      },
    );
    test.deepEqual(
      interpolate(
        0.5,
        Curve.Linear,
        0,
        1,
        {
          a: [0, 10],
          b: '0%',
        },
        {
          a: [1, 11],
          b: '100%',
        },
      ),
      {
        a: [0.5, 10.5],
        b: '50%',
      },
    );
    test.deepEqual(
      interpolate(
        1,
        Curve.Linear,
        0,
        1,
        {
          a: [0, 10],
          b: '0%',
        },
        {
          a: [1, 11],
          b: '100%',
        },
      ),
      {
        a: [1, 11],
        b: '100%',
      },
    );
    test.end();
  });

  suite.end();
});
