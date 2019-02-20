const numeral = require('numeral');
const TimelineProperty = require('haiku-serialization/src/bll/TimelineProperty');
const BaseModel = require('./BaseModel');
const MathUtils = require('./MathUtils');
const formatSeconds = require('haiku-ui-common/lib/helpers/formatSeconds').default;
const logger = require('haiku-serialization/src/utils/LoggerInstance');

const DURATION_DRAG_INCREASE = 20; // Increase by this much per each duration increase
const DURATION_DRAG_TIMEOUT = 300; // Wait this long before increasing the duration
const DURATION_MOD_TIMEOUT = 100;
const MINIMUM_ZOOM_THRESHOLD = 3; // Minimum number of frames to show

/**
 * @class Timeline
 * @description
 *  Representation of a Timeline of a component.
 *  Provides a convenient way to manage the internals of a timeline without
 *  being concerned with React and all the spaghetti therein.
 *
 *  Allows you to manage:
 *    - Playback settings and state
 *    - Range of frames shown in the Timeline UI, zoom factor, etc.
 *    - Receiving updates to the current time
 *    - Querying for info about the state of the current frame, based on
 *      parameters related to the current zoom factor, offset, etc.
 */
class Timeline extends BaseModel {
  constructor (props, opts) {
    super(props, opts);

    this._playing = false;
    this._isLooping = true;
    this._stopwatch = Date.now();
    this._currentFrame = 0;
    this._fps = 60;
    this._lastAuthoritativeFrame = 0;
    this._lastSeek = null;

    this._visibleFrameRange = [0, 60];
    this._timelinePixelWidth = 870;
    this._propertiesPixelWidth = 300;
    this._maxFrame = this._visibleFrameRange[1] * 2;
    this._durationDragStart = 0;
    this._durationTrim = 0;
    this._dragIsAdding = false;
    this._durationInterval = null;
    this._scrollerLeftDragStart = 0;
    this._scrollerRightDragStart = 0;
    this._scrollerBodyDragStart = 0;
    this._scrollbarStart = 0;
    this._scrollbarEnd = 0;
    this._hoveredFrame = 0;
    this._timeDisplayMode = Timeline.TIME_DISPLAY_MODE.FRAMES;
    this._scrollLeft = 0;

    this.raf = null; // Store raf so it can be cancelled
    this.update = this.update.bind(this);
    this.update();
  }

  rehydrate () {
    this.component.rehydrate();
    return this;
  }

  getName () {
    return this.name;
  }

  isPlaying () {
    return this._playing;
  }

  setRepeat (bool) {
    this._isLooping = bool;
  }

  getRepeat () {
    return Boolean(this._isLooping);
  }

  getTimeDisplayMode () {
    return this._timeDisplayMode;
  }

  setTimeDisplayMode (newMode) {
    this._timeDisplayMode = newMode;
    this.emit('update', 'time-display-mode-change');
  }

  toggleTimeDisplayMode () {
    if (this.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.FRAMES) {
      this._timeDisplayMode = Timeline.TIME_DISPLAY_MODE.SECONDS;
    } else {
      this._timeDisplayMode = Timeline.TIME_DISPLAY_MODE.FRAMES;
    }

    this.emit('update', 'time-display-mode-change');
  }

  getDisplayTime () {
    const displayTime = this.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.FRAMES
      ? ~~this.getCurrentFrame()
      : formatSeconds(this.getCurrentFrame() * 1000 / this.getFPS() / 1000).replace('0.', '.');

    return displayTime;
  }

  toggleRepeat () {
    this.setRepeat(!this.getRepeat());
  }

  setAuthoritativeFrame (authoritativeFrame) {
    this._lastAuthoritativeFrame = authoritativeFrame;
    this._stopwatch = Date.now();
    this.updateCurrentFrame(authoritativeFrame);
  }

