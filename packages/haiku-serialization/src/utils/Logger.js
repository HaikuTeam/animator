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

  if (typeof process !== 'undefined') {
    // No-op all logs in production since we only use them in dev
    if (process.env && process.env.NODE_ENV === 'production') {
      logger.info = function(){}
      logger.warn = function(){}
      logger.error = function(){}
      logger.log = function(){}
    }
  }

  return logger
}
