var Clock = require('./clock')
var Timeline = require('./timeline')

function Context (component) {
  this.clock = new Clock([])

  this.component = component
  this.component.context = this
  this.component.startTimeline(Timeline.DEFAULT_NAME)
}

module.exports = Context
