function createJsxExpressionContainer (variableName) {
  return {
    type: 'JSXExpressionContainer',
    expression: {
      type: 'Identifier',
      name: variableName
    }
  }
}

module.exports = createJsxExpressionContainer
