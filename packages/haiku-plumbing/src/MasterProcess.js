import ProcessBase from './ProcessBase'
import Master from './Master'

function run () {
  const master = new Master(ProcessBase.HAIKU.folder)
  master.on('host-disconnected', () => {
    throw new Error('[master] disconnected from host plumbing process')
  })
  return master
}

let master

if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
  const Raven = require('./Raven')
  Raven.context(() => {
    master = run()
  })
} else {
  master = run()
}

export default master
