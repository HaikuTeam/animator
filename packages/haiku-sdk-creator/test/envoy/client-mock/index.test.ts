import EnvoyClient from '@sdk-creator/envoy/EnvoyClient';
import EnvoyLogger from '@sdk-creator/envoy/EnvoyLogger';
import * as tape from 'tape';
import * as ws from 'ws';

tape('envoy:client-mock', async (t) => {
  t.plan(4);

  let client: any = new EnvoyClient({
    mock: true, // This should specify that no connection should begin
    WebSocket: ws,
    logger: new EnvoyLogger('error'),
  });

  t.equal(client.isInMockMode(), true, 'options mock is set to true');

  client = await client.ready();

  setTimeout(() => {
    t.ok(true, 'mock client skipped connect and no connrefused error was thrown');

    client.get('nonexistent').then((channel) => { // In mock mode, this should work despite no server
      t.ok(channel, 'mock client skipped loading a channel and threw no error');

      channel.on('nonexistent:event', () => {
        // never happens; this is a mock
      });

      channel.off('thingthatwasneveron', 'doesntmatterthisisntevenafunction');

      t.ok(true, 'mock client api works without throwing an error');
    });
  }, 1000);
});
