const path = require('path')
const winston = require('winston')
const jsonStringify = require('fast-safe-stringify')
const Differ = require('./Differ')
const Transport = require('winston-transport')
const EventEmitter = require('events')

require('colors') // TODO: use non-string-extending module

/**
 * Control log message format output
 */
const haikuFormat = winston.format.printf((info, opts) => {
  if (info.noFormat) {
    return info.message
  }

  if (Array.isArray(info.message)) {
    info.message = info.message.map((message) => {
      if (typeof message === 'string') {
        return message
      }
      return jsonStringify(message)
    }).join(' ')
  }

  // Padding is done to visually align on file
  return `${info.timestamp}|${info.view.padEnd(8)}|${info.level}${info.tag ? '|' + info.tag : ''}|${info.message}`
})

const DEFAULTS = {
  maxsize: 1000000,
  maxFiles: 1,
  colorize: true
}

const MAX_DIFF_LOG_LEN = 10000

class LogForwarderTransport extends Transport {
  log (info, callback) {
    setImmediate(() => {
      this.emit('log', info)
    })

    callback()
  }
};

class Logger extends EventEmitter {
  constructor (folder, relpath, options = {}) {
    super(options)

    this.differ = new Differ()

    const config = Object.assign({}, DEFAULTS, options)

    const transports = []

    if (folder && relpath) {
      const filename = path.join(folder, relpath)
      transports.push(new winston.transports.File({
        filename: filename,
        tailable: true,
        maxsize: config.maxsize,
        maxFiles: config.maxFiles,
        colorize: config.colorize,
        level: 'info',
        json: false,
        format: winston.format.combine(
          haikuFormat
        )
      }))
    }

    transports.push(new winston.transports.Console({
      format: winston.format.combine(
        haikuFormat
      )
    }))

    // In the future this logForwarder will also send log to plumbing
    const logForwarder = new LogForwarderTransport()
    logForwarder.on('log', (info) => {
      this.emit('log', info)
    })
    transports.push(logForwarder)

    this.logger = winston.createLogger({
      transports,
      format: winston.format.combine(
        winston.format.timestamp()
      )
    })

    // Hook to allow Monkey.js to configure the view prefix from which we log
    this.view = '?'
  }

  info (...args) {
    this.logger.info(args, {view: this.view})
  }

  traceInfo (tag, message, attachedObject) {
    this.logger.info(message, {view: this.view, tag, attachedObject})
  }

  debug (...args) {
    this.logger.debug(args, {view: this.view})
  }

  warn (...args) {
    this.logger.warn(args, {view: this.view})
  }

  error (...args) {
    this.logger.error(args, {view: this.view})
  }

  diff (previous, current, options = {}) {
    if (!previous || previous.length < 1) {
      this.info(`[differ] ${options.relpath}: no previous content`.grey)
    } else if (!current || current.length < 1) {
      this.info(`[differ] ${options.relpath}: no current content`.grey)
    } else if (current === previous) {
      this.info(`[differ] ${options.relpath}: current equal`.grey)
    } else {
      this.info(`[differ] ${options.relpath}:\n`.grey)
      this.differ.set(previous, current)
      const deltas = this.differ.deltas()
      deltas.forEach((delta) => {
        if (delta.value.length <= MAX_DIFF_LOG_LEN) {
          let color = (delta.added) ? 'green' : ((delta.removed) ? 'red' : 'grey')
          if (color !== 'grey') this.logger.info(delta.value[color], {view: this.view, noFormat: true})
        } else {
          this.info(`[differ] delta too long`.grey)
        }
      })
    }
  }

  /**
   * Methods not supported by winston fall back to console
   */

  assert (...args) {
    console.assert(...args)
  }

  count (...args) {
    console.count(...args)
  }

  dir (...args) {
    console.dir(...args)
  }

  dirxml (...args) {
    console.dirxml(...args)
  }

  exception (...args) {
    console.exception(...args)
  }

  group (...args) {
    console.group(...args)
  }

  groupCollapsed (...args) {
    console.groupCollapsed(...args)
  }

  groupEnd (...args) {
    console.groupEnd(...args)
  }

  profileEnd (...args) {
    console.profileEnd(...args)
  }

  select (...args) {
    console.select(...args)
  }

  table (...args) {
    console.table(...args)
  }

  time (...args) {
    console.time(...args)
  }

  timeEnd (...args) {
    console.timeEnd(...args)
  }

  trace (...args) {
    console.trace(...args)
  }
}

module.exports = Logger
