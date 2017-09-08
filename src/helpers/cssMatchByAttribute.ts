/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let objectPath = require("./objectPath")

function matchByAttribute(
  node,
  attrKeyToMatch,
  attrOperator,
  attrValueToMatch,
  options,
) {
  let attributes = objectPath(node, options.attributes)
  if (attributes) {
    let attrValue = attributes[attrKeyToMatch]
    // If no operator, do a simple presence check ([foo])
    if (!attrOperator) return !!attrValue
    switch (attrOperator) {
      case "=":
        return attrValueToMatch === attrValue
      // case '~=':
      // case '|=':
      // case '^=':
      // case '$=':
      // case '*=':
      default:
        console.warn("Operator `" + attrOperator + "` not supported yet")
        return false
    }
  }
}

module.exports = matchByAttribute
