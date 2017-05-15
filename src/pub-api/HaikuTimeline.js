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

HaikuTimeline.prototype.getTime = function getTime () {
  return this._store.getDomainTime()
}

HaikuTimeline.prototype.getFrame = function getFrame () {
  var time = this.getTime()
  var clock = this._player.getClock()
  var timeStep = clock.cycle || 16.666 // weird name, sorry
  return Math.round(time / timeStep)
}

HaikuTimeline.prototype.duration = function duration () {
  return this._store.max || 0
}

HaikuTimeline.prototype.isActive = function isActive () {
  return !!this._store.active
}

HaikuTimeline.prototype.isPlaying = function isPlaying () {
  return !!this._store.isPlaying
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
