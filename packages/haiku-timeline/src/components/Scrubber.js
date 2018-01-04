import React from 'react'
import lodash from 'lodash'
import { DraggableCore } from 'react-draggable'
import Palette from 'haiku-ui-common/lib/Palette'

const THROTTLE_TIME = 17 // ms

export default class Scrubber extends React.Component {
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
    if (what === 'timeline-frame' || what === 'timeline-frame-range') this.forceUpdate()
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    if (this.props.timeline.getCurrentFrame() < frameInfo.friA) {
      return <span />
    }

    if (this.props.timeline.getCurrentFrame() > frameInfo.friB) {
      return <span />
    }

    const currFrame = this.props.timeline.getCurrentFrame()

    const frameOffset = currFrame - frameInfo.friA
    const pxOffset = frameOffset * frameInfo.pxpf

    return (
      <DraggableCore
        axis='x'
        onStart={(dragEvent, dragData) => {
          this.props.timeline.setScrubberDragStart(dragData.x)
          this.props.timeline.setFrameBaseline(this.props.timeline.getCurrentFrame())
          this.props.reactParent.setState({
            avoidTimelinePointerEvents: true
          })
        }}
        onStop={(dragEvent, dragData) => {
          this.props.timeline.setScrubberDragStart(null)
          this.props.timeline.setFrameBaseline(this.props.timeline.getCurrentFrame())
          this.props.reactParent.setState({
            avoidTimelinePointerEvents: false
          })
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          this.props.timeline.changeScrubberPosition(dragData.x)
        }, THROTTLE_TIME)}>
        <div
          style={{
            overflow: 'hidden'
          }}>
          <div
            style={{
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
              top: 2,
              left: 0,
              width: '100%'
              }}>
              {!this.props.isScrubbing && this.props.displayTime}
            </span>
            <span style={{
              position: 'absolute',
              zIndex: 2006,
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
            style={{
              position: 'absolute',
              zIndex: 2006,
              backgroundColor: Palette.SUNSTONE,
              height: 9999,
              width: 1,
              top: 35,
              left: pxOffset,
              pointerEvents: 'none'
            }} />
        </div>
      </DraggableCore>
    )
  }
}

Scrubber.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  reactParent: React.PropTypes.object.isRequired,
  $update: React.PropTypes.object.isRequired,
  isScrubbing: React.PropTypes.bool.isRequired
}
