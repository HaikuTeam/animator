var raf = require('raf')

var NUMBER = 'number'

function Clock (tickables) {
  this.running = false
  this.control = null

  // These values change over time:
  this.loops = 0 // Number of loops (int)
  this.frame = 0 // Frame number (int)
  this.time = 0 // Calculated time value (ms)
  this.delta = 0 // Time elapsed since last step (ms)

  // These values configure the clock behavior:
  this.cycle = 16.6 // Time to elapse per frame (ms)
  this.speed = 16.6 // How fast to step (ms)
  this.margin = 1.0 // Margin of error

  // Avoid detachment when called by raf
  this.loop = this.loop.bind(this)
  this.tickables = tickables || []
  this.raf = null
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

Clock.prototype.getTime = function getTime () {
  if (this.isTimeControlled()) return this.control
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
