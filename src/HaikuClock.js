/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var raf = require('./vendor/raf')
var assign = require('./vendor/assign')
var SimpleEventEmitter = require('./helpers/SimpleEventEmitter')

var NUMBER = 'number'

var DEFAULT_OPTIONS = {
  // frameDuration: Number
  // Time to elapse per frame (ms)
  frameDuration: 16.666,

  // frameDelay: Number
  // How long to wait between each tick (ms)
  frameDelay: 16.666,

  // marginOfErrorForDelta: Number
  // A bit of grace when calculating whether a new frame should be run
  marginOfErrorForDelta: 1.0
}

function HaikuClock (tickables, component, options) {
  if (!(this instanceof HaikuClock)) return new HaikuClock(component)

  SimpleEventEmitter.create(this)

  this._tickables = tickables
  this._component = component

  this.assignOptions(options)

  this._isRunning = false
  this._reinitialize()

  this._raf = null // We'll create our raf function on our first run of our loop
  this.run = this.run.bind(this) // Bind to avoid `this`-detachment when called by raf
}

HaikuClock.prototype._reinitialize = function _reinitialize () {
  this._numLoopsRun = 0
  this._localFramesElapsed = 0
  this._localTimeElapsed = 0
  this._deltaSinceLastTick = 0
  this._localExplicitlySetTime = null
  return this
}

HaikuClock.prototype.addTickable = function addTickable (tickable) {
  this._tickables.push(tickable)
  return this
}

HaikuClock.prototype.assignOptions = function assignOptions (options) {
  this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {})
  return this
}

HaikuClock.prototype.run = function run () {
  if (this.isRunning()) {
    // If time is "controlled" we are locked to an explicitly set local time, so no math i sneeded
    if (this._isTimeControlled()) {
      this.tick()
    } else {
      // If we got here, we need to evaluate the time elapsed, and determine if we've waited long enough for a frame
      this._numLoopsRun++

      var prevTime = this._localTimeElapsed
      var nextTime = prevTime + this.options.frameDuration
      var deltaSinceLastTick = nextTime - prevTime + this._deltaSinceLastTick

      if (
        deltaSinceLastTick >=
        this.options.frameDelay - this.options.marginOfErrorForDelta
      ) {
        this.tick()

        this._localFramesElapsed++
        this._localTimeElapsed = nextTime
        this._deltaSinceLastTick = 0 // Must reset delta when frame has been completed
      } else {
        // If we got here, this loop is faster than the desired speed; wait till next call
        this._deltaSinceLastTick = deltaSinceLastTick
      }
    }
  }

  // Queue up the next animation frame loop
  this._raf = raf(this.run)
  return this
}

HaikuClock.prototype._cancelRaf = function _cancelRaf () {
  if (this._raf) raf.cancel(this._raf)
  return this
}

HaikuClock.prototype.tick = function tick () {
  for (var i = 0; i < this._tickables.length; i++) {
    this._tickables[i].performTick()
  }
  return this
}

HaikuClock.prototype.getTime = function getTime () {
  return this.getExplicitTime()
}

HaikuClock.prototype.setTime = function setTime (time) {
  this._localExplicitlySetTime = parseInt(time || 0, 10)
  return this
}

/**
 * @method getExplicitTime
 * @description Return either the running time or the controlled time, depending on whether this
 * clock is in control mode or not.
 */
HaikuClock.prototype.getExplicitTime = function getExplicitTime () {
  if (this._isTimeControlled()) return this.getControlledTime()
  return this.getRunningTime()
}

/**
 * @method getControlledTime
 * @description Return the value of time that has been explicitly controlled.
 */
HaikuClock.prototype.getControlledTime = function getControlledTime () {
  return this._localExplicitlySetTime
}

HaikuClock.prototype._isTimeControlled = function _isTimeControlled () {
  return typeof this._localExplicitlySetTime === NUMBER
}

/**
 * @method getRunningTime
 * @description Return the running time, which is the value of time that has elapsed whether or
 * not time has been 'controlled' in control mode.
 */
HaikuClock.prototype.getRunningTime = function getRunningTime () {
  return this._localTimeElapsed
}

HaikuClock.prototype.isRunning = function isRunning () {
  return this._isRunning
}

HaikuClock.prototype.start = function start () {
  this._isRunning = true
  return this
}

HaikuClock.prototype.stop = function stop () {
  this._isRunning = false
  return this
}

HaikuClock.prototype.getFrameDuration = function getFrameDuration () {
  return this.options.frameDuration
}

/**
 * TODO:
 * Implement the below:
 */

// HaikuClock.prototype.getFps = function getFps () {
// }

// HaikuClock.prototype.setFps = function setFps () {
// }

module.exports = HaikuClock
