import EnvoyClient from '@sdk-creator/envoy/EnvoyClient';
import EnvoyLogger from '@sdk-creator/envoy/EnvoyLogger';
import * as ws from 'ws';
import CatHandler from './CatHandler';

const client = new EnvoyClient<CatHandler>({
  port: parseInt(process.env.HAIKU_SDK_TEST_PORT, 10),
  WebSocket: ws,
  logger: new EnvoyLogger('error'),
});

async function go () {
  const channel: any = await client.get('cat');
  channel.on('meowed', (payload) => {
    // empty
  });
}

go();
