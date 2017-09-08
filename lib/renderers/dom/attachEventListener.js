/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Events = require('./Events')

module.exports = function attachEventListener (
  domElement,
  eventName,
  listener,
  component
) {
  // FF doesn't like it if this isn't a function... this can happen if bad props are passed upstream
  if (typeof listener === 'function') {
    // If this event is a window-level event, then register it on the window instead of the element
    // Note that the logic to prevent duplicate subscriptions is supposed to occur upstream of this function!
    if (Events.window[eventName]) {
      var win = domElement.ownerDocument.defaultView || domElement.ownerDocument.parentWindow
      if (win) {
        win.addEventListener(eventName, listener)
      }
    } else {
      domElement.addEventListener(eventName, listener)
    }
  }
}
