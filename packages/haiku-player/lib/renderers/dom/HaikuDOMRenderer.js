/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var getElementSize = require('./getElementSize')
var _getLocalDomEventPosition = require('./getLocalDomEventPosition')
var createRightClickMenu = require('./createRightClickMenu')
var createMixpanel = require('./createMixpanel')
var _render = require('./render')
var _patch = require('./patch')

function HaikuDOMRenderer () {
  // TODO: Pass in the mount element here instead of through the methods each time?
  if (!(this instanceof HaikuDOMRenderer)) {
    return new HaikuDOMRenderer()
  }

  this._user = {
    mouse: {
      x: 0,
      y: 0,
      down: 0,
      buttons: [0, 0, 0] // Assume most mouses have 3 buttons?
    },
    keys: {},
    touches: [], // [{ x: 'number', y: 'number' }]
    mouches: [] // [{ x: 'number', y: 'number' }] - Both touches and mouse cursor info
  }
}

HaikuDOMRenderer.prototype.render = function render (
  domElement,
  virtualContainer,
  virtualTree,
  component
) {
  return _render(
    domElement,
    virtualContainer,
    virtualTree,
    component
  )
}

HaikuDOMRenderer.prototype.patch = function patch (
  domElement,
  virtualContainer,
  patchesDict,
  component
) {
  return _patch(
    domElement,
    virtualContainer,
    patchesDict,
    component
  )
}

HaikuDOMRenderer.prototype.menuize = function menuize (domElement, component) {
  return createRightClickMenu(domElement, component)
}

HaikuDOMRenderer.prototype.mixpanel = function mixpanel (domElement, mixpanelToken, component) {
  return createMixpanel(domElement, mixpanelToken, component)
}

HaikuDOMRenderer.prototype.createContainer = function createContainer (domElement) {
  return {
    isContainer: true,
    layout: {
      computed: {
        size: getElementSize(domElement)
      }
    }
  }
}

HaikuDOMRenderer.prototype.initialize = function initialize (domElement) {
  var user = this._user

  function setMouse (mouseEvent) {
    var pos = _getLocalDomEventPosition(mouseEvent, domElement)
    user.mouse.x = pos.x
    user.mouse.y = pos.y
  }

  function setTouches (touchEvent) {
    user.touches.splice(0)
    for (var i = 0; i < touchEvent.touches.length; i++) {
      var touch = touchEvent.touches[i]
      var pos = _getLocalDomEventPosition(touch, domElement)
      user.touches.push(pos)
    }
  }

  function setMouches () {
    user.mouches.splice(0)
    // Only treat a mouse like a touch if it is down.
    if (user.mouse.down) {
      user.mouches.push(user.mouse)
    }
    user.mouches.push.apply(user.mouches, user.touches)
  }

  function clearKey () {
    for (var which in user.keys) user.keys[which] = 0
  }

  function clearMouse () {
    user.mouse.down = 0
    user.touches.splice(0)
    for (var i = 0; i < user.mouse.buttons.length; i++) {
      user.mouse.buttons[i] = 0
    }
  }

  function clearMouch () {
    user.mouches.splice(0)
  }

  function clearTouch () {
    user.touches.splice(0)
  }

  // MOUSE
  // -----

  domElement.addEventListener('mousedown', function _mousedownandler (mouseEvent) {
    ++user.mouse.down
    ++user.mouse.buttons[mouseEvent.button]
    setMouse(mouseEvent)
    setMouches()
  })

  domElement.addEventListener('mouseup', function _mouseupHandler (mouseEvent) {
    clearMouse()
    clearMouch()
    setMouches()
  })

  domElement.addEventListener('mousemove', function _mousemoveHandler (mouseEvent) {
    setMouse(mouseEvent)
    setMouches()
  })

  domElement.addEventListener('mouseenter', function _mouseenterHandler (mouseEvent) {
    clearMouse()
    clearMouch()
  })

  domElement.addEventListener('mouseleave', function _mouseenterHandler (mouseEvent) {
    clearMouse()
    clearMouch()
  })

  domElement.addEventListener('wheel', function _wheelHandler (mouseEvent) {
    setMouse(mouseEvent)
    setMouches()
  })

  var doc = domElement.ownerDocument
  var win = doc.defaultView || doc.parentWindow

  // KEYS
  // ----

  doc.addEventListener('keydown', function _keydownHandler (keyEvent) {
    if (user.keys[keyEvent.which] === undefined) user.keys[keyEvent.which] = 0
    ++user.keys[keyEvent.which]
  })

  doc.addEventListener('keyup', function _keyupHandler (keyEvent) {
    if (user.keys[keyEvent.which] === undefined) user.keys[keyEvent.which] = 0

    // Known Mac "feature" where keyup never fires while meta key (91) is down
    // When right-click menu is toggled we don't get all mouseup events
    if (keyEvent.which === 91 || keyEvent.which === 17) {
      clearKey()
    }

    user.keys[keyEvent.which] = 0
  })

  // WINDOW

  win.addEventListener('blur', function _blurHandlers (blurEvent) {
    clearKey()
    clearMouse()
    clearTouch()
    clearMouch()
  })

  win.addEventListener('focus', function _blurHandlers (blurEvent) {
    clearKey()
    clearMouse()
    clearTouch()
    clearMouch()
  })

  // TOUCHES
  // -------
  domElement.addEventListener('touchstart', function _touchstartHandler (touchEvent) {
    setTouches(touchEvent)
    setMouches()
  })

  domElement.addEventListener('touchend', function _touchsendHandler (touchEvent) {
    clearTouch()
    clearMouch()
  })

  domElement.addEventListener('touchmove', function _touchmoveHandler (touchEvent) {
    setTouches(touchEvent)
    setMouches()
  })

  domElement.addEventListener('touchenter', function _touchenterHandler (touchEvent) {
    clearTouch()
    clearMouch()
  })

  domElement.addEventListener('touchleave', function _touchleaveHandler (touchEvent) {
    clearTouch()
    clearMouch()
  })
}

function _copy (a) {
  var b = []
  for (var i = 0; i < a.length; i++) b[i] = a[i]
  return b
}

function _clone (a) {
  var b = {}
  for (var key in a) b[key] = a[key]
  return b
}

HaikuDOMRenderer.prototype.getUser = function getUser () {
  return {
    mouse: {
      x: this._user.mouse.x,
      y: this._user.mouse.y,
      down: this._user.mouse.down,
      buttons: _copy(this._user.mouse.buttons)
    },
    keys: _clone(this._user.keys),
    touches: _copy(this._user.touches),
    mouches: _copy(this._user.mouches)
  }
}

module.exports = HaikuDOMRenderer
