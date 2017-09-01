/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var renderTree = require('./renderTree')

function render (
  domElement,
  virtualContainer,
  virtualTree,
  locator,
  component
) {
  return renderTree(
    domElement,
    virtualContainer,
    [virtualTree],
    locator,
    component
  )
}

module.exports = render
