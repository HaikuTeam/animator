var jsxElementNodeToElementName = require('./jsxElementNodeToElementName')
var jsxElementNodeToAttributes = require('./jsxElementNodeToAttributes')

function jsxElementNodeToSerializedManaObject (jsxElementNode) {
  var obj = {}
  obj.elementName = jsxElementNodeToElementName(jsxElementNode)
  obj.attributes = jsxElementNodeToAttributes(jsxElementNode)
  obj.children = jsxElementNodeToChildren(jsxElementNode)
  return obj
}

module.exports = jsxElementNodeToSerializedManaObject

var jsxElementNodeToChildren = require('./jsxElementNodeToChildren')
