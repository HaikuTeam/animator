/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import getTimelineMaxTime from './helpers/getTimelineMaxTime';
import SimpleEventEmitter from './helpers/SimpleEventEmitter';
import assign from './vendor/assign';

const NUMBER = 'number';

const DEFAULT_OPTIONS = {
  // loop: Boolean
  // Determines whether this timeline should loop (start at its beginning when finished)
  loop: true,
};

// tslint:disable:variable-name
export default class HaikuTimeline {
  options;
  emit;
  _component;
  _name;
  _descriptor;
  _globalClockTime;
  _localElapsedTime;
  _localExplicitlySetTime;
  _maxExplicitlyDefinedTime;
  _isPlaying;

  constructor(component, name, descriptor, options) {
    SimpleEventEmitter.create(this);

    this._component = component;
    this._name = name;
    this._descriptor = descriptor;

    this.assignOptions(options || {});

    this._globalClockTime = 0;
    this._localElapsedTime = 0;
    this._localExplicitlySetTime = null; // Only set this to a number if time is 'controlled'
    this._maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);

    this._isPlaying = false;
  }

  assignOptions(options) {
    this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {});
    return this;
  }

  ensureClockIsRunning() {
    const clock = this._component.getClock();
    if (!clock.isRunning()) {
      clock.start();
    }
    return this;
  }

  /**
   * @method setComponent
   * @description Internal hook to allow Haiku to hot swap on-stage components during editing.
   */
  setComponent(component) {
    this._component = component;
    return this;
  }

  updateInternalProperties(
    updatedGlobalClockTime,
  ) {
    const previousGlobalClockTime = this._globalClockTime;
    const deltaGlobalClockTime = updatedGlobalClockTime - previousGlobalClockTime;

    this._globalClockTime = updatedGlobalClockTime;

    if (this.isTimeControlled()) {
      this._localElapsedTime = this._localExplicitlySetTime;
    } else {
      // If we are a looping timeline, reset to zero once we've gone past our max
      if (
        this.options.loop &&
        this._localElapsedTime > this._maxExplicitlyDefinedTime
      ) {
        this._localElapsedTime =
          0 + this._maxExplicitlyDefinedTime - this._localElapsedTime;
      }
      this._localElapsedTime += deltaGlobalClockTime;
    }

    if (this.isFinished()) {
      this._isPlaying = false;
    }
  }

  doUpdateWithGlobalClockTime(
    globalClockTime,
  ) {
    if (this.isFrozen()) {
      this.updateInternalProperties(this._globalClockTime);
    } else {
      this.updateInternalProperties(globalClockTime);
    }

    if (this.isPlaying()) {
      this.shout('tick');
    }

    this.shout('update');

    return this;
  }

  resetMaxDefinedTimeFromDescriptor(
    descriptor,
  ) {
    this._maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);
    return this;
  }

  isTimeControlled() {
    return typeof this.getControlledTime() === NUMBER;
  }

  controlTime(
    controlledTimeToSet,
    updatedGlobalClockTime,
  ) {
    this._localExplicitlySetTime = parseInt(controlledTimeToSet || 0, 10);
    // Need to update the properties so that accessors like .getFrame() work after this update.
    this.updateInternalProperties(updatedGlobalClockTime);
    return this;
  }

  /**
   * @method getName
   * @description Return the name of this timeline
   */
  getName() {
    return this._name;
  }

  /**
   * @method getMaxTime
   * @description Return the maximum time that this timeline will reach, in ms.
   */
  getMaxTime() {
    return this._maxExplicitlyDefinedTime;
  }

  /**
   * @method getClockTime
   * @description Return the global clock time that this timeline is at, in ms,
   * whether or not our local time matches it or it has exceeded our max.
   * This value is ultimately managed by the clock and passed in.
   */
  getClockTime() {
    return this._globalClockTime;
  }

  /**
   * @method getElapsedTime
   * @description Return the amount of time that has elapsed on this timeline since
   * it started updating, up to the most recent time update it received from the clock.
   * Note that for inactive timelines, this value will cease increasing as of the last update.
   */
  getElapsedTime() {
    return this._localElapsedTime;
  }

  /**
   * @method getControlledTime
   * @description If time has been explicitly set here via time control, this value will
   * be the number of that setting.
   */
  getControlledTime() {
    return this._localExplicitlySetTime;
  }

  /**
   * @method getBoundedTime
   * @description Return the locally elapsed time, or the maximum time of this timeline,
   * whichever is smaller. Useful if you want to know what the "effective" time of this
   * timeline is, not necessarily how much has elapsed in an absolute sense. This is used
   * in the renderer to determine what value to calculate "now" deterministically.
   */
  getBoundedTime() {
    const max = this.getMaxTime();
    const elapsed = this.getElapsedTime();
    if (elapsed > max) {
      return max;
    }
    return elapsed;
  }

  /**
   * @method getTime
   * @description Convenience wrapper. Currently returns the bounded time. There's an argument
   * that this should return the elapsed time, though. #TODO
   */
  getTime() {
    return this.getBoundedTime();
  }

  /**
   * @method getBoundedFrame
   * @description Return the current frame up to the maximum frame available for this timeline's duration.
   */
  getBoundedFrame() {
    const time = this.getBoundedTime();
    const timeStep = this._component.getClock().getFrameDuration();
    return Math.round(time / timeStep);
  }

  /**
   * @method getUnboundedFrame
   * @description Return the current frame, even if it is above the maximum frame.
   */
  getUnboundedFrame() {
    const time = this.getElapsedTime(); // The elapsed time can go larger than the max time; see timeline.js
    const timeStep = this._component.getClock().getFrameDuration();
    return Math.round(time / timeStep);
  }

  /**
   * @method getFrame
   * @description Return the bounded frame.
   * There's an argument that this should return the absolute frame. #TODO
   */
  getFrame() {
    return this.getBoundedFrame();
  }

  /**
   * @method isPlaying
   * @description Returns T/F if the timeline is playing
   */
  isPlaying() {
    return !!this._isPlaying;
  }

  /**
   * @method isFrozen
   * @description Returns T/F if the timeline is frozen
   */
  isFrozen() {
    return !!this.options.freeze;
  }

  /**
   * @method isFinished
   * @description Returns T/F if the timeline is finished.
   * If this timeline is set to loop, it is never "finished".
   */
  isFinished() {
    if (this.options.loop || this.isTimeControlled()) {
      return false;
    }
    return ~~this.getElapsedTime() > this.getMaxTime();
  }

  duration() {
    return this.getMaxTime() || 0;
  }

  getDuration() {
    return this.duration();
  }

  setRepeat(bool) {
    this.options.loop = bool;
    return this;
  }

  getRepeat() {
    return !!this.options.loop;
  }

  freeze() {
    this.options.freeze = true;
    return this;
  }

  unfreeze() {
    this.options.freeze = false;
    return this;
  }

  shout(key) {
    const frame = this.getFrame();
    const time = Math.round(this.getTime());
    const name = this.getName();
    this.emit(key, frame, time);
    this._component.emit('timeline:' + key, name, frame, time);
    return this;
  }

  start(
    maybeGlobalClockTime,
    descriptor,
  ) {
    this._localElapsedTime = 0;
    this._isPlaying = true;
    this._globalClockTime = maybeGlobalClockTime || 0;
    this._maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);

    this.shout('start');

    return this;
  }

  stop(maybeGlobalClockTime, descriptor) {
    this._isPlaying = false;
    this._maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);

    this.shout('stop');

    return this;
  }

  pause() {
    const time = this._component.getClock().getTime();
    const descriptor = this._component._getTimelineDescriptor(this._name);
    this.stop(time, descriptor);

    this.shout('pause');

    return this;
  }

  play(requestedOptions) {
    const options = requestedOptions || {};

    this.ensureClockIsRunning();

    const time = this._component.getClock().getTime();
    const descriptor = this._component._getTimelineDescriptor(this._name);
    const local = this._localElapsedTime;

    this.start(time, descriptor);

    if (this._localExplicitlySetTime !== null) {
      this._localElapsedTime = this._localExplicitlySetTime;
      this._localExplicitlySetTime = null;
    } else {
      this._localElapsedTime = local;
    }

    if (!options.skipMarkForFullFlush) {
      this._component._markForFullFlush();
    }

    this.shout('play');

    return this;
  }

  seek(ms) {
    this.ensureClockIsRunning();
    const clockTime = this._component.getClock().getTime();
    this.controlTime(ms, clockTime);
    const descriptor = this._component._getTimelineDescriptor(this._name);
    this.start(clockTime, descriptor);
    this._component._markForFullFlush();

    this.shout('seek');

    return this;
  }

  gotoAndPlay(ms) {
    this.ensureClockIsRunning();
    this.seek(ms);
    this.play(null);
    return this;
  }

  gotoAndStop(ms) {
    this.ensureClockIsRunning();
    this.seek(ms);
    if (this._component && this._component._context && this._component._context.tick) {
      this._component._context.tick();
    }
    this.pause();
    return this;
  }
}
