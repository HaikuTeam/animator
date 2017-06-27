/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var BasicUtils = require('./BasicUtils')
var flattenTree = require('./manaFlattenTree')
var queryList = require('./cssQueryList')

var OBJECT = 'object'

function queryTree (matches, node, query, options) {
  if (!node || typeof node !== OBJECT) return matches
  var list = BasicUtils.uniq(flattenTree([], node, options, 0, 0))
  queryList(matches, list, query, options)
  return matches
}

module.exports = queryTree
