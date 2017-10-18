/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import objectPath from './objectPath';

const STRING = 'string';
const OBJECT = 'object';
const FUNCTION = 'function';

// Quick and dirty (not AST-based) way to get the name of a function at runtime
function _getFnName(fn) {
  if (fn.name) {
    return fn.name;
  }

  const str = fn.toString();

  //                | | <-- this space is always here via toString()
  const reg = /function ([^(]*)/;
  const ex = reg.exec(str);
  return ex && ex[1];
}

export default function matchByTagName(node, tagName, options) {
  const val = objectPath(node, options.name);
  if (val) {
    if (typeof val === STRING && val === tagName) {
      return true;
    } else if (typeof val === FUNCTION) {
      // Allow function constructors to act as the tag name
      if (_getFnName(val) === tagName) {
        return true;
      }
    } else if (typeof val === OBJECT) {
      // Allow for things like instances to act as the tag name
      if (val.name === tagName || val.tagName === tagName) {
        return true;
      }
    }
  }
}
