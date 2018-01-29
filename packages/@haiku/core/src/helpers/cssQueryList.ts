/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import cssMatchOne from './cssMatchOne';

const PIECE_SEPARATOR = ',';

export default function queryList(list, query, options) {
  const matches = [];
  const maxdepth = options.maxdepth !== undefined
    ? parseInt(options.maxdepth, 10)
    : Infinity;
  const pieces = query.split(PIECE_SEPARATOR);
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i].trim();
    for (let j = 0; j < list.length; j++) {
      const node = list[j];
      if (node.__depth <= maxdepth) {
        if (cssMatchOne(node, piece, options)) {
          matches.push(node);
        }
      }
    }
  }

  return matches;
}
