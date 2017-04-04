var Clock = require('./clock')
var Timeline = require('./timeline')
var assign = require('lodash.assign')

function Context (component, options) {
  var tickables = []

  this.options = assign({}, options)

  if (this.options.frame) {
    tickables.push({ performTick: this.options.frame })
  }

  this.clock = new Clock(tickables, this.options.clock)
  // Start the raf loop in the clock - need to do this even if we aren't autoplaying
  this.clock.loop()

  this.component = component
  this.component.context = this
  this.component.startTimeline(Timeline.DEFAULT_NAME)
}

Context.prototype.getChildren

module.exports = Context
