/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import getMaxTimeFromDescriptor from "./helpers/getTimelineMaxTime"
import SimpleEventEmitter from "./helpers/SimpleEventEmitter"
import assign from "./vendor/assign"

const NUMBER = "number"

const DEFAULT_OPTIONS = {
  // loop: Boolean
  // Determines whether this timeline should loop (start at its beginning when finished)
  loop: true,
}

export default function HaikuTimeline(component, name, descriptor, options) {
  SimpleEventEmitter.create(this)

  this._component = component
  this._name = name
  this._descriptor = descriptor

  this.assignOptions(options || {})

  this._globalClockTime = 0
  this._localElapsedTime = 0
  this._localExplicitlySetTime = null // Only set this to a number if time is 'controlled'
  this._maxExplicitlyDefinedTime = getMaxTimeFromDescriptor(descriptor)

  this._isActive = false
  this._isPlaying = false
}

HaikuTimeline.prototype.assignOptions = function assignOptions(options) {
  this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {})
  return this
}

HaikuTimeline.prototype._ensureClockIsRunning = function _ensureClockIsRunning() {
  let clock = this._component.getClock()
  if (!clock.isRunning()) clock.start()
  return this
}

HaikuTimeline.prototype._updateInternalProperties = function _updateInternalProperties(
  updatedGlobalClockTime,
) {
  let previousGlobalClockTime = this._globalClockTime
  let deltaGlobalClockTime = updatedGlobalClockTime - previousGlobalClockTime

  this._globalClockTime = updatedGlobalClockTime

  if (this._isTimeControlled()) {
    this._localElapsedTime = this._localExplicitlySetTime
  } else {
    // If we are a looping timeline, reset to zero once we've gone past our max
    if (
      this.options.loop &&
      this._localElapsedTime > this._maxExplicitlyDefinedTime
    ) {
      this._localElapsedTime =
        0 + this._maxExplicitlyDefinedTime - this._localElapsedTime
    }
    this._localElapsedTime += deltaGlobalClockTime
  }

  if (this.isFinished()) {
    this._isPlaying = false
  }
}

HaikuTimeline.prototype._doUpdateWithGlobalClockTime = function _doUpdateWithGlobalClockTime(
  globalClockTime,
) {
  if (this.isFrozen()) {
    this._updateInternalProperties(this._globalClockTime)
  } else {
    this._updateInternalProperties(globalClockTime)
  }

  if (this.isActive() && this.isPlaying()) {
    this._shout("tick")
  }

  this._shout("update")

  return this
}

HaikuTimeline.prototype._resetMaxDefinedTimeFromDescriptor = function _resetMaxDefinedTimeFromDescriptor(
  descriptor,
) {
  this._maxExplicitlyDefinedTime = getMaxTimeFromDescriptor(descriptor)
  return this
}

HaikuTimeline.prototype._isTimeControlled = function _isTimeControlled() {
  return typeof this.getControlledTime() === NUMBER
}

HaikuTimeline.prototype._controlTime = function _controlTime(
  controlledTimeToSet,
  updatedGlobalClockTime,
) {
  this._localExplicitlySetTime = parseInt(controlledTimeToSet || 0, 10)
  // Need to update the properties so that accessors like .getFrame() work after this update.
  this._updateInternalProperties(updatedGlobalClockTime)
  return this
}

/**
 * @method getName
 * @description Return the name of this timeline
 */
HaikuTimeline.prototype.getName = function getName() {
  return this._name
}

/**
 * @method getMaxTime
 * @description Return the maximum time that this timeline will reach, in ms.
 */
HaikuTimeline.prototype.getMaxTime = function getMaxTime() {
  return this._maxExplicitlyDefinedTime
}

/**
 * @method getClockTime
 * @description Return the global clock time that this timeline is at, in ms,
 * whether or not our local time matches it or it has exceeded our max.
 * This value is ultimately managed by the clock and passed in.
 */
HaikuTimeline.prototype.getClockTime = function getClockTime() {
  return this._globalClockTime
}

/**
 * @method getElapsedTime
 * @description Return the amount of time that has elapsed on this timeline since
 * it started updating, up to the most recent time update it received from the clock.
 * Note that for inactive timelines, this value will cease increasing as of the last update.
 */
HaikuTimeline.prototype.getElapsedTime = function getElapsedTime() {
  return this._localElapsedTime
}

/**
 * @method getControlledTime
 * @description If time has been explicitly set here via time control, this value will
 * be the number of that setting.
 */
HaikuTimeline.prototype.getControlledTime = function getControlledTime() {
  return this._localExplicitlySetTime
}

/**
 * @method getBoundedTime
 * @description Return the locally elapsed time, or the maximum time of this timeline,
 * whichever is smaller. Useful if you want to know what the "effective" time of this
 * timeline is, not necessarily how much has elapsed in an absolute sense. This is used
 * in the renderer to determine what value to calculate "now" deterministically.
 */
HaikuTimeline.prototype.getBoundedTime = function getBoundedTime() {
  let max = this.getMaxTime()
  let elapsed = this.getElapsedTime()
  if (elapsed > max) return max
  return elapsed
}

/**
 * @method getTime
 * @description Convenience wrapper. Currently returns the bounded time. There's an argument
 * that this should return the elapsed time, though. #TODO
 */
HaikuTimeline.prototype.getTime = function getTime() {
  return this.getBoundedTime()
}

/**
 * @method getBoundedFrame
 * @description Return the current frame up to the maximum frame available for this timeline's duration.
 */
HaikuTimeline.prototype.getBoundedFrame = function getBoundedFrame() {
  let time = this.getBoundedTime()
  let timeStep = this._component.getClock().getFrameDuration()
  return Math.round(time / timeStep)
}

