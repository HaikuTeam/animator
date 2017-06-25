/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = function attachEventListener (domElement, lowercaseName, listener, options, scopes) {
  var eventName = lowercaseName.slice(2) // Assumes 'on*' prefix

  // FF doesn't like it if this isn't a function... this can happen if bad props are passed upstream
  if (typeof listener === 'function') {
    domElement.addEventListener(eventName, listener)
  }
}
