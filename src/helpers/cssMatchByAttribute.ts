/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import objectPath from './objectPath';

export default function matchByAttribute(
  node,
  attrKeyToMatch,
  attrOperator,
  attrValueToMatch,
  options,
) {
  const attributes = objectPath(node, options.attributes);
  if (attributes) {
    const attrValue = attributes[attrKeyToMatch];
    // If no operator, do a simple presence check ([foo])
    if (!attrOperator) return !!attrValue;
    switch (attrOperator) {
      case '=':
        return attrValueToMatch === attrValue;
      // case '~=':
      // case '|=':
      // case '^=':
      // case '$=':
      // case '*=':
      default:
        console.warn('Operator `' + attrOperator + '` not supported yet');
        return false;
    }
  }
}
