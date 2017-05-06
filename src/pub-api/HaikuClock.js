var Emitter = require('./../emitter')

function HaikuClock (_player) {
  if (!(this instanceof HaikuClock)) return new HaikuClock(_player)
  Emitter.create(this)
  this._player = _player
}

HaikuClock.prototype.getTime = function getTime () {
  return this._player._component.context.clock.getTime()
}

HaikuClock.prototype.setTime = function setTime (t) {
  this._player._component.context.clock.controlTime(t)
  return this
}

HaikuClock.prototype.isRunning = function isRunning () {
  return this._player._component.context.clock.running
}

HaikuClock.prototype.start = function start () {
  this._player._component.context.clock.start()
  return this
}

// HaikuClock.prototype.getFps = function getFps () {
// }

// HaikuClock.prototype.setFps = function setFps () {
// }

module.exports = HaikuClock
