/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import objectPath from './objectPath';

const HAIKU_ID_ATTRIBUTE = 'haiku-id';

export default function matchByHaiku(node, haikuString, options) {
  const attributes = objectPath(node, options.attributes);
  if (!attributes) {
    return false;
  }
  if (!attributes[HAIKU_ID_ATTRIBUTE]) {
    return false;
  }
  return attributes[HAIKU_ID_ATTRIBUTE] === haikuString;
}
