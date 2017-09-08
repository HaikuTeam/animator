function extractDescendantNamesFromJsxElementNode (namesArray, jsxElementNode) {
  if (jsxElementNode.type === 'JSXElement') {
    namesArray.push(jsxElementNode.openingElement.name.name)
    for (var i = 0; i < jsxElementNode.children.length; i++) {
      var childNode = jsxElementNode.children[i]
      extractDescendantNamesFromJsxElementNode(namesArray, childNode)
    }
  }
  return namesArray
}

module.exports = extractDescendantNamesFromJsxElementNode
