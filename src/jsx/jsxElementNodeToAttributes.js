var jsxAttributeNodeToName = require('./jsxAttributeNodeToName')
var jsxAttributeNodeToValue = require('./jsxAttributeNodeToValue')

function jsxElementNodeToAttributes (jsxElementNode) {
  var attributes = {}
  jsxElementNode.openingElement.attributes.forEach(function _each (jsxAttributeNode) {
    var name = jsxAttributeNodeToName(jsxAttributeNode)
    var value = jsxAttributeNodeToValue(jsxAttributeNode)
    attributes[name] = value
  })
  return attributes
}

module.exports = jsxElementNodeToAttributes
