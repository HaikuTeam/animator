var assignStyle = require('./assignStyle')
var assignClass = require('./assignClass')
var assignEvent = require('./assignEvent')

var STYLE = 'style'
var OBJECT = 'object'
var FUNCTION = 'function'
var CLASS = 'class'
var CLASS_NAME = 'className'

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

    if (key[0] === 'o' && key[1] === 'n' && typeof newValue === FUNCTION) {
      assignEvent(domElement, key, newValue)
      continue
    }

    var previousValue = domElement.getAttribute(key)
    if (previousValue !== newValue) domElement.setAttribute(key, newValue)
  }
  return domElement
}

module.exports = assignAttributes
