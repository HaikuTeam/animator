import Websocket from 'ws'
import path from 'path'
import async from 'async'
import { EventEmitter } from 'events'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import WebsocketClient from 'haiku-websockets/lib/WebsocketClient'
import envInfo from './envInfo'
import haikuInfo from './haikuInfo'
// require('njstrace').inject()

Error.stackTraceLimit = Infinity // Show long stack traces when errors are shown

const pinfo = `${process.pid} ${path.basename(__filename)} ${path.basename(process.execPath)}`

const PROCESSES = []

// A handle is not present if this wasn't spawned
if (process.stdout._handle) {
  process.stdout._handle.setBlocking(true) // Don't truncate output to stdout
}

// process.stdin.resume()
process.on('uncaughtException', (exception) => {
  console.error(exception)
  return async.eachSeries(PROCESSES, (proc, next) => {
    return proc.teardown(next)
  }, () => {
    logger.sacred(`[process] ${pinfo} exiting after exception`)
    process.exit(1)
  })
})

process.on('SIGINT', () => {
  logger.info(`[process] ${pinfo} got interrupt signal`)
  return async.eachSeries(PROCESSES, (proc, next) => {
    return proc.teardown(next)
  }, () => {
    logger.sacred(`[process] ${pinfo} exiting after interrupt`)
    process.exit()
  })
})

process.on('SIGTERM', () => {
  logger.info(`[process] ${pinfo} got terminate signal`)
  return async.eachSeries(PROCESSES, (proc, next) => {
    return proc.teardown(next)
  }, () => {
    logger.sacred(`[process] ${pinfo} exiting after termination`)
    process.exit()
  })
})

process.on('error', (error) => {
  logger.error(error)
})

export default class ProcessBase extends EventEmitter {
  constructor (alias, api = {}, options = {}) {
    super()
    const { args, subcommand, flags } = envInfo()
    this.$ = [subcommand].concat(args).concat(flags) // To invoke this as a CLI command
    this.alias = alias || this.constructor.name
    this.api = api
    this.options = options
    this.haiku = ProcessBase.HAIKU
    this.reestablishConnection()
    process.on('message', (data) => {
      if (data === 'reestablishConnection!') {
        this.reestablishConnection()
      }
    })
    process.on('exit', (status) => {
      this.emit('exit')
      process.exit(status)
    })
    PROCESSES.push(this)
  }

  reestablishConnection () {
    if (this.isOpen()) {
      logger.info(`[process] still connected ok; skipping reestablish`)
      return void (0) // No need to reconnect
    }

    if (this.haiku && this.haiku.socket) {
      const url = `http://${this.haiku.socket.host || process.env.HAIKU_PLUMBING_HOST}:${this.haiku.socket.port || process.env.HAIKU_PLUMBING_PORT}?type=controllee&alias=${this.alias}&folder=${this.haiku.folder || process.env.HAIKU_PROJECT_FOLDER}`
      this.socket = new WebsocketClient(new Websocket(url))
      this.socket.on('request', this.emit.bind(this, 'request'))
      this.socket.on('close', () => {
        this.socket.wsc.readyState = Websocket.CLOSED
      })
      this.socket.on('error', () => {
        logger.info(`[process] socket error (${url})`)
      })
    } else {
      logger.warn(`[process] no socket info given; cannot connect to Haiku plumbing hub (via ${this.alias})`)
    }
  }

  teardown (cb) {
    return this.emit('teardown', cb)
  }

  getReadyState () {
    if (!this.socket) return 0
    if (!this.socket.wsc) return 0
    return this.socket.wsc.readyState
  }

  isOpen () {
    return this.getReadyState() === Websocket.OPEN
  }

  isConnecting () {
    return this.getReadyState() === Websocket.CONNECTING
  }

  emitUp (message) {
    process.send(message)
    return this
  }

  exit (status) {
    process.exit(status)
  }
}

ProcessBase.HAIKU = haikuInfo()
