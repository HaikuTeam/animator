var applyCssLayout = require('haiku-bytecode/src/applyCssLayout')
var Layout3D = require('haiku-bytecode/src/Layout3D')
var isTextNode = require('./isTextNode')
var scopeIs = require('./scopeIs')

var DEFAULT_PIXEL_RATIO = 1.0
var IDENTITY_MATRIX = Layout3D.createMatrix()
var SVG = 'svg'
var SVG_RENDERABLES = {
  a: true,
  audio: true,
  canvas: true,
  circle: true,
  ellipse: true,
  foreignObject: true,
  g: true,
  iframe: true,
  image: true,
  line: true,
  mesh: true,
  path: true,
  polygon: true,
  polyline: true,
  rect: true,
  svg: true,
  switch: true,
  symbol: true,
  text: true,
  textPath: true,
  tspan: true,
  unknown: true,
  use: true,
  video: true
}

function applyLayout (domElement, virtualElement, parentDomNode, parentVirtualElement, options, scopes) {
  if (isTextNode(virtualElement)) return domElement

  if (virtualElement.layout) {
    // Don't assign layout to things that never need it like <desc>, <title>, etc.
    if (scopeIs(scopes, SVG) && !SVG_RENDERABLES[virtualElement.elementName]) {
      return domElement
    }

    if (!parentVirtualElement.layout || !parentVirtualElement.layout.computed) {
      _warnOnce('Cannot compute layout without parent computed size (child: <' + virtualElement.elementName + '>; parent: <' + parentVirtualElement.elementName + '>)')
      return domElement
    }

    var devicePixelRatio = options && options.devicePixelRatio || DEFAULT_PIXEL_RATIO
    var parentSize = parentVirtualElement.layout.computed.size
    var computedLayout = Layout3D.computeLayout({}, virtualElement.layout, virtualElement.layout.matrix, IDENTITY_MATRIX, parentSize)

    // Need to pass some size to children, so if this element doesn't have one, use the parent's
    virtualElement.layout.computed = computedLayout || { size: parentSize }

    // No computed layout means the el is not shown
    if (!computedLayout) {
      if (domElement.style.display !== 'none') domElement.style.display = 'none'
    } else {
      if (domElement.style.display !== 'block') domElement.style.display = 'block'
      applyCssLayout(domElement, virtualElement, virtualElement.layout, computedLayout, devicePixelRatio, options, scopes)
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
