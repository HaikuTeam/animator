const {parse} = require('@babel/parser')

function functionBodyStringToFunctionBodyAST (body) {
  var nodes = []
  let innerComments = null
  if (body) {
    var ast = parse(body, {
      allowReturnOutsideFunction: true
    })
    // Inner comments happens when only comments are existant
    if (ast.program.innerComments) {
      innerComments = ast.program.innerComments
    }
    nodes.push(...ast.program.body)
  }
  var block = {
    type: 'BlockStatement',
    body: nodes
  }
  // If have inner comments, set them
  if (innerComments) {
    block.innerComments = innerComments
  }
  return block
}

module.exports = functionBodyStringToFunctionBodyAST
