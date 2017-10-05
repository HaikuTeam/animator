import ProcessBase from './ProcessBase'
import Master from './Master'

if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
  require('./Raven')
}

const master = new Master(ProcessBase.HAIKU.folder)

master.on('host-disconnected', () => {
  throw new Error('[master] disconnected from host plumbing process')
})

export default master
