import * as tape from 'tape';
const schema = require('./../../lib/properties/dom/schema').default;
const fs = require('fs');

tape('dom.properties', (t) => {
  t.plan(1);
  t.ok(
    schema.div['style.zIndex'] === 'number',
  );
});
