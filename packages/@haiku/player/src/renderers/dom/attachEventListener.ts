/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import Events from './Events';

export default function attachEventListener(virtualElement, domElement, eventName, listener, component) {
  // FF doesn't like it if this isn't a function... this can happen if bad props are passed upstream
  if (typeof listener === 'function') {
    let target;

    // If this event is a window-level event, then register it on the window instead of the element
    // Note that the logic to prevent duplicate subscriptions is supposed to occur upstream of this function!
    if (Events.window[eventName]) {
      target = domElement.ownerDocument.defaultView || domElement.ownerDocument.parentWindow;
    } else {
      target = domElement;
    }

    if (target) {
      if (!component._hasRegisteredListenerOnElement(virtualElement, eventName)) {
        component._markDidRegisterListenerOnElement(virtualElement, target, eventName, listener);
        target.addEventListener(eventName, listener);
      }
    }
  }
}
