import path from 'path'
import lodash from 'lodash'
import Websocket from 'haiku-serialization/src/ws/Websocket'
import MockWebsocket from 'haiku-serialization/src/ws/MockWebsocket'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import WebSocket from 'ws'
import Master from './Master'

// Show long stack traces
Error.stackTraceLimit = Infinity

const PROCESS_INFO = `${process.pid} ${path.basename(__filename)} ${path.basename(process.execPath)}`

// A handle is not present if this process wasn't spawned
if (process.stdout._handle) {
  // Don't truncate output to stdout
  process.stdout._handle.setBlocking(true)
}

logger.info(`[master process] config`, process.env.HAIKU_MASTER_PROCESS_CONFIG)

const {
  folder,
  plumbingUrl,
  socketToken,
  fileOptions,
  envoyOptions
} = JSON.parse(process.env.HAIKU_MASTER_PROCESS_CONFIG)

const masterInstance = new Master(folder, fileOptions, envoyOptions)

const websocketToPlumbing = (plumbingUrl)
  ? new Websocket(
      plumbingUrl,
      folder,
      'controllee',
      'master',
      WebSocket,
      socketToken
    )
  : new MockWebsocket() // For isolated testing environments

process.on('uncaughtException', (exception) => {
  // Logger may be async (?); use console to ensure we display the exception
  console.error(exception)
  masterInstance.teardown(() => {
    logger.info(`[master process] exiting after exception`)
    process.exit(1)
  })
})

process.on('SIGINT', () => {
  logger.info(`[master process] ${PROCESS_INFO} got interrupt signal`)
  masterInstance.teardown(() => {
    logger.info(`[master process] ${PROCESS_INFO} exiting after interrupt`)
    process.exit()
  })
})

process.on('SIGTERM', () => {
  logger.info(`[master process] ${PROCESS_INFO} got terminate signal`)
  masterInstance.teardown(() => {
    logger.info(`[master process] ${PROCESS_INFO} exiting after termination`)
    process.exit()
  })
})

process.on('error', (err) => {
  logger.error(err)
})

websocketToPlumbing.on('open', () => {
  logger.info(`[master process] websocket opened`)
})

websocketToPlumbing.on('close', () => {
  logger.info(`[master process] websocket closed`)
  masterInstance.teardown(() => {
    throw new Error('disconnected from plumbing process')
  })
})

websocketToPlumbing.on('error', (err) => {
  logger.error(`[master process] websocket error`, err)
})

websocketToPlumbing.on('broadcast', (message) => {
  masterInstance.handleBroadcastMessage(message)
})

websocketToPlumbing.on('method', (method, params, message, cb) => {
  masterInstance.handleMethodMessage(method, params, cb)
})

masterInstance.on('assets-changed', (masterInstance, assets) => {
  websocketToPlumbing.send({
    type: 'broadcast',
    name: 'assets-changed',
    folder: masterInstance.folder,
    assets
  })
})

masterInstance.on('component:reload', (masterInstance, file) => {
  websocketToPlumbing.send({
    type: 'broadcast',
    name: 'component:reload',
    folder: masterInstance.folder,
    relpath: file.relpath
  })
})

masterInstance.on('project-state-change', (payload) => {
  websocketToPlumbing.send(lodash.assign({
    type: 'broadcast',
    name: 'project-state-change',
    folder: masterInstance.folder
  }, payload))
})

masterInstance.on('merge-designs', (relpath, designs) => {
  websocketToPlumbing.send({
    type: 'action',
    folder: masterInstance.folder,
    method: 'mergeDesigns',
    params: [masterInstance.folder, relpath, designs]
  })
})

export default masterInstance
