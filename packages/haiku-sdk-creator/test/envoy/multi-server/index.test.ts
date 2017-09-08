import * as tape from 'tape'
import EnvoyServer from '../../../lib/envoy/server.js'
import EnvoyLogger from '../../../lib/envoy/logger.js'

tape('envoy:multi-server', async (t) => {
    t.plan(7)

    var s1 = new EnvoyServer({ logger: new EnvoyLogger("info") })
    s1 = await s1.ready()

    var s2 = new EnvoyServer({ logger: new EnvoyLogger("info") })
    s2 = await s2.ready()

    var s3 = new EnvoyServer({ logger: new EnvoyLogger("info") })
    s3 = await s3.ready()

    t.ok(true, 'no port collision exceptions when starting multiple servers')

    t.equal(typeof s1.port, 'number', 'server has port number')
    t.equal(typeof s2.port, 'number', 'server has port number')
    t.equal(typeof s3.port, 'number', 'server has port number')
    
    t.ok(s1.port !== s2.port, 'server port is different')
    t.ok(s1.port !== s3.port, 'server port is different')
    t.ok(s2.port !== s3.port, 'server port is different')

    s1.close()
    s2.close()
    s3.close()
})
