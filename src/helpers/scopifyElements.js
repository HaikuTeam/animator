var DEFAULT_SCOPE = 'div'

var SCOPE_STRATA = {
  div: 'div',
  svg: 'svg'
  // canvas: 'canvas'
}

var STRING = 'string'

function scopifyElements (mana, parent, scope) {
  if (!mana) return mana
  if (typeof mana === STRING) return mana

  // We'll need the ancestry present if we need to trace back up to the scope
  if (parent && !mana.__parent) {
    mana.__parent = parent
  }

  mana.__scope = scope || DEFAULT_SCOPE

  // If the current element defines a new strata, make that a new scope
  // and pass it down to the children
  if (SCOPE_STRATA[mana.elementName]) {
    scope = SCOPE_STRATA[mana.elementName]
  }

  if (mana.children) {
    for (var i = 0; i < mana.children.length; i++) {
      var child = mana.children[i]
      scopifyElements(child, mana, scope)
    }
  }
}

module.exports = scopifyElements
