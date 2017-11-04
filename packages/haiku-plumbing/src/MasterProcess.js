import ProcessBase from './ProcessBase'
import Master from './Master'
const Raven = require('./Raven')

function run () {
  const master = new Master(ProcessBase.HAIKU.folder)
  master.on('host-disconnected', () => {
    throw new Error('[master] disconnected from host plumbing process')
  })
  return master
}

let master

Raven.context(() => {
  master = run()
})

export default master
