/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import attachEventListener from "./attachEventListener"

export default function assignEvent(
  domElement,
  eventName,
  listenerFunction,
  component,
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

  let already = false
  for (let i = 0; i < domElement.haiku.listeners[eventName].length; i++) {
    let existing = domElement.haiku.listeners[eventName][i]
    if (existing._haikuListenerId === listenerFunction._haikuListenerId) {
      already = true
      break
    }
  }

  if (!already) {
    listenerFunction._haikuListenerId = Math.random() + ""
    domElement.haiku.listeners[eventName].push(listenerFunction)

    attachEventListener(
      domElement,
      eventName,
      listenerFunction,
      component,
    )
  }
}
