var babylon = require('babylon')

function functionBodyStringToFunctionBodyAST (body) {
  var nodes = []
  let innerComments = null
  if (body) {
    var ast = babylon.parse(body, {
      allowReturnOutsideFunction: true
    })
    var parse = ast.program.body
    // Inner comments happens when only comments are existant
    if (ast.program.innerComments) {
      innerComments = ast.program.innerComments
    }
    nodes = parse
  }
  var block = {
    type: 'BlockStatement',
    body: nodes
  }
  // If have inner comments, set them
  if (innerComments) {
    block.innerComments = innerComments;
  }
  return block
}

module.exports = functionBodyStringToFunctionBodyAST
