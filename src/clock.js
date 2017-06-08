var raf = require('raf')
var assign = require('./utils/assign')

var NUMBER = 'number'
var DEFAULTS = {
  cycle: 16.666,
  speed: 16.666,
  margin: 1.0
}

function Clock (tickables, options) {
  this.assignOptions(options)

  this.running = false
  this.control = null

  // These values change over time:
  this.loops = 0 // Number of loops (int)
  this.frame = 0 // Frame number (int)
  this.time = 0 // Calculated time value (ms)
  this.delta = 0 // Time elapsed since last step (ms)

  // Avoid detachment when called by raf
  this.loop = this.loop.bind(this)
  this.tickables = tickables || []
  this.raf = null
}

Clock.prototype.assignOptions = function assignOptions (options) {
  this.options = assign({}, DEFAULTS, options)
  // These values configure the clock behavior:
  this.cycle = this.options.cycle // Time to elapse per frame (ms)
  this.speed = this.options.speed // How fast to step (ms)
  this.margin = this.options.margin // Margin of error
}

Clock.prototype.isTimeControlled = function isTimeControlled () {
  return typeof this.control === NUMBER
}

Clock.prototype.tick = function tick (tickables) {
  for (var i = 0; i < tickables.length; i++) {
    var tickable = tickables[i]
    tickable.performTick()
  }
}

Clock.prototype.loop = function _loop () {
  if (this.running) {
    if (this.isTimeControlled()) {
      this.tick(this.tickables)
    } else {
      this.loops++
      var prevTime = this.time
      var timeStep = this.cycle
      var nextTime = prevTime + timeStep
      var deltaSinceLastStep = (nextTime - prevTime) + this.delta
      if (deltaSinceLastStep >= this.speed - this.margin) {
        this.tick(this.tickables)
        this.frame++
        this.time = nextTime
        this.delta = 0 // Must reset delta when frame completed
      } else {
        // This loop is faster than the desired speed. Wait till next one
        this.delta = deltaSinceLastStep
      }
    }
  }
  this.raf = raf(this.loop)
}

Clock.prototype.cancelRaf = function cancelRaf () {
  if (this.raf) raf.cancel(this.raf)
  return this
}

/**
 * @method getExplicitTime
 * @description Return either the running time or the controlled time, depending on whether this
 * clock is in control mode or not.
 */
Clock.prototype.getExplicitTime = function getExplicitTime () {
  if (this.isTimeControlled()) {
    return this.getControlledTime()
  }
  return this.getRunningTime()
}

/**
 * @method getControlledTime
 * @description Return the value of time that has been explicitly controlled.
 */
Clock.prototype.getControlledTime = function getControlledTime () {
  return this.control
}

/**
 * @method getRunningTime
 * @description Return the running time, which is the value of time that has elapsed whether or
 * not time has been 'controlled' in control mode.
 */
Clock.prototype.getRunningTime = function getRunningTime () {
  return this.time
}

Clock.prototype.start = function start () {
  this.running = true
  return this
}

Clock.prototype.stop = function stop () {
  this.running = false
  return this
}

Clock.prototype.controlTime = function controlTime (time) {
  this.control = parseInt(time || 0, 10)
  return this
}

module.exports = Clock
