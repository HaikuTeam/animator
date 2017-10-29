// If elementName is bytecode (i.e. a nested component) return a fallback name
// used for a bunch of lookups, otherwise return the given string element name
module.exports = function _safeElementName (mana) {
  // If bytecode, the fallback name is div
  if (mana.elementName && typeof mana.elementName === 'object') {
    return 'div' // TODO: How will this byte us?
  }
  return mana.elementName
}
