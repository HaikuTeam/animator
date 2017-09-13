import Websocket from 'ws'
import path from 'path'
import { EventEmitter } from 'events'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import WebsocketClient from 'haiku-websockets/lib/WebsocketClient'
import envInfo from './envInfo'
import haikuInfo from './haikuInfo'

const killables = []
function killall () {
  killables.forEach((killable) => {
    killable.kill()
  })
}

const pinfo = `${process.pid} ${path.basename(__filename)} ${path.basename(process.execPath)}`

function attachProcess () {
  Error.stackTraceLimit = Infinity // Show long stack traces when errors are shown
  // A handle is not present if this wasn't spawned
  if (process.stdout._handle) {
    process.stdout._handle.setBlocking(true) // Don't truncate output to stdout
  }
  // process.stdin.resume()
  process.on('uncaughtException', (exception) => {
    console.error('------------------------\n', exception, '\n------------------------')
    if (exception && exception.stack) logger.error(exception)
    killall()
    process.exit(1)
  })
  process.on('SIGINT', () => {
    logger.info(`[process] ${pinfo} got interrupt signal`)
    killall()
    process.exit()
  })
  process.on('SIGTERM', () => {
    logger.info(`[process] ${pinfo} got terminate signal`)
    killall()
    process.exit()
  })
  process.on('error', (error) => {
    logger.error(error)
  })
}

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
      if (data === 'reestablishConnection!') this.reestablishConnection()
    })
    process.on('exit', (status) => {
      this.emit('exit')
      process.exit(status)
    })
  }

  reestablishConnection () {
    if (this.isOpen()) {
      logger.info(`[process] still connected ok; skipping reestablish`)
      return void (0) // No need to reconnect
    }

    if (this.haiku && this.haiku.socket) {
      const url = `http://${this.haiku.socket.host}:${this.haiku.socket.port}?type=controllee&alias=${this.alias}&folder=${this.haiku.folder}`
      logger.info(`[process] establishing websocket connection to ${url}`)
      this.socket = new WebsocketClient(new Websocket(url))
      this.socket.on('request', this.emit.bind(this, 'request'))
    } else {
      logger.warn(`[process] no socket info given; cannot connect to Haiku plumbing hub (via ${this.alias})`)
    }
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

  boom (error) {
    throw error
  }
}

attachProcess()
ProcessBase.HAIKU = haikuInfo()
