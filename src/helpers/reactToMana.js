/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var STRING_TYPE = 'string'

function reactToMana (react) {
  var props = {}
  for (var key in react.props) {
    if (key !== 'children') {
      props[key] = react.props[key]
    }
  }

  var givenChildren = react.props.children || react.children
  var processedChildren
  if (Array.isArray(givenChildren)) {
    processedChildren = reactChildrenToMana(givenChildren)
  } else if (givenChildren && givenChildren.type) {
    processedChildren = [reactToMana(givenChildren)]
  } else if (typeof givenChildren === STRING_TYPE) {
    processedChildren = [givenChildren]
  }

  return {
    elementName: react.type,
    attributes: props,
    children: processedChildren
  }
}

module.exports = reactToMana

var reactChildrenToMana = require('./reactChildrenToMana')
