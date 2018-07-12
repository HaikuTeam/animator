import React from 'react'
import lodash from 'lodash'
import Palette from 'haiku-ui-common/lib/Palette'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import zIndex from './styles/zIndex'

export default class ScrubberInterior extends React.Component {
  constructor (props) {
    super(props)
    this.ruleSet = document.createElement('style')
    document.head.appendChild(this.ruleSet)
    this.off = false
    this.propertiesWidth = props.timeline.getPropertiesPixelWidth()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.moveGaugeIfNecessary = this.moveGaugeIfNecessary.bind(this)
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
      if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
        if (this.props.timeline.isPlaying()) {
          this.moveGaugeIfNecessary()
        } else {
          this.forceUpdate()
        }
      }
    } else if (what === 'timeline-frame-range') {
      this.forceUpdate()
    } else if (what === 'time-display-mode-change') {
      this.forceUpdate()
    } else if (what === 'timeline-scroll' || 'timeline-scroll-from-scrollbar') {
      this.forceUpdate()
    }
  }

  translateToMaxFrame ({currentFrame, frameInfo}) {
    const frameOffset = (frameInfo.maxf - currentFrame)
    const positionOffset = this.propertiesWidth + (currentFrame * frameInfo.pxpf)
    const translation = this.propertiesWidth + (frameInfo.maxf * frameInfo.pxpf)
    const duration = frameInfo.mspf * frameOffset

    console.log({
      frameOffset,
      translation,
      duration,
      max: frameInfo.maxf,
      current: currentFrame
    })

    const rule = `
      .scrubbing-thing {
        animation-duration: ${duration}ms;
        animation-name: scrub;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    `

    const animation = `
      @keyframes scrub {
        from {
          transform: translateX(${positionOffset}px);
        }

        to {
          transform: translateX(${translation}px);
        }
      }
    `

    this.ruleSet.sheet.insertRule(rule, 0)
    this.ruleSet.sheet.insertRule(animation, 0)
    debugger
    this.tail.classList.add('scrubbing-thing')
    this.head.classList.add('scrubbing-thing')

    if (currentFrame !== 0) {
      setTimeout(() => this.translateToMaxFrame({currentFrame: 0, frameInfo}), duration)
    }
  }

  translateToCurrentFrame ({currentFrame, frameInfo}) {
    if (this.head && this.tail) {
      const pxOffset = currentFrame * frameInfo.pxpf
      const translation = this.propertiesWidth + pxOffset

      this.head.classList.remove('scrubbing-thing')
      this.tail.classList.remove('scrubbing-thing')
      this.head.style.transform = `translateX(${translation}px)`
      this.tail.style.transform = `translateX(${translation}px)`
    }
  }

  moveGaugeIfNecessary () {
    const frameInfo = this.props.timeline.getFrameInfo()
    const currentFrame = this.props.timeline.getCurrentFrame()

    if (this.props.timeline.isPlaying()) {
      if (currentFrame < frameInfo.maxf) {
        if (!this.isMoving) {
          this.translateToMaxFrame({currentFrame, frameInfo})
          this.isMoving = true
        }
      }
    } else {
      this.translateToCurrentFrame({currentFrame, frameInfo})
      this.isMoving = false
    }
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      this.moveGaugeIfNecessary()
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

    return (
      <div
        onMouseDown={this.props.onMouseDown}
        style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
          position: 'sticky',
          top: 0,
          marginTop: -45,
          zIndex: Math.abs(this.props.timeline.getScrollLeft() - pxOffset) < 3 && !this.isMoving ? 12 : zIndex.scrubber.base,
          fontSize: 10
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
            zIndex: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : 2006,
            willChange: 'transform'
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
            pointerEvents: 'none',
            willChange: 'transform'
          }} />
      </div>
    )
  }
}

ScrubberInterior.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  onMouseDown: React.PropTypes.func
}
