var getElementSize = require('./getElementSize')
var _render = require('./render')
var _patch = require('./patch')

function render (domElement, virtualContainer, virtualTree, locator, hash) {
  return _render(domElement, virtualContainer, virtualTree, locator, hash)
}

function patch (domElement, virtualContainer, patchesDict, locator, hash) {
  return _patch(domElement, virtualContainer, patchesDict, locator, hash)
}

function createContainer (domElement) {
  return {
    layout: {
      computed: {
        size: getElementSize(domElement)
      }
    }
  }
}

module.exports = {
  render: render,
  patch: patch,
  createContainer: createContainer
}
