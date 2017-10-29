function _manaTreeToDepthFirstArray (arr, mana) {
  if (!mana || typeof mana === 'string') return arr
  arr.push(mana)
  for (var i = 0; i < mana.children.length; i++) {
    var child = mana.children[i]
    _manaTreeToDepthFirstArray(arr, child)
  }
  return arr
}

module.exports = _manaTreeToDepthFirstArray
