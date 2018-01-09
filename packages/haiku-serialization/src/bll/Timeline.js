const numeral = require('numeral')
const lodash = require('lodash')
const assign = require('lodash.assign')
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const getTimelineMaxTime = require('@haiku/player/lib/helpers/getTimelineMaxTime').default
const BaseModel = require('./BaseModel')
const MathUtils = require('./MathUtils')
const formatSeconds = require('haiku-ui-common/lib/helpers/formatSeconds').default

const DURATION_DRAG_INCREASE = 20 // Increase by this much per each duration increase
const DURATION_DRAG_TIMEOUT = 300 // Wait this long before increasing the duration
const DURATION_MOD_TIMEOUT = 100
const STANDARD_DEBOUNCE = 100

/**
 * @class Timeline
 * @description
 *.  Representation of a Timeline of a component.
 *.  Provides a convenient way to manage the internals of a timeline without
 *.  being concerned with React and all the spaghetti therein.
 *
 *.  Allows you to manage:
 *.    - Playback settings and state
 *.    - Range of frames shown in the Timeline UI, zoom factor, etc.
 *.    - Receiving updates to the current time
 *.    - Querying for info about the state of the current frame, based on
 *.      parameters related to the current zoom factor, offset, etc.
 */
class Timeline extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this._playing = false
    this._isLooping = true
    this._stopwatch = Date.now()
    this._currentFrame = 0
    this._fps = 60
    this._lastAuthoritativeFrame = 0
    this._lastSeek = null

    this._visibleFrameRange = [0, 60]
    this._timelinePixelWidth = 870
    this._propertiesPixelWidth = 300
    this._scrubberDragStart = null
    this._maxFrame = this._visibleFrameRange[1] * 2
    this._frameBaseline = 0
    this._durationDragStart = 0
    this._durationTrim = 0
    this._dragIsAdding = false
    this._durationInterval = null
    this._scrollerLeftDragStart = 0
    this._scrollerRightDragStart = 0
    this._scrollerBodyDragStart = 0
    this._scrollbarStart = 0
    this._scrollbarEnd = 0
    this._hoveredFrame = 0
    this._timeDisplayMode = Timeline.TIME_DISPLAY_MODE.FRAMES

    this.debouncedRehydrate = lodash.debounce(this.rehydrate.bind(this), STANDARD_DEBOUNCE)

    this.raf = null // Store raf so it can be cancelled
    this.update = this.update.bind(this)
    this.update()
  }

  rehydrate () {
    this.component.rehydrate()
    return this
  }

  getName () {
    return this.name
  }

  isPlaying () {
    return this._playing
  }

  setRepeat (bool) {
    this._isLooping = bool
  }

  getRepeat () {
    return Boolean(this._isLooping)
  }

  getTimeDisplayMode () {
    return this._timeDisplayMode
  }

  setTimeDisplayMode (newMode) {
    this._timeDisplayMode = newMode === 'seconds'
      ? Timeline.TIME_DISPLAY_MODE.SECONDS
      : Timeline.TIME_DISPLAY_MODE.FRAMES

    this.emit('update', 'time-display-mode-change')
  }

  toggleTimeDisplayMode () {
    if (this.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.FRAMES) {
      this._timeDisplayMode = Timeline.TIME_DISPLAY_MODE.SECONDS
    } else {
      this._timeDisplayMode = Timeline.TIME_DISPLAY_MODE.FRAMES
    }

    this.emit('update', 'time-display-mode-change')
  }

  getDisplayTime () {
    const displayTime = this.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.FRAMES
      ? ~~this.getCurrentFrame()
      : formatSeconds(this.getCurrentFrame() * 1000 / this.getFPS() / 1000).replace(/^0+/, '')

    return displayTime
  }

  toggleRepeat () {
    this.setRepeat(!this.getRepeat())
  }

  setAuthoritativeFrame (authoritativeFrame) {
    this._lastAuthoritativeFrame = authoritativeFrame
    this._stopwatch = Date.now()
    this.updateCurrentFrame(authoritativeFrame)
    if (!this.isScrubberDragging()) {
      this.tryToLeftAlignTickerInVisibleFrameRange(authoritativeFrame)
    }
  }

  getExtrapolatedCurrentFrame () {
    const lap = Date.now()
    const spanMs = lap - this._stopwatch
    const spanS = spanMs / 1000
    const spanFrames = Math.round(spanS * this._fps)
    const extrapolatedFrame = this._lastAuthoritativeFrame + spanFrames
    return extrapolatedFrame
  }

  togglePlayback () {
    const frameInfo = this.getFrameInfo()

    if (this.getCurrentFrame() >= frameInfo.maxf) {
      this.seek(frameInfo.fri0) // Don't pause here because we'll pause below
      this.updateCurrentFrame(frameInfo.fri0)
      this.tryToLeftAlignTickerInVisibleFrameRange(frameInfo.fri0)
    }

    if (this.isPlaying()) {
      console.log('PAUSE')
      this.pause()
    } else {
      console.log('PLAY')
      this.play()
    }
  }

  playbackSkipBack () {
    let frameInfo = this.getFrameInfo()
    this.seekAndPause(frameInfo.fri0)
    this.updateCurrentFrame(frameInfo.fri0)
    this.tryToLeftAlignTickerInVisibleFrameRange(frameInfo.fri0)
  }

  playbackSkipForward () {
    let frameInfo = this.getFrameInfo()
    this.seekAndPause(frameInfo.maxf)
    this.updateCurrentFrame(frameInfo.maxf)
    this.tryToLeftAlignTickerInVisibleFrameRange(frameInfo.maxf)
  }

  play () {
    this._playing = true
    this._stopwatch = Date.now()
    if (!this.component.project.getEnvoyClient().isInMockMode()) {
      this.component.project.getEnvoyChannel('timeline').play(this.uid).then(() => {
        this.update()
      })
    }
  }

  pause () {
    this._playing = false
    if (!this.component.project.getEnvoyClient().isInMockMode()) {
      this.component.project.getEnvoyChannel('timeline').pause(this.uid).then((finalFrame) => {
        this.setCurrentFrame(finalFrame)
        this.setAuthoritativeFrame(finalFrame)
      })
    }
  }

  seekToTime (time, skipTransmit, forceSeek) {
    const frameInfo = this.getFrameInfo()
    const frame = Math.round(time / frameInfo.mspf)
    return this.seek(frame, skipTransmit, forceSeek)
  }

  seek (newFrame, skipTransmit, forceSeek) {
    // Don't bother with any part of this update if we're already at this frame
    if (forceSeek || this.getCurrentFrame() !== newFrame) {
      this.setCurrentFrame(newFrame)
      const id = this.uid
      const tuple = id + '|' + newFrame
      const last = this._lastSeek
      if (forceSeek || last !== tuple) {
        this._lastSeek = tuple
        this.setAuthoritativeFrame(newFrame)
        // If we end up calling the handler here, we end up doing this:
        // Glass hears 'didSeek', fires its handler.
        // Which calls draw, which in turn calls component.setTimelineTimeValue.
        // Which in turn calls setCurrentTime, which alls Timeline.seekToTime,
        // which in turn calls seek (this method). Beware!
        if (!skipTransmit && !this.component.project.getEnvoyClient().isInMockMode()) {
          const timelineChannel = this.component.project.getEnvoyChannel('timeline')
          // When ActiveComponent is loaded, it calls setTimelineTimeValue() -> seek(),
          // which may occur before Envoy channels are opened, hence this check.
          if (timelineChannel) {
            timelineChannel.seekToFrame(id, newFrame)
          } else {
            console.warn(`[haiku:timeline] envoy timeline channel not open (seekToFrame ${id}, ${newFrame})`)
          }
        }
      }
    }
  }

  changeScrubberPosition (dragX) {
    const frameInfo = this.getFrameInfo()
    const dragStart = this._scrubberDragStart
    const frameBaseline = this._frameBaseline
    const dragDelta = dragX - dragStart
    const frameDelta = Math.round(dragDelta / frameInfo.pxpf)

    let currentFrame = frameBaseline + frameDelta
    if (currentFrame < frameInfo.friA) currentFrame = frameInfo.friA
    if (currentFrame > frameInfo.friB) currentFrame = frameInfo.friB

    return this.seek(currentFrame)
  }

  seekAndPause (newFrame) {
    this.setCurrentFrame(newFrame)
    this._playing = false
    if (!this.component.project.getEnvoyClient().isInMockMode()) {
      const timelineChannel = this.component.project.getEnvoyChannel('timeline')
      // When ActiveComponent is loaded, it calls setTimelineTimeValue() -> seek(),
      // which may occur before Envoy channels are opened, hence this check.
      if (timelineChannel) {
        timelineChannel.seekToFrameAndPause(this.uid, newFrame).then((finalFrame) => {
          this.setCurrentFrame(finalFrame)
          this.setAuthoritativeFrame(finalFrame)
        })
      } else {
        console.warn(`[haiku:Timeline] envoy timeline channel not open (seekToFrameAndPause ${this.uid}, ${newFrame})`)
      }
    }
  }

  update () {
    if (this._playing) {
      const frameInfo = this.getFrameInfo()

      // Prevent pointless looping
      if (frameInfo.maxf < 1) {
        this.seekAndPause(frameInfo.maxf)
        return
      }

      const extrapolatedFrame = this.getExtrapolatedCurrentFrame()

      this.updateCurrentFrame(extrapolatedFrame)

      // Only go as far as the maximum frame as defined in the bytecode
      if (this.getCurrentFrame() > frameInfo.maxf) {
        // Need to unset this or the next seek will be treated as a a no-op
        this._lastSeek = null

        if (this.getRepeat()) {
          this.seek(0)
          this.play()
        } else {
          this.seekAndPause(frameInfo.maxf)
        }
      }

      if (!this.isScrubberDragging()) {
        // This method itself determines if the left alignment is necessary
        this.tryToLeftAlignTickerInVisibleFrameRange(this.getCurrentFrame())
      }

      this.raf = window.requestAnimationFrame(this.update)
    }
  }

  getFPS () {
    const instance = this.component.getPlayerComponentInstance()
    if (!instance) return 60
    return instance.getClock().getFPS()
  }

  getMaxFrame () {
    return this._maxFrame
  }

  setMaxFrame (maxFrame) {
    this._maxFrame = maxFrame
    return this
  }

  getCurrentFrame () {
    return this._currentFrame
  }

  getCurrentTime () {
    const frameInfo = this.getFrameInfo()
    const frame = this.getCurrentFrame()
    return frame * frameInfo.mspf
  }

  hoverFrame (hoveredFrame) {
    this._hoveredFrame = hoveredFrame
    this.emit('update', 'timeline-frame-hovered')
    return this
  }

  getHoveredFrame () {
    return this._hoveredFrame
  }

  getCurrentMs () {
    const frameInfo = this.getFrameInfo()
    return Math.round(this.getCurrentFrame() * frameInfo.mspf)
  }

  setCurrentFrame (currentFrame) {
    this._currentFrame = currentFrame
    return this
  }

  updateCurrentFrame (currentFrame) {
    this.setCurrentFrame(currentFrame)

    const frameInfo = this.getFrameInfo()
    const timelineTime = Math.round(frameInfo.mspf * this._currentFrame)
    const timelineName = this.component.getCurrentTimelineName()

    // If we've loaded the instance, reach in and make sure its internals are up to date
    // with ours. TODO: Explore ways to avoid duplicating the source of truth

    this.component.eachPlayerComponentInstance((instance) => {
      const explicitTime = instance._context.clock.getExplicitTime()
      const timelineInstances = instance._timelineInstances

      for (const localTimelineName in timelineInstances) {
        if (localTimelineName !== timelineName) {
          continue
        }

        const timelineInstance = timelineInstances[timelineName]

        if (timelineInstance.isActive()) {
          timelineInstance._controlTime(timelineTime, explicitTime)
        }
      }
    })

    this.emit('update', 'timeline-frame')

    return this
  }

  togglePreviewPlayback (isPreviewMode) {
    const timelineName = this.component.getCurrentTimelineName()

    this.component.eachPlayerComponentInstance((instance) => {
      const timelineInstances = instance._timelineInstances
      const timelineInstance = timelineInstances[timelineName]

      window.requestAnimationFrame(() => {
        if (isPreviewMode) {
          timelineInstance.unfreeze()
          timelineInstance.gotoAndPlay(0)
          timelineInstance.options.loop = true
        } else {
          this.seek(this.getCurrentFrame())
          timelineInstance.freeze()
          timelineInstance.seek(this.getCurrentMs())
          timelineInstance.options.loop = false
        }
      })
    })
  }

  getDurationDragStart () {
    return this._durationDragStart
  }

  getDurationTrim () {
    return this._durationTrim
  }

  setDurationTrim (durationTrim) {
    this._durationTrim = durationTrim
    this.emit('update', 'timeline-duration-trim')
    return this
  }

  getTimelinePixelWidth () {
    return this._timelinePixelWidth
  }

  setTimelinePixelWidth (pxWidth) {
    this._timelinePixelWidth = pxWidth
    this.emit('update', 'timeline-timeline-pixel-width')
    return this
  }

  getPropertiesPixelWidth () {
    return this._propertiesPixelWidth
  }

  setPropertiesPixelWidth (pxWidth) {
    this._propertiesPixelWidth = pxWidth
    this.emit('update', 'timeline-properties-pixel-width')
    return this
  }

  getVisibleFrameRangeLength () {
    return this.getRightFrameEndpoint() - this.getLeftFrameEndpoint()
  }

  getVisibleFrameRange () {
    return this._visibleFrameRange
  }

  getLeftFrameEndpoint () {
    return this._visibleFrameRange[0]
  }

  getRightFrameEndpoint () {
    return this._visibleFrameRange[1]
  }

  getScrubberDragStart () {
    return this._scrubberDragStart
  }

  isScrubberDragging () {
    return typeof this._scrubberDragStart === 'number'
  }

  setScrubberDragStart (scrubberDragStart) {
    this._scrubberDragStart = scrubberDragStart
    this.emit('update', 'timeline-scrubber-drag-start')
    return this
  }

  getFrameBaseline () {
    return this._frameBaseline
  }

  setFrameBaseline (frameBaseline) {
    this._frameBaseline = frameBaseline
    this.emit('update', 'timeline-frame-baseline')
    return this
  }

  getScrollerLeftDragStart () {
    return this._scrollerLeftDragStart
  }

  getScrollerRightDragStart () {
    return this._scrollerRightDragStart
  }

  getScrollerBodyDragStart () {
    return this._scrollerBodyDragStart
  }

  scrollbarBodyStart (dragData) {
    this._scrollerBodyDragStart = dragData.x
    this._scrollbarStart = this.getLeftFrameEndpoint()
    this._scrollbarEnd = this.getRightFrameEndpoint()
    this.emit('update', 'timeline-scrollbar-body-start')
    return this
  }

  scrollbarBodyStop () {
    this._scrollerBodyDragStart = false
    this._scrollbarStart = null
    this._scrollbarEnd = null
    this.emit('update', 'timeline-scrollbar-body-stop')
    return this
  }

  scrollbarLeftStart (dragData) {
    this._scrollerLeftDragStart = dragData.x
    this._scrollbarStart = this.getLeftFrameEndpoint()
    this._scrollbarEnd = this.getRightFrameEndpoint()
    this.emit('update', 'timeline-scrollbar-left-start')
    return this
  }

  scrollbarLeftStop (dragData) {
    this._scrollerLeftDragStart = false
    this._scrollbarStart = null
    this._scrollbarEnd = null
    this.emit('update', 'timeline-scrollbar-left-stop')
    return this
  }

  scrollbarRightStart (dragData) {
    this._scrollerRightDragStart = dragData.x
    this._scrollbarStart = this.getLeftFrameEndpoint()
    this._scrollbarEnd = this.getRightFrameEndpoint()
    this.emit('update', 'timeline-scrollbar-right-start')
    return this
  }

  scrollbarRightStop (dragData) {
    this._scrollerRightDragStart = false
    this._scrollbarStart = null
    this._scrollbarEnd = null
    this.emit('update', 'timeline-scrollbar-right-stop')
    return this
  }

  getScrollbarStart () {
    return this._scrollbarStart
  }

  getScrollbarEnd () {
    return this._scrollbarEnd
  }

  getDragIsAdding () {
    return this._dragIsAdding
  }

  getSelectedKeyframes () {
    return Keyframe.filter((keyframe) => {
      return keyframe.isSelected()
    })
  }

  getActiveKeyframes () {
    return Keyframe.filter((keyframe) => {
      return keyframe.isActive()
    })
  }

  hasMultipleSelectedKeyframes () {
    const found = this.getSelectedKeyframes()
    return found.length > 1
  }

  /**
    // Sorry: These should have been given human-readable names
    <GAUGE>
            <----friW--->
    fri0    friA        friB        friMax
    |       |           |           |
    | | | | | | | | | | | | | | | | |
            <-----------> << timelines viewport
    <------->           | << properties viewport
            pxA         pxB
                                    |pxMax
    <SCROLLBAR>
    |-------------------| << scroller viewport
        *====*            << scrollbar
    <------------------->
    |sc0                |scL && scRatio
        |scA
             |scB
  */
  getFrameInfo () {
    const frameInfo = {}

    // Number of frames per second
    frameInfo.fps = this.getFPS()

    // Milliseconds per frame
    frameInfo.mspf = 1000 / frameInfo.fps

    // The maximum milliseconds *as defined in the bytecode*
    frameInfo.maxms = Timeline.getMaximumMs(this.component.getReifiedBytecode(), this.component.getCurrentTimelineName())

    // The maximum frame *as defined in the bytecode*
    frameInfo.maxf = Timeline.millisecondToNearestFrame(frameInfo.maxms, frameInfo.mspf) // Maximum frame defined in the timeline

    // The lowest possible frame (always 0) (this is pointless but?)
    frameInfo.fri0 = 0

    // The leftmost frame on the visible range
    frameInfo.friA = (this.getLeftFrameEndpoint() < frameInfo.fri0)
      ? frameInfo.fri0
      : this.getLeftFrameEndpoint()

    // The maximum frame that can be reached via scrolling on the timeline
    // If the defined frame is too small, use our own virtual maximum
    frameInfo.friMax = (frameInfo.maxf < this.getMaxFrame())
      ? this.getMaxFrame()
      : frameInfo.maxf

    // Whichever max is higher: the virtual, or the assigned value
    frameInfo.friMaxVirt = this.getMaxFrame()

    // The rightmost frame on the visible range
    frameInfo.friB = (this.getRightFrameEndpoint() > frameInfo.friMaxVirt)
      ? frameInfo.friMaxVirt
      : this.getRightFrameEndpoint()

    frameInfo.pxpf = this.getTimelinePixelWidth() / Math.abs(this.getRightFrameEndpoint() - this.getLeftFrameEndpoint())

    // Pixel number for friA, the leftmost frame on the visible range
    frameInfo.pxA = frameInfo.friA * frameInfo.pxpf

    // Pixel number for friB, the rightmost frame on the visible range
    frameInfo.pxB = frameInfo.friB * frameInfo.pxpf

    // Pixel number for friMax2, i.e. the width in pixels of the whole timeline
    frameInfo.pxMax = frameInfo.friMax * frameInfo.pxpf

    // Millisecond number for friA, the leftmost frame in the visible range
    frameInfo.msA = Math.round(frameInfo.friA * frameInfo.mspf)

    // Millisecond number for friB, the rightmost frame in the visible range
    frameInfo.msB = Math.round(frameInfo.friB * frameInfo.mspf)

    // The length in pixels of the scroller view
    frameInfo.scL = this.getPropertiesPixelWidth() + this.getTimelinePixelWidth()

     // The ratio of the scroller view to the timeline view (so the scroller renders in proportion)
    frameInfo.scRatio = frameInfo.pxMax / frameInfo.scL

    // The pixel of the left endpoint of the scroller
    frameInfo.scA = (frameInfo.pxA) / frameInfo.scRatio

    // The pixel of the right endpoint of the scroller
    frameInfo.scB = (frameInfo.pxB) / frameInfo.scRatio

    return frameInfo
  }

  getVisibleFrames () {
    const visibleFrames = []

    const frameInfo = this.getFrameInfo()
    const visiblePixelWidth = this.getTimelinePixelWidth()

    const leftFrame = frameInfo.friA
    const rightFrame = frameInfo.friB

    const leftMostAbsolutePixel = Math.round(leftFrame * frameInfo.pxpf)

    const frameModulus = Timeline.getFrameModulus(frameInfo.pxpf)

    for (let i = leftFrame; i <= rightFrame; i++) {
      let pixelOffsetLeft = Math.round(i * frameInfo.pxpf)

      if (pixelOffsetLeft >= leftMostAbsolutePixel && pixelOffsetLeft <= (leftMostAbsolutePixel + visiblePixelWidth)) {
        visibleFrames.push({
          pixelOffsetLeft,
          frameModulus,
          frameNumber: i,
          leftMostAbsolutePixel,
          pixelsPerFrame: frameInfo.pxpf
        })
      }
    }

    return visibleFrames
  }

  mapVisibleFrames (iteratee) {
    const mappedOutput = []

    const visibleFrames = this.getVisibleFrames()

    visibleFrames.forEach(({ pixelOffsetLeft, leftMostAbsolutePixel, frameModulus, frameNumber, pixelsPerFrame }) => {
      let mapOutput = iteratee(frameNumber, pixelOffsetLeft - leftMostAbsolutePixel, pixelsPerFrame, frameModulus)
      if (mapOutput) {
        mappedOutput.push(mapOutput)
      }
    })

    return mappedOutput
  }

  mapVisibleTimes (iteratee) {
    const mappedOutput = []

    const frameInfo = this.getFrameInfo()

    const leftFrame = frameInfo.friA
    const leftMs = frameInfo.friA * frameInfo.mspf
    const rightMs = frameInfo.friB * frameInfo.mspf
    const totalMs = rightMs - leftMs

    const msModulus = Timeline.getMillisecondModulus(frameInfo.pxpf)

    const firstMarker = MathUtils.roundUp(leftMs, msModulus)

    let msMarkerTmp = firstMarker
    const msMarkers = []
    while (msMarkerTmp <= rightMs) {
      msMarkers.push(msMarkerTmp)
      msMarkerTmp += msModulus
    }

    for (let i = 0; i < msMarkers.length; i++) {
      let msMarker = msMarkers[i]
      let nearestFrame = Timeline.millisecondToNearestFrame(msMarker, frameInfo.mspf)
      let msRemainder = Math.floor(nearestFrame * frameInfo.mspf - msMarker)

      // TODO: handle the msRemainder case rather than ignoring it
      if (!msRemainder) {
        let frameOffset = nearestFrame - leftFrame
        let pxOffset = Math.round(frameOffset * frameInfo.pxpf)
        let mapOutput = iteratee(msMarker, pxOffset, totalMs)
        if (mapOutput) mappedOutput.push(mapOutput)
      }
    }

    return mappedOutput
  }

  dragScrubberPosition (dragX) {
    const frameInfo = this.getFrameInfo()

    const dragStart = this.getScrubberDragStart()
    const frameBaseline = this.getFrameBaseline()

    const dragDelta = dragX - dragStart
    const frameDelta = Math.round(dragDelta / frameInfo.pxpf)

    let currentFrame = frameBaseline + frameDelta

    if (currentFrame < frameInfo.friA) currentFrame = frameInfo.friA
    if (currentFrame > frameInfo.friB) currentFrame = frameInfo.friB

    this.component.getCurrentTimeline().seek(currentFrame)
  }

  dragDurationModifierPosition (dragX) {
    const frameInfo = this.getFrameInfo()

    const dragStart = this.getDurationDragStart()
    const dragDelta = dragX - dragStart

    let frameDelta = Math.round(dragDelta / frameInfo.pxpf)

    if (dragDelta > 0 && this.getDurationTrim() >= 0) {
      if (!this._durationInterval) {
        // The point of this interval is to let the user hold the little element over to the
        // side for a bit before we immediately start adding frames (don't do it right away)
        this._durationInterval = setInterval(() => {
          const currentMax = (this.getMaxFrame())
            ? this.getMaxFrame()
            : frameInfo.friMax2

          this.setMaxFrame(currentMax + DURATION_DRAG_INCREASE)
        }, DURATION_DRAG_TIMEOUT)
      }

      this._dragIsAdding = true

      return
    }

    if (this._durationInterval) {
      clearInterval(this._durationInterval)
    }

    // Don't let user drag back past last frame; and don't let them drag more than an entire width of frames
    if (frameInfo.friB + frameDelta <= frameInfo.friMax || -frameDelta >= frameInfo.friB - frameInfo.friA) {
      // TODO: make more precise so it removes as many frames as
      // it can instead of completely ignoring the drag
      frameDelta = this.getDurationTrim()
      return
    }

    this._dragIsAdding = false

    this.setDurationTrim(frameDelta)
  }

  handleDurationModifierStop () {
    const frameInfo = this.getFrameInfo()
    const currentMax = this.getMaxFrame() ? this.getMaxFrame() : frameInfo.friMax2

    clearInterval(this._durationInterval)
    this.setMaxFrame(currentMax + this._durationTrim)
    this._dragIsAdding = false
    this._durationInterval = null

    setTimeout(() => {
      this._durationDragStart = null
      this._durationTrim = 0
    }, DURATION_MOD_TIMEOUT)
  }

  changeVisibleFrameRange (xl, xr) {
    const frameInfo = this.getFrameInfo()

    let absL = null
    let absR = null

    if (this.getScrollerLeftDragStart()) {
      absL = xl
    } else if (this.getScrollerRightDragStart()) {
      absR = xr
    } else if (this.getScrollerBodyDragStart()) {
      const offsetL = (this.getScrollbarStart() * frameInfo.pxpf) / frameInfo.scRatio
      const offsetR = (this.getScrollbarEnd() * frameInfo.pxpf) / frameInfo.scRatio
      const diffX = xl - this.getScrollerBodyDragStart()

      absL = offsetL + diffX
      absR = offsetR + diffX
    }

    let fL = (absL !== null)
      ? Math.round((absL * frameInfo.scRatio) / frameInfo.pxpf)
      : this.getLeftFrameEndpoint()

    let fR = (absR !== null)
      ? Math.round((absR * frameInfo.scRatio) / frameInfo.pxpf)
      : this.getRightFrameEndpoint()

    // Stop the scroller at the left side and lock the size
    if (fL <= frameInfo.fri0) {
      fL = frameInfo.fri0
      if (!this.getScrollerRightDragStart() && !this.getScrollerLeftDragStart()) {
        fR = this.getRightFrameEndpoint() - (this.getLeftFrameEndpoint() - fL)
      }
    }

    // Stop the scroller at the right side and lock the size
    if (fR >= frameInfo.friMax2) {
      fL = this.getLeftFrameEndpoint()
      if (!this.getScrollerRightDragStart() && !this.getScrollerLeftDragStart()) {
        fR = frameInfo.friMax2
      }
    }

    this.setVisibleFrameRange(fL, fR)
  }

  updateVisibleFrameRangeByDelta (delta) {
    const l = this.getLeftFrameEndpoint() + delta
    const r = this.getRightFrameEndpoint() + delta
    if (l >= 0) {
      this.setVisibleFrameRange(l, r)
    }
  }

  /**
   * @method tryToLeftAlignTickerInVisibleFrameRange
   * @description will left-align the current timeline window (maintaining zoom)
   */
  tryToLeftAlignTickerInVisibleFrameRange (frame) {
    const frameInfo = this.getFrameInfo()

    // If a frame was passed, only do this if we detect we've gone outside of the range
    if (frame !== undefined && (frame > frameInfo.friB || frame < frameInfo.friA)) {
      const l = this.getLeftFrameEndpoint()
      const r = this.getRightFrameEndpoint()
      const span = r - l

      let newL = this.getCurrentFrame()
      let newR = newL + span

      if (newR > frameInfo.friMax) {
        newL -= (newR - frameInfo.friMax)
        newR = frameInfo.friMax
      }

      this.setVisibleFrameRange(newL, newR)
    }

    return this
  }

  setVisibleFrameRange (l, r) {
    this._visibleFrameRange = [l, r]
    if (r > this.getMaxFrame()) {
      this.setMaxFrame(r)
    }
    this.emit('update', 'timeline-frame-range')
    return this
  }

  updateScrubberPositionByDelta (delta) {
    let currentFrame = this.getCurrentFrame() + delta
    if (currentFrame <= 0) currentFrame = 0
    this.component.getCurrentTimeline().seek(currentFrame)
  }

  normalizeMs (ms) {
    const frameInfo = this.getFrameInfo()
    const nearestFrame = Timeline.millisecondToNearestFrame(ms, frameInfo.mspf)
    const finalMs = Math.round(nearestFrame * frameInfo.mspf)
    return finalMs
  }

  notifyFrameActionChange () {
    this.emit('update', 'timeline-frame-action')
  }
}

