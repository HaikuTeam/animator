import * as tape from 'tape';

import {
  InterpolationPoints,
  injectKeyframeInTimelineProperty,
} from '../../lib/exporters/curves';

tape('bezier re-interpolation', (test: tape.Test) => {
  test.test('keyframe injection preserves linear transitions', (test: tape.Test) => {
    const timelineProperty = {
      0: {value: 0, curve: 'linear'},
      2: {value: 1},
    };

    injectKeyframeInTimelineProperty(timelineProperty, 1);

    test.true(timelineProperty.hasOwnProperty('1'));
    test.equal(timelineProperty[1].value, 0.5);
    // Yes, these are still linear!
    // @see {@link http://cubic-bezier.com/#0,0,.5,.5}
    test.deepEqual(timelineProperty[0].curve, [0, 0, 0.5, 0.5]);
    // @see {@link http://cubic-bezier.com/#.5,.5,1,1}
    test.deepEqual(timelineProperty[1].curve, [0.5, 0.5, 1, 1]);
    test.end();
  });

  test.test('keyframe injection neatly decomposes complex curves', (test: tape.Test) => {
    const timelineProperty = {
      0: {value: 0, curve: 'easeInOutQuad'},
      2: {value: 1},
    };

    injectKeyframeInTimelineProperty(timelineProperty, 1);

    // We have to do some optimistic rounding since the evaluation of mid-point values of cubic curves is epsilon-based.
    // TODO: Back up the rounding decisions in these tests with #math.
    const optimisticallyRound = (value, decimalPlaces = 3) => Number(value.toFixed(decimalPlaces));

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

  test.end();
});
