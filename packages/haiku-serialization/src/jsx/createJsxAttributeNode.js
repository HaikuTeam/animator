function createJsxAttributeNode (name, value) {
  return {
    type: 'JSXAttribute',
    name: {
      type: 'JSXIdentifier',
      name: name
    },
    value: {
      type: 'StringLiteral',
      value: value
    }
  }
}

module.exports = createJsxAttributeNode
