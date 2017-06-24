function visitManaTree (locator, mana, visitor, parent, index) {
  if (!mana) return null
  visitor(mana.elementName, mana.attributes, mana.children, mana, locator, parent, index)
  if (!mana.children) return null
  for (var i = 0; i < mana.children.length; i++) {
    var child = mana.children[i]
    visitManaTree(locator + '.' + i, child, visitor, mana, i)
  }
}

module.exports = visitManaTree
