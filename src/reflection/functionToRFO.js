var babylon = require('babylon')
var generate = require('babel-generator').default

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
      console.warn('[bytecode] reflection got unexpected param node type ', node.type)
      return null
  }
}

function bodyASTToBodySpec (node) {
  var bodyWithBraces = generate(node).code // e.g. "{\n foobar;\n}"
  var bodyWithoutBraces = bodyWithBraces.slice(2, bodyWithBraces.length - 2) // e.g. " foobar;"
  return bodyWithoutBraces
}

function functionToRFO (fn) {
  var spec = {
    type: null,
    name: null,
    params: null,
    body: null
  }

  var expr = wrap(fn.toString())
  var result = babylon.parse(expr)
  var ast = result && result.program
  var expression = ast && ast.body && ast.body[0] && ast.body[0].expression

  // Signal null to indicate we don't know how to handle this
  if (!expression) {
    console.warn('[bytecode] reflection got unparseable expression ' + expr)
    return null
  }

  switch (expression.type) {
    case 'FunctionExpression':
      spec.type = 'FunctionExpression'
      if (expression.id) spec.name = expression.id.name
      spec.params = expression.params.map(paramASTToParamSpec)
      spec.body = bodyASTToBodySpec(expression.body)
      break

    case 'ArrowFunctionExpression':
      spec.type = 'ArrowFunctionExpression'
      spec.params = expression.params.map(paramASTToParamSpec)
      spec.body = bodyASTToBodySpec(expression.body)
      break

    default:
      // Signal null to indicate we don't know how to handle this
      console.warn('[bytecode] reflection got unexpected function type ' + expression.type)
      return null
  }

  return {
    __function: spec
  }
}

module.exports = functionToRFO
