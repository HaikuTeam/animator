var prettier = require('prettier')

function formatStandardSync (code, options) {
  try {
    return prettier.format(code)
  } catch (exception) {
    console.warn(exception)
    return null
  }
}

module.exports = formatStandardSync
