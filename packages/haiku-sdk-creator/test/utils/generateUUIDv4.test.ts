import * as tape from 'tape';
import generateUUIDv4 from '../../lib/utils/generateUUIDv4';

tape('generateUUIDv4', (t) => {
  t.plan(1);
  const uuid1 = generateUUIDv4();
  t.equal(uuid1.length, 36, 'uuid is correct length');
});
