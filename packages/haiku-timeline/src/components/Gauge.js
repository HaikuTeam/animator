import React from 'react'
import formatSeconds from 'haiku-ui-common/lib/helpers/formatSeconds'
import Palette from 'haiku-ui-common/lib/Palette'
import Timeline from 'haiku-serialization/src/bll/Timeline'
import zIndex from './styles/zIndex'
import { experimentIsEnabled, Experiment } from 'haiku-common/lib/experiments'

export default class Gauge extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
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
    if (!this.mounted) return false

    if (
      what === 'timeline-frame-range' ||
      what === 'timeline-frame-hovered' ||
      what === 'time-display-mode-change' ||
      what === 'timeline-max-frame-changed'
    ) {
      this.forceUpdate()
    }
  }

  wrapIfNativeScrollIsEnabled (children) {
    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      return (
        <div
          id='gauge-wrapper'
          style={{
            height: 24,
            backgroundColor: Palette.COAL,
            position: 'sticky',
            top: 12,
            marginLeft: this.props.timeline.getPropertiesPixelWidth(),
            width: this.props.timeline.calculateFullTimelineWidth(),
            zIndex: zIndex.gauge.base,
            fontSize: 10,
            borderBottom: '1px solid ' + Palette.FATHER_COAL,
            color: Palette.ROCK_MUTED
          }}
          onMouseDown={this.props.onGaugeMouseDown}
        >
          {children}
        </div>
      )
    } else {
      return children
    }
  }

  render () {
    let out

    if (this.props.timeline.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.FRAMES) {
      out = (
        <div
          className='gauge'>
          {this.props.timeline.mapVisibleFrames((frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) => {
            if ((frameNumber % frameModulus) === 0) {
              return (
                <span key={`frame-${frameNumber}`} style={{ pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }}>
                  <span style={{
                    fontWeight: 'bold',
                    color: (this.props.timeline.getHoveredFrame() === frameNumber)
                      ? Palette.SUNSTONE
                      : 'inherit'
                  }}>
                    {frameNumber}
                  </span>
                </span>
              )
            }
          })}
        </div>
      )
    } else if (this.props.timeline.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.SECONDS) { // aka time elapsed, not frames
      out = (
        <div
          className='gauge'>
          {this.props.timeline.mapVisibleTimes((millisecondsNumber, pixelOffsetLeft, totalMilliseconds) => {
            if (totalMilliseconds <= 1000) {
              return (
                <span key={`time-${millisecondsNumber}`} style={{ pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }}>
                  <span style={{ fontWeight: 'bold' }}>{millisecondsNumber}ms</span>
                </span>
              )
            } else {
              return (
                <span key={`time-${millisecondsNumber}`} style={{ pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }}>
                  <span style={{ fontWeight: 'bold' }}>{formatSeconds(millisecondsNumber / 1000)}s</span>
                </span>
              )
            }
          })}
        </div>
      )
    }

    return this.wrapIfNativeScrollIsEnabled(out)
  }
}

Gauge.propTypes = {
  timeline: React.PropTypes.object.isRequired
}
