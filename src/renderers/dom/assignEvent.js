function assignEvent (domElement, name, listenerFunction) {
  if (!domElement.listeners) domElement.listeners = {}
  if (!domElement.listeners[name]) domElement.listeners[name] = []
  var already = false
  for (var i = 0; i < domElement.listeners[name].length; i++) {
    var existing = domElement.listeners[name][i]
    if (existing === listenerFunction) already = true
  }
  if (!already) {
    domElement.listeners[name].push(listenerFunction)
  }
}

module.exports = assignEvent
