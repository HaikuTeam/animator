import * as WebSocket from "ws"
import EnvoyClient from "../../../lib/envoy/client"

async function go () {
    let client = new EnvoyClient({
      host: "0.0.0.0",
      port: parseInt(process.env.HAIKU_SDK_TEST_PORT, 10),
      WebSocket: WebSocket,
    })

    let channel = await client.get("timeline")

    channel.on("didPlay", () => {
      console.log(1)
    })

    channel.on("didPause", () => {
      console.log(1)
    })

    channel.on("didSeek", () => {
      console.log(1)
    })
}

go()
