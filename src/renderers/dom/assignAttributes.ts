/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import assignClass from "./assignClass"
import assignStyle from "./assignStyle"
import attachEventListener from "./attachEventListener"
import getFlexId from "./getFlexId"

const STYLE = "style"
const OBJECT = "object"
const FUNCTION = "function"
const CLASS = "class"
const CLASS_NAME = "className"

const XLINK_XMLNS = "http://www.w3.org/1999/xlink"
const X = "x"
const L = "l"
const I = "i"
const N = "n"
const K = "k"

// data:image/png;base64 etc
const D = "d"
const A = "a"
const T = "t"
const COLON = ":"
const M = "m"
const G = "g"
const E = "e"
const FSLASH = "/"

function setAttribute(el, key, val, component, cache) {
  // If key === xlink:href we are dealing with a reference and need to use a namepsace
  if (key[0] === X && key[1] === L && key[2] === I && key[3] === N && key[4] === K) {
    let ns = XLINK_XMLNS

    // If the value is data:image/, treat that as a special case magic string
    if (
      val[0] === D &&
      val[1] === A &&
      val[2] === T &&
      val[3] === A &&
      val[4] === COLON &&
      val[5] === I &&
      val[6] === M &&
      val[7] === A &&
      val[8] === G &&
      val[9] === E &&
      val[10] === FSLASH) {
      // In case of a huge image string, we don't even diff it, we just write it once and only once
      if (!cache.base64image) {
        el.setAttributeNS(ns, key, val)
        cache.base64image = true
      }
    } else {
      let p0 = el.getAttributeNS(ns, key)
      if (p0 !== val) {
        el.setAttributeNS(ns, key, val)
      }
    }
  } else {
    // Fast path several attributes for which it's expensive to compare/read from DOM
    if (key === "d") {
      if (val !== cache.d) {
        el.setAttribute(key, val)
        cache.d = val
      }
    } else if (key === "points") {
      if (val !== cache.points) {
        el.setAttribute(key, val)
        cache.points = val
      }
    } else {
      let p1 = el.getAttribute(key)
      if (p1 !== val) {
        el.setAttribute(key, val)
      }
    }
  }
}

export default function assignAttributes(
  domElement,
  virtualElement,
  component,
  isPatchOperation,
  isKeyDifferent,
) {
  if (!isPatchOperation) {
    // Remove any attributes from the previous run that aren't present this time around
    if (domElement.haiku && domElement.haiku.element) {
      for (let oldKey in domElement.haiku.element.attributes) {
        let oldValue = domElement.haiku.element.attributes[oldKey]
        let newValue = virtualElement.attributes[oldKey]
        if (oldKey !== STYLE) {
          // Removal of old styles is handled downstream; see assignStyle()
          if (
            newValue === null ||
            newValue === undefined ||
            oldValue !== newValue
          ) {
            domElement.removeAttribute(oldKey)
          }
        }
      }
    }
  }

  for (let key in virtualElement.attributes) {
    let anotherNewValue = virtualElement.attributes[key]

    if (key === STYLE && anotherNewValue && typeof anotherNewValue === OBJECT) {
      assignStyle(
        domElement,
        virtualElement,
        anotherNewValue,
        component,
        isPatchOperation,
      )
      continue
    }

    if ((key === CLASS || key === CLASS_NAME) && anotherNewValue) {
      assignClass(domElement, anotherNewValue)
      continue
    }

    // 'onclick', etc - Handling the chance that we got an inline event handler
    if (
      key[0] === "o" &&
      key[1] === "n" &&
      typeof anotherNewValue === FUNCTION
    ) {
      attachEventListener(virtualElement, domElement, key.slice(2).toLowerCase(), anotherNewValue, component)
      continue
    }

    setAttribute(domElement, key, anotherNewValue, component, component.config.options.cache[getFlexId(virtualElement)])
  }

  // Any 'hidden' eventHandlers we got need to be assigned now.
  // Note: The #legacy way this used to happen was via node attributes, which caused problems
  // Hence them being 'hidden' in this __handlers object
  if (virtualElement.__handlers) {
    for (let eventName in virtualElement.__handlers) {
      let handler = virtualElement.__handlers[eventName]
      if (!handler.__subscribed) {
        attachEventListener(virtualElement, domElement, eventName, handler, component)
        handler.__subscribed = true
      }
    }
  }

  return domElement
}
