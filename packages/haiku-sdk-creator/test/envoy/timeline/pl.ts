import * as WebSocket from 'ws';
import EnvoyServer from '../../../lib/envoy/EnvoyServer';
import EnvoyLogger from '../../../lib/envoy/EnvoyLogger';
import {TimelineHandler} from '../../../lib/timeline/TimelineHandler';

async function go() {
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
