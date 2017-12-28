/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import cssQueryList from './cssQueryList';
import manaFlattenTree from './manaFlattenTree';

const OBJECT = 'object';

export default function queryTree(node, query, options) {
  if (!node || typeof node !== OBJECT) {
    return [];
  }

  return cssQueryList(manaFlattenTree(node, options), query, options);
}
