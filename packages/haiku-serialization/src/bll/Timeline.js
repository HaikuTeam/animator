const getMillisecondModulus = require('./helpers/getMillisecondModulus')
const getFrameModulus = require('./helpers/getFrameModulus')
const roundUp = require('./helpers/roundUp')
const millisecondToNearestFrame = require('./helpers/millisecondToNearestFrame')
const getMaximumMs = require('./helpers/getMaximumMs')
const BaseModel = require('./BaseModel')
const Keyframe = require('./Keyframe')
const lodash = require('lodash')

const DURATION_DRAG_INCREASE = 20 // Increase by this much per each duration increase
const DURATION_DRAG_TIMEOUT = 300 // Wait this long before increasing the duration
const DURATION_MOD_TIMEOUT = 100
const STANDARD_DEBOUNCE = 100

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
    return this._lastAuthoritativeFrame + spanFrames
  }

  play () {
    this._playing = true
    this._stopwatch = Date.now()
    if (!this.component.getEnvoyClient().isInMockMode()) {
      this.component.getEnvoyChannel('timeline').play(this.uid).then(() => {
        this.update()
      })
    }
  }

  pause () {
    this._playing = false
    if (!this.component.getEnvoyClient().isInMockMode()) {
      this.component.getEnvoyChannel('timeline').pause(this.uid).then((finalFrame) => {
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
        if (!skipTransmit && !this.component.getEnvoyClient().isInMockMode()) {
          const timelineChannel = this.component.getEnvoyChannel('timeline')
          // When ActiveComponent is loaded, it calls setTimelineTimeValue() -> seek(),
          // which may occur before Envoy channels are opened, hence this check.
          if (timelineChannel) {
            timelineChannel.seekToFrame(id, newFrame)
          } else {
            console.warn(`[haiku:Timeline] envoy timeline channel not open (seekToFrame ${id}, ${newFrame})`)
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
    if (!this.component.getEnvoyClient().isInMockMode()) {
      const timelineChannel = this.component.getEnvoyChannel('timeline')
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
      this.updateCurrentFrame(this.getExtrapolatedCurrentFrame())

      const frameInfo = this.getFrameInfo()

      // Only go as far as the maximum frame as defined in the bytecode
      if (this.getCurrentFrame() >= frameInfo.maxf) {
        // Need to unset this or the next seek will be treated as a a no-op
        this._lastSeek = null

        if (this.getRepeat()) {
          this.seek(0)
          this.play()
        } else {
          this.seekAndPause(frameInfo.maxf)
          this.emit('timeline-model:stop-playback')
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
    return this.component.instance.getClock().getFPS()
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
    if (this.component.instance) {
      const explicitTime = this.component.instance._context.clock.getExplicitTime()
      const timelineInstances = this.component.instance._timelineInstances

      for (const localTimelineName in timelineInstances) {
        if (localTimelineName !== timelineName) {
          continue
        }

        const timelineInstance = timelineInstances[timelineName]

        if (timelineInstance.isActive()) {
          timelineInstance._controlTime(timelineTime, explicitTime)
        }
      }
    }

    this.emit('update', 'timeline-frame')

    return this
  }

  togglePreviewPlayback (isPreviewMode) {
    const timelineName = this.component.getCurrentTimelineName()
    const timelineInstances = this.component.instance._timelineInstances
    const timelineInstance = timelineInstances[timelineName]

    window.requestAnimationFrame(() => {
      if (isPreviewMode) {
        timelineInstance.unfreeze()
        timelineInstance.gotoAndPlay(0)
        timelineInstance.options.loop = true
      } else {
        timelineInstance.freeze()
        timelineInstance.seek(0)
        timelineInstance.options.loop = false
      }
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
    frameInfo.maxms = getMaximumMs(this.component.getReifiedBytecode(), this.component.getCurrentTimelineName())

    // The maximum frame *as defined in the bytecode*
    frameInfo.maxf = millisecondToNearestFrame(frameInfo.maxms, frameInfo.mspf) // Maximum frame defined in the timeline

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

    const frameModulus = getFrameModulus(frameInfo.pxpf)

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

    const msModulus = getMillisecondModulus(frameInfo.pxpf)

    const firstMarker = roundUp(leftMs, msModulus)

    let msMarkerTmp = firstMarker
    const msMarkers = []
    while (msMarkerTmp <= rightMs) {
      msMarkers.push(msMarkerTmp)
      msMarkerTmp += msModulus
    }

    for (let i = 0; i < msMarkers.length; i++) {
      let msMarker = msMarkers[i]
      let nearestFrame = millisecondToNearestFrame(msMarker, frameInfo.mspf)
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
    const nearestFrame = millisecondToNearestFrame(ms, frameInfo.mspf)
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

Timeline.setCurrentTime = function setCurrentTime (time, skipTransmit, forceSeek) {
  Timeline.all().forEach((timeline) => {
    timeline.seekToTime(time, skipTransmit, forceSeek)
  })
}

Timeline.setCurrent = function setCurrent (name) {
  Timeline.all().forEach((timeline) => {
    timeline._isCurrent = false
  })
  const current = Timeline.find({ name: name })
  current._isCurrent = true
  return current
}

module.exports = Timeline
