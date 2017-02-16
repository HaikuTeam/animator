var Emitter = require('./emitter')

function Instance (component) {
  Emitter.create(this)

  this.timelines = {
    play: function _play () {
      if (arguments.length < 1) {
        component.startAllTimelines()
      } else {
        for (var i = 0; i < arguments.length; i++) {
          var timelineName = arguments[i]
          component.startTimeline(timelineName)
        }
      }
    },

    pause: function _pause () {
      if (arguments.length < 1) {
        component.stopAllTimelines()
      } else {
        for (var i = 0; i < arguments.length; i++) {
          var timelineName = arguments[i]
          component.stopTimeline(timelineName)
        }
      }
    }
  }
}

module.exports = Instance
