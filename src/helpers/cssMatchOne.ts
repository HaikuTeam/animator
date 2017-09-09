/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import matchById from "./cssMatchById"
import matchByClass from "./cssMatchByClass"
import matchByTagName from "./cssMatchByTagName"
import matchByAttribute from "./cssMatchByAttribute"
import matchByHaiku from "./cssMatchByHaiku"
import attrSelectorParser from "./attrSelectorParser"

const ID_PREFIX = "#"
const CLASS_PREFIX = "."
const ATTR_PREFIX = "["
const HAIKU_PREFIX = "haiku:"

export default function matchOne(node, piece, options) {
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
