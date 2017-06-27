/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function isTextNode(virtualElement, scopes) {
  return typeof virtualElement === 'string';
}

module.exports = isTextNode;