Timeline.DEFAULT_OPTIONS = {
  required: {
    component: true,
    name: true,
    _isCurrent: true
  }
}

BaseModel.extend(Timeline)

Timeline.setCurrentTime = function setCurrentTime (criteria, time, skipTransmit, forceSeek) {
  Timeline.where(criteria).forEach((timeline) => {
    timeline.seekToTime(time, skipTransmit, forceSeek)
  })
}

Timeline.setCurrent = function setCurrent (criteria, name) {
  Timeline.where(criteria).forEach((timeline) => {
    timeline._isCurrent = false
  })
  const current = Timeline.find(assign({ name: name }, criteria))
  current._isCurrent = true
  return current
}

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
            timelineName
          )
        }
      }
    }
  }
}

Timeline.getFrameModulus = function getFrameModulus (pxpf) {
  if (pxpf >= 20) return 1
  if (pxpf >= 15) return 2
  if (pxpf >= 10) return 5
  if (pxpf >= 5) return 10
  if (pxpf === 4) return 15
  if (pxpf === 3) return 20
  if (pxpf === 2) return 30
  return 50
}

Timeline.getMillisecondModulus = function getMillisecondModulus (pxpf) {
  if (pxpf >= 20) return 25
  if (pxpf >= 15) return 50
  if (pxpf >= 10) return 100
  if (pxpf >= 5) return 200
  if (pxpf === 4) return 250
  if (pxpf === 3) return 500
  if (pxpf === 2) return 1000
  return 5000
}

