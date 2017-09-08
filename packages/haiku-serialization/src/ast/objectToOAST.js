function objectToOAST (obj) {
  var oast = {
    type: 'ObjectExpression',
    properties: []
  }

  for (var key in obj) {
    if (key === undefined) continue
    var keyexp = expressionToOASTComponent(key)
    var valueexp = expressionToOASTComponent(obj[key], key)
    oast.properties.push({
      type: 'ObjectProperty',
      key: keyexp,
      value: valueexp
    })
  }

  return oast
}

module.exports = objectToOAST

// Down here to avoid circular dependency blank object
var expressionToOASTComponent = require('./expressionToOASTComponent')
