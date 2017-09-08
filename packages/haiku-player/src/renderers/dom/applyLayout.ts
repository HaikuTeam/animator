/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let isTextNode = require("./isTextNode")
let isIE = require("./isIE")
let isEdge = require("./isEdge")
let getWindowsBrowserVersion = require("./getWindowsBrowserVersion")
let isMobile = require("./isMobile")
let applyCssLayout = require("./../../layout/applyCssLayout")
let scopeOfElement = require("./../../layout/scopeOfElement")
let hasPreserve3d = require("./../../vendor/modernizr").hasPreserve3d

let DEFAULT_PIXEL_RATIO = 1.0
let SVG = "svg"

let safeWindow = typeof window !== "undefined" && window
let PLATFORM_INFO = {
  hasWindow: !!safeWindow,
  isMobile: isMobile(safeWindow), // Dumb navigator check
  isIE: isIE(safeWindow), // Dumb navigator check - use feature detection instead?
  isEdge: isEdge(safeWindow),
  windowsBrowserVersion: getWindowsBrowserVersion(safeWindow),
  hasPreserve3d: hasPreserve3d(safeWindow), // I dunno if we actually need this
  devicePixelRatio: DEFAULT_PIXEL_RATIO,
}

// console.info('[haiku player] platform info:', JSON.stringify(PLATFORM_INFO))

let SVG_RENDERABLES = {
  a: true,
  audio: true,
  canvas: true,
  circle: true,
  ellipse: true,
  filter: true,
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
  video: true,
}

function applyLayout(
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  component,
  isPatchOperation,
  isKeyDifferent,
) {
  if (isTextNode(virtualElement)) return domElement

  if (virtualElement.layout) {
    // Don't assign layout to things that never need it like <desc>, <title>, etc.
    // Check if we're inside an <svg> component *and* one of the actually renderable svg-type els
    if (
      scopeOfElement(virtualElement) === SVG &&
      !SVG_RENDERABLES[virtualElement.elementName]
    ) {
      return domElement
    }

    if (!parentVirtualElement.layout || !parentVirtualElement.layout.computed) {
      _warnOnce(
        "Cannot compute layout without parent computed size (child: <" +
          virtualElement.elementName +
          ">; parent: <" +
          parentVirtualElement.elementName +
          ">)",
      )
      return domElement
    }

    let devicePixelRatio =
      (component.config.options && component.config.options.devicePixelRatio) || DEFAULT_PIXEL_RATIO
    let computedLayout = virtualElement.layout.computed

    // No computed layout means the el is not shown
    if (!computedLayout || computedLayout.invisible) {
      if (domElement.style.display !== "none") {
        domElement.style.display = "none"
      }
    } else {
      if (domElement.style.display !== "block") {
        domElement.style.display = "block"
      }

      component.config.options.platform = PLATFORM_INFO

      applyCssLayout(
        domElement,
        virtualElement,
        virtualElement.layout,
        computedLayout,
        devicePixelRatio,
        component,
      )
    }
  }

  return domElement
}

let warnings = {}

function _warnOnce(warning) {
  if (warnings[warning]) return void 0
  warnings[warning] = true
  console.warn("[haiku player] warning:", warning)
}

module.exports = applyLayout
