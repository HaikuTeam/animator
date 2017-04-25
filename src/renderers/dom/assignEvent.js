var attachEventListener = require('./attachEventListener')

function assignEvent (domElement, lowerCaseName, listenerFunction, options, scopes) {
  if (!domElement.haiku) {
    domElement.haiku = {}
  }
  if (!domElement.haiku.listeners) {
    domElement.haiku.listeners = {}
  }
  if (!domElement.haiku.listeners[lowerCaseName]) {
    domElement.haiku.listeners[lowerCaseName] = []
  }

  var already = false
  for (var i = 0; i < domElement.haiku.listeners[lowerCaseName].length; i++) {
    var existing = domElement.haiku.listeners[lowerCaseName][i]
    if (existing._haikuListenerId === listenerFunction._haikuListenerId) {
      already = true
      break
    }
  }

  if (!already) {
    listenerFunction._haikuListenerId = Math.random() + ''
    domElement.haiku.listeners[lowerCaseName].push(listenerFunction)
    attachEventListener(domElement, lowerCaseName, listenerFunction, options, scopes)
  }
}

module.exports = assignEvent
