/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let STRING_TYPE = "string"

function reactToMana(react) {
  let props = {}
  for (let key in react.props) {
    if (key !== "children") {
      props[key] = react.props[key]
    }
  }

  let givenChildren = react.props.children || react.children
  let processedChildren
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
    children: processedChildren,
  }
}

module.exports = reactToMana

let reactChildrenToMana = require("./reactChildrenToMana")