Timeline.getMaximumMs = function getMaximumMs (reifiedBytecode, timelineName) {
  if (!reifiedBytecode) {
    return 0
  }
  if (!reifiedBytecode.timelines) {
    return 0
  }
  if (!reifiedBytecode.timelines[timelineName]) {
    return 0
  }
  return Timeline.getTimelineMaxTime(reifiedBytecode.timelines[timelineName])
}

// A cached version of the above that stores the max value so we
// can avoid doing what is a rather expensive calculation every frame.
// We also need to clear this cache; see `clearInMemoryBytecodeCaches`
Timeline.getTimelineMaxTime = (timelineDescriptor) => {
  if (timelineDescriptor.__max !== undefined) {
    return timelineDescriptor.__max
  }
  timelineDescriptor.__max = getTimelineMaxTime(timelineDescriptor)
  return timelineDescriptor.__max
}

Timeline.millisecondToNearestFrame = function millisecondToNearestFrame (msValue, mspf) {
  return Math.round(msValue / mspf)
}

Timeline.UNIT_MAPPING = {
  'translation.x': 'px',
  'translation.y': 'px',
  'translation.z': 'px',
  'rotation.z': 'rad',
  'rotation.y': 'rad',
  'rotation.x': 'rad',
  'scale.x': '',
  'scale.y': '',
  'opacity': '',
  'shown': '',
  'backgroundColor': '',
  'color': '',
  'fill': '',
  'stroke': ''
}

