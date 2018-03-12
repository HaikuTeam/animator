var getElementAttributes = require('./getElementAttributes')

var O = 'o'
var N = 'n'
var MAX_ATT_LEN = 256

function serializeElement ($el, doIncludeAllProperties, doSkipChildren, doSkipPositionInfo) {
  var serialized = {}

  if (!$el) return null

  serialized.haiku = $el.haiku
  serialized.elementName = $el.tagName.toLowerCase()
  serialized.attributes = getElementAttributes($el, MAX_ATT_LEN)

  if (!doSkipChildren) {
    serialized.children = []
    for (var i = 0; i < $el.children.length; i++) {
      serialized.children.push(
        serializeElement(
          $el.children[i],
          doIncludeAllProperties,
          doSkipChildren,
          doSkipPositionInfo
        )
      )
    }
  }

  if (!doSkipPositionInfo) {
    var bbox = $el.getBBox && $el.getBBox()
    if (bbox) serialized.bbox = { top: bbox.top, right: bbox.right, bottom: bbox.bottom, left: bbox.left, width: bbox.width, height: bbox.height, x: bbox.x, y: bbox.y }

    var rect = $el.getBoundingClientRect && $el.getBoundingClientRect()
    if (rect) serialized.rect = { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height, x: rect.x, y: rect.y }
  }

  if (doIncludeAllProperties) {
    for (var key in $el) {
      if (key[0] === O && key[1] === N) continue // Skip event listeners
      var prop = $el[key]
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
