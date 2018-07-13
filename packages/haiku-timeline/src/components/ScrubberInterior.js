import React from 'react'
import lodash from 'lodash'
import Palette from 'haiku-ui-common/lib/Palette'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import zIndex from './styles/zIndex'

export default class ScrubberInterior extends React.Component {
  constructor (props) {
    super(props)
    this.propertiesWidth = props.timeline.getPropertiesPixelWidth()
    this.handleUpdate = this.handleUpdate.bind(this)
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
      this.forceUpdate()
    } else if (what === 'timeline-frame-range') {
      this.forceUpdate()
    } else if (what === 'time-display-mode-change') {
      this.forceUpdate()
    } else if (what === 'timeline-scroll' || 'timeline-scroll-from-scrollbar') {
      this.forceUpdate()
    }
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

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
    const translation = this.propertiesWidth + pxOffset

    return (
      <div
        onMouseDown={this.props.onMouseDown}
        style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
          position: 'sticky',
          top: 0,
          marginTop: -45,
          zIndex: zIndex.scrubber.base,
          fontSize: 10
        } : {
          overflow: 'hidden'
        })}>
        <div
          ref={(head) => { this.head = head }}
          style={experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
            position: 'absolute',
            backgroundColor: Palette.SUNSTONE,
            color: Palette.FATHER_COAL,
            textAlign: 'center',
            height: 18,
            width: 16,
            top: 13,
            left: -7,
            borderRadius: '50%',
            cursor: 'move',
            boxShadow: '0 0 2px 0 rgba(0, 0, 0, .9)',
            willChange: 'transform',
            transform: `translate3D(${translation}px, 0, 0)`
          } : {
            position: 'absolute',
            backgroundColor: Palette.SUNSTONE,
            color: Palette.FATHER_COAL,
            textAlign: 'center',
            height: 19,
            width: 19,
            top: 13,
            left: pxOffset - 9,
            borderRadius: '50%',
            cursor: 'move',
            boxShadow: '0 0 2px 0 rgba(0, 0, 0, .9)',
            zIndex: 2006
          }}>
          <span style={{
            position: 'absolute',
            top: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 1 : 2,
            left: 0,
            width: '100%'
          }}>
            {this.props.timeline.getDisplayTime()}
          </span>
          <span style={experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
            position: 'absolute',
            width: 0,
            height: 0,
            top: 13,
            left: 1,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '9px solid rgb(254, 254, 254)'
          } : {
            position: 'absolute',
            zIndex: 2006,
            width: 0,
            height: 0,
            top: 15,
            left: 1,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '9px solid ' + Palette.SUNSTONE
          }} />
          <span style={experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
            position: 'absolute',
            width: 0,
            height: 0,
            top: 15,
            left: 2,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '8px solid rgb(254, 254, 254)'
          } : {
            display: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 'none' : 'inline-block',
            position: 'absolute',
            zIndex: 2006,
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
            willChange: 'transform',
            transform: `translate3D(${translation}px, 0, 0)`
          }} />
      </div>
    )
  }
}

ScrubberInterior.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  onMouseDown: React.PropTypes.func
}
