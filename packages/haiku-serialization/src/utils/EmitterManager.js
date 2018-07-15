const { EventEmitter } = require('events')

// Prevent trigger-happy MaxListenersExceededWarning
if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
  EventEmitter.prototype._maxListeners = Infinity
} else {
  EventEmitter.prototype._maxListeners = 500
}

/**
 * @class EmitterManager
 * @description For classes that are both emitters and which listen to emitters.
 * Intended to help manage large arrays of event emitters and abstract some complexity.
 */
class EmitterManager {
  constructor () {
    // Collection of event emitters tracked so we can sub/unsub from them in bulk
    // Array<{eventEmitter:EventEmitter, eventName:string, eventHandler:Function}>
    this._emitters = []
  }

  addEmitterListener (eventEmitter, eventName, eventHandler, options) {
    this._emitters.push([eventEmitter, eventName, eventHandler])
    if (eventEmitter.on) {
      eventEmitter.on(eventName, eventHandler)
    } else if (eventEmitter.addEventListener) {
      eventEmitter.addEventListener(eventName, eventHandler, options)
    }
  }

  addEmitterListenerIfNotAlreadyRegistered (eventEmitter, eventName, eventHandler) {
    // HACK: Instead of expanding the emitter directly, store this on ourselves somehow
    if (!eventEmitter._emitterManagerListenersRegistered) {
      eventEmitter._emitterManagerListenersRegistered = {}
    }

    if (!eventEmitter._emitterManagerListenersRegistered[eventName]) {
      eventEmitter._emitterManagerListenersRegistered[eventName] = eventHandler
      this.addEmitterListener(eventEmitter, eventName, eventHandler)
    }
  }

  removeEmitterListeners () {
    // Clean up subscriptions to prevent memory leaks and react warnings
    this._emitters.forEach((tuple) => {
      tuple[0].removeListener(tuple[1], tuple[2])
    })
  }
}

EmitterManager.extend = (instance) => {
  const emitterManager = new EmitterManager()
  const propertyNames = Object.getOwnPropertyNames(EmitterManager.prototype)
  propertyNames.forEach((propertyName) => {
    if (propertyName === 'constructor') return
    const foundProperty = emitterManager[propertyName]
    if (typeof foundProperty === 'function') {
      instance[propertyName] = foundProperty.bind(emitterManager)
    }
  })
  return instance
}

module.exports = EmitterManager
