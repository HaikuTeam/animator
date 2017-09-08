var babylon = require('babylon')

function parseCode (code, options) {
  try {
    var parsed = babylon.parse(code, options || {
      sourceType: 'module',
      plugins: ['jsx']
    })
    return parsed
  } catch (exception) {
    return exception
  }
}

module.exports = parseCode
