/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function isSerializedFunction(object) {
  return object && !!object.__function
}

module.exports = isSerializedFunction
