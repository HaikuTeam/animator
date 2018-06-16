import * as tape from 'tape';

import schema from '@core/properties/dom/schema';

tape(
  'dom.properties',
  (t) => {
    t.plan(1);
    t.ok(schema.div['style.zIndex'] === 'number');
  },
);
