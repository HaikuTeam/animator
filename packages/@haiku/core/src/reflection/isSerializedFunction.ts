/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function isSerializedFunction (object) {
  return object && !!object.__function;
}
