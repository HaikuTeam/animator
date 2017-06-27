/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function assignStyle(domElement, style, options, scopes, isPatchOperation) {
  if (!domElement.__haikuExplicitStyles) domElement.__haikuExplicitStyles = {};

  if (!isPatchOperation) {
    // If we have an element from a previous run, remove any old styles that aren't part of the new one
    if (
      domElement.haiku &&
      domElement.haiku.element &&
      domElement.haiku.element.attributes &&
      domElement.haiku.element.attributes.style
    ) {
      for (var oldStyleKey in domElement.haiku.element.attributes.style) {
        var newStyleValue = style[oldStyleKey];
        if (newStyleValue === null || newStyleValue === undefined) {
          domElement.style[oldStyleKey] = null;
        }
      }
    }
  }

  for (var key in style) {
    var newProp = style[key];
    var previousProp = domElement.style[key];
    if (previousProp !== newProp) {
      domElement.__haikuExplicitStyles[key] = true;
      domElement.style[key] = style[key];
    }
  }
  return domElement;
}

module.exports = assignStyle;
