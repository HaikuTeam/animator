// var formatEsformatter = require('./formatEsformatter')
var prettier = require('prettier')

var MAX_LEN = Infinity // 100000

function formatStandard (code, options, cb) {
  // var opts = {
  //   fix: true,
  //   plugins: ['react']
  // }
  try {
    // code = formatEsformatter(code)
    if (code.length <= MAX_LEN) {
      code = prettier.format(code)
    } else {
      console.warn('Formatter skipping long code (length: ' + code.length + ')')
    }
    return cb(null, code, [])
  } catch (exception) {
    return cb(exception)
  }
}

module.exports = formatStandard
