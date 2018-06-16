/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const DEFAULT_SCOPE = 'div';

const SCOPE_STRATA = {
  div: 'div',
  svg: 'svg',
  // canvas: 'canvas'
};

const STRING = 'string';

export default function scopifyElements (mana, parent, scope) {
  if (!mana) {
    return mana;
  }
  if (typeof mana === STRING) {
    return mana;
  }

  mana.__scope = scope || DEFAULT_SCOPE;

  if (mana.children) {
    for (let i = 0; i < mana.children.length; i++) {
      const child = mana.children[i];
      scopifyElements(
        child,
        mana,
        // If the current element defines a new strata, make that a new scope
        // and pass it down to the children.
        SCOPE_STRATA[mana.elementName] || scope,
      );
    }
  }
}
