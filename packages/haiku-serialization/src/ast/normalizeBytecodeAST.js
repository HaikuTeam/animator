var upsertRequire = require('./upsertRequire')
var removeRequire = require('./removeRequire')
var traverseAST = require('./traverseAST')
var wrapInHaikuInject = require('./wrapInHaikuInject')

/**
 * @function normalizeBytecodeAST
 * @description Given an AST of a bytecode file, normalize it so that it
 * uses all of the up-to-date constructs expected for the output file.
 */
module.exports = function normalizeBytecodeAST (ast) {
  // Make sure we get rid of any legacy references to @haiku/player
  removeRequire(ast, 'Haiku', '@haiku/player')

  // Make sure that the bytecode file requires the Haiku Core as 'Haiku'
  upsertRequire(ast, 'Haiku', '@haiku/core')

  // Remove all comments at the top level since they cause more problems than they solve
  ast.program.body.forEach((node) => {
    if (node.leadingComments) {
      node.leadingComments.splice(0)
    }
    if (node.trailingComments) {
      node.trailingComments.splice(0)
    }
  })

  // Convert any object-destructuring functions to Haiku.inject expressions
  traverseAST(ast, function _traverse (node) {
    if (node.type === 'ObjectProperty') {
      if (node.value.type === 'ArrowFunctionExpression') {
        // There is no use for a this-binding in the bytecode, and we want widest possible
        // browser support, so convert any ArrowFunctionExpression to FunctionExpressions
        node.value.type = 'FunctionExpression'
      }
      if (node.value.type === 'FunctionExpression') {
        // Assume we only want to change 'expressions' that appear in timelines
        if (node.key && ((node.key.name === 'value') || (node.key.value === 'value'))) {
          _convertFunctionToHaikuInjectFormat(node.value, node)
        }
      }
    }
  })
}

function _uniqParams (params) {
  var ids = {}
  params.forEach((param) => {
    ids[param.name || param.value] = param
  })
  var out = []
  for (var name in ids) {
    out.push(ids[name])
  }
  return out
}

function _convertFunctionToHaikuInjectFormat (node, parent) {
  // We're going to build a new full params object to replace the existing one
  var params = []
  node.params.forEach((param) => {
    if (param.type === 'Identifier') {
      params.push(param)
    } else if (param.type === 'ObjectPattern') {
      // We only need to deal with the top-level of the object pattern
      param.properties.forEach((property) => {
        if (property.key.type === 'Identifier') {
          params.push(property.key)
        }
      })
    }
  })
  // We'll just go ahead and mutate the parame in place...why not?
  node.params = _uniqParams(params)
  // Now we need to wrap the function in the 'Haiku.inject' expression
  parent.value = wrapInHaikuInject(node)
}
