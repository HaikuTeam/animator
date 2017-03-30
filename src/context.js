var Clock = require('./clock')
var Timeline = require('./timeline')

function Context (component, options) {
  var tickables = []
  if (options && options.frame) {
    tickables.push({ performTick: options.frame })
  }
  this.clock = new Clock(tickables, options && options.clock)
  // Start the raf loop in the clock - need to do this even if we aren't autoplaying
  this.clock.loop()

  this.component = component
  this.component.context = this
  this.component.startTimeline(Timeline.DEFAULT_NAME)
}

module.exports = Context
