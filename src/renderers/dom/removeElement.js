/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function removeElement (domElement, hash, options, scopes) {
  domElement.parentNode.removeChild(domElement)
  return domElement
}

module.exports = removeElement
