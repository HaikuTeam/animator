var getElementSize = require('./getElementSize')
var _render = require('./render')
var _patch = require('./patch')

function render (domElement, virtualContainer, virtualTree, locator, hash, options, scopes) {
  return _render(domElement, virtualContainer, virtualTree, locator, hash, options, scopes)
}

function patch (domElement, virtualContainer, patchesDict, locator, hash, options, scopes) {
  return _patch(domElement, virtualContainer, patchesDict, locator, hash, options, scopes)
}

function createContainer (domElement) {
  return {
    isContainer: true,
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
