import * as ws from 'ws'
import * as tape from 'tape'
import EnvoyClient from '../../lib/envoy/client.js'
import EnvoyServer from '../../lib/envoy/server.js'
import EnvoyLogger from '../../lib/envoy/logger.js'
import { EnvoyHandler } from '../../lib/envoy'

tape('envoy:index:basic', async (t) => {
    t.plan(1)

    class TestHandler {
        doFoo(arg) {
            return "foo, " + arg + "!"
        }
    }

    let server = new EnvoyServer({ logger: new EnvoyLogger("info") })
    server = await server.ready()
    server.bindHandler("foo", TestHandler, new TestHandler())

    var client = new EnvoyClient<TestHandler>({ port: server.port, WebSocket: ws, logger: new EnvoyLogger("info") })
    client.get("foo").then(async (fooHandler: TestHandler) => {
        var ret = await fooHandler.doFoo("meow")
        t.equal(ret, "foo, meow!")
        server.close()
    })
})

tape('envoy:index:events', async (t) => {
    t.plan(1)

    class TestEventHandler {
        private server: EnvoyServer
        constructor(server: EnvoyServer) {
            this.server = server
        }
        doFoo(arg) {
            this.server.emit("foo-event", { name: "foo", payload: "data for " + arg })
        }
    }

    let server = new EnvoyServer({ logger: new EnvoyLogger("info") })
    server = await server.ready()
    server.bindHandler("foo-event", TestEventHandler, new TestEventHandler(server))

    var client = new EnvoyClient<TestEventHandler>({ port: server.port, WebSocket: ws, logger: new EnvoyLogger("info") })
    client.get("foo-event").then(async (fooClient: TestEventHandler & EnvoyHandler) => {
        fooClient.on("foo", (payload) => {
            t.equal(payload, "data for dayz")
            server.close()
        })
        fooClient.doFoo("dayz")
    })
})
