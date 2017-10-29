function visit (node, visitor) {
  if (node) {
    visitor(node, null)
    if (!node.children) return
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i]
      if (typeof child === 'string') continue
      visit(child, visitor)
    }
  }
}

module.exports = visit
