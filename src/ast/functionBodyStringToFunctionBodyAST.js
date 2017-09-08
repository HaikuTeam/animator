var babylon = require('babylon')

function functionBodyStringToFunctionBodyAST (body) {
  var nodes = []
  if (body) {
    var ast = babylon.parse(body, {
      allowReturnOutsideFunction: true
    })
    var parse = ast.program.body
    nodes = parse
  }
  var block = {
    type: 'BlockStatement',
    body: nodes
  }
  return block
}

module.exports = functionBodyStringToFunctionBodyAST
