/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var STRING = 'string'

function objectPath (obj, key) {
  if (typeof key === STRING) return obj[key]
  var base = obj
  for (var i = 0; i < key.length; i++) {
    var name = key[i]
    base = base[name]
  }
  return base
}

module.exports = objectPath
