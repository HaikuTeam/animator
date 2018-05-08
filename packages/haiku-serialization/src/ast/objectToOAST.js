function objectToOAST (obj) {
  const oast = {
    type: 'ObjectExpression',
    properties: []
  }

  for (const key in obj) {
    if (key === undefined) continue
    const keyexp = expressionToOASTComponent(key)
    const valueexp = expressionToOASTComponent(obj[key], key)
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
const expressionToOASTComponent = require('./expressionToOASTComponent')
