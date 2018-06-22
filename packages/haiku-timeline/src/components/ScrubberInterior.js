import React from 'react'
import lodash from 'lodash'
import Palette from 'haiku-ui-common/lib/Palette'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'

export default class ScrubberInterior extends React.Component {
  constructor (props) {
    super(props)
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
    } else if (what === 'timeline-frame-range' && !experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      this.forceUpdate()
    } else if (what === 'time-display-mode-change') {
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
    const frameOffset = currFrame - frameInfo.friA
    const pxOffset = frameOffset * frameInfo.pxpf
    const propertiesWidth = this.props.timeline.getPropertiesPixelWidth()

    return (
      <div
        style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
          position: 'sticky',
          top: 0,
          marginTop: -45,
          zIndex: 99999
        } : {
          overflow: 'hidden'
        })}>
        <div
          style={{
            position: 'absolute',
            backgroundColor: Palette.SUNSTONE,
            color: Palette.FATHER_COAL,
            textAlign: 'center',
            height: 19,
            width: 19,
            top: 13,
            left: propertiesWidth + pxOffset - 9,
            borderRadius: '50%',
            cursor: 'move',
            boxShadow: '0 0 2px 0 rgba(0, 0, 0, .9)',
            zIndex: 999999
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
            zIndex: 999999,
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
            zIndex: 999999,
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
          style={{
            position: 'absolute',
            zIndex: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 999999999 : 2006,
            backgroundColor: Palette.SUNSTONE,
            height: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 'calc(100vh - 80px)' : 9999,
            width: 1,
            top: 35,
            left: pxOffset + propertiesWidth,
            pointerEvents: 'none'
          }} />
      </div>
    )
  }
}

ScrubberInterior.propTypes = {
  isScrubbing: React.PropTypes.bool.isRequired,
  timeline: React.PropTypes.object.isRequired
}
