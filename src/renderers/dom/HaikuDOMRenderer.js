/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var getElementSize = require('./getElementSize')
var createRightClickMenu = require('./createRightClickMenu')
var createMixpanel = require('./createMixpanel')
var _render = require('./render')
var _patch = require('./patch')

var HaikuDOMRenderer = {}

function render (
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

function patch (
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

function menuize (domElement, playerInstance) {
  createRightClickMenu(domElement, playerInstance)
}

function mixpanel (domElement, mixpanelToken, playerInstance) {
  createMixpanel(domElement, mixpanelToken, playerInstance)
}

function createContainer (domElement) {
  return {
    isContainer: true,
    layout: {
      computed: {
        size: getElementSize(domElement)
      }
    }
  }
}

HaikuDOMRenderer.render = render
HaikuDOMRenderer.patch = patch
HaikuDOMRenderer.menuize = menuize
HaikuDOMRenderer.mixpanel = mixpanel
HaikuDOMRenderer.createContainer = createContainer

module.exports = HaikuDOMRenderer
