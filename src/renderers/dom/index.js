var getElementSize = require('./getElementSize')
var _render = require('./render')

function render (domElement, virtualContainer, virtualTree, locator, hash) {
  return _render(domElement, virtualContainer, virtualTree, locator, hash)
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
  createContainer: createContainer
}
