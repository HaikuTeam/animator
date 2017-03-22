var applyCssLayout = require('haiku-bytecode/src/applyCssLayout')
var Layout3D = require('haiku-bytecode/src/Layout3D')
var isTextNode = require('./isTextNode')

var DEFAULT_PIXEL_RATIO = 1.0
var IDENTITY_MATRIX = Layout3D.createMatrix()

function applyLayout (domElement, virtualElement, parentDomNode, parentVirtualElement, options) {
  if (isTextNode(virtualElement)) return domElement

  if (virtualElement.layout) {
    var devicePixelRatio = options && options.devicePixelRatio || DEFAULT_PIXEL_RATIO

    if (!parentVirtualElement.layout || !parentVirtualElement.layout.computed) {
      _warnOnce('Cannot compute layout without parent computed size (child: <' + virtualElement.elementName + '>; parent: <' + parentVirtualElement.elementName + '>)')
      return domElement
    }

    var parentSize = parentVirtualElement.layout.computed.size

    var computedLayout = Layout3D.computeLayout({}, virtualElement.layout, virtualElement.layout.matrix, IDENTITY_MATRIX, parentSize)

    // Need to pass some size to children, so if this element doesn't have one, use the parent's
    virtualElement.layout.computed = computedLayout || { size: parentSize }

    // No computed layout means the el is not shown
    if (!computedLayout) {
      if (domElement.style.display !== 'none') domElement.style.display = 'none'
    } else {
      if (domElement.style.display !== 'block') domElement.style.display = 'block'
      applyCssLayout(domElement, virtualElement, virtualElement.layout, computedLayout, devicePixelRatio)
    }
  }

  return domElement
}

var warnings = {}

function _warnOnce (warning) {
  if (warnings[warning]) return void (0)
  warnings[warning] = true
  console.warn(warning)
}

module.exports = applyLayout
