/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function scopeOfElement (mana) {
  if (mana.__memory.scope) {
    return mana.__memory.scope;
  }

  if (mana.__memory && mana.__memory.parent) {
    return scopeOfElement(mana.__memory.parent);
  }

  return null;
}
