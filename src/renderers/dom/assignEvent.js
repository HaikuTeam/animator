/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var attachEventListener = require('./attachEventListener')

function assignEvent (
  domElement,
  eventName,
  listenerFunction,
  component
) {
  if (!domElement.haiku) {
    domElement.haiku = {}
  }
  if (!domElement.haiku.listeners) {
    domElement.haiku.listeners = {}
  }
  if (!domElement.haiku.listeners[eventName]) {
    domElement.haiku.listeners[eventName] = []
  }

  var already = false
  for (var i = 0; i < domElement.haiku.listeners[eventName].length; i++) {
    var existing = domElement.haiku.listeners[eventName][i]
    if (existing._haikuListenerId === listenerFunction._haikuListenerId) {
      already = true
      break
    }
  }

  if (!already) {
    listenerFunction._haikuListenerId = Math.random() + ''
    domElement.haiku.listeners[eventName].push(listenerFunction)

    attachEventListener(
      domElement,
      eventName,
      listenerFunction,
      component
    )
  }
}

module.exports = assignEvent
