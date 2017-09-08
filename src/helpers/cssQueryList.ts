/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let matchOne = require("./cssMatchOne")

let PIECE_SEPARATOR = ","

function queryList(matches, list, query, options) {
  let maxdepth = options.maxdepth !== undefined
    ? parseInt(options.maxdepth, 10)
    : Infinity
  let pieces = query.split(PIECE_SEPARATOR)
  for (let i = 0; i < pieces.length; i++) {
    let piece = pieces[i].trim()
    for (let j = 0; j < list.length; j++) {
      let node = list[j]
      if (node.__depth <= maxdepth) {
        if (matchOne(node, piece, options)) {
          matches.push(node)
        }
      }
    }
  }
}

module.exports = queryList
