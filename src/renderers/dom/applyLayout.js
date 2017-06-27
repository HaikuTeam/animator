/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var applyCssLayout = require('./../../helpers/applyCssLayout')
var scopeOfElement = require('./../../helpers/scopeOfElement')
var isTextNode = require('./isTextNode')
var isIE = require('./isIE')
var isMobile = require('./isMobile')
var hasPreserve3d = require('./hasPreserve3d')

var _window = typeof window !== 'undefined' && window
var PLATFORM_INFO = {
  hasWindow: !!_window,
  isMobile: isMobile(_window), // Dumb navigator check
  isIE: isIE(_window), // Dumb navigator check - use feature detection instead?
  hasPreserve3d: hasPreserve3d(_window) // I dunno if we actually need this
}

console.info('[haiku player] platform info:', JSON.stringify(PLATFORM_INFO))

var DEFAULT_PIXEL_RATIO = 1.0
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

function applyLayout (
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  options,
  scopes,
  isPatchOperation,
  isKeyDifferent
) {
  if (isTextNode(virtualElement)) return domElement

  if (virtualElement.layout) {
    // Don't assign layout to things that never need it like <desc>, <title>, etc.
    // Check if we're inside an <svg> context *and* one of the actually renderable svg-type els
    if (
      scopeOfElement(virtualElement) === SVG &&
      !SVG_RENDERABLES[virtualElement.elementName]
    ) {
      return domElement
    }

    if (!parentVirtualElement.layout || !parentVirtualElement.layout.computed) {
      _warnOnce(
        'Cannot compute layout without parent computed size (child: <' +
          virtualElement.elementName +
          '>; parent: <' +
          parentVirtualElement.elementName +
          '>)'
      )
      return domElement
    }

    var devicePixelRatio = (options && options.devicePixelRatio) ||
      DEFAULT_PIXEL_RATIO
    var computedLayout = virtualElement.layout.computed

    // No computed layout means the el is not shown
    if (!computedLayout || computedLayout.invisible) {
      if (domElement.style.display !== 'none') {
        domElement.style.display = 'none'
      }
    } else {
      if (domElement.style.display !== 'block') {
        domElement.style.display = 'block'
      }
      options.platform = PLATFORM_INFO
      applyCssLayout(
        domElement,
        virtualElement,
        virtualElement.layout,
        computedLayout,
        devicePixelRatio,
        options,
        scopes
      )
    }
  }

  return domElement
}

var warnings = {}

function _warnOnce (warning) {
  if (warnings[warning]) return void 0
  warnings[warning] = true
  console.warn('[haiku player] warning:', warning)
}

module.exports = applyLayout
