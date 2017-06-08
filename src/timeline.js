var Constants = require('./constants')
var _getMaxTimeFromDescriptor = require('haiku-bytecode/src/getTimelineMaxTime')
var Emitter = require('./emitter')

var NUMBER = 'number'

function Timeline (time, descriptor, name, options) {
  Emitter.create(this)

  this.assignOptions(options)

  this.name = name
  this.control = null
  this.global = time || 0
  this.local = 0
  this.active = true
  this._isPlaying = true
  this.max = _getMaxTimeFromDescriptor(descriptor)
}

Timeline.DEFAULT_NAME = Constants.DEFAULT_TIMELINE_NAME

Timeline.prototype.assignOptions = function assignOptions (options) {
  this.loop = !!(options && options.loop)
}

/**
 * @method getMaxTime
 * @description Return the maximum time that this timeline will reach, in ms.
 */
Timeline.prototype.getMaxTime = function getMaxTime () {
  return this.max
}

/**
 * @method getClockTime
 * @description Return the global clock time that this timeline is at, in ms,
 * whether or not our local time matches it or it has exceede dour max.
 8 This value is ultimately managed by the clock and passed in.
 */
Timeline.prototype.getClockTime = function getClockTime () {
  return this.global
}

/**
 * @method getElapsedTime
 * @description Return the amount of time that has elapsed on this timeline since
 * it started updating, up to the most recent time update it received from the clock.
 * Note that for inactive timelines, this value will cease increasing as of the last update.
 */
Timeline.prototype.getElapsedTime = function getElapsedTime () {
  return this.local
}

/**
 * @method getControlledTime
 * @description If time has been explicitly set here via time control, this value will
 * be the number of that setting.
 */
Timeline.prototype.getControlledTime = function getControlledTime () {
  return this.control
}

/**
 * @method getBoundedTime
 * @description Return the locally elapsed time, or the maximum time of this timeline,
 * whichever is smaller. Useful if you want to know what the "effective" time of this
 * timeline is, not necessarily how much has elapsed in an absolute sense. This is used
 * in the renderer to determine what value to calculate "now" deterministically.
 */
Timeline.prototype.getBoundedTime = function getBoundedTime () {
  var max = this.getMaxTime()
  var local = this.getElapsedTime()
  if (local > max) return max
  return local
}

Timeline.prototype._updateInternalProperties = function _updateInternalProperties (time) {
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

  if (this.isFinished()) {
    this._isPlaying = false
  }
}

Timeline.prototype.performUpdate = function performUpdate (time) {
  this._updateInternalProperties(time)
  this.emit('update')
  return this
}

Timeline.prototype.resetMax = function resetMax (descriptor) {
  this.max = _getMaxTimeFromDescriptor(descriptor)
  return this
}

Timeline.prototype.isFinished = function () {
  if (this.loop) return false
  return ~~this.getElapsedTime() > this.getMaxTime()
}

Timeline.prototype.isTimeControlled = function isTimeControlled () {
  return typeof this.getControlledTime() === NUMBER
}

Timeline.prototype.controlTime = function (time) {
  this.control = parseInt(time || 0, 10)
  // Need to update the properties so that accessors like .getFrame() work.
  this._updateInternalProperties(time)
  return this
}

Timeline.prototype.start = function start (time, descriptor) {
  this.local = 0
  this.active = true
  this._isPlaying = true
  this.global = time || 0
  this.max = _getMaxTimeFromDescriptor(descriptor)
  return this
}

Timeline.prototype.stop = function stop (time, descriptor) {
  this.active = false
  this._isPlaying = false
  this.max = _getMaxTimeFromDescriptor(descriptor)
  return this
}

Timeline.prototype.isPlaying = function isPlaying () {
  return !!this._isPlaying
}

Timeline.prototype.isActive = function isActive () {
  return !!this.active
}

module.exports = Timeline
