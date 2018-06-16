import EnvoyLogger from '@sdk-creator/envoy/EnvoyLogger';
import EnvoyServer from '@sdk-creator/envoy/EnvoyServer';
import * as cp from 'child_process';
import * as path from 'path';
import * as tape from 'tape';
import CatHandler from './CatHandler';

tape('envoy:killed-proc', async (t) => {
  t.plan(1);

  let server: any = new EnvoyServer({logger: new EnvoyLogger('error')});
  server = await server.ready();
  server.bindHandler('cat', CatHandler, new CatHandler(server));
  process.env.HAIKU_SDK_TEST_PORT = '' + server.port;

  // …hack. We need to use ts-node as our runner in order for everything to work correctly.
  const p1 = cp.fork(
    './node_modules/.bin/ts-node',
    [
      '-r',
      'tsconfig-paths/register',
      '-P',
      'tsconfig.all.json',
      path.join(__dirname, 'uno.ts'),
    ],
    {cwd: global.process.cwd()},
  );
  const p2 = cp.fork(
    './node_modules/.bin/ts-node',
    [
      '-r',
      'tsconfig-paths/register',
      '-P',
      'tsconfig.all.json',
      path.join(__dirname, 'dos.ts'),
    ],
    {cwd: global.process.cwd()},
  );

  setTimeout(() => {
    p2.kill();
    setTimeout(() => {
      p1.kill();
      server.close();
      t.ok(true, 'proc kill did not destroy everything');
    }, 2500);
  }, 2500);
});
