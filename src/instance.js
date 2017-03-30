var Emitter = require('./emitter')

function Instance (component) {
  Emitter.create(this)

  var self = this

  this.component = component

  this.play = function _play () {
    this.timelines.play('Default')
  }

  this.clock = {
    start: function _start () {
      component.context.clock.start()
    },

    stop: function _stop () {
      component.context.clock.stop()
    }
  }

  this.timelines = {
    play: function _tlplay () {
      // Assume that if we are playing a timeline, we also need the clock to be running
      if (!component.context.clock.running) {
        component.context.clock.start()
      }
      if (arguments.length < 1) {
        component.startAllTimelines()
      } else {
        for (var i = 0; i < arguments.length; i++) {
          var timelineName = arguments[i]
          component.startTimeline(timelineName)
        }
      }
    },

    pause: function _tlpause () {
      if (arguments.length < 1) {
        component.stopAllTimelines()
      } else {
        for (var i = 0; i < arguments.length; i++) {
          var timelineName = arguments[i]
          component.stopTimeline(timelineName)
        }
      }
    },

    control: function _tlcontrol (name, time) {
      var timelines = component.store.get('timelines')
      if (!timelines[name]) return console.warn('Warning: No such timeline ' + name)
      // Assume that if we are controlling time, we also need the clock to be running
      if (!component.context.clock.running) {
        component.context.clock.start()
      }
      timelines[name].controlTime(time)
    }
  }

  this.events = {
    listen: function _listen (selector, event, handler) {
      component.template._controllerEventHandlers.push({
        selector: selector,
        event: event,
        handler: handler
      })
      self.emit('flushEventListeners')
    }
  }
}

module.exports = Instance
