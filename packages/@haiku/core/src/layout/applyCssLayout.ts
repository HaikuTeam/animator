/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import formatTransform from './formatTransform';
import isEqualTransformString from './isEqualTransformString';
import scopeOfElement from './scopeOfElement';
import setStyleMatrix from './setStyleMatrix';

const SVG = 'svg';

function hasExplicitStyle(domElement, key) {
  if (!domElement.__haikuExplicitStyles) {
    return false;
  }
  return !!domElement.__haikuExplicitStyles[key];
}

export default function applyCssLayout(domElement, virtualElement, nodeLayout, computedLayout, context) {
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

  if (virtualElement.elementName === SVG && !domElement.style.transformOrigin) {
    // Reset the transform-origin to allow our layout system to be self-contained.
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
          context.config.useWebkitPrefix,
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
            context.config.useWebkitPrefix,
          );
        }
      }
    }
  }

  return domElement.style;
}
