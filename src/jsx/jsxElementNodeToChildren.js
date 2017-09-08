function jsxElementNodeToChildren (jsxElementNode) {
  if (!jsxElementNode.children) return []
  var children = []
  jsxElementNode.children.forEach(function _each (childNode) {
    if (childNode.type === 'JSXText') {
      // Exclude all-whitespace children
      if (!/^\s*$/.test(childNode.value)) {
        children.push(childNode.value)
      }
    } else if (childNode.type === 'JSXElement') {
      children.push(jsxElementNodeToSerializedManaObject(childNode))
    }
    // What other types can occur here? JSXExpressionContainer, ...?
  })
  return children
}

module.exports = jsxElementNodeToChildren

var jsxElementNodeToSerializedManaObject = require('./jsxElementNodeToSerializedManaObject')
