/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

const STRING = 'string';

export default function objectPath(obj, key) {
  if (typeof key === STRING) return obj[key];
  let base = obj;
  for (let i = 0; i < key.length; i++) {
    const name = key[i];
    base = base[name];
  }
  return base;
}
