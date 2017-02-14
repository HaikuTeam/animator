var renderTree = require('./renderTree')

function render (domElement, virtualContainer, virtualTree, locator, hash) {
  return renderTree(domElement, virtualContainer, [virtualTree], locator, hash)
}

module.exports = render
