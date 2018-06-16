/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {BytecodeNode, BytecodeNodeAttributes, HaikuBytecode, MaybeBytecodeNode} from '../api/HaikuBytecode';

export type ManaTreeVisitor = (
  elementName: string|HaikuBytecode,
  attributes: BytecodeNodeAttributes,
  children: (string|BytecodeNode)[],
  mana: BytecodeNode,
  locator: string,
  parent: MaybeBytecodeNode,
  index: number,
) => void;

const visitManaTree = (
  locator: string,
  mana: string|BytecodeNode,
  visitor: ManaTreeVisitor,
  parent: MaybeBytecodeNode,
  index: number,
): void => {
  if (!mana || typeof mana === 'string') {
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
};

export default visitManaTree;
