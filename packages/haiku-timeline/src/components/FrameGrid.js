import React from 'react'
import Color from 'color'
import Palette from './DefaultPalette'

export default class FrameGrid extends React.Component {
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
    if (!this.mounted) return null
    if (what === 'timeline-frame-range') this.forceUpdate()
  }

  render () {
    return (
      <div
        id='frame-grid'
        style={{
          overflow: 'hidden'
        }}>
        {this.props.timeline.mapVisibleFrames((frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) => {
          return (
            <span
              id={`frame-${frameNumber}`}
              key={`frame-${frameNumber}`}
              style={{
                height: 9999,
                borderLeft: '1px solid ' + Color(Palette.COAL).fade(0.65),
                position: 'absolute',
                left: pixelOffsetLeft,
                top: 34
              }} />
          )
        })}
      </div>
    )
  }
}

FrameGrid.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  $update: React.PropTypes.object.isRequired
}
