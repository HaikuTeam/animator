// import EnvoyClient from '../../lib/envoy/client.js'
// import EnvoyServer from '../../lib/envoy/server.js'
// import EnvoyLogger from '../../lib/envoy/logger.js'
// import { EnvoyHandler } from '../../lib/envoy'
// import TourHandler from '../../lib/tour/tour'
// import * as ws from 'ws'
// import * as tape from 'tape'

// tape('tour:next acts like a fsm', (t) => {
//     t.plan(3)

//     let client = _setTour()

//     client.get("tour").then(async (handler: TourHandler) => {
//         let { value, done } = await handler.next()

//         t.equal(value.index, 0)
//         t.equal(value.selector, '#test')
//         t.notOk(done)
//     })
// })

// tape('tour:next increments the steps every time is invoked', (t) => {
//     t.plan(2)

//     let client = _setTour()

//     client.get("tour").then(async (handler: TourHandler) => {
//         let step = await handler.next()
//         t.equal(step.value.index, 0)

//         step = await handler.next()
//         t.equal(step.value.index, 1)
//     })
// })

// function _setTour() {
//     let server = new EnvoyServer({ logger: new EnvoyLogger("info") })
//     let tourHandler = new TourHandler(server)
//     server.bindHandler("tour", TourHandler, tourHandler)
//     return new EnvoyClient<TourHandler>({ WebSocket: ws })
// }
