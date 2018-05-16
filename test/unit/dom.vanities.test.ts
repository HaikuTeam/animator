import * as tape from 'tape';
const vanities = require('./../../lib/properties/dom/vanities').default;
const fs = require('fs');

tape('dom.vanities', (t) => {
  t.plan(1);
  t.ok(typeof vanities.div['rotation.w'] === 'function');
});