  getExtrapolatedCurrentFrame () {
    const lap = Date.now();
    const spanMs = lap - this._stopwatch;
    const spanS = spanMs / 1000;
    const spanFrames = Math.round(spanS * this._fps);
    const extrapolatedFrame = this._lastAuthoritativeFrame + spanFrames;
    return extrapolatedFrame;
  }

  togglePlayback () {
    const frameInfo = this.getFrameInfo();

    if (this.getCurrentFrame() >= frameInfo.maxf) {
      this.seek(frameInfo.fri0); // Don't pause here because we'll pause below
      this.updateCurrentFrame(frameInfo.fri0);
      this.tryToLeftAlignTickerInVisibleFrameRange(frameInfo.fri0);
    }

    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  playbackSkipBack () {
    const frameInfo = this.getFrameInfo();
    this.seekAndPause(frameInfo.fri0);
    this.updateCurrentFrame(frameInfo.fri0);
    this.tryToLeftAlignTickerInVisibleFrameRange(frameInfo.fri0);
  }

  playbackSkipForward () {
    const frameInfo = this.getFrameInfo();
    this.seekAndPause(frameInfo.maxf);
    this.updateCurrentFrame(frameInfo.maxf);
    this.tryToLeftAlignTickerInVisibleFrameRange(frameInfo.maxf);
  }

  play () {
    this._playing = true;
    this._stopwatch = Date.now();
    if (!this.component.project.getEnvoyClient().isInMockMode()) {
      const channel = this.component.project.getEnvoyChannel('timeline');
      // Don't know why, but this can be undefined in some edge case/race
      if (channel) {
        channel.play(this.getPrimaryKey()).then(() => {
          this.update();
        });
      }
    }
  }

  pause (skipTransmit) {
    this._playing = false;
    this._lastSeek = null;
    if (!skipTransmit && !this.component.project.getEnvoyClient().isInMockMode()) {
      const channel = this.component.project.getEnvoyChannel('timeline');
      // Don't know why, but this can be undefined in some edge case/race
      if (channel) {
        channel.pause(this.getPrimaryKey()).then((finalFrame) => {
          this.setCurrentFrame(finalFrame);
          this.setAuthoritativeFrame(finalFrame);
          this.tryToLeftAlignTickerInVisibleFrameRange(finalFrame);
        });
      }
    }
  }

  seekToTime (time, skipTransmit, forceSeek) {
    const frameInfo = this.getFrameInfo();
    const frame = Math.round(time / frameInfo.mspf);
    return this.seek(frame, skipTransmit, forceSeek);
  }

  seek (newFrame, skipTransmit, forceSeek) {
    // Don't bother with any part of this update if we're already at this frame
    if (forceSeek || this.getCurrentFrame() !== newFrame) {
      this.setCurrentFrame(newFrame);
      const id = this.getPrimaryKey();
      const tuple = id + '|' + newFrame;
      const last = this._lastSeek;
      if (forceSeek || last !== tuple) {
        this._lastSeek = tuple;
        this.setAuthoritativeFrame(newFrame);
        // If we end up calling the handler here, we end up doing this:
        // Glass hears 'didSeek', fires its handler.
        // Which calls draw, which in turn calls component.setTimelineTimeValue.
        // Which in turn calls setCurrentTime, which alls Timeline.seekToTime,
        // which in turn calls seek (this method). Beware!
        if (!skipTransmit && !this.component.project.getEnvoyClient().isInMockMode()) {
          const timelineChannel = this.component.project.getEnvoyChannel('timeline');
          // When ActiveComponent is loaded, it calls setTimelineTimeValue() -> seek(),
          // which may occur before Envoy channels are opened, hence this check.
          if (timelineChannel) {
            timelineChannel.seekToFrame(id, newFrame);
          } else {
            logger.warn(`[timeline] envoy timeline channel not open (seekToFrame ${id}, ${newFrame})`);
          }
        }
      }
    }
  }

  seekAndPause (newFrame) {
    this.seek(newFrame, true);
    this.pause(true)
    if (!this.component.project.getEnvoyClient().isInMockMode()) {
      const timelineChannel = this.component.project.getEnvoyChannel('timeline');
      // When ActiveComponent is loaded, it calls setTimelineTimeValue() -> seek(),
      // which may occur before Envoy channels are opened, hence this check.
      if (timelineChannel) {
        timelineChannel.seekToFrameAndPause(this.getPrimaryKey(), newFrame).then((finalFrame) => {
          this.setCurrentFrame(finalFrame);
          this.setAuthoritativeFrame(finalFrame);
          this.tryToLeftAlignTickerInVisibleFrameRange(finalFrame);
        });
      } else {
        logger.warn(`[timeline] envoy timeline channel not open (seekToFrameAndPause ${this.getPrimaryKey()}, ${newFrame})`);
      }
    }
  }

  update () {
    if (this._playing) {
      const frameInfo = this.getFrameInfo();

      // Prevent pointless looping
      if (frameInfo.maxf < 1) {
        this.seekAndPause(frameInfo.maxf);
        return;
      }

      const extrapolatedFrame = this.getExtrapolatedCurrentFrame();

      this.updateCurrentFrame(extrapolatedFrame);

      // Only go as far as the maximum frame as defined in the bytecode
      if (this.getCurrentFrame() > frameInfo.maxf) {
        // Need to unset this or the next seek will be treated as a a no-op
        this._lastSeek = null;

        if (this.getRepeat()) {
          this.seek(0);
          this._stopwatch = Date.now();
        } else {
          this.seekAndPause(frameInfo.maxf);
        }
      }

      this.tryToLeftAlignTickerInVisibleFrameRange(this.getCurrentFrame());

      this.raf = window.requestAnimationFrame(this.update);
    }
  }

  getFPS () {
    const instance = this.component.$instance;
    if (!instance) {
      return 60;
    }
    return instance.getClock().getFPS();
  }

  getMaxFrame () {
    return this._maxFrame;
  }

  setMaxFrame (maxFrame) {
    this._maxFrame = maxFrame;
    this.cache.unset('frameInfo');
    this.emit('update', 'timeline-max-frame-changed');
    return this;
  }

  getCurrentFrame () {
    return this._currentFrame;
  }

  getCurrentTime () {
    const frameInfo = this.getFrameInfo();
    const frame = this.getCurrentFrame();
    return frame * frameInfo.mspf;
  }

  hoverFrame (hoveredFrame) {
    this._hoveredFrame = hoveredFrame;
    this.emit('update', 'timeline-frame-hovered');
    return this;
  }

  getHoveredFrame () {
    return this._hoveredFrame;
  }

  getCurrentMs () {
    const frameInfo = this.getFrameInfo();
    return Math.round(this.getCurrentFrame() * frameInfo.mspf);
  }

  setCurrentFrame (currentFrame) {
    this._currentFrame = currentFrame;
    return this;
  }

  updateCurrentFrame (currentFrame) {
    this.setCurrentFrame(currentFrame);

    const frameInfo = this.getFrameInfo();
    const timelineTime = Math.round(frameInfo.mspf * this._currentFrame);
    const timelineName = this.component.getCurrentTimelineName();

    this.component.$instance.controlTime(timelineName, timelineTime);

    this.emit('update', 'timeline-frame');

    return this;
  }

  getDurationDragStart () {
    return this._durationDragStart;
  }

  getDurationTrim () {
    return this._durationTrim;
  }

  setDurationTrim (durationTrim) {
    this._durationTrim = durationTrim;
    this.emit('update', 'timeline-duration-trim');
    return this;
  }

  getTimelinePixelWidth () {
    return this._timelinePixelWidth;
  }

  setTimelinePixelWidth (pxWidth) {
    this._timelinePixelWidth = pxWidth;
    this.cache.unset('frameInfo');
    this.emit('update', 'timeline-timeline-pixel-width');
    return this;
  }

  setPropertiesPixelWidth (value) {
    this._propertiesPixelWidth = value;
    this.cache.unset('frameInfo');
  }

  getPropertiesPixelWidth () {
    return this._propertiesPixelWidth;
  }

  getVisibleFrameRangeLength () {
    return this.getRightFrameEndpoint() - this.getLeftFrameEndpoint();
  }

  getVisibleFrameRange () {
    return this._visibleFrameRange;
  }

  getLeftFrameEndpoint () {
    return this._visibleFrameRange[0];
  }

  getRightFrameEndpoint () {
    return this._visibleFrameRange[1];
  }

  getDragIsAdding () {
    return this._dragIsAdding;
  }

  getSelectedKeyframes () {
    return Keyframe.filter((keyframe) => {
      return keyframe.isSelected();
    });
  }

  hasMultipleSelectedKeyframes () {
    const found = this.getSelectedKeyframes();
    return found.length > 1;
  }

  /**
   * // Sorry: These should have been given human-readable names
   * <GAUGE>
   *         <----friW--->
   * fri0    friA        friB        friMax
   * |       |           |           |
   * | | | | | | | | | | | | | | | | |
   *         <-----------> << timelines viewport
   * <------->           | << properties viewport
   *         pxA         pxB
   *                                 |pxMax
   * <SCROLLBAR>
   * |-------------------| << scroller viewport
   *     *====*            << scrollbar
   * <------------------->
   * |sc0                |scL && scRatio
   *     |scA
   *          |scB
   */
  getFrameInfo () {
    return this.cache.fetch('frameInfo', () => {
      const frameInfo = {};

      // Number of frames per second
      frameInfo.fps = this.getFPS();

      // Milliseconds per frame
      frameInfo.mspf = 1000 / frameInfo.fps;

      // The maximum milliseconds *as defined in the bytecode*
      // and *including timeline keyframes and frame linsteners*
      frameInfo.maxms = this.component.$instance.getTimeline(
        this.component.getCurrentTimelineName(),
      ).getMaxTime();

      // The maximum frame *as defined in the bytecode*
      frameInfo.maxf = Timeline.millisecondToNearestFrame(frameInfo.maxms, frameInfo.mspf); // Maximum frame defined in the timeline

      // The lowest possible frame (always 0) (this is pointless but?)
      frameInfo.fri0 = 0;

      // The leftmost frame on the visible range
      frameInfo.friA = (this.getLeftFrameEndpoint() < frameInfo.fri0)
        ? frameInfo.fri0
        : this.getLeftFrameEndpoint();

      // The maximum frame that can be reached via scrolling on the timeline
      // If the defined frame is too small, use our own virtual maximum
      frameInfo.friMax = (frameInfo.maxf < this.getMaxFrame())
        ? this.getMaxFrame()
        : frameInfo.maxf;

      // Whichever max is higher: the virtual, or the assigned value
      frameInfo.friMaxVirt = this.getMaxFrame();

      // The rightmost frame on the visible range
      frameInfo.friB = (this.getRightFrameEndpoint() > frameInfo.friMaxVirt)
        ? frameInfo.friMaxVirt
        : this.getRightFrameEndpoint();

      frameInfo.pxpf = this._timelinePixelWidth / Math.abs(this.getRightFrameEndpoint() - this.getLeftFrameEndpoint());

      // Pixel number for friA, the leftmost frame on the visible range
      frameInfo.pxA = frameInfo.friA * frameInfo.pxpf;

      // Pixel number for friB, the rightmost frame on the visible range
      frameInfo.pxB = frameInfo.friB * frameInfo.pxpf;

      // Pixel number for friMax2, i.e. the width in pixels of the whole timeline
      frameInfo.pxMax = frameInfo.friMax * frameInfo.pxpf;

      // Millisecond number for friA, the leftmost frame in the visible range
      frameInfo.msA = Math.round(frameInfo.friA * frameInfo.mspf);

      // Millisecond number for friB, the rightmost frame in the visible range
      frameInfo.msB = Math.round(frameInfo.friB * frameInfo.mspf);

      // The length in pixels of the scroller view
      frameInfo.scL = this._propertiesPixelWidth + this._timelinePixelWidth;

      // The ratio of the scroller view to the timeline view (so the scroller renders in proportion)
      frameInfo.scRatio = frameInfo.pxMax / frameInfo.scL;

      // The pixel of the left endpoint of the scroller
      frameInfo.scA = (frameInfo.pxA) / frameInfo.scRatio;

      // The pixel of the right endpoint of the scroller
      frameInfo.scB = (frameInfo.pxB) / frameInfo.scRatio;
      return frameInfo;
    });
  }

  getVisibleFrames () {
    const visibleFrames = [];
    const frameInfo = this.getFrameInfo();
    const leftFrame = 0;
    const rightFrame = frameInfo.friMax;
    const leftMostAbsolutePixel = Math.round(leftFrame * frameInfo.pxpf);
    const frameModulus = Timeline.getFrameModulus(frameInfo.pxpf);

    for (let i = leftFrame; i <= rightFrame; i++) {
      const pixelOffsetLeft = Math.round(i * frameInfo.pxpf);

      visibleFrames.push({
        pixelOffsetLeft,
        frameModulus,
        frameNumber: i,
        leftMostAbsolutePixel,
        pixelsPerFrame: frameInfo.pxpf,
      });
    }

    return visibleFrames;
  }

  mapVisibleFrames (iteratee) {
    const mappedOutput = [];

    const visibleFrames = this.getVisibleFrames();

    visibleFrames.forEach(({pixelOffsetLeft, leftMostAbsolutePixel, frameModulus, frameNumber, pixelsPerFrame}) => {
      const mapOutput = iteratee(frameNumber, pixelOffsetLeft - leftMostAbsolutePixel, pixelsPerFrame, frameModulus);
      if (mapOutput) {
        mappedOutput.push(mapOutput);
      }
    });

    return mappedOutput;
  }

  mapVisibleTimes (iteratee) {
    const mappedOutput = [];

    const frameInfo = this.getFrameInfo();

    const leftFrame = frameInfo.friA;
    const leftMs = 0;
    const rightMs = frameInfo.friMax * frameInfo.mspf;
    const totalMs = rightMs - leftMs;

    const msModulus = Timeline.getMillisecondModulus(frameInfo.pxpf);

    const firstMarker = MathUtils.roundUp(leftMs, msModulus);

    let msMarkerTmp = firstMarker;
    const msMarkers = [];
    while (msMarkerTmp <= rightMs) {
      msMarkers.push(msMarkerTmp);
      msMarkerTmp += msModulus;
    }

    for (let i = 0; i < msMarkers.length; i++) {
      const msMarker = msMarkers[i];
      const nearestFrame = Timeline.millisecondToNearestFrame(msMarker, frameInfo.mspf);
      const msRemainder = Math.floor(nearestFrame * frameInfo.mspf - msMarker);

      // TODO: handle the msRemainder case rather than ignoring it
      if (!msRemainder) {
        const frameOffset = nearestFrame - leftFrame;
        const pxOffset = Math.round(frameOffset * frameInfo.pxpf);
        const mapOutput = iteratee(msMarker, pxOffset, totalMs);
        if (mapOutput) {
          mappedOutput.push(mapOutput);
        }
      }
    }

    return mappedOutput;
  }

  dragDurationModifierPosition (dragX) {
    const frameInfo = this.getFrameInfo();

    const dragStart = this.getDurationDragStart();
    const dragDelta = dragX - dragStart;

    let frameDelta = Math.round(dragDelta / frameInfo.pxpf);

    if (dragDelta > 0 && this.getDurationTrim() >= 0) {
      if (!this._durationInterval) {
        // The point of this interval is to let the user hold the little element over to the
        // side for a bit before we immediately start adding frames (don't do it right away)
        this._durationInterval = setInterval(() => {
          const currentMax = (this.getMaxFrame())
            ? this.getMaxFrame()
            : frameInfo.friMax2;

          this.setMaxFrame(currentMax + DURATION_DRAG_INCREASE);
        }, DURATION_DRAG_TIMEOUT);
      }

      this._dragIsAdding = true;

      return;
    }

    if (this._durationInterval) {
      clearInterval(this._durationInterval);
    }

    // Don't let user drag back past last frame; and don't let them drag more than an entire width of frames
    if (frameInfo.friB + frameDelta <= frameInfo.friMax || -frameDelta >= frameInfo.friB - frameInfo.friA) {
      // TODO: make more precise so it removes as many frames as
      // it can instead of completely ignoring the drag
      frameDelta = this.getDurationTrim();
      return;
    }

    this._dragIsAdding = false;

    this.setDurationTrim(frameDelta);
  }

  handleDurationModifierStop () {
    const frameInfo = this.getFrameInfo();
    const currentMax = this.getMaxFrame() ? this.getMaxFrame() : frameInfo.friMax2;

    clearInterval(this._durationInterval);
    this.setMaxFrame(currentMax + this._durationTrim);
    this._dragIsAdding = false;
    this._durationInterval = null;

    setTimeout(() => {
      this._durationDragStart = null;
      this._durationTrim = 0;
    }, DURATION_MOD_TIMEOUT);
  }

  calculateMaxScrollValue () {
    return this.calculateFullTimelineWidth() - this._timelinePixelWidth;
  }

  handleSettingScroll (scrollValue, eventName) {
    if (scrollValue >= 0) {
      const maxScrollValue = this.calculateMaxScrollValue();
      const frameInfo = this.getFrameInfo();

      if (scrollValue >= maxScrollValue) {
        const pixelsToMove = 40;
        const framesToMove = pixelsToMove / frameInfo.pxpf;
        this._scrollLeft = maxScrollValue;
        this.setMaxFrame(this.getMaxFrame() + framesToMove);
      } else {
        const left = Math.round(scrollValue / frameInfo.pxpf);
        const right = left + this._visibleFrameRange[1] - this._visibleFrameRange[0];
        this.setVisibleFrameRange(left, right, false);
        this._scrollLeft = scrollValue;
      }

      this.emit('update', eventName);
    }
  }

  setScrollLeft (scrollValue) {
    this.handleSettingScroll(scrollValue, 'timeline-scroll');
  }

  setScrollLeftFromScrollbar (scrollValue) {
    this.handleSettingScroll(scrollValue, 'timeline-scroll-from-scrollbar');
  }

  getScrollLeft () {
    return this._scrollLeft;
  }

  mapXCoordToFrame (coord) {
    const frameInfo = this.getFrameInfo();
    return Math.round((coord / frameInfo.pxpf) * frameInfo.scRatio);
  }

  zoomBy (scale) {
    const left = this.getLeftFrameEndpoint();
    const right = this.getRightFrameEndpoint();

    this.zoomByLeftAndRightEndpoints(
      (left * scale) + left,
      (right * scale) + right,
    );
  }

  zoomByLeftAndRightEndpoints (left, right, fromScrollbar = false) {
    let leftTotal = left || this.getLeftFrameEndpoint();
    const rightTotal = right || this.getRightFrameEndpoint();
    const difference = rightTotal - leftTotal;
    const frameInfo = this.getFrameInfo();

    if (
      difference < MINIMUM_ZOOM_THRESHOLD ||
      difference > this._timelinePixelWidth * 2 ||
      rightTotal < leftTotal
    ) {
      return;
    }

    if (leftTotal < frameInfo.fri0) {
      leftTotal = frameInfo.fri0;
    }

    this.setVisibleFrameRange(leftTotal, rightTotal);

    if (fromScrollbar) {
      const scrollValue = leftTotal * frameInfo.pxpf;
      this.setScrollLeftFromScrollbar(scrollValue);
    }
  }

  updateVisibleFrameRangeByDelta (delta) {
    const l = this.getLeftFrameEndpoint() + delta;
    const r = this.getRightFrameEndpoint() + delta;
    if (l >= 0) {
      this.setVisibleFrameRange(l, r);
    }
  }

  /**
   * @method tryToLeftAlignTickerInVisibleFrameRange
   * @description will left-align the current timeline window (maintaining zoom)
   */
  tryToLeftAlignTickerInVisibleFrameRange (frame) {
    const frameInfo = this.getFrameInfo();
    const pxOffsetLeft = frame * frameInfo.pxpf;

    if (frame !== undefined && (pxOffsetLeft > this._scrollLeft + this._timelinePixelWidth || pxOffsetLeft < this._scrollLeft)) {
      this.setScrollLeftFromScrollbar(pxOffsetLeft);
    }

    return this;
  }

  setVisibleFrameRange (l, r, shouldNotifyUpdates = true) {
    this._visibleFrameRange = [l, r];
    if (r > this.getMaxFrame()) {
      this.setMaxFrame(r);
    }

    this.cache.unset('frameInfo');
    if (shouldNotifyUpdates) {
      Keyframe.clearAllViewPositions({component: this.component});
      this.emit('update', 'timeline-frame-range');
    }
    return this;
  }

  calculateFullTimelineWidth () {
    const frameInfo = this.getFrameInfo();
    return frameInfo.pxMax + 20;
  }

  updateScrubberPositionByDelta (delta) {
    let currentFrame = this.getCurrentFrame() + delta;
    if (currentFrame <= 0) {
      currentFrame = 0;
    }
    this.component.getCurrentTimeline().seek(currentFrame);
  }

  normalizeMs (ms) {
    const frameInfo = this.getFrameInfo();
    const nearestFrame = Timeline.millisecondToNearestFrame(ms, frameInfo.mspf);
    const finalMs = Math.round(nearestFrame * frameInfo.mspf);
    return finalMs;
  }

  notifyFrameActionChange () {
    this.emit('update', 'timeline-frame-action');
  }
}

Timeline.DEFAULT_OPTIONS = {
  required: {
    component: true,
    name: true,
  },
};

BaseModel.extend(Timeline);

Timeline.eachTimelineKeyframeDescriptor = function eachTimelineKeyframeDescriptor (timelines, iteratee) {
  for (const timelineName in timelines) {
    for (const componentSelector in timelines[timelineName]) {
      for (const propertyName in timelines[timelineName][componentSelector]) {
        for (const keyframeMs in timelines[timelineName][componentSelector][propertyName]) {
          iteratee(
            timelines[timelineName][componentSelector][propertyName][keyframeMs],
            keyframeMs,
            propertyName,
            componentSelector,
            timelineName,
          );
        }
      }
    }
  }
};

Timeline.getFrameModulus = (pxpf) => {
  if (pxpf >= 20) {
    return 1;
  }
  if (pxpf >= 15) {
    return 2;
  }
  if (pxpf >= 10) {
    return 5;
  }
  if (pxpf >= 5) {
    return 10;
  }
  if (pxpf === 4) {
    return 15;
  }
  if (pxpf === 3) {
    return 20;
  }
  if (pxpf === 2) {
    return 30;
  }
  return 50;
};

Timeline.getMillisecondModulus = (pxpf) => {
  if (pxpf >= 20) {
    return 25;
  }
  if (pxpf >= 15) {
    return 50;
  }
  if (pxpf >= 10) {
    return 100;
  }
  if (pxpf >= 5) {
    return 200;
  }
  if (pxpf >= 4) {
    return 250;
  }
  if (pxpf >= 3) {
    return 500;
  }
  if (pxpf >= 2) {
    return 1000;
  }
  return 5000;
};

Timeline.millisecondToNearestFrame = function millisecondToNearestFrame (msValue, mspf) {
  return Math.round(msValue / mspf);
};

Timeline.UNIT_MAPPING = {
  'translation.x': 'px',
  'translation.y': 'px',
  'translation.z': 'px',
  'rotation.z': 'rad',
  'rotation.y': 'rad',
  'rotation.x': 'rad',
  'scale.x': '',
  'scale.y': '',
  opacity: '',
  shown: '',
  backgroundColor: '',
  color: '',
  fill: '',
  stroke: '',
};

Timeline.inferUnitOfValue = function inferUnitOfValue (propertyName) {
  const unit = Timeline.UNIT_MAPPING[propertyName];
  if (unit) {
    return unit;
  }
  return '';
};

Timeline.getPropertyValueDescriptor = function getPropertyValueDescriptor (timelineRow, options) {
  const componentId = timelineRow.element.getComponentId();

  const elementName = timelineRow.element.getNameString();

  const propertyName = timelineRow.getPropertyNameString();

  const hostInstance = timelineRow.component.$instance;

  const hostStates = (hostInstance && hostInstance.getStates()) || {};

  const bytecodeFile = timelineRow.component.fetchActiveBytecodeFile();

  const serializedBytecode = bytecodeFile.getSerializedBytecode();

  const reifiedBytecode = bytecodeFile.getReifiedBytecode();

  const currentTimelineName = (options.timelineName)
    ? options.timelineName
    : timelineRow.component.getCurrentTimelineName();

  const currentTimelineTime = (options.timelineTime !== undefined)
    ? options.timelineTime
    : timelineRow.component.getCurrentTimelineTime();

  const propertyDescriptor = timelineRow.getDescriptor();

  const fallbackValue = propertyDescriptor.fallback;

  const baselineValue = TimelineProperty.getBaselineValue(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance,
    hostStates,
  );

  const baselineCurve = TimelineProperty.getBaselineCurve(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance,
    hostStates,
  );

  const computedValue = TimelineProperty.getComputedValue(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance,
    hostStates,
  );

  const assignedValueObject = TimelineProperty.getAssignedValueObject(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    serializedBytecode,
  );

  const assignedValue = assignedValueObject && assignedValueObject.value;

  const bookendValueObject = TimelineProperty.getAssignedBaselineValueObject(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    serializedBytecode,
  );

  const bookendValue = bookendValueObject && bookendValueObject.value;

  let prettyValue;
  if (assignedValue !== undefined) {
    if (assignedValue && typeof assignedValue === 'object' && assignedValue.__function) {
      let cleanValue = Expression.retToEq(assignedValue.__function.body.trim());

      if (cleanValue.length > 6) {
        cleanValue = (cleanValue.slice(0, 6) + '…');
      }

      prettyValue = {text: cleanValue, style: {whiteSpace: 'nowrap'}, render: 'react'};
    }
  }

  if (prettyValue === undefined) {
    if (assignedValue === undefined && bookendValue !== undefined) {
      if (bookendValue && typeof bookendValue === 'object' && bookendValue.__function) {
        prettyValue = {text: '⚡', style: {fontSize: '11px'}, render: 'react'};
      }
    }
  }

  if (prettyValue === undefined) {
    const formattedPrettyValue = (typeof computedValue === 'number')
      ? numeral(computedValue || 0).format(options.numFormat || '0,0[.]0')
      : computedValue;

    prettyValue = {
      // TODO: remove this check when https://github.com/adamwdraper/Numeral-js/pull/629 is merged
      text: isNaN(formattedPrettyValue) ? computedValue : formattedPrettyValue,
    };
  }

  const valueUnit = Timeline.inferUnitOfValue(propertyDescriptor.name);

  const valueLabel = Property.humanizePropertyName(propertyName);

  return {
    timelineTime: currentTimelineTime,
    timelineName: currentTimelineName,
    propertyName,
    valueUnit,
    valueLabel,
    fallbackValue,
    baselineValue,
    baselineCurve,
    computedValue,
    assignedValue,
    bookendValue,
    prettyValue,
  };
};

Timeline.DEFAULT_NAME = 'Default';

Timeline.TIME_DISPLAY_MODE = {
  FRAMES: 'frames',
  SECONDS: 'seconds',
};

module.exports = Timeline;

// Down here to avoid Node circular dependency stub objects. #FIXME
const Expression = require('./Expression');
const Keyframe = require('./Keyframe');
const Property = require('./Property');
