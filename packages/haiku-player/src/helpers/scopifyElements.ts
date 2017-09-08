/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let DEFAULT_SCOPE = "div"

let SCOPE_STRATA = {
  div: "div",
  svg: "svg",
  // canvas: 'canvas'
}

let STRING = "string"

function scopifyElements(mana, parent, scope) {
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
    for (let i = 0; i < mana.children.length; i++) {
      let child = mana.children[i]
      scopifyElements(child, mana, scope)
    }
  }
}

module.exports = scopifyElements
