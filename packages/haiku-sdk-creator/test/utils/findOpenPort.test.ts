import * as tape from 'tape';
import findOpenPort from '../../lib/utils/findOpenPort';

tape('findOpenPort', (t) => {
  t.plan(2);
  return findOpenPort(null, 'somethingthatshouldfail.haiku.ai', (err, host, port) => {
    t.is(host, '0.0.0.0', 'host falls back to 0.0.0.0 on ENOTFOUND');
    t.equal(typeof port, 'number', 'port number is retrieved');
  });
});
