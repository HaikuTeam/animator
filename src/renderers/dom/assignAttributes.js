var assignStyle = require('./assignStyle')
var assignClass = require('./assignClass')
var assignEvent = require('./assignEvent')
var eventNames = require('./eventNames')

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

function assignAttributes (domElement, attributes, options, scopes) {
  for (var key in attributes) {
    var newValue = attributes[key]

    if (key === STYLE && newValue && typeof newValue === OBJECT) {
      assignStyle(domElement, newValue, options, scopes)
      continue
    }

    if ((key === CLASS || key === CLASS_NAME) && newValue) {
      assignClass(domElement, newValue, options, scopes)
      continue
    }

    var lower = key.toLowerCase()
    // 'onclick', etc
    if (lower[0] === 'o' && lower[1] === 'n' && typeof newValue === FUNCTION) {
      assignEvent(domElement, lower, newValue, options, scopes)
      continue
    }
    // fix 'click' to be 'onclick' per a known event mapping
    if (eventNames[lower]) {
      assignEvent(domElement, 'on' + lower, newValue, options, scopes)
      continue
    }

    setAttribute(domElement, key, newValue, options, scopes)
  }
  return domElement
}

module.exports = assignAttributes
