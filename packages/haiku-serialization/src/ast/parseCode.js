const {parse} = require('@babel/parser')

function parseCode (code, options) {
  try {
    var parsed = parse(code, options || {
      sourceType: 'module'
    })
    return parsed
  } catch (exception) {
    return exception
  }
}

module.exports = parseCode
