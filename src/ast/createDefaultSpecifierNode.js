function createDefaultSpecifierNode (identifier) {
  return {
    type: 'ImportDefaultSpecifier',
    local: {
      type: 'Identifier',
      name: identifier
    }
  }
}

module.exports = createDefaultSpecifierNode
