var reifyOAST = require('./../ast/reifyOAST')

function jsxAttributeNodeToValue (jsxAttributeNode) {
  return reifyOAST(jsxAttributeNode.value, null, true)
}

module.exports = jsxAttributeNodeToValue
