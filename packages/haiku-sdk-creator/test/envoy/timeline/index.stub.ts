// import * as tape from "tape"
// import * as cp from "child_process"
// import * as path from 'path'

// tape("envoy:timeline", async (t) => {
//     t.plan(1)

//     var pl = cp.fork(path.join(__dirname, "pl.js"))

//     pl.on("message", (port) => {
//         process.env.HAIKU_SDK_TEST_PORT = port
//         var tl = cp.fork(path.join(__dirname, "tl.js"))
        
//     })
// })
