const getObjectPropertyKey = require('./../../ast/getObjectPropertyKey')
const expressionToOASTComponent = require('./../../ast/expressionToOASTComponent')

module.exports = function _synchronizeSubstructAndAST (substruct) {
  for (var aspectName in substruct.bytecode) {
    var aspectValue = substruct.bytecode[aspectName]
    var didInsert = false
    for (var i = 0; i < substruct.objectExpression.properties.length; i++) {
      if (didInsert) continue
      var propertyASTNode = substruct.objectExpression.properties[i]
      var propertyASTNodeKey = getObjectPropertyKey(propertyASTNode)
      if (propertyASTNodeKey === aspectName) {
        didInsert = true
        propertyASTNode.value = expressionToOASTComponent(aspectValue, aspectName)
      }
    }
    // If a property with the desired name wasn't there, add it
    // I have no idea why this logic is written in this way...
    if (!didInsert) {
      substruct.objectExpression.properties.unshift({
        type: 'ObjectProperty',
        key: expressionToOASTComponent(aspectName),
        value: expressionToOASTComponent(aspectValue)
      })
    }
  }
}
