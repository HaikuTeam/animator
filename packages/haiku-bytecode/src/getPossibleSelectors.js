function getPossibleSelectors (mana) {
  var selectors = []

  selectors.push(mana.elementName)

  if (mana.attributes) {
    var classString = (mana.attributes.class || '') + (mana.attributes.className || '')
    var classList = classString.split(/\s+/)
    for (var i = 0; i < classList.length; i++) {
      selectors.push('.' + classList[i])
    }

    if (mana.attributes.id) {
      selectors.push('#' + mana.attributes.id)
    }
  }

  return selectors
}

module.exports = getPossibleSelectors
