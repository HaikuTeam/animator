/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {IHaikuComponent} from './api';
import HaikuBase, {GLOBAL_LISTENER_KEY} from './HaikuBase';
import getTimelineMaxTime from './helpers/getTimelineMaxTime';
import {isNumeric, tokenizeDirective} from './reflection/Tokenizer';
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

export const enum PlaybackFlag {
  ONCE = 'once',
  PLAY = 'play', // alias for 'once'
  LOOP = 'loop',
  STOP = 'stop',
  SEEK = 'seek',
}

const makePlaybackProc = (body: string): Function => {
  // tslint:disable-next-line:no-function-constructor-with-string-args
  return new Function('$time', body);
};

const PLAYBACK_FLAGS = {
  once: true,
  play: true, // alias for 'once'
  loop: true,
  stop: true,
  seek: true,
};

// tslint:disable:variable-name
export default class HaikuTimeline extends HaikuBase {
  options;
  component: IHaikuComponent;
  name;
  descriptor;

  private globalClockTime: number;
  private localElapsedTime: number;
  private localControlledTime: number|null;
  private maxExplicitlyDefinedTime: number;
  private areUpdatesFrozen: boolean;
  private isTimelinePlaying: boolean;
  private isTimelineLooping: boolean;
  private offsetCalculator: Function;
  private lastFrame: number;
  private numLoops: number;

