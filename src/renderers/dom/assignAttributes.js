/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var assignStyle = require('./assignStyle')
var assignClass = require('./assignClass')
var assignEvent = require('./assignEvent')

var STYLE = 'style'
var OBJECT = 'object'
var FUNCTION = 'function'
var CLASS = 'class'
var CLASS_NAME = 'className'

var XLINK_XMLNS = 'http://www.w3.org/1999/xlink'
var X = 'x'
var L = 'l'
var I = 'i'
var N = 'n'
var K = 'k'

// data:image/png;base64 etc
var D = 'd'
var A = 'a'
var T = 't'
var COLON = ':'
var M = 'm'
var G = 'g'
var E = 'e'
var FSLASH = '/'

function setAttribute (el, key, val, options, scopes, cache) {
  // If key === xlink:href we are dealing with a reference and need to use a namepsace
  if (key[0] === X && key[1] === L && key[2] === I && key[3] === N && key[4] === K) {
    var ns = XLINK_XMLNS

    // If the value is data:image/, treat that as a special case magic string
    if (val[0] === D && val[1] === A && val[2] === T && val[3] === A && val[4] === COLON && val[5] === I && val[6] === M && val[7] === A && val[8] === G && val[9] === E && val[10] === FSLASH) {
      // In case of a huge image string, we don't even diff it, we just write it once and only once
      if (!cache.base64image) {
        el.setAttributeNS(ns, key, val)
        cache.base64image = true
      }
    } else {
      var p0 = el.getAttributeNS(ns, key)
      if (p0 !== val) {
        el.setAttributeNS(ns, key, val)
      }
    }
  } else {
    // Fast path several attributes for which it's expensive to compare/read from DOM
    if (key === 'd') {
      if (val !== cache.d) {
        el.setAttribute(key, val)
        cache.d = val
      }
    } else if (key === 'points') {
      if (val !== cache.points) {
        el.setAttribute(key, val)
        cache.points = val
      }
    } else {
      var p1 = el.getAttribute(key)
      if (p1 !== val) {
        el.setAttribute(key, val)
      }
    }
  }
}

function assignAttributes (
  domElement,
  attributes,
  options,
  scopes,
  isPatchOperation,
  isKeyDifferent
) {
  if (!isPatchOperation) {
    // Remove any attributes from the previous run that aren't present this time around
    if (domElement.haiku && domElement.haiku.element) {
      for (var oldKey in domElement.haiku.element.attributes) {
        var oldValue = domElement.haiku.element.attributes[oldKey]
        var newValue = attributes[oldKey]
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

  for (var key in attributes) {
    var anotherNewValue = attributes[key]

    if (key === STYLE && anotherNewValue && typeof anotherNewValue === OBJECT) {
      assignStyle(
        domElement,
        anotherNewValue,
        options,
        scopes,
        isPatchOperation
      )
      continue
    }

    if ((key === CLASS || key === CLASS_NAME) && anotherNewValue) {
      assignClass(domElement, anotherNewValue, options, scopes)
      continue
    }

    var lower = key.toLowerCase()
    // 'onclick', etc
    if (
      lower[0] === 'o' &&
      lower[1] === 'n' &&
      typeof anotherNewValue === FUNCTION
    ) {
      assignEvent(domElement, lower, anotherNewValue, options, scopes)
      continue
    }

    setAttribute(domElement, key, anotherNewValue, options, scopes, options.cache[domElement.haiku.locator])
  }
  return domElement
}

module.exports = assignAttributes