/**
 * @method getUnboundedFrame
 * @description Return the current frame, even if it is above the maximum frame.
 */
HaikuTimeline.prototype.getUnboundedFrame = function getUnboundedFrame() {
  let time = this.getElapsedTime() // The elapsed time can go larger than the max time; see timeline.js
  let timeStep = this._component.getClock().getFrameDuration()
  return Math.round(time / timeStep)
}

/**
 * @method getFrame
 * @description Return the bounded frame.
 * There's an argument that this should return the absolute frame. #TODO
 */
HaikuTimeline.prototype.getFrame = function getFrame() {
  return this.getBoundedFrame()
}

/**
 * @method isPlaying
 * @description Returns T/F if the timeline is playing
 */
HaikuTimeline.prototype.isPlaying = function isPlaying() {
  return !!this._isPlaying
}

/**
 * @method isActive
 * @description Returns T/F if the timeline is active
 */
HaikuTimeline.prototype.isActive = function isActive() {
  return !!this._isActive
}

/**
 * @method isFrozen
 * @description Returns T/F if the timeline is frozen
 */
HaikuTimeline.prototype.isFrozen = function isFrozen() {
  return !!this.options.freeze
}

/**
 * @method isFinished
 * @description Returns T/F if the timeline is finished.
 * If this timeline is set to loop, it is never "finished".
 */
HaikuTimeline.prototype.isFinished = function() {
  if (this.options.loop) return false
  return ~~this.getElapsedTime() > this.getMaxTime()
}

HaikuTimeline.prototype.duration = function duration() {
  return this.getMaxTime() || 0
}

HaikuTimeline.prototype.getDuration = function getDuration() {
  return this.duration()
}

HaikuTimeline.prototype.setRepeat = function setRepeat(bool) {
  this.options.loop = bool
  return this
}

HaikuTimeline.prototype.getRepeat = function getRepeat() {
  return !!this.options.loop
}

HaikuTimeline.prototype.freeze = function freeze() {
  this.options.freeze = true
  return this
}

HaikuTimeline.prototype.unfreeze = function freeze() {
  this.options.freeze = false
  return this
}

HaikuTimeline.prototype._shout = function _shout(key) {
  let frame = this.getFrame()
  let time = Math.round(this.getTime())
  let name = this.getName()
  this.emit(key, frame, time)
  this._component.emit("timeline:" + key, name, frame, time)
  return this
}

HaikuTimeline.prototype.start = function start(
  maybeGlobalClockTime,
  descriptor,
) {
  this._localElapsedTime = 0
  this._isActive = true
  this._isPlaying = true
  this._globalClockTime = maybeGlobalClockTime || 0
  this._maxExplicitlyDefinedTime = getMaxTimeFromDescriptor(descriptor)

  this._shout("start")

  return this
}

HaikuTimeline.prototype.stop = function stop(maybeGlobalClockTime, descriptor) {
  this._isActive = false
  this._isPlaying = false
  this._maxExplicitlyDefinedTime = getMaxTimeFromDescriptor(descriptor)

  this._shout("stop")

  return this
}

HaikuTimeline.prototype.pause = function pause() {
  let time = this._component.getClock().getTime()
  let descriptor = this._component._getTimelineDescriptor(this._name)
  this.stop(time, descriptor)

  this._shout("pause")

  return this
}

HaikuTimeline.prototype.play = function play(options) {
  if (!options) options = {}

  this._ensureClockIsRunning()

  let time = this._component.getClock().getTime()
  let descriptor = this._component._getTimelineDescriptor(this._name)
  let local = this._localElapsedTime

  this.start(time, descriptor)

  if (this._localExplicitlySetTime !== null) {
    this._localElapsedTime = this._localExplicitlySetTime
    this._localExplicitlySetTime = null
  } else {
    this._localElapsedTime = local
  }

  if (!options.skipMarkForFullFlush) {
    this._component._markForFullFlush(true)
  }

  this._shout("play")

  return this
}

HaikuTimeline.prototype.seek = function seek(ms) {
  this._ensureClockIsRunning()
  let clockTime = this._component.getClock().getTime()
  this._controlTime(ms, clockTime)
  let descriptor = this._component._getTimelineDescriptor(this._name)
  this.start(clockTime, descriptor)
  this._component._markForFullFlush(true)

  this._shout("seek")

  return this
}

HaikuTimeline.prototype.gotoAndPlay = function gotoAndPlay(ms) {
  this._ensureClockIsRunning()
  this.seek(ms)
  this.play()
  return this
}

HaikuTimeline.prototype.gotoAndStop = function gotoAndStop(ms) {
  this._ensureClockIsRunning()
  this.seek(ms)
  return this
}

/**
 * TODO:
 * Implement the methods below.
 */

// HaikuTimeline.prototype.seekMs = function seekMs () {
// }

// HaikuTimeline.prototype.seekFrame = function seekFrame () {
// }

// HaikuTimeline.prototype.seekPercent = function seekPercent () {
// }

// HaikuTimeline.prototype.reverse = function reverse () {
// }

// HaikuTimeline.prototype.gotoAndReverse = function gotoAndReverse () {
// }

// HaikuTimeline.prototype.playUntil = function playUntil () {
// }

// HaikuTimeline.prototype.reverseUntil = function reverseUntil () {
// }

// HaikuTimeline.prototype.setPosts = function setPosts () {
// }

// HaikuTimeline.prototype.clearPosts = function clearPosts () {
// }

// HaikuTimeline.prototype.getPosts = function getPosts () {
// }
