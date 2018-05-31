'use strict';

import * as tape from 'tape';
import SVGPoints from '@core/helpers/SVGPoints';

tape(
  'SVGPoints.polyPointsStringToPoints',
  (t) => {

    t.plan(1);

    const points1 = '149.2,12  49.2 209.1 101     108.2    20  ,  284  50, 28';
    t.equal(
      JSON.stringify([[149.2, 12], [49.2, 209.1], [101, 108.2], [20, 284], [50, 28]]),
      JSON.stringify(SVGPoints.polyPointsStringToPoints(points1)),
    );

  },
);
