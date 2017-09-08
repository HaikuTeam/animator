/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let BasicUtils = require("./BasicUtils")
let flattenTree = require("./manaFlattenTree")
let queryList = require("./cssQueryList")

let OBJECT = "object"

function queryTree(matches, node, query, options) {
  if (!node || typeof node !== OBJECT) return matches
  let list = BasicUtils.uniq(flattenTree([], node, options, 0, 0))
  queryList(matches, list, query, options)
  return matches
}

module.exports = queryTree
