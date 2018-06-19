import * as tape from 'tape';

import {getVanity} from '@core/HaikuComponent';

tape(
  'dom.vanities',
  (t) => {
    t.plan(1);
    t.ok(typeof getVanity(null, 'rotation.x') === 'function');
  },
);
