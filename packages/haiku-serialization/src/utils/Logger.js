const path = require('path')
const winston = require('winston')
const jsonStringify = require('fast-safe-stringify')
const Differ = require('./Differ')
const Transport = require('winston-transport')
const EventEmitter = require('events')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const {isProduction} = require('haiku-common/lib/environments')

require('colors') // TODO: use non-string-extending module

const formatJsonLogToString = (message) => {
  if (message.noFormat) {
    return message.message
  }

  if (Array.isArray(message.message)) {
    message.message = message.message.map((message) => {
      if (typeof message === 'string') {
        return message
      }
      return jsonStringify(message)
    }).join(' ')
  }

  // Pading is done to visually align on file
  return `${message.timestamp}|${message.view.padEnd(8)}|${message.level}${message.tag ? '|' + message.tag : ''}${message.durationMs ? '|d=' + message.durationMs : ''}|${message.message}`
}

/**
 * Control log message format output
 */
const haikuFormat = winston.format.printf((info, opts) => {
  return formatJsonLogToString(info)
})

// Ignore log messages if they have { doNotLogOnFile: true }
// Its needed to avoid double writing to log file on plumbing
const ignoreDoNotWriteToFile = winston.format((info, opts) => {
  if (info.doNotLogOnFile) { return false }
  return info
})

const DEFAULTS = {
  maxsize: 1000000,
  maxFiles: 1,
  colorize: true
}

const MAX_DIFF_LOG_LEN = 10000

const useAdvancedLoggingFeatures = experimentIsEnabled(Experiment.SendLogMessagesToPlumbing)

class LogForwarderTransport extends Transport {
  constructor (opts) {
    super(opts)
    // If defined, it will forward logs to websocket
    this.websocket = null
  }

  log (message, callback) {
    // Avoid double logging
    message.doNotLogOnFile = true
    this.sendToPlumbing(message)
    callback()
  }

  // We send to pumbling so we can log to pumbing console in a nice way
  sendToPlumbing (message) {
    if (useAdvancedLoggingFeatures && this.websocket) {
      this.websocket.send({
        type: 'log',
        from: message.view,
        message
      })
    }
  }

  setWebsocket (websocket) {
    this.websocket = websocket
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
          ignoreDoNotWriteToFile(),
          haikuFormat
        )
      }))
    }

    // In prod, we don't really benefit from sending logs to the dev console.
    if (!isProduction()) {
      transports.push(new winston.transports.Console({
        format: winston.format.combine(
          haikuFormat
        )
      }))
    }

    if (useAdvancedLoggingFeatures) {
      // In the future this logForwarder will also send log to plumbing
      this.logForwarderTransport = new LogForwarderTransport()
      transports.push(this.logForwarderTransport)
    }

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp()
      ),
      transports
    })

    // Hook to allow Monkey.js to configure the view prefix from which we log
    this.view = '?'
  }

  setWebsocket (websocket) {
    if (useAdvancedLoggingFeatures) {
      this.logForwarderTransport.setWebsocket(websocket)
    }
  }

  raw (jsonMessage) {
    this.logger.log(jsonMessage)
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
    this.logger.profile(args, {view: this.view})
  }

  timeEnd (...args) {
    this.logger.profile(args, {view: this.view})
  }

  trace (...args) {
    console.trace(...args)
  }
}

module.exports = {Logger, formatJsonLogToString}
