var path = require('path')
var winston = require('winston')

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
  var config = Object.assign({}, DEFAULTS, options)

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
      json: false,
      level: 'info',
      timestamp: config.timestamp,
      showLevel: config.showLevel,
      eol: config.eol,
      formatter: ({level, message}) => {
        const timestamp = new Date().toISOString()
        return `(${timestamp}) (${level.toUpperCase()}) — ${message}`
      }
    }))
  }

  var logger = new (winston.Logger)({
    transports: transports
  })

  // Winston doesn't work in browser context due to an issue with streams
  if (typeof window !== 'undefined') {
    logger.log = console.log.bind(console)
    logger.info = console.info.bind(console)
    logger.warn = console.warn.bind(console)
    logger.error = console.error.bind(console)
    logger.trace = console.trace.bind(console)
  }

  logger.capture = (cb) => {
    logger.stream({ start: -1 }).on('log', cb)
  }

  return logger
}
