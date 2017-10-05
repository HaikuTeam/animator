import ProcessBase from './ProcessBase'
import Master from './Master'

var Raven = require('./Raven')

Raven.context(() => {
  const master = new Master(ProcessBase.HAIKU.folder)

  master.on('host-disconnected', () => {
    throw new Error('[master] disconnected from host plumbing process')
  })
})

export default master
