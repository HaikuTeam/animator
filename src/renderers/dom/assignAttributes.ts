/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import assignClass from './assignClass';
import assignStyle from './assignStyle';
import attachEventListener from './attachEventListener';
import getFlexId from './getFlexId';

const STYLE = 'style';
const OBJECT = 'object';
const FUNCTION = 'function';
const CLASS = 'class';
const CLASS_NAME = 'className';

// data:image/png;base64 etc

function setAttribute(el, key, val, cache) {
  // If key === xlink:href we are dealing with a reference and need to use a namespace.
  if (key[0] === 'x' && key[1] === 'l' && key[2] === 'i' && key[3] === 'n' && key[4] === 'k') {
    const ns = 'http://www.w3.org/1999/xlink';

    // If the value is data:image/, treat that as a special case magic string
    if (
      val[0] === 'd' &&
      val[1] === 'a' &&
      val[2] === 't' &&
      val[3] === 'a' &&
      val[4] === ':' &&
      val[5] === 'i' &&
      val[6] === 'm' &&
      val[7] === 'a' &&
      val[8] === 'g' &&
      val[9] === 'e' &&
      val[10] === '/'
    ) {
      // In case of a huge image string, we don't even diff it, we just write it once and only once
      if (!cache.base64image) {
        el.setAttributeNS(ns, key, val);
        cache.base64image = true;
      }
    } else {
      const p0 = el.getAttributeNS(ns, key);
      if (p0 !== val) {
        el.setAttributeNS(ns, key, val);
      }
    }
  } else {
    // Fast path several attributes for which it's expensive to compare/read from DOM
    if (key === 'd') {
      if (val !== cache.d) {
        el.setAttribute(key, val);
        cache.d = val;
      }
    } else if (key === 'points') {
      if (val !== cache.points) {
        el.setAttribute(key, val);
        cache.points = val;
      }
    } else {
      const p1 = el.getAttribute(key);
      if (p1 !== val) {
        el.setAttribute(key, val);
      }
    }
  }
}

export default function assignAttributes(domElement, virtualElement, component, isPatchOperation) {
  const cache = component.cache[getFlexId(virtualElement)]

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

            if(cache[oldKey]) {
              cache[oldKey] = null
            }
          }
        }
      }
    }
  }

  for (const key in virtualElement.attributes) {
    const anotherNewValue = virtualElement.attributes[key];

    if (
      key === STYLE
      && anotherNewValue
      && typeof anotherNewValue === OBJECT &&
      Object.keys(anotherNewValue).length !== 0
    ) {
      assignStyle(domElement, anotherNewValue, component, isPatchOperation);
      continue;
    }

    if ((key === CLASS || key === CLASS_NAME) && anotherNewValue) {
      assignClass(domElement, anotherNewValue);
      continue;
    }

    // 'onclick', etc - Handling the chance that we got an inline event handler
    if (key[0] === 'o' && key[1] === 'n' && typeof anotherNewValue === FUNCTION) {
      attachEventListener(virtualElement, domElement, key.slice(2).toLowerCase(), anotherNewValue, component);
      continue;
    }

    setAttribute(domElement, key, anotherNewValue, cache);
  }

  // Any 'hidden' eventHandlers we got need to be assigned now.
  // Note: The #legacy way this used to happen was via node attributes, which caused problems
  // Hence them being 'hidden' in this __handlers object
  if (virtualElement.__handlers) {
    for (const eventName in virtualElement.__handlers) {
      const handler = virtualElement.__handlers[eventName];
      if (!handler.__subscribed) {
        attachEventListener(virtualElement, domElement, eventName, handler, component);
        handler.__subscribed = true;
      }
    }
  }

  return domElement;
}
