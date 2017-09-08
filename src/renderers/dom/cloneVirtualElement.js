
function _cloneVirtualElement (virtualElement) {
  return {
    elementName: virtualElement.elementName,
    attributes: _cloneAttributes(virtualElement.attributes),
    children: virtualElement.children
  }
}

module.exports = _cloneVirtualElement

var _cloneAttributes = require('./cloneAttributes')
