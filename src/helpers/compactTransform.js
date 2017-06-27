/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var C1 = ', ';
var C2 = ',';

function compactTransform(t1) {
  return t1.split(C1).join(C2);
}

module.exports = compactTransform;
