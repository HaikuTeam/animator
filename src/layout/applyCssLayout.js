/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var setStyleMatrix = require('./setStyleMatrix')
var formatTransform = require('./formatTransform')
var isEqualTransformString = require('./isEqualTransformString')
var scopeOfElement = require('./scopeOfElement')

var SVG = 'svg'

function hasExplicitStyle (domElement, key) {
  if (!domElement.__haikuExplicitStyles) return false
  return !!domElement.__haikuExplicitStyles[key]
}

function applyCssLayout (
  domElement,
  virtualElement,
  nodeLayout,
  computedLayout,
  pixelRatio,
  context
) {
  // No point continuing if there's no computedLayout contents
  if (
    !computedLayout.opacity &&
    !computedLayout.size &&
    !computedLayout.matrix
  ) {
    return
  }

  var elementScope = scopeOfElement(virtualElement)

  if (nodeLayout.shown === false) {
    if (domElement.style.visibility !== 'hidden') {
      domElement.style.visibility = 'hidden'
    }
  } else if (nodeLayout.shown === true) {
    if (domElement.style.visibility !== 'visible') {
      domElement.style.visibility = 'visible'
    }
  }

  if (!hasExplicitStyle(domElement, 'opacity')) {
    if (computedLayout.opacity) {
      // A lack of an opacity setting means 100% opacity, so unset any existing
      // value if we happen to get an opacity approaching 1.
      if (computedLayout.opacity > 0.999) {
        if (domElement.style.opacity) domElement.style.opacity = void 0
      } else {
        var opacityString = '' + computedLayout.opacity
        if (domElement.style.opacity !== opacityString) {
          domElement.style.opacity = opacityString
        }
      }
    }
  }

  if (!hasExplicitStyle(domElement, 'width')) {
    if (computedLayout.size.x !== undefined) {
      var sizeXString = parseFloat(computedLayout.size.x.toFixed(2)) + 'px'
      if (domElement.style.width !== sizeXString) {
        domElement.style.width = sizeXString
      }
      // If we're inside an SVG, we also have to assign the width/height attributes or Firefox will complain
      if (elementScope === SVG) {
        if (domElement.getAttribute('width') !== sizeXString) {
          domElement.setAttribute('width', sizeXString)
        }
      }
    }
  }

  if (!hasExplicitStyle(domElement, 'height')) {
    if (computedLayout.size.y !== undefined) {
      var sizeYString = parseFloat(computedLayout.size.y.toFixed(2)) + 'px'
      if (domElement.style.height !== sizeYString) {
        domElement.style.height = sizeYString
      }
      // If we're inside an SVG, we also have to assign the width/height attributes or Firefox will complain
      if (elementScope === SVG) {
        if (domElement.getAttribute('height') !== sizeYString) {
          domElement.setAttribute('height', sizeYString)
        }
      }
    }
  }

  if (computedLayout.matrix) {
    var attributeTransform = domElement.getAttribute('transform')
    // IE doesn't support using transform on the CSS style in SVG elements, so if we are in SVG,
    // and if we are inside an IE context, use the transform attribute itself
    if (context.config.options.platform.isIE) {
      if (elementScope === SVG) {
        var matrixString = formatTransform(
          computedLayout.matrix,
          nodeLayout.format,
          pixelRatio
        )
        if (!isEqualTransformString(attributeTransform, matrixString)) {
          domElement.setAttribute('transform', matrixString)
        }
      } else {
        setStyleMatrix(
          domElement.style,
          nodeLayout.format,
          computedLayout.matrix,
          context.config.options.useWebkitPrefix,
          pixelRatio,
          context
        )
      }
    } else {
      // An domElement might have an explicit transform override set, in which case, don't
      // attach the style transform to this node, because we will likely clobber what they've set
      if (!hasExplicitStyle(domElement, 'transform')) {
        if (
          !attributeTransform ||
          attributeTransform === '' ||
          virtualElement.__transformed
        ) {
          setStyleMatrix(
            domElement.style,
            nodeLayout.format,
            computedLayout.matrix,
            context.config.options.useWebkitPrefix,
            pixelRatio,
            context
          )
        }
      }
    }
  }

  return domElement.style
}

module.exports = applyCssLayout
