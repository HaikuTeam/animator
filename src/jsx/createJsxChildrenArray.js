function createJsxChildrenArray (childJsxNodes) {
  var children = []
  childJsxNodes.forEach(function _each (childJsxNode) {
    children.push(childJsxNode)
  })
  return children
}

module.exports = createJsxChildrenArray
