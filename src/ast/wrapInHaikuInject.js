module.exports = function wrapInHaikuInject (node) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'Haiku'
      },
      property: {
        type: 'Identifier',
        name: 'inject'
      }
    },
    // The first argument is the function, and remainders are the injectables
    arguments: [node].concat(node.params.map((param) => {
      return {
        type: 'StringLiteral',
        value: param.name
      }
    }))
  }
}
