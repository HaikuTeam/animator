/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = function scopeOfElement(mana) {
  if (mana.__scope) return mana.__scope

  if (mana.__parent) {
    return scopeOfElement(mana.__parent)
  }

  return null
}
