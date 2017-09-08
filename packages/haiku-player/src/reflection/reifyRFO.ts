/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let inject = require("./inject")
let functionSpecificationToFunction = require("./functionSpecificationToFunction")

function reifyRFO(rfo) {
  let fn = functionSpecificationToFunction(
    rfo.name || "",
    rfo.params,
    rfo.body,
    rfo.type,
  )

  // Upstream can signal that this function needs to become 'injected'
  // in order to function properly using this flag
  if (rfo.injectee) {
    inject.apply(null, [fn].concat(rfo.params))
  }

  return fn
}

module.exports = reifyRFO
