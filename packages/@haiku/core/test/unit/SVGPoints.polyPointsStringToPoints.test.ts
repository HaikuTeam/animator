'use strict';

import SVGPoints from '@core/helpers/SVGPoints';
import * as tape from 'tape';

tape(
  'SVGPoints.polyPointsStringToPoints',
  (t) => {
    t.deepEqual(
      SVGPoints.polyPointsStringToPoints('149.2,12  49.2 209.1 101     108.2    20  ,  284  50, 28'),
      [[149.2, 12], [49.2, 209.1], [101, 108.2], [20, 284], [50, 28]],
    );

    t.deepEqual(
      SVGPoints.polyPointsStringToPoints('33.0923435 -30.2510571 52.5923435 50.7489429 -29.0005041 28.5544302'),
      [[33.0923435, -30.2510571], [52.5923435, 50.7489429], [-29.0005041, 28.5544302]],
    );

    t.end();
  },
);
