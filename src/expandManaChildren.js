var expandManaTree = require('./expandManaTree')

function expandManaChildren (children) {
  if (Array.isArray(children)) return children.map(expandManaTree)
  if (!children) return []
  return expandManaTree(children)
}

module.exports = expandManaChildren
