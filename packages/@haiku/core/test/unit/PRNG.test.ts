import * as tape from 'tape';

import PRNG from '@core/helpers/PRNG';

tape(
  'PRNG',
  (t) => {
    t.plan(3);

    const prng = new PRNG('abcde');
    t.ok(prng);
    t.equal(
      prng.random(),
      0.23144008215179881,
    );
    t.equal(
      prng.random(),
      0.27404636548159655,
    );
  },
);
