var Emitter = require('./../emitter')

function HaikuTimeline (_name, _player, _store) {
  if (!(this instanceof HaikuTimeline)) return new HaikuTimeline(_name, _player, _store)
  Emitter.create(this)
  this._name = _name
  this._player = _player
  this._store = _store

  this._store.on('update', function _update () {
    var frame = this.getFrame()
    var time = Math.round(this.getTime())
    if (this.isActive() && this.isPlaying()) this.emit('tick', frame, time)
    this.emit('update', frame, time)
  }.bind(this))
}

HaikuTimeline.prototype._ensureClockIsRunning = function _ensureClockIsRunning () {
  var clock = this._player.getClock()
  if (!clock.isRunning()) clock.start()
  return this
}

/**
 * @method getMaxTime
 * @description Return the maximum time that this timeline will reach, in ms.
 */
HaikuTimeline.prototype.getMaxTime = function getMaxTime () {
  return this._store.getMaxTime()
}

/**
 * @method getClockTime
 * @description Return the global clock time that this timeline is at, in ms,
 * whether or not our local time matches it or it has exceede dour max.
 8 This value is ultimately managed by the clock and passed in.
 */
HaikuTimeline.prototype.getClockTime = function getClockTime () {
  return this._store.getClockTime()
}

/**
 * @method getElapsedTime
 * @description Return the amount of time that has elapsed on this timeline since
 * it started updating, up to the most recent time update it received from the clock.
 * Note that for inactive timelines, this value will cease increasing as of the last update.
 */
HaikuTimeline.prototype.getElapsedTime = function getElapsedTime () {
  return this._store.getElapsedTime()
}

/**
 * @method getControlledTime
 * @description If time has been explicitly set here via time control, this value will
 * be the number of that setting.
 */
HaikuTimeline.prototype.getControlledTime = function getControlledTime () {
  return this._store.getControlledTime()
}

/**
 * @method getBoundedTime
 * @description Return the locally elapsed time, or the maximum time of this timeline,
 * whichever is smaller. Useful if you want to know what the "effective" time of this
 * timeline is, not necessarily how much has elapsed in an absolute sense. This is used
 * in the renderer to determine what value to calculate "now" deterministically.
 */
HaikuTimeline.prototype.getBoundedTime = function getBoundedTime () {
  return this._store.getBoundedTime()
}

/**
 * @method getTime
 * @description Convenience wrapper. Currently returns the bounded time. There's an argument
 * that this should return the elapsed time, though. #TODO
 */
HaikuTimeline.prototype.getTime = function getTime () {
  return this.getBoundedTime()
}

/**
 * @method getBoundedFrame
 * @description Return the current frame up to the maximum frame available for this timeline's duration.
 */
HaikuTimeline.prototype.getBoundedFrame = function getBoundedFrame () {
  var time = this.getBoundedTime()
  var timeStep = this._player.getClock().getFrameDuration()
  return Math.round(time / timeStep)
}

/**
 * @method getUnboundedFrame
 * @description Return the current frame, even if it is above the maximum frame.
 */
HaikuTimeline.prototype.getUnboundedFrame = function getUnboundedFrame () {
  var time = this.getElapsedTime() // The elapsed time can go larger than the max time; see timeline.js
  var timeStep = this._player.getClock().getFrameDuration()
  return Math.round(time / timeStep)
}

/**
 * @method getFrame
 * @description Return the bounded frame.
 * There's an argument that this should return the absolute frame. #TODO
 */
HaikuTimeline.prototype.getFrame = function getFrame () {
  return this.getBoundedFrame()
}

HaikuTimeline.prototype.duration = function duration () {
  return this.getMaxTime() || 0
}

HaikuTimeline.prototype.isActive = function isActive () {
  return this._store.isActive()
}

HaikuTimeline.prototype.isPlaying = function isPlaying () {
  return this._store.isPlaying()
}

HaikuTimeline.prototype.setRepeat = function setRepeat (bool) {
  this._store.loop = bool
  return this
}

HaikuTimeline.prototype.getRepeat = function getRepeat () {
  return !!this._store.loop
}

HaikuTimeline.prototype.pause = function pause () {
  var time = this._player.getClock().getTime()
  var descriptor = this._player._component.bytecode.bytecode.timelines[this._name]
  this._store.stop(time, descriptor)
  return this
}

HaikuTimeline.prototype.play = function play () {
  this._ensureClockIsRunning()
  var time = this._player.getClock().getTime()
  var descriptor = this._player._component.bytecode.bytecode.timelines[this._name]
  var local = this._store.local
  this._store.start(time, descriptor)
  if (this._store.control !== null) {
    this._store.local = this._store.control
    this._store.control = null
  } else {
    this._store.local = local
  }
  this._player._component._needsFullFlush = true
  return this
}

HaikuTimeline.prototype.seek = function seek (ms) {
  this._ensureClockIsRunning()
  this._store.controlTime(ms)
  var time = this._player.getClock().getTime()
  var descriptor = this._player._component.bytecode.bytecode.timelines[this._name]
  this._store.start(time, descriptor)
  this._player._component._needsFullFlush = true
  return this
}

HaikuTimeline.prototype.gotoAndPlay = function gotoAndPlay (ms) {
  this._ensureClockIsRunning()
  this.seek(ms)
  this.play()
  return this
}

HaikuTimeline.prototype.gotoAndStop = function gotoAndStop (ms) {
  this._ensureClockIsRunning()
  this.seek(ms)
  return this
}

// HaikuTimeline.prototype.seekMs = function seekMs () {
//   this._ensureClockIsRunning()
//   return this
// }

// HaikuTimeline.prototype.seekFrame = function seekFrame () {
//   this._ensureClockIsRunning()
//   return this
// }

// HaikuTimeline.prototype.seekPercent = function seekPercent () {
//   this._ensureClockIsRunning()
//   return this
// }

// HaikuTimeline.prototype.reverse = function reverse () {
//   this._ensureClockIsRunning()
//   return this
// }

// HaikuTimeline.prototype.gotoAndReverse = function gotoAndReverse () {
//   this._ensureClockIsRunning()
//   return this
// }

// HaikuTimeline.prototype.playUntil = function playUntil () {
//   this._ensureClockIsRunning()
//   return this
// }

// HaikuTimeline.prototype.reverseUntil = function reverseUntil () {
//   this._ensureClockIsRunning()
//   return this
// }

// HaikuTimeline.prototype.setPosts = function setPosts () {
// }

// HaikuTimeline.prototype.clearPosts = function clearPosts () {
// }

// HaikuTimeline.prototype.getPosts = function getPosts () {
// }

module.exports = HaikuTimeline
