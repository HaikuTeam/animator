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
    mouse: { x: 0, y: 0, isDown: false },
    keys: [], // { which: 'number' }
    touches: [], // [{ x: 'number', y: 'number' }]
    mouches: [] // [{ x: 'number', y: 'number' }] - Both touches and mouse cursor info
  }
}

HaikuDOMRenderer.prototype.render = function render (
  domElement,
  virtualContainer,
  virtualTree,
  locator,
  hash,
  options,
  scopes
) {
  return _render(
    domElement,
    virtualContainer,
    virtualTree,
    locator,
    hash,
    options,
    scopes
  )
}

HaikuDOMRenderer.prototype.patch = function patch (
  domElement,
  virtualContainer,
  patchesDict,
  locator,
  hash,
  options,
  scopes
) {
  return _patch(
    domElement,
    virtualContainer,
    patchesDict,
    locator,
    hash,
    options,
    scopes
  )
}

HaikuDOMRenderer.prototype.menuize = function menuize (domElement, playerInstance) {
  return createRightClickMenu(domElement, playerInstance)
}

HaikuDOMRenderer.prototype.mixpanel = function mixpanel (domElement, mixpanelToken, playerInstance) {
  return createMixpanel(domElement, mixpanelToken, playerInstance)
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
  var user = this.getUser()

  var keysDown = {}

  function setKeys () {
    user.keys.splice(0)
    for (var code in keysDown) {
      // keysDown[code] is a KeyEvent if one is present for that key
      if (keysDown[code]) {
        user.keys.push(keysDown[code])
      }
    }
  }

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
    if (user.mouse.isDown) {
      user.mouches.push(user.mouse)
    }
    user.mouches.push.apply(user.mouches, user.touches)
  }

  // MOUSE
  // -----

  domElement.addEventListener('mouseenter', function _mouseenterHandler (mouseEvent) {
    setMouse(mouseEvent)
    setMouches()
  })

  domElement.addEventListener('mouseleave', function _mouseleaveHandler (mouseEvent) {
    setMouse(mouseEvent)
    setMouches()
  })

  domElement.addEventListener('mousedown', function _mousedownandler (mouseEvent) {
    user.mouse.isDown = true
    setMouse(mouseEvent)
    setMouches()
  })

  domElement.addEventListener('mouseup', function _mouseupHandler (mouseEvent) {
    user.mouse.isDown = false
    setMouse(mouseEvent)
    setMouches()
  })

  domElement.addEventListener('mousemove', function _mousemoveHandler (mouseEvent) {
    setMouse(mouseEvent)
    setMouches()
  })

  // KEYS
  // ----

  domElement.addEventListener('keydown', function _keydownHandler (keyEvent) {
    keysDown[keyEvent.which] = keyEvent
    setKeys()
  })

  domElement.addEventListener('keyup', function _keyupHandler (keyEvent) {
    keysDown[keyEvent.which] = false
    setKeys()
  })

  // TOUCHES
  // -------
  domElement.addEventListener('touchstart', function _touchstartHandler (touchEvent) {
    setTouches(touchEvent)
    setMouches()
  })

  domElement.addEventListener('touchend', function _touchsendHandler (touchEvent) {
    setTouches({ touches: [] }) // No more touches once it ends; using a fake TouchEvent interface
    setMouches()
  })

  domElement.addEventListener('touchmove', function _touchmoveHandler (touchEvent) {
    setTouches(touchEvent)
    setMouches()
  })
}

HaikuDOMRenderer.prototype.getUser = function getUser () {
  return this._user
}

module.exports = HaikuDOMRenderer
