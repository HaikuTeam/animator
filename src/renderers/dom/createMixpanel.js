var assign = require('./../../utils/assign')

module.exports = function createMixpanel (domElement, mixpanelToken, playerInstance) {
  var mixpanel = require('mixpanel-browser')

  mixpanel.init(mixpanelToken)

  // Why not expose this so others, e.g. the share page, can hook into it?
  playerInstance.mixpanel = {
    // A little wrapper that makes sure the bytecode's metadata passes through with whatever else we passed
    track: function track (eventName, eventProperties) {
      var metadata = playerInstance._bytecode && playerInstance._bytecode.metadata || {}
      mixpanel.track(eventName, assign({
        platform: 'dom'
      }, metadata, eventProperties))
    }
  }

  playerInstance.on('haikuComponentDidInitialize', function () {
    playerInstance.mixpanel.track('component:initialize')
  })
}
