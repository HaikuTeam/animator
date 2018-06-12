/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import BasicUtils from './BasicUtils';
import objectPath from './objectPath';

export default function flattenTree (node, options, unique = true, list = [], depth = 0, index = 0) {
  list.push(node);

  if (typeof node !== 'string') {
    node.__depth = depth;
    node.__index = index;
  }

  // Don't recurse down into the children of nested components, which should be 'invisible' to us.
  // Nested components are indicated when their name is not a string, e.g. a component descriptor.
  if (depth < 1 || typeof node[options.name] === 'string') {
    const children = objectPath(node, options.children);

    if (!children || children.length < 1 || typeof children === 'string') {
      return list;
    }

    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        flattenTree(children[i], options, false, list, depth + 1, i);
      }
    } else if (typeof children === 'object') {
      children.__depth = depth + 1;
      children.__index = 0;

      list.push(children);
      return list;
    }
  }

  return unique ? BasicUtils.uniq(list) : list;
}
