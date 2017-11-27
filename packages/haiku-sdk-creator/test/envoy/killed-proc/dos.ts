import * as ws from 'ws';
import EnvoyClient from '../../../lib/envoy/EnvoyClient';
import EnvoyLogger from '../../../lib/envoy/EnvoyLogger';
import CatHandler from './CatHandler';

const client = new EnvoyClient<CatHandler>({
  port: parseInt(process.env.HAIKU_SDK_TEST_PORT, 10),
  WebSocket: ws,
  logger: new EnvoyLogger('error'),
});

async function go() {
  const channel = await client.get('cat');
  channel.on('meowed', (payload) => {
    // empty
  });
}

go();
