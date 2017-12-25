/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function visitManaTree(locator, mana, visitor, parent, index) {
  if (!mana) {
    return null;
  }
  visitor(
    mana.elementName,
    mana.attributes,
    mana.children,
    mana,
    locator,
    parent,
    index,
  );
  if (!mana.children) {
    return null;
  }
  for (let i = 0; i < mana.children.length; i++) {
    const child = mana.children[i];
    visitManaTree(locator + '.' + i, child, visitor, mana, i);
  }
}
