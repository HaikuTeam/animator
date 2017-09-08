function ensureManaChildrenArray (mana) {
  var previous = mana.children
  var children = []
  mana.children = children
  if (previous) mana.children.push(previous)
  return mana
}

module.exports = ensureManaChildrenArray
