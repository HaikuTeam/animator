/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let cs = require("./../vendor/color-string")

let STRING = "string"
let OBJECT = "object"

function parseString(str) {
  if (!str) return null
  if (typeof str === OBJECT) return str
  if (str.trim().slice(0, 3) === "url") return str
  let desc = cs.get(str)
  return desc
}

function generateString(desc) {
  if (typeof desc === STRING) return desc
  if (!desc) return "none"
  let str = cs.to[desc.model](desc.value)
  return str
}

module.exports = {
  parseString,
  generateString,
}
