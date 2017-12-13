import React from 'react'
import formatSeconds from './helpers/formatSeconds'
import Palette from 'haiku-ui-common/lib/Palette'

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

  handleUpdate (what) {
    if (!this.mounted) return false
    if (
      what === 'timeline-frame-range' ||
      what === 'timeline-frame-hovered'
    ) {
      this.forceUpdate()
    }
  }

  render () {
    if (this.props.timeDisplayMode === 'frames') {
      return (
        <div
          className='gauge'>
          {this.props.timeline.mapVisibleFrames((frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) => {
            if (frameNumber === 0 || frameNumber % frameModulus === 0) {
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
    } else if (this.props.timeDisplayMode === 'seconds') { // aka time elapsed, not frames
      return (
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
  }
}

Gauge.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  timeDisplayMode: React.PropTypes.string.isRequired,
  $update: React.PropTypes.object.isRequired
}
