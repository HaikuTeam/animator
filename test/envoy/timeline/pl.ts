import * as WebSocket from 'ws'
import EnvoyServer from '../../../lib/envoy/server'
import EnvoyLogger from '../../../lib/envoy/logger'
import TimelineHandler from '../../../lib/timeline/timeline'

async function go () {
    let envoyServer = new EnvoyServer({
      WebSocket: WebSocket,
      logger: new EnvoyLogger("warn")
    })

    await envoyServer.ready()

    let envoyTimelineHandler = new TimelineHandler(envoyServer)
    envoyServer.bindHandler("timeline", TimelineHandler, envoyTimelineHandler)

    process.send("" + envoyServer.port)
}

go()
