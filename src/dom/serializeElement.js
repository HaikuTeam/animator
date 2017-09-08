var getElementAttributes = require('./getElementAttributes')

var O = 'o'
var N = 'n'
var MAX_ATT_LEN = 256

function serializeElement (element, doIncludeAllProperties, doSkipChildren, doSkipPositionInfo) {
  var serialized = {}

  if (!element) return null

  serialized.haiku = element.haiku
  serialized.elementName = element.tagName.toLowerCase()
  serialized.attributes = getElementAttributes(element, MAX_ATT_LEN)

  if (!doSkipChildren) {
    serialized.children = []
    for (var i = 0; i < element.children.length; i++) {
      serialized.children.push(serializeElement(element.children[i], doIncludeAllProperties, doSkipChildren, doSkipPositionInfo))
    }
  }

  if (!doSkipPositionInfo) {
    var bbox = element.getBBox && element.getBBox()
    if (bbox) serialized.bbox = { top: bbox.top, right: bbox.right, bottom: bbox.bottom, left: bbox.left, width: bbox.width, height: bbox.height, x: bbox.x, y: bbox.y }

    var rect = element.getBoundingClientRect && element.getBoundingClientRect()
    if (rect) serialized.rect = { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height, x: rect.x, y: rect.y }
  }

  if (doIncludeAllProperties) {
    for (var key in element) {
      if (key[0] === O && key[1] === N) continue // Skip event listeners
      var prop = element[key]
      if (typeof prop === 'string') {
        // Skip super long attributes
        if (prop.length <= MAX_ATT_LEN) {
          serialized[key] = prop
        }
      } else if (typeof prop === 'number') {
        serialized[key] = prop
      } else if (prop === null) {
        serialized[key] = null
      }
    }
  }

  return serialized
}

module.exports = serializeElement
