var paramsToFunctionASTParams = require('./paramsToFunctionASTParams')
var functionBodyStringToFunctionBodyAST = require('./functionBodyStringToFunctionBodyAST')

function RFOToFunctionAST (rfo, key) {
  var type = rfo.type || 'FunctionExpression'
  var ast
  switch (type) {
    case 'FunctionExpression':
      ast = {
        type: 'FunctionExpression',
        id: ((rfo.name && { type: 'Identifier', name: rfo.name }) || undefined),
        params: paramsToFunctionASTParams(rfo.params),
        body: functionBodyStringToFunctionBodyAST(rfo.body)
      }
      break
    case 'ArrowFunctionExpression':
      ast = {
        type: 'ArrowFunctionExpression',
        params: paramsToFunctionASTParams(rfo.params),
        body: functionBodyStringToFunctionBodyAST(rfo.body)
      }
      break
  }
  return ast
}

module.exports = RFOToFunctionAST
