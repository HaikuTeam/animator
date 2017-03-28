var renderTree = require('./renderTree')

function render (domElement, virtualContainer, virtualTree, locator, hash, options, scopes) {
  return renderTree(domElement, virtualContainer, [virtualTree], locator, hash || {}, options || {}, scopes || {})
}

module.exports = render
