var createDefaultSpecifierNode = require('./createDefaultSpecifierNode')

function createImportDefaultDeclarationNode (identifier, givenPath) {
  return {
    type: 'ImportDeclaration',
    source: {
      type: 'StringLiteral',
      value: givenPath
    },
    specifiers: [
      createDefaultSpecifierNode(identifier)
    ]
  }
}

module.exports = createImportDefaultDeclarationNode
