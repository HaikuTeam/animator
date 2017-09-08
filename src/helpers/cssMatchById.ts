/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let objectPath = require("./objectPath")

function matchById(node, id, options) {
  let attributes = objectPath(node, options.attributes)
  if (attributes) {
    if (attributes.id === id) {
      return true
    }
  }
}

module.exports = matchById
