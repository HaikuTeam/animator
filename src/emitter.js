function create (instance) {
  var registry = {}

  instance.on = function on (key, fn) {
    if (!registry[key]) registry[key] = []
    registry[key].push(fn)
    return this
  }

  instance.off = function off (key, fn) {
    var listeners = registry[key]
    if (!listeners || listeners.length < 1) return this
    for (var i = 0; i < listeners.length; i++) {
      if (fn && listeners[i] === fn) listeners.splice(i, 1)
      else listeners.splice(i, 1)
    }
    return this
  }

  instance.emit = function emit (key, msg) {
    var listeners = registry[key]
    if (!listeners || listeners.length < 1) return this
    for (var i = 0; i < listeners.length; i++) listeners[i](msg)
    return this
  }

  return registry
}

module.exports = {
  create: create
}
