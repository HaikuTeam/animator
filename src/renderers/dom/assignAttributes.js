var assignStyle = require('./assignStyle')
var assignClass = require('./assignClass')
var assignEvent = require('./assignEvent')
var eventNames = require('./eventNames')

var STYLE = 'style'
var OBJECT = 'object'
var FUNCTION = 'function'
var CLASS = 'class'
var CLASS_NAME = 'className'

var SVG_XMLNS = 'http://www.w3.org/2000/svg'

function setAttr (el, key, val) {
  if (key.slice(0, 5) === 'xlink') {
    if (!el.getAttribute('xmlns:xlink')) {
      console.log(1)
    }
    var p0 = el.getAttributeNS(SVG_XMLNS, key)
    if (p0 !== val) el.setAttributeNS(SVG_XMLNS, key, val)
  } else {
    var p1 = el.getAttribute(key)
    if (p1 !== val) el.setAttribute(key, val)
  }
}

function assignAttributes (domElement, attributes) {
  for (var key in attributes) {
    var newValue = attributes[key]

    if (key === STYLE && newValue && typeof newValue === OBJECT) {
      assignStyle(domElement, newValue)
      continue
    }

    if ((key === CLASS || key === CLASS_NAME) && newValue) {
      assignClass(domElement, newValue)
      continue
    }

    var lower = key.toLowerCase()
    // 'onclick', etc
    if (lower[0] === 'o' && lower[1] === 'n' && typeof newValue === FUNCTION) {
      assignEvent(domElement, lower, newValue)
      continue
    }
    // fix 'click' to be 'onclick' per a known event mapping
    if (eventNames[lower]) {
      assignEvent(domElement, 'on' + lower, newValue)
      continue
    }

    setAttr(domElement, key, newValue)
  }
  return domElement
}

module.exports = assignAttributes
