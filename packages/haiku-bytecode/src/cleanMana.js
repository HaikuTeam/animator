function cleanMana (mana) {
  var out = {}
  if (!mana) return null
  if (typeof mana === 'string') return mana
  out.elementName = mana.elementName
  out.attributes = mana.attributes
  out.children = mana.children && mana.children.map(cleanMana)
  return out
}

module.exports = cleanMana
