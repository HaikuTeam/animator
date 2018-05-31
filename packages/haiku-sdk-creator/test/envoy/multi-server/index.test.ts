import EnvoyLogger from '@sdk-creator/envoy/EnvoyLogger';
import EnvoyServer from '@sdk-creator/envoy/EnvoyServer';
import * as tape from 'tape';

tape('envoy:multi-server', async (t) => {
  t.plan(7);

  let s1: any = new EnvoyServer({logger: new EnvoyLogger('error')});
  s1 = await s1.ready();

  let s2: any = new EnvoyServer({logger: new EnvoyLogger('error')});
  s2 = await s2.ready();

  let s3: any = new EnvoyServer({logger: new EnvoyLogger('error')});
  s3 = await s3.ready();

  t.ok(true, 'no port collision exceptions when starting multiple servers');

  t.equal(typeof s1.port, 'number', 'server has port number');
  t.equal(typeof s2.port, 'number', 'server has port number');
  t.equal(typeof s3.port, 'number', 'server has port number');

  t.ok(s1.port !== s2.port, 'server port is different');
  t.ok(s1.port !== s3.port, 'server port is different');
  t.ok(s2.port !== s3.port, 'server port is different');

  s1.close();
  s2.close();
  s3.close();
});
