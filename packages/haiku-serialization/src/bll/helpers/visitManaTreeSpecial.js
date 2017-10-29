const _safeElementName = require('./safeElementName')

function _visitManaTreeSpecial (address, hash, mana, iteratee) {
  address += `:[${hash}]${_safeElementName(mana)}(${(mana.attributes && mana.attributes.id) ? '#' + mana.attributes.id : ''})`
  iteratee(mana, address)
  if (!mana.children || mana.children.length < 1) return void (0)
  for (let i = 0; i < mana.children.length; i++) {
    let child = mana.children[i]
    if (child && typeof child === 'object') {
      _visitManaTreeSpecial(address, hash + '-' + i, child, iteratee)
    }
  }
}

module.exports = _visitManaTreeSpecial
