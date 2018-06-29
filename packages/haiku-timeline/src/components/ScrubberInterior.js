import React from 'react'
import lodash from 'lodash'
import Palette from 'haiku-ui-common/lib/Palette'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import zIndex from './styles/zIndex'

export default class ScrubberInterior extends React.Component {
  constructor (props) {
    super(props)
    this.off = false
    this.propertiesWidth = props.timeline.getPropertiesPixelWidth()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.moveGaugeIfNeccesary = this.moveGaugeIfNeccesary.bind(this)
    this.throttledForceUpdate = lodash.throttle(this.forceUpdate.bind(this), 64)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.timeline.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.timeline.on('update', this.handleUpdate)
  }

  componentWillReceiveProps (nextProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate)
      nextProps.timeline.on('update', this.handleUpdate)
    }
  }

  handleUpdate (what) {
    if (!this.mounted) return null

    if (what === 'timeline-frame') {
      if (!this.props.timeline.isPlaying()) {
        this.forceUpdate()
      }
    } else if (what === 'timeline-frame-range') {
      this.forceUpdate()
    } else if (what === 'time-display-mode-change') {
      this.forceUpdate()
    } else if (what === 'timeline-scroll') {
      this.forceUpdate()
    }
  }

  translateToMaxFrame ({currentFrame, frameInfo}) {
    const pxOffset = frameInfo.maxf * frameInfo.pxpf
    const translation = this.propertiesWidth + pxOffset
    const duration = frameInfo.mspf * (frameInfo.maxf - currentFrame)

    this.head.style.transform = `translateX(${translation}px)`
    this.tail.style.transform = `translateX(${translation}px)`
    this.head.style.transition = `transform ${duration}ms linear`
    this.tail.style.transition = `transform ${duration}ms linear`
  }

  translateToFrameZero () {
    this.head.style.transition = ''
    this.tail.style.transition = ''
    this.head.style.transform = 'translateX(0)'
    this.tail.style.transform = 'translateX(0)'
  }

  translateToCurrentFrame ({currentFrame, frameInfo}) {
    if (this.head && this.tail) {
      const pxOffset = currentFrame * frameInfo.pxpf
      const translation = this.propertiesWidth + pxOffset

      this.head.style.transition = ''
      this.tail.style.transition = ''
      this.head.style.transform = `translateX(${translation}px)`
      this.tail.style.transform = `translateX(${translation}px)`
    }
  }

  moveGaugeIfNeccesary () {
    const frameInfo = this.props.timeline.getFrameInfo()
    const currentFrame = this.props.timeline.getCurrentFrame()

    if (this.props.timeline.isPlaying()) {
      if (currentFrame < frameInfo.maxf) {
        if (!this.isMoving) {
          this.translateToMaxFrame({currentFrame, frameInfo})
          this.isMoving = true
        }
      } else {
        this.translateToFrameZero()
        this.isMoving = false
      }
    } else {
      this.translateToCurrentFrame({currentFrame, frameInfo})
      this.isMoving = false
    }

    window.requestAnimationFrame(this.moveGaugeIfNeccesary)
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      this.moveGaugeIfNeccesary()
    }

    if (!experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      if (this.props.timeline.getCurrentFrame() < frameInfo.friA) {
        return <span />
      }

      if (this.props.timeline.getCurrentFrame() > frameInfo.friB) {
        return <span />
      }
    }

    const currFrame = this.props.timeline.getCurrentFrame()
    const frameOffset = experimentIsEnabled(Experiment.NativeTimelineScroll)
      ? currFrame
      : currFrame - frameInfo.friA
    const pxOffset = frameOffset * frameInfo.pxpf
    const propertiesWidth = this.props.timeline.getPropertiesPixelWidth()

    return (
      <div
        onMouseDown={this.props.onMouseDown}
        style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
          position: 'sticky',
          top: 0,
          marginTop: -45,
          zIndex: this.props.timeline.getScrollLeft() < 5 ? 999 : zIndex.scrubber.base
        } : {
          overflow: 'hidden'
        })}>
        <div
          ref={(head) => { this.head = head }}
          style={{
            position: 'absolute',
            backgroundColor: Palette.SUNSTONE,
            color: Palette.FATHER_COAL,
            textAlign: 'center',
            height: 19,
            width: 19,
            top: 13,
            left: experimentIsEnabled(Experiment.NativeTimelineScroll) ? -9 : pxOffset - 9,
            borderRadius: '50%',
            cursor: 'move',
            boxShadow: '0 0 2px 0 rgba(0, 0, 0, .9)',
            zIndex: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : 2006
          }}>
          <span style={{
            position: 'absolute',
            top: 2,
            left: 0,
            width: '100%'
          }}>
            {this.props.timeline.getDisplayTime()}
          </span>
          <span style={{
            position: 'absolute',
            zIndex: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : 2006,
            width: 0,
            height: 0,
            top: 15,
            left: 3,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '9px solid ' + Palette.SUNSTONE
          }} />
          <span style={{
            position: 'absolute',
            zIndex: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : 2006,
            width: 0,
            height: 0,
            left: 2,
            top: 15,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '9px solid ' + Palette.SUNSTONE
          }} />
        </div>
        <div
          ref={(tail) => { this.tail = tail }}
          style={{
            position: 'absolute',
            zIndex: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 1 : 2006,
            backgroundColor: Palette.SUNSTONE,
            height: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 'calc(100vh - 80px)' : 9999,
            width: 1,
            top: 35,
            left: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : pxOffset,
            pointerEvents: 'none'
          }} />
      </div>
    )
  }
}

ScrubberInterior.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  onMouseDown: React.PropTypes.func
}
