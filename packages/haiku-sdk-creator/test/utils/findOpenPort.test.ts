import * as tape from 'tape'
import findOpenPort from '../../lib/utils/findOpenPort.js'

tape('findOpenPort', (t) => {
    t.plan(1)
    return findOpenPort(null, '0.0.0.0', (err, port) => {
      t.equal(typeof port, 'number', 'port number is retrieved')
    })
})
