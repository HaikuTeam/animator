/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import raf from "./vendor/raf"
import assign from "./vendor/assign"
import SimpleEventEmitter from "./helpers/SimpleEventEmitter"
import HaikuGlobal from "./HaikuGlobal"

const NUMBER = "number"

const DEFAULT_OPTIONS = {
  // frameDuration: Number
  // Time to elapse per frame (ms)
  frameDuration: 16.666,

  // frameDelay: Number
  // How long to wait between each tick (ms)
  frameDelay: 16.666,

  // marginOfErrorForDelta: Number
  // A bit of grace when calculating whether a new frame should be run
  marginOfErrorForDelta: 1.0,
}

// The global animation harness is a *singleton* so we don't want to create new ones even if this is reloaded
if (!HaikuGlobal.HaikuGlobalAnimationHarness) {
  HaikuGlobal.HaikuGlobalAnimationHarness = {}
  HaikuGlobal.HaikuGlobalAnimationHarness.queue = [] // Just an array of functions to call on every rAF tick
  // The main frame function, loops through all those who need an animation tick and calls them
  HaikuGlobal.HaikuGlobalAnimationHarness.frame = function HaikuGlobalAnimationHarnessFrame() {
    let queue = HaikuGlobal.HaikuGlobalAnimationHarness.queue
    let length = queue.length
    for (let i = 0; i < length; i++) {
      queue[i]()
    }
    HaikuGlobal.HaikuGlobalAnimationHarness.raf = raf.request(HaikuGlobal.HaikuGlobalAnimationHarness.frame)
  }
  // Need a mechanism to cancel the rAF loop otherwise some contexts (e.g. tests) will have leaked handles
  HaikuGlobal.HaikuGlobalAnimationHarness.cancel = function HaikuGlobalAnimationHarnessCancel() {
    if (HaikuGlobal.HaikuGlobalAnimationHarness.raf) {
      raf.cancel(HaikuGlobal.HaikuGlobalAnimationHarness.raf)
    }
  }
  // Trigger the loop to start; we'll push frame functions into its queue later
  HaikuGlobal.HaikuGlobalAnimationHarness.frame()
}

export default function HaikuClock(tickables, component, options) {
  SimpleEventEmitter.create(this)

  this._tickables = tickables
  this._component = component

  this.assignOptions(options)

  this._isRunning = false
  this._reinitialize()

   // Bind to avoid `this`-detachment when called by raf
  HaikuGlobal.HaikuGlobalAnimationHarness.queue.push(this.run.bind(this))

  // Tests and others may need this to cancel the rAF loop, to avoid leaked handles
  this.GLOBAL_ANIMATION_HARNESS = HaikuGlobal.HaikuGlobalAnimationHarness
}

HaikuClock.prototype._reinitialize = function _reinitialize() {
  this._numLoopsRun = 0
  this._localFramesElapsed = 0
  this._localTimeElapsed = 0
  this._deltaSinceLastTick = 0
  this._localExplicitlySetTime = null
  return this
}

HaikuClock.prototype.addTickable = function addTickable(tickable) {
  this._tickables.push(tickable)
  return this
}

HaikuClock.prototype.assignOptions = function assignOptions(options) {
  this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {})
  return this
}

HaikuClock.prototype.run = function run() {
  if (this.isRunning()) {
    // If time is "controlled" we are locked to an explicitly set local time, so no math i sneeded
    if (this._isTimeControlled()) {
      this.tick()
    } else {
      // If we got here, we need to evaluate the time elapsed, and determine if we've waited long enough for a frame
      this._numLoopsRun++

      let prevTime = this._localTimeElapsed
      let nextTime = prevTime + this.options.frameDuration
      let deltaSinceLastTick = nextTime - prevTime + this._deltaSinceLastTick

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

  return this
}

HaikuClock.prototype.tick = function tick() {
  for (let i = 0; i < this._tickables.length; i++) {
    this._tickables[i].performTick()
  }
  return this
}

HaikuClock.prototype.getTime = function getTime() {
  return this.getExplicitTime()
}

HaikuClock.prototype.setTime = function setTime(time) {
  this._localExplicitlySetTime = parseInt(time || 0, 10)
  return this
}

/**
 * @method getExplicitTime
 * @description Return either the running time or the controlled time, depending on whether this
 * clock is in control mode or not.
 */
HaikuClock.prototype.getExplicitTime = function getExplicitTime() {
  if (this._isTimeControlled()) return this.getControlledTime()
  return this.getRunningTime()
}

/**
 * @method getControlledTime
 * @description Return the value of time that has been explicitly controlled.
 */
HaikuClock.prototype.getControlledTime = function getControlledTime() {
  return this._localExplicitlySetTime
}

HaikuClock.prototype._isTimeControlled = function _isTimeControlled() {
  return typeof this._localExplicitlySetTime === NUMBER
}

/**
 * @method getRunningTime
 * @description Return the running time, which is the value of time that has elapsed whether or
 * not time has been 'controlled' in control mode.
 */
HaikuClock.prototype.getRunningTime = function getRunningTime() {
  return this._localTimeElapsed
}

HaikuClock.prototype.isRunning = function isRunning() {
  return this._isRunning
}

HaikuClock.prototype.start = function start() {
  this._isRunning = true
  return this
}

HaikuClock.prototype.stop = function stop() {
  this._isRunning = false
  return this
}

HaikuClock.prototype.getFrameDuration = function getFrameDuration() {
  return this.options.frameDuration
}
