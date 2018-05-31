import EnvoyClient from '@sdk-creator/envoy/EnvoyClient';
import * as WebSocket from 'ws';

async function go () {
  const client = new EnvoyClient({
    WebSocket,
    host: '0.0.0.0',
    port: parseInt(process.env.HAIKU_SDK_TEST_PORT, 10),
  });

  const channel: any = await client.get('timeline');

  channel.on('didPlay', () => {
    console.log(1);
  });

  channel.on('didPause', () => {
    console.log(1);
  });

  channel.on('didSeek', () => {
    console.log(1);
  });
}

go();
