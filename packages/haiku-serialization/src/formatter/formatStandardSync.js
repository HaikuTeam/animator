const prettier = require('prettier')
const logger = require('./../utils/LoggerInstance')

function formatStandardSync (code, options) {
  try {
    return prettier.format(code)
  } catch (exception) {
    logger.warn('[formatter]', exception)
    return null
  }
}

module.exports = formatStandardSync
