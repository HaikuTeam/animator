/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import BasicUtils from './BasicUtils';
import cssQueryList from './cssQueryList';
import manaFlattenTree from './manaFlattenTree';

const OBJECT = 'object';

export default function queryTree(matches, node, query, options) {
  if (!node || typeof node !== OBJECT) {
    return matches;
  }
  const list = BasicUtils.uniq(manaFlattenTree([], node, options, 0, 0));
  cssQueryList(matches, list, query, options);
  return matches;
}
