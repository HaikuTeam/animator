import tape = require('tape');

import {decomposeCurveBetweenKeyframes, splitBezierForTimelinePropertyAtKeyframe} from '@formats/exporters/curves';
import {Curve} from '@haiku/core/lib/api';

tape('bezier re-interpolation', (suite: tape.Test) => {
  suite.test('keyframe injection preserves linear transitions', (test: tape.Test) => {
    const timelineProperty = {
      0: {value: 0, curve: 'linear' as Curve},
      2: {value: 1},
    };

    splitBezierForTimelinePropertyAtKeyframe(timelineProperty, 1);

    test.true(timelineProperty.hasOwnProperty('1'));
    test.equal(timelineProperty[1].value, 0.5);
    // Yes, these are still linear!
    // @see {@link http://cubic-bezier.com/#0,0,.5,.5}
    test.deepEqual(timelineProperty[0].curve, [0, 0, 0.5, 0.5]);
    // @see {@link http://cubic-bezier.com/#.5,.5,1,1}
    test.deepEqual(timelineProperty[1].curve, [0.5, 0.5, 1, 1]);
    test.end();
  });

  suite.test('keyframe injection neatly decomposes complex curves', (test: tape.Test) => {
    const timelineProperty = {
      0: {value: 0, curve: 'easeInOutQuad' as Curve},
      2: {value: 1},
    };

    splitBezierForTimelinePropertyAtKeyframe(timelineProperty, 1);

    // We have to do some optimistic rounding since the evaluation of mid-point values of cubic curves is epsilon-based.
    // TODO: Back up the rounding decisions in these tests with #math.
    const optimisticallyRound = (value: number, decimalPlaces = 3) => Number(value.toFixed(decimalPlaces));

    // The resulting curve should essentially be the decomposition of an ease-in-out curve into an ease-in curve and
    // an ease-out curve.
    test.true(timelineProperty.hasOwnProperty('1'));
    // Any ease-in-out timing function is at exactly (0.5, 0.5) at time t = 0.5.
    // @see {@link http://cubic-bezier.com/#.45,.03,.51,.96}
    test.equal(optimisticallyRound(timelineProperty[1].value, 1), 0.5);
    // @see {@link http://cubic-bezier.com/#0,0,.73,.51}
    test.deepEqual((timelineProperty[0].curve as any).map(optimisticallyRound), [0, 0, 0.73, 0.513]);
    // @see {@link http://cubic-bezier.com/#0,.5,.53,.96}
    test.deepEqual((timelineProperty[1].curve as any).map(optimisticallyRound), [0, 0.5, 0.53, 0.956]);
    test.end();
  });

  suite.test('compound curve decomposition: elastic', (test: tape.Test) => {
    const timelineProperty = {
      0: {value: 0, curve: 'easeInOutElastic' as Curve},
      10000: {value: 10000},
    };

    decomposeCurveBetweenKeyframes(timelineProperty, 0, 10000);
    // Note: These expected values come from heuristic testing, but they should not change or be flaky.
    test.deepEqual(
      timelineProperty,
      {
        0: {
          curve: 'easeOutSine',
          value: 0,
        },
        1132: {
          curve: 'easeInSine',
          value: 21.5,
        },
        1500: {
          curve: 'easeOutSine',
          value: 0,
        },
        2132: {
          curve: 'easeInSine',
          value: -86,
        },
        2500: {
          curve: [0.633, 0.444, 0.6, -1.5],
          value: 0,
        },
        5000: {
          curve: [0.4, 2.5, 0.367, 0.556],
          value: 5000,
        },
        7500: {
          curve: 'easeOutSine',
          value: 10000,
        },
        7867: {
          curve: 'easeInSine',
          value: 10086,
        },
        8500: {
          curve: 'easeOutSine',
          value: 10000,
        },
        8867: {
          curve: 'easeInSine',
          value: 9978.5,
        },
        10000: {value: 10000},
      },
    );
    test.end();
  });

  suite.test('compound curve decomposition: bounce', (test: tape.Test) => {
    const timelineProperty = {
      0: {value: 0, curve: 'easeInOutBounce' as Curve},
      10000: {value: 10000},
    };

    decomposeCurveBetweenKeyframes(timelineProperty, 0, 10000);
    // Note: These expected values come from heuristic testing, but they should not change or be flaky.
    test.deepEqual(
      timelineProperty,
      {
        0: {
          curve: 'easeInQuad',
          value: 0,
        },
        227: {
          curve: 'easeOutQuad',
          value: 78,
        },
        455: {
          curve: 'easeInQuad',
          value: 0,
        },
        910: {
          curve: 'easeOutQuad',
          value: 312.5,
        },
        1365: {
          curve: 'easeInQuad',
          value: 0,
        },
        2275: {
          curve: 'easeOutQuad',
          value: 1250,
        },
        3185: {
          curve: 'easeInQuad',
          value: 0,
        },
        5000: {
          curve: 'easeInQuad',
          value: 5000,
        },
        6815: {
          curve: 'easeOutQuad',
          value: 10000,
        },
        7725: {
          curve: 'easeInQuad',
          value: 8750,
        },
        8635: {
          curve: 'easeOutQuad',
          value: 10000,
        },
        9090: {
          curve: 'easeInQuad',
          value: 9687.5,
        },
        9545: {
          curve: 'easeOutQuad',
          value: 10000,
        },
        9772: {
          curve: 'easeInQuad',
          value: 9922,
        },
        10000: {value: 10000},
      },
    );
    test.end();
  });

  suite.end();
});
