import * as tape from 'tape';

import vanities from '@core/properties/dom/vanities';

tape(
  'dom.vanities',
  (t) => {
    t.plan(1);
    t.ok(typeof vanities.div['rotation.x'] === 'function');
  },
);
