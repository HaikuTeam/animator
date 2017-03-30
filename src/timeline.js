var Constants = require('./constants')

var NUMBER = 'number'

function Timeline (time, descriptor, name, options) {
  this.name = name
  this.control = null
  this.global = time || 0
  this.local = 0
  this.active = true
  this.max = _getMaxTime(descriptor)
  this.loop = !!(options && options.loop)
}

Timeline.DEFAULT_NAME = Constants.DEFAULT_TIMELINE_NAME

Timeline.prototype.performUpdate = function performUpdate (time) {
  var previous = this.global
  var delta = time - previous
  this.global = time

  if (this.isTimeControlled()) {
    this.local = this.control
  } else {
    // If we are a looping timeline, reset to zero once we've gone past our max
    if (this.loop && this.local > this.max) {
      this.local = 0 + this.max - this.local
    }
    this.local += delta
  }

  return this
}

Timeline.prototype.isTimeControlled = function isTimeControlled () {
  return typeof this.control === NUMBER
}

Timeline.prototype.isFinished = function () {
  if (this.loop) return false
  return ~~this.local > this.max
}

Timeline.prototype.controlTime = function (time) {
  this.control = parseInt(time || 0, 10)
  return this
}

Timeline.prototype.start = function start (time, descriptor) {
  this.local = 0
  this.active = true
  this.global = time || 0
  this.max = _getMaxTime(descriptor)
  return this
}

Timeline.prototype.stop = function stop (time, descriptor) {
  this.active = false
  this.max = _getMaxTime(descriptor)
  return this
}

Timeline.prototype.isActive = function isActive () {
  return !!this.active
}

function _getMaxTime (descriptor) {
  var max = 0
  for (var selector in descriptor) {
    var group = descriptor[selector]
    for (var output in group) {
      var keyframes = group[output]
      var keys = Object.keys(keyframes)
      for (var i = 0; i < keys.length; i++) {
        var key = parseInt(keys[i], 10)
        if (key > max) max = key
      }
    }
  }
  return max
}

module.exports = Timeline
