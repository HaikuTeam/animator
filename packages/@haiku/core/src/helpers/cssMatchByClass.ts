/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import objectPath from './objectPath';

const CLASS_NAME_ATTR = 'class';
const ALT_CLASS_NAME_ATTR = 'className'; // Ease of React integration
const SPACE = ' ';

export default function matchByClass (node, className, options) {
  const attributes = objectPath(node, options.attributes);
  if (attributes) {
    let foundClassName = attributes[CLASS_NAME_ATTR];
    if (!foundClassName) {
      foundClassName = attributes[ALT_CLASS_NAME_ATTR];
    }
    if (foundClassName) {
      const classPieces = foundClassName.split(SPACE);
      if (classPieces.indexOf(className) !== -1) {
        return true;
      }
    }
  }
}
