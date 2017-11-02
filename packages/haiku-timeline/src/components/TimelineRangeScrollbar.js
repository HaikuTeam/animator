import React from 'react'
import lodash from 'lodash'
import { DraggableCore } from 'react-draggable'
import Palette from './DefaultPalette'

const THROTTLE_TIME = 17 // ms
const KNOB_RADIUS = 5

export default class TimelineRangeScrollbar extends React.Component {
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
    if (what === 'timeline-frame-range' || what === 'timeline-frame') this.forceUpdate()
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    return (
      <div
        className='timeline-range-scrollbar'
        style={{
          width: frameInfo.scL,
          height: KNOB_RADIUS * 2,
          position: 'relative',
          backgroundColor: Palette.DARKER_GRAY,
          borderTop: '1px solid ' + Palette.FATHER_COAL,
          borderBottom: '1px solid ' + Palette.FATHER_COAL
        }}>
        <DraggableCore
          axis='x'
          onStart={(dragEvent, dragData) => {
            this.props.timeline.scrollbarBodyStart(dragData)
          }}
          onStop={(dragEvent, dragData) => {
            this.props.timeline.scrollbarBodyStop(dragData)
          }}
          onDrag={lodash.throttle((dragEvent, dragData) => {
            // Don't drag on the body if we're already dragging on the ends
            if (!this.props.timeline.getScrollerLeftDragStart() && !this.props.timeline.getScrollerRightDragStart()) {
              this.props.timeline.changeVisibleFrameRange(dragData.x, dragData.x)
            }
          }, THROTTLE_TIME)}>
          <div
            style={{
              position: 'absolute',
              backgroundColor: Palette.LIGHTEST_GRAY,
              height: KNOB_RADIUS * 2,
              left: frameInfo.scA,
              width: frameInfo.scB - frameInfo.scA + 17,
              borderRadius: KNOB_RADIUS,
              cursor: 'move'
            }}>
            <DraggableCore
              axis='x'
              onStart={(dragEvent, dragData) => {
                this.props.timeline.scrollbarLeftStart(dragData)
              }}
              onStop={(dragEvent, dragData) => {
                this.props.timeline.scrollbarLeftStop(dragData)
              }}
              onDrag={lodash.throttle((dragEvent, dragData) => {
                this.props.timeline.changeVisibleFrameRange(dragData.x + frameInfo.scA, 0)
              }, THROTTLE_TIME)}>
              <div style={{
                width: 10,
                height: 10,
                position: 'absolute',
                cursor: 'ew-resize',
                left: 0,
                borderRadius: '50%',
                backgroundColor: Palette.SUNSTONE
              }} />
            </DraggableCore>
            <DraggableCore
              axis='x'
              onStart={(dragEvent, dragData) => {
                this.props.timeline.scrollbarRightStart(dragData)
              }}
              onStop={(dragEvent, dragData) => {
                this.props.timeline.scrollbarRightStop(dragData)
              }}
              onDrag={lodash.throttle((dragEvent, dragData) => {
                this.props.timeline.changeVisibleFrameRange(0, dragData.x + frameInfo.scA)
              }, THROTTLE_TIME)}>
              <div style={{
                width: 10,
                height: 10,
                position: 'absolute',
                cursor: 'ew-resize',
                right: 0,
                borderRadius: '50%',
                backgroundColor: Palette.SUNSTONE
              }} />
            </DraggableCore>
          </div>
        </DraggableCore>
        <div
          style={{
            width: this.props.timeline.getPropertiesPixelWidth() + this.props.timeline.getTimelinePixelWidth() - 10,
            left: 10,
            position: 'relative'
          }}>
          <div style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: KNOB_RADIUS * 2,
            width: 1,
            backgroundColor: Palette.ROCK,
            left: ((this.props.timeline.getCurrentFrame() / frameInfo.friMax) * 100) + '%'
          }} />
        </div>
      </div>
    )
  }
}

TimelineRangeScrollbar.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  reactParent: React.PropTypes.object.isRequired,
  $update: React.PropTypes.object.isRequired
}
