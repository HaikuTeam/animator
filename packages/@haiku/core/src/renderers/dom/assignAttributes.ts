/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import assignClass from './assignClass';
import assignStyle from './assignStyle';

const STYLE = 'style';
const OBJECT = 'object';
const CLASS = 'class';
const CLASS_NAME = 'className';
const NS = 'http://www.w3.org/1999/xlink';
const XLINK_HREF = 'xlink:href';

const setAttribute = (
  domElement,
  virtualElement,
  key,
  val,
) => {
  if (key === XLINK_HREF) {
    const p0 = domElement.getAttributeNS(NS, key);
    if (p0 !== val) {
      domElement.setAttributeNS(NS, key, val);
    }
  } else {
    const p1 = domElement.getAttribute(key);
    if (p1 !== val) {
      domElement.setAttribute(key, val);
    }
  }
};

export default function assignAttributes (domElement, virtualElement, component, isPatchOperation) {
  if (!isPatchOperation) {
    // Remove any attributes from the previous run that aren't present this time around
    if (domElement.haiku && domElement.haiku.element) {
      for (const oldKey in domElement.haiku.element.attributes) {
        const oldValue = domElement.haiku.element.attributes[oldKey];
        const newValue = virtualElement.attributes[oldKey];

        if (oldKey !== STYLE) {
          // Removal of old styles is handled downstream; see assignStyle()
          if (newValue === null || newValue === undefined || oldValue !== newValue) {
            domElement.removeAttribute(oldKey);
          }
        }
      }
    }
  }

  for (const key in virtualElement.attributes) {
    const anotherNewValue = virtualElement.attributes[key];

    if (
      key === STYLE &&
      anotherNewValue &&
      typeof anotherNewValue === OBJECT
    ) {
      if (Object.keys(anotherNewValue).length > 0) {
        assignStyle(domElement, anotherNewValue, component, isPatchOperation);
      }
      continue;
    }

    if ((key === CLASS || key === CLASS_NAME) && anotherNewValue) {
      assignClass(domElement, anotherNewValue);
      continue;
    }

    // It's (almost?) never beneficial to write `NaN` to a DOM attribute here;
    // this is a very hot path, and the result is a deluge of not-catchable errors.
    if (Number.isNaN(anotherNewValue)) {
      continue;
    }

    setAttribute(
      domElement,
      virtualElement,
      key,
      anotherNewValue,
    );
  }

  return domElement;
}
