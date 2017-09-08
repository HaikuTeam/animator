var manaChildToJSXNode = require('./manaChildToJSXNode')

function manaChildrenToJSXChildren (children) {
  if (Array.isArray(children)) {
    return children.map(function _map (child) {
      return manaChildToJSXNode(child)
    })
  } else {
    if (!children) return []
    return manaChildToJSXNode(children)
  }
}

module.exports = manaChildrenToJSXChildren
