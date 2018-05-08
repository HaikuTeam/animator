var prettier = require('prettier')

var MAX_LEN = Infinity // 100000

function formatStandard (code, options, cb) {
  try {
    if (code.length <= MAX_LEN) {
      code = prettier.format(code)
    }

    return cb(null, code, [])
  } catch (exception) {
    return cb(exception)
  }
}

module.exports = formatStandard
