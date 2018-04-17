const path = require('path')
const winston = require('winston')
const Differ = require('./Differ')
require('colors') // TODO: use non-string-extending module

const DEFAULTS = {
  maxsize: 1000000,
  maxFiles: 5,
  colorize: true
}

const MAX_DIFF_LOG_LEN = 10000
const IS_WEBVIEW = typeof window !== 'undefined'
const NO_FORMAT = '__NO_FORMAT__'

class Logger {
  constructor (folder, relpath, options = {}) {
    this.differ = new Differ()

    const config = Object.assign({}, DEFAULTS, options)

    const transports = []

    const env = process.env.NODE_ENV
    const version = process.env.HAIKU_RELEASE_VERSION

    const formatter = ({level, message}) => {
      if (message.slice(0, 13) === NO_FORMAT) {
        return message.slice(13)
      }

      const timestamp = new Date().toISOString()
      return `${timestamp} [${env}|${version}|${this.view}] [${level}] ${message}`
    }

    transports.push(new (winston.transports.Console)({
      colorize: config.colorize,
      level: 'info',
      formatter
    }))

    if (folder && relpath) {
      const filename = path.join(folder, relpath)

      transports.push(new (winston.transports.File)({
        filename: filename,
        tailable: true,
        maxsize: config.maxsize,
        maxFiles: config.maxFiles,
        colorize: config.colorize,
        level: 'info',
        json: false,
        formatter
      }))
    }

    this.logger = new (winston.Logger)({
      transports: transports
    })

    // Hook to allow Monkey.js to configure the view prefix from which we log
    this.view = '?'
  }

  raw (...args) {
    console.log(...args)
  }

  log (...args) {
    if (IS_WEBVIEW) console.log(...args)
    this.logger.log(...args)
  }

  info (...args) {
    if (IS_WEBVIEW) console.info(...args)
    this.logger.info(...args)
  }

  debug (...args) {
    if (IS_WEBVIEW) console.debug(...args)
    this.logger.debug(...args)
  }

  warn (...args) {
    if (IS_WEBVIEW) console.warn(...args)
    this.logger.warn(...args)
  }

  error (...args) {
    if (IS_WEBVIEW) console.error(...args)
    this.logger.error(...args)
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
          if (color !== 'grey') this.info(NO_FORMAT, delta.value[color])
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
