/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var objectPath = require('./objectPath')

function matchByAttribute (
  node,
  attrKeyToMatch,
  attrOperator,
  attrValueToMatch,
  options
) {
  var attributes = objectPath(node, options.attributes)
  if (attributes) {
    var attrValue = attributes[attrKeyToMatch]
    // If no operator, do a simple presence check ([foo])
    if (!attrOperator) return !!attrValue
    switch (attrOperator) {
      case '=':
        return attrValueToMatch === attrValue
      // case '~=':
      // case '|=':
      // case '^=':
      // case '$=':
      // case '*=':
      default:
        console.warn('Operator `' + attrOperator + '` not supported yet')
        return false
    }
  }
}

module.exports = matchByAttribute
