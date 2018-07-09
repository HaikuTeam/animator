/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {IHaikuComponent} from './api';
import HaikuBase, {GLOBAL_LISTENER_KEY} from './HaikuBase';
import getTimelineMaxTime from './helpers/getTimelineMaxTime';
import assign from './vendor/assign';

const NUMBER = 'number';

const DEFAULT_OPTIONS = {
  // loop: Boolean
  // Determines whether this timeline should loop (start at its beginning when finished)
  loop: true,
};

export const enum TimeUnit {
  Millisecond = 'ms',
  Frame = 'fr',
}

export const enum PlaybackSetting {
  ONCE = 'once',
  LOOP = 'loop',
  STOP = 'stop',
  CEDE = 'cede',
}

export type PlaybackStatus = PlaybackSetting | number | string;

// tslint:disable:variable-name
export default class HaikuTimeline extends HaikuBase {
  options;
  component: IHaikuComponent;
  name;
  descriptor;
  status: PlaybackStatus;

  _globalClockTime: number;
  _localElapsedTime: number;
  _localExplicitlySetTime: number;
  _maxExplicitlyDefinedTime: number;
  _isPlaying: boolean;
  private loopCounter: number;

  constructor (component: IHaikuComponent, name, descriptor, options) {
    super();

    this.component = component;
    this.name = name;
    this.descriptor = descriptor;
    this.status = null;

    this.assignOptions(options || {});

    this._globalClockTime = 0;
    this._localElapsedTime = 0;
    this._localExplicitlySetTime = null; // Only set this to a number if time is 'controlled'
    this._maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);

    this._isPlaying = null;

