var attachEventListener = require('./attachEventListener')

function assignEvent (domElement, lowerCaseName, listenerFunction, options, scopes) {
  if (!domElement.listeners) domElement.listeners = {}
  if (!domElement.listeners[lowerCaseName]) domElement.listeners[lowerCaseName] = []
  var already = false
  for (var i = 0; i < domElement.listeners[lowerCaseName].length; i++) {
    var existing = domElement.listeners[lowerCaseName][i]
    if (existing === listenerFunction) already = true
  }
  if (!already) {
    domElement.listeners[lowerCaseName].push(listenerFunction)
    attachEventListener(domElement, lowerCaseName, listenerFunction, options, scopes)
  }
}

module.exports = assignEvent
