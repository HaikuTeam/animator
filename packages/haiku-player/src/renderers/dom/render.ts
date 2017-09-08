/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let renderTree = require("./renderTree")

function render(
  domElement,
  virtualContainer,
  virtualTree,
  component,
) {
  return renderTree(
    domElement,
    virtualContainer,
    [virtualTree],
    component,
  )
}

module.exports = render
