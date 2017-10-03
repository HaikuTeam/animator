import EnvoyClient from '../../lib/envoy/client.js'
import EnvoyServer from '../../lib/envoy/server.js'
import EnvoyLogger from '../../lib/envoy/logger.js'
import { EnvoyHandler } from '../../lib/envoy'
import TourHandler from '../../lib/tour/tour'
import * as ws from 'ws'
import * as tape from 'tape'

tape('tour:lifecycle methods starts and ends the tour properly', async (t) => {
    t.plan(4)

    let server
    let tourHandler
    let client

    server = new EnvoyServer({ logger: new EnvoyLogger("error"), mock: true })
    server = await server.ready()
    tourHandler = new TourHandler(server)

    server.bindHandler("tour", TourHandler, tourHandler)
    client = new EnvoyClient<TourHandler>({ port: server.port, WebSocket: ws, logger: new EnvoyLogger("error") })

    client.get("tour").then(async (handler: TourHandler) => {
        let isActive
        let step

        await handler.start(true)
        isActive = await handler.isTourActive()
        step = await handler.getCurrentStep()
        t.ok(isActive, '#start starts the tour')
        t.equal(step, 0, '#start sets the tour current step to 0')

        await handler.next()
        step = await handler.getCurrentStep()
        t.equal(step, 1, '#next increases the tour current step by one')

        await handler.finish()
        isActive = await handler.isTourActive()
        t.notOk(isActive, '#finish finishes the tour')

        server.close()
    })
})
