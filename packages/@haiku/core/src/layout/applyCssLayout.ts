/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import Layout3D from '../Layout3D';
import formatTransform from './formatTransform';
import isEqualTransformString from './isEqualTransformString';
import scopeOfElement from './scopeOfElement';
import setStyleMatrix from './setStyleMatrix';

const SVG = 'svg';

function hasExplicitStyle (domElement, key) {
  if (!domElement.haiku) {
    return false;
  }
  if (!domElement.haiku.explicitStyles) {
    return false;
  }
  return domElement.haiku.explicitStyles[key] !== undefined;
}

/**
 * Tags which can receive width and height styles.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/width}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/height}
 */
const DOM_SIZEABLES = {
  div: true,
  feBlend: true,
  feColorMatrix: true,
  feComponentTransfer: true,
  feComposite: true,
  feConvolveMatrix: true,
  feDiffuseLighting: true,
  feDisplacementMap: true,
  feDropShadow: true,
  feFlood: true,
  feGaussianBlur: true,
  feImage: true,
  feMerge: true,
  feMorphology: true,
  feOffset: true,
  feSpecularLighting: true,
  feTile: true,
  feTurbulence: true,
  filter: true,
  foreignObject: true,
  image: true,
  mask: true,
  pattern: true,
  rect: true,
  svg: true,
  use: true,
};

export default function applyCssLayout (domElement, virtualElement, nodeLayout, computedLayout, context) {
  // No point continuing if there's no computedLayout contents
  if (computedLayout.opacity === undefined && !computedLayout.size && !computedLayout.matrix) {
    return;
  }

  const elementScope = scopeOfElement(virtualElement);

  if (nodeLayout.shown === false) {
    if (domElement.style.visibility !== 'hidden') {
      domElement.style.visibility = 'hidden';
    }
  } else if (nodeLayout.shown === true) {
    if (domElement.style.visibility !== 'visible') {
      domElement.style.visibility = 'visible';
    }
  }

  if (!hasExplicitStyle(domElement, 'opacity')) {
    // No opacity defined means use whatever the previously defined opacity was
    if (computedLayout.opacity === undefined) {
      // no-op
    } else {
      let finalOpacity;

      if (computedLayout.opacity >= 0.999) {
        finalOpacity = 1;
      } else if (computedLayout.opacity <= 0.0001) {
        finalOpacity = 0;
      } else {
        finalOpacity = computedLayout.opacity;
      }

      const opacityString = '' + finalOpacity;

      if (domElement.style.opacity !== opacityString) {
        domElement.style.opacity = opacityString;
      }
    }
  }

  if (DOM_SIZEABLES[virtualElement.elementName] && computedLayout.size) {
    if (!hasExplicitStyle(domElement, 'width')) {
      if (computedLayout.size.x !== undefined) {
        const sizeXString = parseFloat(computedLayout.size.x.toFixed(2)) + 'px';
        if (domElement.style.width !== sizeXString) {
          domElement.style.width = sizeXString;
        }
        // If we're inside an SVG, we also have to assign the width/height attributes or Firefox will complain
        if (elementScope === SVG) {
          if (domElement.getAttribute('width') !== sizeXString) {
            domElement.setAttribute('width', sizeXString);
          }
        }
      }
    }

    if (!hasExplicitStyle(domElement, 'height')) {
      if (computedLayout.size.y !== undefined) {
        const sizeYString = parseFloat(computedLayout.size.y.toFixed(2)) + 'px';
        if (domElement.style.height !== sizeYString) {
          domElement.style.height = sizeYString;
        }
        // If we're inside an SVG, we also have to assign the width/height attributes or Firefox will complain
        if (elementScope === SVG) {
          if (domElement.getAttribute('height') !== sizeYString) {
            domElement.setAttribute('height', sizeYString);
          }
        }
      }
    }
  }

  if (Layout3D.virtualElementIsLayoutContainer(virtualElement) && !domElement.style.transformOrigin) {
    // Reset the transform-origin so that our layout system can be self-contained.
    domElement.style.transformOrigin = '0% 0% 0px';
  }

  if (computedLayout.matrix) {
    const attributeTransform = domElement.getAttribute('transform');
    // IE doesn't support using transform on the CSS style in SVG elements, so if we are in SVG,
    // and if we are inside an IE context, use the transform attribute itself
    if (context.config.platform.isIE || context.config.platform.isEdge) {
      if (elementScope === SVG) {
        const matrixString = formatTransform(computedLayout.matrix, nodeLayout.format);
        if (!isEqualTransformString(attributeTransform, matrixString)) {
          domElement.setAttribute('transform', matrixString);
        }
      } else {
        setStyleMatrix(
          domElement.style,
          nodeLayout.format,
          computedLayout.matrix,
        );
      }
    } else {
      // An domElement might have an explicit transform override set, in which case, don't
      // attach the style transform to this node, because we will likely clobber what they've set
      if (!hasExplicitStyle(domElement, 'transform')) {
        if (
          !attributeTransform ||
          attributeTransform === ''
        ) {
          setStyleMatrix(
            domElement.style,
            nodeLayout.format,
            computedLayout.matrix,
          );
        }
      }
    }
  }

  return domElement.style;
}
