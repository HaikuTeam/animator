/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {ClockConfig, IHaikuClock} from './api';
import HaikuBase from './HaikuBase';
import HaikuGlobal from './HaikuGlobal';
import assign from './vendor/assign';
import raf from './vendor/raf';

const NUMBER = 'number';

const DEFAULT_OPTIONS: ClockConfig = {
  // frameDuration: Number
  // Time to elapse per frame (ms)
  frameDuration: 16.666,

  // frameDelay: Number
  // How long to wait between each tick (ms)
  frameDelay: 16.666,

  // marginOfErrorForDelta: Number
  // A bit of grace when calculating whether a new frame should be run
  marginOfErrorForDelta: 1.0,

  // run: Boolean
  // Whether or not the clock should run by default
  run: true,
};

// The global animation harness is a singleton
// We don't want to create new ones even on reload
if (!HaikuGlobal.HaikuGlobalAnimationHarness) {
  const queue = [];

  const frame = () => {
    const length = queue.length;

    for (let i = 0; i < length; i++) {
      queue[i]();
    }

    HaikuGlobal.HaikuGlobalAnimationHarness.raf = raf.request(frame);
  };

  HaikuGlobal.HaikuGlobalAnimationHarness = {
    // Array of functions to call on every rAF tick
    queue,
    // The main frame function, loops through all those who
    // need an animation tick and calls them
    frame,
    // Need a mechanism to cancel the rAF loop, or else some contexts
    // (e.g. tests) will have leaked handles
    cancel: () => {
      if (HaikuGlobal.HaikuGlobalAnimationHarness.raf) {
        raf.cancel(HaikuGlobal.HaikuGlobalAnimationHarness.raf);
      }
    },
  };

  // Trigger the loop to start; we'll push frame functions into its queue later
  HaikuGlobal.HaikuGlobalAnimationHarness.frame();
}

// tslint:disable:variable-name
export default class HaikuClock extends HaikuBase implements IHaikuClock {
  private boundRunner: () => void = () => {
    this.run();
  };

  _deltaSinceLastTick;
  _isRunning;
  _localExplicitlySetTime;
  _localFramesElapsed;
  _localTimeElapsed;
  _numLoopsRun;
  options: ClockConfig;
  _tickables;
  GLOBAL_ANIMATION_HARNESS;

  constructor (tickables, options: ClockConfig) {
    super();

    this._tickables = tickables;

    this.assignOptions(options);

    this._isRunning = false;
    this.reinitialize();

    if (this.options.run) {
      // Bind to avoid `this`-detachment when called by raf
      HaikuGlobal.HaikuGlobalAnimationHarness.queue.push(this.boundRunner);
    }

    // Tests and others may need this to cancel the rAF loop, to avoid leaked handles
    this.GLOBAL_ANIMATION_HARNESS = HaikuGlobal.HaikuGlobalAnimationHarness;
  }

  reinitialize () {
    this._numLoopsRun = 0;
    this._localFramesElapsed = 0;
    this._localTimeElapsed = 0;
    this._deltaSinceLastTick = 0;
    this._localExplicitlySetTime = null;
    return this;
  }

  addTickable (tickable) {
    this._tickables.push(tickable);
    return this;
  }

  assignOptions (options: ClockConfig) {
    this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {});
    return this;
  }

  run () {
    if (this.isRunning()) {
      // If time is "controlled" we are locked to an explicitly set local time, so no math is needed.
      if (this.isTimeControlled()) {
        this.tick();
      } else {
        // If we got here, we need to evaluate the time elapsed, and determine if we've waited long enough for a frame
        this._numLoopsRun++;

        const prevTime = this._localTimeElapsed;
        const nextTime = prevTime + this.options.frameDuration;
        const deltaSinceLastTick = nextTime - prevTime + this._deltaSinceLastTick;

        if (
          deltaSinceLastTick >=
          this.options.frameDelay - this.options.marginOfErrorForDelta
        ) {
          this.tick();

          this._localFramesElapsed++;
          this._localTimeElapsed = nextTime;
          this._deltaSinceLastTick = 0; // Must reset delta when frame has been completed
        } else {
          // If we got here, this loop is faster than the desired speed; wait till next call
          this._deltaSinceLastTick = deltaSinceLastTick;
        }
      }
    }
  }

  tick () {
    for (let i = 0; i < this._tickables.length; i++) {
      this._tickables[i].performTick();
    }
  }

  getTime () {
    return this.getExplicitTime();
  }

  setTime (time) {
    this._localExplicitlySetTime = parseInt(time || 0, 10);
    return this;
  }

  getFPS () {
    return Math.round(1000 / this.options.frameDuration);
  }

  /**
   * @method getExplicitTime
   * @description Return either the running time or the controlled time, depending on whether this
   * clock is in control mode or not.
   */
  getExplicitTime () {
    if (this.isTimeControlled()) {
      return this.getControlledTime();
    }
    return this.getRunningTime();
  }

  /**
   * @method getControlledTime
   * @description Return the value of time that has been explicitly controlled.
   */
  getControlledTime () {
    return this._localExplicitlySetTime;
  }

  isTimeControlled () {
    return typeof this._localExplicitlySetTime === NUMBER;
  }

  /**
   * @method getRunningTime
   * @description Return the running time, which is the value of time that has elapsed whether or
   * not time has been 'controlled' in control mode.
   */
  getRunningTime () {
    return this._localTimeElapsed;
  }

  isRunning () {
    return this._isRunning;
  }

  start () {
    this._isRunning = true;
    return this;
  }

  stop () {
    this._isRunning = false;
    return this;
  }

  getFrameDuration () {
    return this.options.frameDuration;
  }

  destroy () {
    super.destroy();
    for (let i = 0; i < HaikuGlobal.HaikuGlobalAnimationHarness.queue.length; i++) {
      if (HaikuGlobal.HaikuGlobalAnimationHarness.queue[i] === this.boundRunner) {
        HaikuGlobal.HaikuGlobalAnimationHarness.queue.splice(i, 1);
        return;
      }
    }
  }

  get frameDuration (): number {
    return this.options.frameDuration;
  }

  get frameDelay (): number {
    return this.options.frameDelay;
  }

  get time (): number {
    return this.getExplicitTime();
  }

  static __name__ = 'HaikuClock';
}
