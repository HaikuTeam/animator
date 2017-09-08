var generateCode = require('./generateCode')

function getFunctionNodeBody (node) {
  var lines = []
  for (var i = 0; i < node.body.body.length; i++) {
    lines.push(generateCode(node.body.body[i]))
  }
  var body = lines.join('\n')
  return body
}

module.exports = getFunctionNodeBody
