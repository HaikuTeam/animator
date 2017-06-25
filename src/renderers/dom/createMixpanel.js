/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var assign = require('./../../helpers/assign')

module.exports = function createMixpanel (domElement, mixpanelToken, component) {
  var mixpanel = require('mixpanel-browser')

  mixpanel.init(mixpanelToken)

  // Why not expose this so others, e.g. the share page, can hook into it?
  component.mixpanel = {
    // A little wrapper that makes sure the bytecode's metadata passes through with whatever else we passed
    track: function track (eventName, eventProperties) {
      var metadata = component._bytecode && component._bytecode.metadata || {}
      mixpanel.track(eventName, assign({
        platform: 'dom'
      }, metadata, eventProperties))
    }
  }

  component.on('haikuComponentDidInitialize', function () {
    component.mixpanel.track('component:initialize')
  })
}
