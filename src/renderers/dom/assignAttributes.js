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

function setAttribute (el, key, val, options, scopes) {
  if ((key.slice(0, 5) === 'xlink')) {
    var ns = XLINK_XMLNS
    var p0 = el.getAttributeNS(ns, key)
    if (p0 !== val) el.setAttributeNS(ns, key, val)
  } else {
    var p1 = el.getAttribute(key)
    if (p1 !== val) el.setAttribute(key, val)
  }
}

function assignAttributes (domElement, attributes, options, scopes, isPatchOperation, isKeyDifferent) {
  if (!isPatchOperation) {
    // Remove any attributes from the previous run that aren't present this time around
    if (domElement.haiku && domElement.haiku.element) {
      for (var oldKey in domElement.haiku.element.attributes) {
        var oldValue = domElement.haiku.element.attributes[oldKey]
        var newValue = attributes[oldKey]
        if (oldKey !== STYLE) { // Removal of old styles is handled downstream; see assignStyle()
          if (newValue === null || newValue === undefined || oldValue !== newValue) {
            domElement.removeAttribute(oldKey)
          }
        }
      }
    }
  }

  for (var key in attributes) {
    var anotherNewValue = attributes[key]

    if (key === STYLE && anotherNewValue && typeof anotherNewValue === OBJECT) {
      assignStyle(domElement, anotherNewValue, options, scopes, isPatchOperation)
      continue
    }

    if ((key === CLASS || key === CLASS_NAME) && anotherNewValue) {
      assignClass(domElement, anotherNewValue, options, scopes)
      continue
    }

    var lower = key.toLowerCase()
    // 'onclick', etc
    if (lower[0] === 'o' && lower[1] === 'n' && typeof anotherNewValue === FUNCTION) {
      assignEvent(domElement, lower, anotherNewValue, options, scopes)
      continue
    }

    setAttribute(domElement, key, anotherNewValue, options, scopes)
  }
  return domElement
}

module.exports = assignAttributes
