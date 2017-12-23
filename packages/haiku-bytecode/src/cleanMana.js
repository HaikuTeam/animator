function cleanMana (mana) {
  var out = {}
  if (!mana) return null
  if (typeof mana === 'string') return mana
  out.elementName = mana.elementName

  // cleanMana is used when producing a decycled (wire-ready) bytecode object during editing.
  // If the bytecode has any subcomponents, which are designated using the .elementName
  // in the same way the React designates components by the .type, then treat the
  // node as a simple <div>. TODO: We may actually want to decycle the subcomponent here.
  if (out.elementName && typeof out.elementName === 'object') {
    out.elementName = 'div'
  }

  out.attributes = mana.attributes
  out.children = mana.children && mana.children.map(cleanMana)
  return out
}

module.exports = cleanMana
