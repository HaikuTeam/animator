import EnvoyLogger from '@sdk-creator/envoy/EnvoyLogger';
import EnvoyServer from '@sdk-creator/envoy/EnvoyServer';
import {TimelineHandler} from '@sdk-creator/timeline/TimelineHandler';
import * as WebSocket from 'ws';

async function go () {
  const envoyServer = new EnvoyServer({
    WebSocket,
    logger: new EnvoyLogger('warn'),
  });

  await envoyServer.ready();

  const envoyTimelineHandler = new TimelineHandler(envoyServer);
  envoyServer.bindHandler('timeline', TimelineHandler, envoyTimelineHandler);

  process.send('' + envoyServer.port);
}

go();
