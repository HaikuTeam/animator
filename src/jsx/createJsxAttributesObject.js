var createJsxAttributeNode = require('./createJsxAttributeNode')

function createJsxAttributesObject (attrs) {
  var attrsArray = []
  for (var key in attrs) {
    attrsArray.push(createJsxAttributeNode(key, attrs[key]))
  }
  return attrsArray
}

module.exports = createJsxAttributesObject
