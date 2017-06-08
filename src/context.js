var Clock = require('./clock')
var Timeline = require('./timeline')
var assign = require('./utils/assign')

function Context (component, options) {
  var tickables = []

  this.assignOptions(options)

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

Context.prototype.assignOptions = function assignOptions (options) {
  this.options = assign({}, options)

  // HACK: We run this before the clock is initialized sometimes so have to check
  if (this.clock) {
    this.clock.assignOptions(this.options.clock)
  }

  return this
}

module.exports = Context
