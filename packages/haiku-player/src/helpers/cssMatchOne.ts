/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let matchById = require("./cssMatchById")
let matchByClass = require("./cssMatchByClass")
let matchByTagName = require("./cssMatchByTagName")
let matchByAttribute = require("./cssMatchByAttribute")
let matchByHaiku = require("./cssMatchByHaiku")
let attrSelectorParser = require("./attrSelectorParser")

let ID_PREFIX = "#"
let CLASS_PREFIX = "."
let ATTR_PREFIX = "["
let HAIKU_PREFIX = "haiku:"

function matchOne(node, piece, options) {
  if (piece.slice(0, 6) === HAIKU_PREFIX) {
    return matchByHaiku(node, piece.slice(6), options)
  }

  if (piece[0] === ID_PREFIX) {
    return matchById(node, piece.slice(1, piece.length), options)
  }

  if (piece[0] === CLASS_PREFIX) {
    return matchByClass(node, piece.slice(1, piece.length), options)
  }

  if (piece[0] === ATTR_PREFIX) {
    let parsedAttr = attrSelectorParser(piece)
    if (!parsedAttr) return false
    return matchByAttribute(
      node,
      parsedAttr.key,
      parsedAttr.operator,
      parsedAttr.value,
      options,
    )
  }

  return matchByTagName(node, piece, options)
}

module.exports = matchOne
