/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var functionExpressionStringToPartialAST = require('./functionExpressionStringToPartialAST')

function wrap (str) {
  // Parentheses are required for parsing an expression
  return '(' + str + ')'
}

function objectPatternASTToParamSpec (node) {
  var spec = {}

  for (var i = 0; i < node.properties.length; i++) {
    var property = node.properties[i]
    var key = property.key.name
    var value = paramASTToParamSpec(property.value)
    spec[key] = value
  }

  return spec
}

function arrayPatternASTTToParamSpec (node) {
  var spec = []

  for (var i = 0; i < node.elements.length; i++) {
    var element = node.elements[i]
    var value = paramASTToParamSpec(element)
    spec[i] = value
  }

  return spec
}

function restElementToParamSpec (node) {
  return { __rest: node.argument.name }
}

function paramASTToParamSpec (node) {
  switch (node.type) {
    case 'Identifier':
      return node.name

    case 'ObjectPattern':
      return objectPatternASTToParamSpec(node)

    case 'ArrayPattern':
      return arrayPatternASTTToParamSpec(node)

    case 'RestElement':
      return restElementToParamSpec(node)

    default:
      // Signal we are unable to handle this param type
      console.warn(
        '[bytecode] reflection got unexpected param node type ',
        node.type
      )
      return null
  }
}

function functionToRFO (fn) {
  var spec = {
    type: null,
    name: null,
    params: null,
    body: null
  }

  // This isn't a full AST - only the function _signature_ is returned as an AST.
  // The body is just returned as .bodyString since we don't really need to parse it.
  // {
  //   type: String, // FunctionExpression / ArrowFunctionExpression
  //   id: {
  //     name: String, // 'fooBar'
  //   },
  //   params: [
  //     {
  //       type: String, // Identifier, ObjectPattern, ArrayPattern, RestElement
  //       properties: maybe array
  //       elements: maybe array
  //       argument: maybe node
  //     }
  //   ],
  //   bodyString: String
  // }
  var expressionAST = functionExpressionStringToPartialAST(wrap(fn.toString()))

  // Signal null to indicate we don't know how to handle this
  if (!expressionAST) {
    console.warn('[bytecode] reflection got unparseable expression')
    return null
  }

  switch (expressionAST.type) {
    case 'FunctionExpression':
      spec.type = 'FunctionExpression'
      if (expressionAST.id) {
        spec.name = expressionAST.id.name
      }
      spec.params = expressionAST.params.map(paramASTToParamSpec)
      spec.body = expressionAST.bodyString
      break

    case 'ArrowFunctionExpression':
      spec.type = 'ArrowFunctionExpression'
      spec.params = expressionAST.params.map(paramASTToParamSpec)
      spec.body = expressionAST.bodyString
      break

    default:
      // Signal null to indicate we don't know how to handle this
      console.warn(
        '[bytecode] reflection got unexpected function type ' +
          expressionAST.type
      )
      return null
  }

  return {
    __function: spec
  }
}

module.exports = functionToRFO
