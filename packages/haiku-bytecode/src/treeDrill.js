function treeDrill (tree, visitor) {
  if (!tree) return true
  if (visitor(tree) === false) return false
  if (!tree.children) return true
  for (var i = tree.children.length - 1; i >= 0; i--) {
    var child = tree.children[i]
    if (treeDrill(child, visitor) === false) return false
  }
  return true
}

module.exports = treeDrill
