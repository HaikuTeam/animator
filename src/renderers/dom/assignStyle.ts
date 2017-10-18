/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function assignStyle(domElement, virtualElement, style, component, isPatchOperation) {
  if (!domElement.__haikuExplicitStyles) domElement.__haikuExplicitStyles = {};

  if (!isPatchOperation) {
    // If we have an element from a previous run, remove any old styles that aren't part of the new one
    if (
      domElement.haiku &&
      domElement.haiku.element &&
      domElement.haiku.element.attributes &&
      domElement.haiku.element.attributes.style
    ) {
      for (const oldStyleKey in domElement.haiku.element.attributes.style) {
        const newStyleValue = style[oldStyleKey];
        if (newStyleValue === null || newStyleValue === undefined) {
          domElement.style[oldStyleKey] = null;
        }
      }
    }
  }

  for (const key in style) {
    const newProp = style[key];
    const previousProp = domElement.style[key];
    if (previousProp !== newProp) {
      domElement.__haikuExplicitStyles[key] = true;
      domElement.style[key] = style[key];
    }
  }
  return domElement;
}