Timeline.inferUnitOfValue = function inferUnitOfValue (propertyName) {
  var unit = Timeline.UNIT_MAPPING[propertyName]
  if (unit) {
    return unit
  }
  return ''
}

Timeline.getPropertyValueDescriptor = function getPropertyValueDescriptor (timelineRow, options) {
  const componentId = timelineRow.element.getComponentId()

  const elementName = timelineRow.element.getNameString()

  const propertyName = timelineRow.getPropertyNameString()

  const hostInstance = timelineRow.component.fetchActiveBytecodeFile().getHostInstance()

  const bytecodeFile = timelineRow.component.fetchActiveBytecodeFile()

  const hostStates = bytecodeFile.getHostStates()

  const serializedBytecode = bytecodeFile.getSerializedBytecode()

  const reifiedBytecode = bytecodeFile.getReifiedBytecode()

  const currentTimelineName = (options.timelineName)
    ? options.timelineName
    : timelineRow.component.getCurrentTimelineName()

  const currentTimelineTime = (options.timelineTime !== undefined)
    ? options.timelineTime
    : timelineRow.component.getCurrentTimelineTime()

  const propertyDescriptor = timelineRow.getDescriptor()

  const fallbackValue = propertyDescriptor.fallback

  const baselineValue = TimelineProperty.getBaselineValue(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance,
    hostStates
  )

  const baselineCurve = TimelineProperty.getBaselineCurve(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance,
    hostStates
  )

  const computedValue = TimelineProperty.getComputedValue(componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance, hostStates
  )

  const assignedValueObject = TimelineProperty.getAssignedValueObject(componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    serializedBytecode
  )

  const assignedValue = assignedValueObject && assignedValueObject.value

  const bookendValueObject = TimelineProperty.getAssignedBaselineValueObject(componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    serializedBytecode
  )

  const bookendValue = bookendValueObject && bookendValueObject.value

  const valueType = propertyDescriptor.typedef || typeof baselineValue

  let prettyValue
  if (assignedValue !== undefined) {
    if (assignedValue && typeof assignedValue === 'object' && assignedValue.__function) {
      let cleanValue = Expression.retToEq(assignedValue.__function.body.trim())

      if (cleanValue.length > 6) cleanValue = (cleanValue.slice(0, 6) + '…')

      prettyValue = { text: cleanValue, style: { whiteSpace: 'nowrap' }, render: 'react' }
    }
  }

  if (prettyValue === undefined) {
    if (assignedValue === undefined && bookendValue !== undefined) {
      if (bookendValue && typeof bookendValue === 'object' && bookendValue.__function) {
        prettyValue = { text: '⚡', style: { fontSize: '11px' }, render: 'react' }
      }
    }
  }

  if (prettyValue === undefined) {
    prettyValue = (valueType === 'number')
      ? numeral(computedValue || 0).format(options.numFormat || '0,0[.]0')
      : computedValue
  }

  const valueUnit = Timeline.inferUnitOfValue(propertyDescriptor.name)

  const valueLabel = Property.humanizePropertyName(propertyName)

  return {
    timelineTime: currentTimelineTime,
    timelineName: currentTimelineName,
    propertyName,
    valueType,
    valueUnit,
    valueLabel,
    fallbackValue,
    baselineValue,
    baselineCurve,
    computedValue,
    assignedValue,
    bookendValue,
    prettyValue
  }
}

Timeline.DEFAULT_NAME = 'Default'

Timeline.TIME_DISPLAY_MODE = {
  FRAMES: 'frames',
  SECONDS: 'seconds'
}

module.exports = Timeline

// Down here to avoid Node circular dependency stub objects. #FIXME
const Expression = require('./Expression')
const Keyframe = require('./Keyframe')
const Property = require('./Property')
