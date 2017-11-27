import * as tape from 'tape';
import * as cp from 'child_process';
import * as path from 'path';
import EnvoyServer from '../../../lib/envoy/EnvoyServer';
import EnvoyLogger from '../../../lib/envoy/EnvoyLogger';
import CatHandler from './CatHandler';

tape('envoy:killed-proc', async (t) => {
  t.plan(1);

  let server = new EnvoyServer({logger: new EnvoyLogger('error')});
  server = await server.ready();
  server.bindHandler('cat', CatHandler, new CatHandler(server));
  process.env.HAIKU_SDK_TEST_PORT = '' + server.port;

  const p1 = cp.fork(path.join(__dirname, 'uno.js'));
  const p2 = cp.fork(path.join(__dirname, 'dos.js'));

  setTimeout(() => {
    p2.kill();
    setTimeout(() => {
      p1.kill();
      server.close();
      t.ok(true, 'proc kill did not destroy everything');
    },         2500);
  },         2500);
});
