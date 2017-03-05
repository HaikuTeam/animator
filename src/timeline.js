var Constants = require('./constants')

var NUMBER = 'number'

function Timeline (time, descriptor) {
  this.control = null
  this.global = time || 0
  this.local = 0
  this.cache = {}
  this.active = true
  this.max = _getMaxTime(descriptor)
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

Timeline.prototype.isFinished = function () {
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