  constructor (component: IHaikuComponent, name, descriptor, options) {
    super();

    this.component = component;
    this.name = name;
    this.descriptor = descriptor;
    this.assignOptions(options || {});

    this.globalClockTime = 0;
    this.localElapsedTime = 0;
    this.localControlledTime = null; // Only set this to a number if time is 'controlled'
    this.maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);
    this.areUpdatesFrozen = !!this.options.freeze;
    this.isTimelineLooping = !!this.options.loop;
    this.isTimelinePlaying = true;
    this.offsetCalculator = null;
    this.lastFrame = null;
    this.numLoops = 0;
  }

  getMs (amount: number, unit: TimeUnit): number {
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

  doUpdateWithGlobalClockTime (
    globalClockTime,
  ) {
    if (this.isFrozen()) {
      return;
    }

    const prevGlobalClockTime = this.getClockTime();
    const deltaGlobalClockTime = globalClockTime - prevGlobalClockTime;
    this.globalClockTime = globalClockTime;

    // If we update with the global clock time while a timeline is paused, the next
    // time we resume playing it will "jump forward" to the time that has elapsed.
    if (this.isPaused()) {
      return;
    }

    this.doUpdateWithTimeDelta(deltaGlobalClockTime);
  }

  doUpdateWithTimeDelta (
    deltaClockTime,
  ) {
    const maxTime = this.getMaxTime();
    const prevElapsedTime = this.getElapsedTime();
    const newElapsedTime = prevElapsedTime + deltaClockTime;
    const didLoop = didTimeLoop(prevElapsedTime, newElapsedTime, maxTime);

    this.setElapsedTime(newElapsedTime);

    // If we are a looping timeline, reset to zero once we've gone past our max
    if (this.isLooping() && didLoop) {
      this.numLoops++;

      // Avoid log DoS for too-short timelines
      if (this.getMaxTime() > 200) {
        this.component.emitFromRootComponent('loop', {
          localElapsedTime: newElapsedTime,
          maxExplicitlyDefinedTime: maxTime,
          globalClockTime: this.getClockTime(),
          boundedFrame: this.getBoundedFrame(),
          loopCount: this.numLoops,
        });
      }
    }
  }

  executePreUpdateHooks (globalClockTime: number) {
    this.doUpdateWithGlobalClockTime(globalClockTime);
  }

  executePostUpdateHooks (globalClockTime: number) {
    if (this.isFrozen() || this.isPaused()) {
      return;
    }

    const frame = this.getBoundedFrame();
    const time = Math.round(this.getBoundedTime());

    this.component.routeEventToHandlerAndEmit(
      GLOBAL_LISTENER_KEY,
      `timeline:${this.getName()}:${frame}`,
      [frame, time],
    );

    this.emit('tick', frame, time);

    this.lastFrame = frame;
  }

  getLastFrame (): number {
    return this.lastFrame;
  }

  controlTime (
    controlledTimeToSet,
    newGlobalClockTime,
  ) {
    this.setControlledTime(parseInt(controlledTimeToSet || 0, 10));
    // Need to update the properties so that accessors like .getFrame() work after this update.
    this.doUpdateWithGlobalClockTime(newGlobalClockTime);
  }

  resetMaxDefinedTimeFromDescriptor (
    descriptor,
  ) {
    this.maxExplicitlyDefinedTime = getTimelineMaxTime(descriptor);
  }

  isTimeControlled () {
    return typeof this.getControlledTime() === NUMBER;
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
    return this.maxExplicitlyDefinedTime;
  }

  /**
   * @method getClockTime
   * @description fseek the global clock time that this timeline is at, in ms,
   * whether or not our local time matches it or it has exceeded our max.
   * This value is ultimately managed by the clock and passed in.
   */
  getClockTime () {
    return this.globalClockTime;
  }

  /**
   * @method getElapsedTime
   * @description Return the amount of time that has elapsed on this timeline since
   * it started updating, up to the most recent time update it received from the clock.
   * Note that for inactive ftimelines, this value will cease increasing as of the last update.
   */
  getElapsedTime () {
    return this.localElapsedTime;
  }

  setElapsedTime (t: number) {
    this.localElapsedTime = t;
  }

  /**
   * @description If time has been explicitly set here via time control, this value will
   * be the number of that setting.
   */
  getControlledTime () {
    return this.localControlledTime;
  }

  setControlledTime (t: number|null) {
    this.localControlledTime = t;
  }

  /**
   * @description Return the locally elapsed time, or the maximum time of this timeline,
   * whichever is smaller. Useful if you want to know what the "effective" time of this
   * timeline is, not necessarily how much has elapsed in an absolute sense. This is used
   * in the renderer to determine what value to calculate "now" deterministically.
   */
  getBoundedTime () {
    const max = this.getMaxTime();

    let time = (this.isTimeControlled())
      ? this.getControlledTime()
      : this.getElapsedTime();

    if (this.offsetCalculator) {
      time = this.offsetCalculator.call(this, time);
    }

    if (this.isLooping()) {
      return mod(time, max);
    }

    // Don't allow negative time
    if (time < 0.000001) {
      time = 0;
    }

    return Math.min(time, max);
  }

  /**
   * @description Convenience wrapper. Currently returns the bounded time. There's an argument
   * that this should return the elapsed time, though. #TODO
   */
  getTime () {
    return this.getBoundedTime();
  }

  /**
   * @description Return the current frame up to the maximum frame available for this timeline's duration.
   */
  getBoundedFrame () {
    const time = this.getTime(); // Returns the bounded time
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
    return this.isTimelinePlaying;
  }

  setPlaying (isPlaying: boolean = true) {
    this.isTimelinePlaying = !!isPlaying;
  }

  isPaused () {
    return !this.isPlaying();
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
    return this.getElapsedTime() > this.getMaxTime();
  }

  isUnfinished () {
    return !this.isFinished();
  }

  getDuration () {
    return this.getMaxTime() || 0;
  }

  setRepeat (bool: boolean = true) {
    this.isTimelineLooping = !!bool;
  }

  getRepeat (): boolean {
    return this.isTimelineLooping;
  }

  isRepeating (): boolean {
    return this.getRepeat();
  }

  isLooping (): boolean {
    return this.isRepeating();
  }

  /**
   * @method isFrozen
   * @description Returns T/F if the timeline is frozen
   */
  isFrozen () {
    return this.areUpdatesFrozen;
  }

  freeze () {
    this.areUpdatesFrozen = true;
  }

  unfreeze () {
    this.areUpdatesFrozen = false;
  }

  start () {
    this.startSoftly(0);
    this.emit('start');
  }

  startSoftly (
    maybeElapsedTime: number,
  ) {
    this.setPlaying(true);
    this.setElapsedTime(maybeElapsedTime || 0);
    this.maxExplicitlyDefinedTime = getTimelineMaxTime(this.component.getTimelineDescriptor(this.name));
  }

  stop () {
    this.stopSoftly();
    this.emit('stop');
  }

  stopSoftly () {
    this.setPlaying(false);
    this.maxExplicitlyDefinedTime = getTimelineMaxTime(this.component.getTimelineDescriptor(this.name));
  }

  pause () {
    this.pauseSoftly();
    this.emit('pause');
  }

  pauseSoftly () {
    this.setPlaying(false);
    this.maxExplicitlyDefinedTime = getTimelineMaxTime(this.component.getTimelineDescriptor(this.name));
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

    this.setPlaying(true);

    // When playing after exiting controlled-time mode, start from the last controlled time.
    if (this.isTimeControlled()) {
      this.setElapsedTime(this.getControlledTime());

      // To properly exit controlled-time mode, we need to set controlled time to null.
      this.setControlledTime(null);
    }

    this.maxExplicitlyDefinedTime = getTimelineMaxTime(this.component.getTimelineDescriptor(this.name));
  }

  seek (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    const ms = this.getMs(amount, unit);
    this.seekSoftly(ms);
    this.component.markForFullFlush();
    this.emit('seek', ms);
  }

  seekSoftly (ms: number) {
    this.ensureClockIsRunning();
    this.controlTime(ms, this.component.getClock().getTime());
    this.setElapsedTime(this.getControlledTime());
    this.maxExplicitlyDefinedTime = getTimelineMaxTime(this.component.getTimelineDescriptor(this.name));
  }

  gotoAndPlay (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    this.seekSoftly(this.getMs(amount, unit));
    this.play(null);
  }

  gotoAndStop (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    this.seekSoftly(this.getMs(amount, unit));
    if (this.component && this.component.context && this.component.context.tick) {
      this.component.context.tick();
    }
    this.pause();
  }

  setPlaybackStatus (input) {
    const {
      flag,
      time,
      proc,
    } = this.parsePlaybackStatus(input);

    if (flag === PlaybackFlag.LOOP) {
      this.setRepeat(true);
    }

    if (flag === PlaybackFlag.ONCE) {
      this.setRepeat(false);
    }

    // If the sending timeline is frozen, don't inadvertently unfreeze its component's guests
    if (
      flag === PlaybackFlag.LOOP || // In the current API, loop also connotes play
      flag === PlaybackFlag.ONCE ||
      flag === PlaybackFlag.PLAY
    ) {
      if (!this.isPlaying()) {
        this.play();
      }
    }

    if (flag === PlaybackFlag.STOP) {
      if (this.isPlaying()) {
        this.stop();
      }
    }

    if (flag === PlaybackFlag.SEEK) {
      this.seek(time || 0, TimeUnit.Millisecond);
    }

    if (typeof proc === 'function') {
      this.offsetCalculator = proc;
    }
  }

  parsePlaybackStatus (input) {
    if (!input) {
      return {
        flag: PlaybackFlag.LOOP,
      };
    }

    // If an object, assume it takes the format of a flag payload
    if (typeof input === 'object') {
      return input;
    }

    if (typeof input === 'number' && isNumeric(input)) {
      return {
        flag: PlaybackFlag.SEEK,
        // Assume the input is frames and convert to our internal format, milliseconds
        time: this.getMs(Number(input), TimeUnit.Frame),
      };
    }

    if (typeof input === 'string') {
      const tokens = this.cacheFetch(`getPlaybackStatusTokens:${input}`, () => {
        return tokenizeDirective(input).map(({value}) => value);
      });

      // If no tokens, assume the default: A looping timeline
      if (tokens.length < 1) {
        return {
          flag: PlaybackFlag.LOOP,
        };
      }

      // Fast-path if we got a single playback flag string
      if (tokens.length === 1 && PLAYBACK_FLAGS[tokens[0]]) {
        return {
          flag: tokens[0],
        };
      }

      const finals = [];
      // Convert any known number-unit tuples in the token stream into their canonical
      // ms-based time value. For example [100,ms]->[100], or [10]->[166] (frames to ms).
      for (let i = 0; i < tokens.length; i++) {
        const curr = tokens[i];
        const next = tokens[i + 1];
        if (typeof curr === 'number') {
          if (next === 'ms') {
            finals.push(this.getMs(curr, TimeUnit.Millisecond));
            i++;
            continue;
          }
          if (next === 'fr') {
            finals.push(this.getMs(curr, TimeUnit.Frame));
            i++;
            continue;
          }
          // Frames are assumed to be the default that an end-user would write
          if (next !== 'fr') {
            finals.push(this.getMs(curr, TimeUnit.Frame));
            continue;
          }
        }
        finals.push(curr);
      }

      if (finals.length > 1) {
        // E.g. if we got +100, make it loop+100
        if (!PLAYBACK_FLAGS[finals[0]]) {
          finals.unshift(PlaybackFlag.LOOP);
        }
      }

      const expr = finals.map((val) => {
        if (PLAYBACK_FLAGS[val]) {
          return '$time';
        }
        return val;
      }).join(' ');

      const proc = makePlaybackProc(`return ${expr};`);

      const out = {
        proc,
        flag: finals[0],
      };

      return out;
    }

    return {
      flag: PlaybackFlag.LOOP,
    };
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
 * @description Modulus, but returns zero if the second number is zero,
 * and calculates an appropriate "cycle" if the number is negative.
 */
const mod = (n: number, m: number): number => {
  if (m === 0) {
    return 0;
  }

  return ((n % m) + m) % m;
};

/**
 * @description Given a previous elapsed time (a), a new elapsed time (b), and a max
 * time (max), determine whether the given timeline has looped between (a) and (b).
 *
 * E.g.:
 *   0----------100
 *        62        103  true
 *
 *   0----------100
 *        62    100  false
 *
 *   0----------100
 *        62   99  false
 *
 *   0----------100
 *              100  110  true
 *
 *   0----------100
 *               101  110  false
 *
 *   0----------100
 *              100
 *              100  false
 *
 *   0----------100
 *   0          100  false
 *
 *   0----------100
 *   0
 *   0  false
 */
const didTimeLoop = (a: number, b: number, max: number): boolean => {
  const ma = mod(a, max);
  const mb = mod(b, max);
  return mb < ma;
};
