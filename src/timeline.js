var Constants = require('./constants')

var NUMBER = 'number'

function Timeline (time) {
  this.control = null
  this.global = time || 0
  this.local = 0
  this.cache = {}
  this.active = true
}

Timeline.DEFAULT_NAME = Constants.DEFAULT_TIMELINE_NAME

Timeline.prototype.performUpdate = function performUpdate (time) {
  var previous = this.global
  var delta = time - previous
  this.global = time

  if (this.isTimeControlled()) {
    this.local = this.control
  } else {
    this.local += delta
  }

  return this
}

Timeline.prototype.isTimeControlled = function isTimeControlled () {
  return typeof this.control === NUMBER
}

Timeline.prototype.controlTime = function (time) {
  this.control = parseInt(time || 0, 10)
  return this
}

Timeline.prototype.start = function start () {
  this.active = true
  return this
}

Timeline.prototype.stop = function stop () {
  this.active = false
  return this
}

Timeline.prototype.isActive = function isActive () {
  return !!this.active
}

module.exports = Timeline
