var fs = require('haiku-fs-extra')
var Differ = require('./../model/Differ')
var Logger = require('./Logger')
var { HOMEDIR_LOGS_PATH } = require('./HaikuHomeDir')

require('colors') // TODO: use non-string-extending module

var MAX_LOG_LEN = 20000

fs.mkdirpSync(HOMEDIR_LOGS_PATH)

const logger = new Logger(HOMEDIR_LOGS_PATH, 'haiku-diffs.log', {
  colorize: true,
  maxsize: 100000,
  maxFiles: 2,
  json: false,
  timestamp: false,
  showLevel: false
})

const differ = new Differ()

logger.difflog = function (previous, current, options) {
  var timestamp = (new Date()).toISOString()
  if (!previous || previous.length < 1) {
    logger.info(`${timestamp} info: [differ] diff ${options.relpath}: no previous content`.grey)
  } else if (!current || current.length < 1) {
    logger.info(`${timestamp} info: [differ] diff ${options.relpath}: no current content`.grey)
  } else if (current === previous) {
    logger.info(`${timestamp} info: [differ] diff ${options.relpath}: current equal`.grey)
  } else {
    logger.info(`${timestamp} info: [differ] diff of ${options.relpath}:\n`.grey)
    differ.set(previous, current)
    const deltas = differ.deltas()
    deltas.forEach((delta) => {
      if (delta.value.length <= MAX_LOG_LEN) {
        let color = (delta.added) ? 'green' : ((delta.removed) ? 'red' : 'grey')
        if (color !== 'grey') logger.info(delta.value[color])
      } else {
        logger.info(`${timestamp} info: [differ] delta too long to show`.grey)
      }
    })
    return deltas
  }
}

// function trunc (str) {
//   var lines = str.split('\n')
//   lines.pop()
//   var first = lines.shift()
//   var last = lines.pop()
//   var out = []
//   if (first) out.push(first)
//   if (last) out.push('...', last)
//   return out.join('\n') + '\n'
// }

module.exports = logger
