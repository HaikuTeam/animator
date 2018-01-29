/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import attrSelectorParser from './attrSelectorParser';
import cssMatchByAttribute from './cssMatchByAttribute';
import cssMatchByClass from './cssMatchByClass';
import cssMatchByHaiku from './cssMatchByHaiku';
import cssMatchById from './cssMatchById';
import cssMatchByTagName from './cssMatchByTagName';

const ID_PREFIX = '#';
const CLASS_PREFIX = '.';
const ATTR_PREFIX = '[';
const HAIKU_PREFIX = 'haiku:';

export default function matchOne(node, piece, options) {
  if (piece.slice(0, 6) === HAIKU_PREFIX) {
    return cssMatchByHaiku(node, piece.slice(6), options);
  }

  if (piece[0] === ID_PREFIX) {
    return cssMatchById(node, piece.slice(1, piece.length), options);
  }

  if (piece[0] === CLASS_PREFIX) {
    return cssMatchByClass(node, piece.slice(1, piece.length), options);
  }

  if (piece[0] === ATTR_PREFIX) {
    const parsedAttr = attrSelectorParser(piece);
    if (!parsedAttr) {
      return false;
    }
    return cssMatchByAttribute(
      node,
      parsedAttr.key,
      parsedAttr.operator,
      parsedAttr.value,
      options,
    );
  }

  return cssMatchByTagName(node, piece, options);
}
