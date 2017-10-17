var path = require('path')
var winston = require('winston')
var lodash = require('lodash')

var DEFAULTS = {
  colorize: false,
  maxsize: 1000000,
  maxFiles: 3,
  json: true,
  timestamp: true,
  showLevel: true,
  eol: '\n'
}

module.exports = function _loggerConstructor (folder, filepath, options) {
  var config = lodash.assign({}, DEFAULTS, options)

  var transports = []

  transports.push(new (winston.transports.Console)({
    colorize: config.colorize,
    timestamp: config.timestamp,
    showLevel: config.showLevel,
    level: 'info',
    eol: config.eol
  }))

  if (folder && filepath) {
    var filename = path.join(folder, filepath)

    transports.push(new (winston.transports.File)({
      filename: filename,
      tailable: true,
      maxsize: config.maxsize,
      maxFiles: config.maxFiles,
      colorize: config.colorize,
      json: config.json,
      level: 'warn',
      timestamp: config.timestamp,
      showLevel: config.showLevel,
      eol: config.eol
    }))
  }

  var logger = new (winston.Logger)({
    transports: transports
  })

  logger.capture = function _capture (cb) {
    logger.stream({ start: -1 }).on('log', cb)
  }

  function noopLogs (nodeEnv) {
    logger.info = function () {}
    logger.warn = function () {}
    logger.error = function () {}
    logger.log = function () {}
    logger.sacred = console.log.bind(console)
  }

  if (typeof process !== 'undefined') {
    if (process.env) {
      // Skip all but the most sacred log messages, unless explicit
      if (process.env.HAIKU_ECHO_ON !== '1') {
        noopLogs(process.env.NODE_ENV)
      }
    }
  }

  return logger
}