    this.loopCounter = 0;
  }

  private getMs (amount: number, unit: TimeUnit): number {
    switch (unit) {
      case TimeUnit.Frame:
        return ~~(this.component.getClock().getFrameDuration() * amount);
      case TimeUnit.Millisecond:
      default:
        // The only currently valid alternative to TimeUnit.Frame is TimeUnit.Millisecond.
        return amount;
    }
  }

  assignOptions (options) {
    this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {});
  }

  ensureClockIsRunning () {
    const clock = this.component.getClock();
    if (!clock.isRunning()) {
      clock.start();
    }
  }

  /**
   * @method setComponent
   * @description Internal hook to allow Haiku to hot swap on-stage components during editing.
   */
  setComponent (component) {
    this.component = component;
  }

  updateInternalProperties (
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
        this.isLooping() &&
        this._localElapsedTime > this._maxExplicitlyDefinedTime
      ) {

        this.loopCounter++;
        // Avoid log DoS for too short timelines
        if (this._maxExplicitlyDefinedTime > 200) {
          this.component.emitFromRootComponent('loop', {
            localElapsedTime: this._localElapsedTime,
            maxExplicitlyDefinedTime: this._maxExplicitlyDefinedTime,
            globalClockTime: this._globalClockTime,
            boundedFrame: this.getBoundedFrame(),
            loopCounter: this.loopCounter});
        }

        this._localElapsedTime =
          0 + this._maxExplicitlyDefinedTime - this._localElapsedTime;
      }
      this._localElapsedTime += deltaGlobalClockTime;
    }

    if (this.isFinished()) {
      this.setPlaying(false);
    }
  }

  doUpdateWithGlobalClockTime (
    globalClockTime,
  ) {
    if (this.isFrozen()) {
      this.updateInternalProperties(this._globalClockTime);
    } else {
      this.updateInternalProperties(globalClockTime);
    }

    if (this.isPlaying()) {
      const frame = this.getUnboundedFrame();
      const time = Math.round(this.getTime());

      this.component.routeEventToHandlerAndEmit(
        GLOBAL_LISTENER_KEY,
        `timeline:${this.getName()}:${frame}`,
        [frame, time],
      );

      this.emit('tick', frame, time);
    }
  }

  resetMaxDefinedTimeFromDescriptor (
    descriptor,
  ) {
    this._maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);
  }

  isTimeControlled () {
    return typeof this.getControlledTime() === NUMBER;
  }

  controlTime (
    controlledTimeToSet,
    updatedGlobalClockTime,
  ) {
    this._localExplicitlySetTime = parseInt(controlledTimeToSet || 0, 10);
    // Need to update the properties so that accessors like .getFrame() work after this update.
    this.updateInternalProperties(updatedGlobalClockTime);
  }

  /**
   * @method getName
   * @description Return the name of this timeline
   */
  getName () {
    return this.name;
  }

  /**
   * @method getMaxTime
   * @description Return the maximum time that this timeline will reach, in ms.
   */
  getMaxTime () {
    return this._maxExplicitlyDefinedTime;
  }

  /**
   * @method getClockTime
   * @description Return the global clock time that this timeline is at, in ms,
   * whether or not our local time matches it or it has exceeded our max.
   * This value is ultimately managed by the clock and passed in.
   */
  getClockTime () {
    return this._globalClockTime;
  }

  /**
   * @method getElapsedTime
   * @description Return the amount of time that has elapsed on this timeline since
   * it started updating, up to the most recent time update it received from the clock.
   * Note that for inactive timelines, this value will cease increasing as of the last update.
   */
  getElapsedTime () {
    return this._localElapsedTime;
  }

  /**
   * @method getControlledTime
   * @description If time has been explicitly set here via time control, this value will
   * be the number of that setting.
   */
  getControlledTime () {
    return this._localExplicitlySetTime;
  }

  /**
   * @method getBoundedTime
   * @description Return the locally elapsed time, or the maximum time of this timeline,
   * whichever is smaller. Useful if you want to know what the "effective" time of this
   * timeline is, not necessarily how much has elapsed in an absolute sense. This is used
   * in the renderer to determine what value to calculate "now" deterministically.
   */
  getBoundedTime () {
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
  getTime () {
    return this.getBoundedTime();
  }

  /**
   * @method getBoundedFrame
   * @description Return the current frame up to the maximum frame available for this timeline's duration.
   */
  getBoundedFrame () {
    const time = this.getBoundedTime();
    const timeStep = this.component.getClock().getFrameDuration();
    return Math.round(time / timeStep);
  }

  /**
   * @method getUnboundedFrame
   * @description Return the current frame, even if it is above the maximum frame.
   */
  getUnboundedFrame () {
    const time = this.getElapsedTime(); // The elapsed time can go larger than the max time; see timeline.js
    const timeStep = this.component.getClock().getFrameDuration();
    return Math.round(time / timeStep);
  }

  /**
   * @method getFrame
   * @description Return the bounded frame.
   * There's an argument that this should return the absolute frame. #TODO
   */
  getFrame () {
    return this.getBoundedFrame();
  }

  /**
   * @method isPlaying
   * @description Returns T/F if the timeline is playing
   */
  isPlaying () {
    return !!this._isPlaying;
  }

  /**
   * @method isExplicitlyPaused
   * @description Returns T/F if the timeline has actually been paused; differentiate from
   * the falsy state timelines have when first constructed.
   */
  isExplicitlyPaused () {
    // The comparison to `false` is intentional and important. See doc above.
    // tslint:disable:no-boolean-literal-compare
    return this._isPlaying === false;
  }

  /**
   * @method isFrozen
   * @description Returns T/F if the timeline is frozen
   */
  isFrozen () {
    return !!this.options.freeze;
  }

  /**
   * @method isFinished
   * @description Returns T/F if the timeline is finished.
   * If this timeline is set to loop, it is never "finished".
   */
  isFinished () {
    if (this.isLooping() || this.isTimeControlled()) {
      return false;
    }
    return ~~this.getElapsedTime() > this.getMaxTime();
  }

  isUnfinished () {
    return !this.isFinished();
  }

  getDuration () {
    return this.getMaxTime() || 0;
  }

  setRepeat (bool) {
    this.options.loop = bool;
  }

  getRepeat (): boolean {
    return !!this.options.loop;
  }

  isRepeating (): boolean {
    return this.getRepeat();
  }

  isLooping (): boolean {
    return this.isRepeating();
  }

  freeze () {
    this.options.freeze = true;
  }

  unfreeze () {
    this.options.freeze = false;
  }

  setPlaying (isPlaying: boolean = true) {
    this._isPlaying = isPlaying;
  }

  start (
    maybeGlobalClockTime,
    descriptor,
  ) {
    this.startSoftly(maybeGlobalClockTime, descriptor);
    this.emit('start');
  }

  startSoftly (
    maybeGlobalClockTime,
    descriptor,
  ) {
    this._localElapsedTime = 0;
    this.setPlaying(true);
    this._globalClockTime = maybeGlobalClockTime || 0;
    this._maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);
  }

  stop (maybeGlobalClockTime, descriptor) {
    this.stopSoftly(maybeGlobalClockTime, descriptor);
    this.emit('stop');
  }

  stopSoftly (
    maybeGlobalClockTime,
    descriptor,
  ) {
    this.setPlaying(false);
    this._maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);
  }

  pause () {
    this.pauseSoftly();
    this.emit('pause');
  }

  pauseSoftly () {
    const time = this.component.getClock().getTime();
    const descriptor = this.component.getTimelineDescriptor(this.name);
    this.stopSoftly(time, descriptor);
  }

  play (options: any = {}) {
    this.playSoftly();

    if (!options || !options.skipMarkForFullFlush) {
      this.component.markForFullFlush();
    }

    this.emit('play');
  }

  playSoftly () {
    this.ensureClockIsRunning();

    const time = this.component.getClock().getTime();
    const descriptor = this.component.getTimelineDescriptor(this.name);
    const local = this._localElapsedTime;

    this.startSoftly(time, descriptor);

    if (this._localExplicitlySetTime !== null) {
      this._localElapsedTime = this._localExplicitlySetTime;
      this._localExplicitlySetTime = null;
    } else {
      this._localElapsedTime = local;
    }
  }

  seek (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    const ms = this.getMs(amount, unit);
    this.seekSoftly(ms);
    this.component.markForFullFlush();
    this.emit('seek', ms);
  }

  private seekSoftly (ms: number) {
    this.ensureClockIsRunning();
    const clockTime = this.component.getClock().getTime();
    this.controlTime(ms, clockTime);
    const descriptor = this.component.getTimelineDescriptor(this.name);
    this.startSoftly(clockTime, descriptor);
  }

  gotoAndPlay (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    const ms = this.getMs(amount, unit);
    this.ensureClockIsRunning();
    this.seekSoftly(ms);
    this.play(null);
  }

  gotoAndStop (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    const ms = this.getMs(amount, unit);
    this.ensureClockIsRunning();
    this.seekSoftly(ms);
    if (this.component && this.component.context && this.component.context.tick) {
      this.component.context.tick();
    }
    this.pause();
  }

  setPlaybackStatus (status: PlaybackStatus) {
    this.status = status;
  }

  applyPlaybackStatus () {
    if (this.isFrozen()) {
      return;
    }

    let status = this.status;

    // Let the child timeline do whatever it wishes without interference
    if (status === PlaybackSetting.CEDE) {
      return;
    }

    if (!status) {
      status = PlaybackSetting.LOOP;
    }

    const shouldRepeat = status === PlaybackSetting.LOOP;
    const shouldPlay = status === PlaybackSetting.ONCE;
    const shouldStop = status === PlaybackSetting.STOP;

    // Start by unsetting the repeat statusue, which we'll re-set only if our status becomes 'loop'
    this.setRepeat(false);

    if (shouldRepeat) {
      this.setRepeat(true);
    }

    // If the sending timeline is frozen, don't inadvertently unfreeze its component's guests
    if (shouldPlay || shouldRepeat) {
      if (!this.isPlaying()) {
        this.play();
      }

      return;
    }

    if (shouldStop) {
      if (this.isPlaying()) {
        this.stop(null, null);
      }

      return;
    }

    if (typeof status === 'number') {
      this.seek(status); // Numbers are assumed to be frames
      return;
    }

    // Attempt to handle strings that specify a unit, e.g. '123ms'
    if (typeof status === 'string') {
      const numericSpec = unitizeString(status);

      if (numericSpec) {
        this.seek(numericSpec.value, numericSpec.units as TimeUnit);
      }
    }
  }

  /**
   * @deprecated
   * TODO: Please change this to a getter.
   */
  duration (): number {
    return this.getDuration();
  }

  get repeat (): boolean {
    return this.getRepeat();
  }

  get time (): number {
    return this.getTime();
  }

  get max (): number {
    return this.getMaxTime();
  }

  get frame (): number {
    return this.getFrame();
  }

  static __name__ = 'HaikuTimeline';

  static all = (): HaikuTimeline[] => HaikuBase.getRegistryForClass(HaikuTimeline);

  static where = (criteria): HaikuTimeline[] => {
    const all = HaikuTimeline.all();
    return all.filter((timeline) => {
      return timeline.matchesCriteria(criteria);
    });
  };

  static create = (component: IHaikuComponent, name, descriptor, config): HaikuTimeline => {
    return new HaikuTimeline(
      component,
      name,
      descriptor,
      config,
    );
  };
}

/**
 * @function unitizeString
 * @description Convert a string like '123ms' to {value: 123, units: 'ms'}
 */
const unitizeString = (str: string) => {
  const match = str.match(/(\d+)(\w+)/);

  if (!match || !match[1] || !match[2]) {
    return;
  }

  return {
    value: Number(match[1]),
    units: match[2],
  };
};
