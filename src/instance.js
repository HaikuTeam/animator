var Emitter = require('./emitter')

function Instance (context) {
  Emitter.create(this)

  this.timelines = {
    play: function _play () {
      if (arguments.length < 1) {
        context.startAllTimelines()
      } else {
        for (var i = 0; i < arguments.length; i++) {
          var timelineName = arguments[i]
          context.startTimeline(timelineName)
        }
      }
    },

    pause: function _pause () {
      if (arguments.length < 1) {
        context.stopAllTimelines()
      } else {
        for (var i = 0; i < arguments.length; i++) {
          var timelineName = arguments[i]
          context.stopTimeline(timelineName)
        }
      }
    }
  }
}

module.exports = Instance
