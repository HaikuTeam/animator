import * as tape from 'tape';
const vanities = require('./../../lib/properties/dom/vanities').default;

tape('dom.vanities', (t) => {
  t.plan(1);
  t.ok(typeof vanities.div['rotation.x'] === 'function');
});
