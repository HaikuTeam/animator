/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

// #origin
export default function scopeOfElement(mana) {
  if (mana.__scope) {
    return mana.__scope;
  }

  if (mana.__parent) {
    return scopeOfElement(mana.__parent);
  }

  return null;
}
