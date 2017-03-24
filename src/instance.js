var Emitter = require('./emitter')

function Instance (component) {
  Emitter.create(this)

  this.component = component

  this.start = function _start () {
    component.context.clock.loop()
    component.context.clock.start()
  }

  this.stop = function _stop () {
    component.context.clock.stop()
  }

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
    },

    control: function _lock (name, time) {
      var timelines = component.store.get('timelines')
      if (!timelines[name]) return console.warn('Warning: No such timeline ' + name)
      timelines[name].controlTime(time)
    }
  }

  this.events = {
    listen: function _listen (selector, event, handler) {
      component.template._handles.push({
        selector: selector,
        event: event,
        handler: handler
      })
    }
  }
}

module.exports = Instance
