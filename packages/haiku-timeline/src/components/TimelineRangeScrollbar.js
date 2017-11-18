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

  getPlayheadPc (frameInfo) {
    if (frameInfo.friMaxVirt < 1) return 0
    const frame = this.props.timeline.getCurrentFrame()
    if (frame < 1) return 0
    return (frame / frameInfo.friMax) * 100
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    return (
      <div
        id='timeline-range-scrollbar-container'
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
            this.props.reactParent.setState({
              avoidTimelinePointerEvents: true
            })
          }}
          onStop={(dragEvent, dragData) => {
            this.props.timeline.scrollbarBodyStop(dragData)
            this.props.reactParent.setState({
              avoidTimelinePointerEvents: false
            })
          }}
          onDrag={lodash.throttle((dragEvent, dragData) => {
            // Don't drag on the body if we're already dragging on the ends
            if (!this.props.timeline.getScrollerLeftDragStart() && !this.props.timeline.getScrollerRightDragStart()) {
              this.props.timeline.changeVisibleFrameRange(dragData.x, dragData.x)
            }
          }, THROTTLE_TIME)}>
          <div
            id='timeline-range-scrollbar'
            style={{
              position: 'absolute',
              backgroundColor: Palette.LIGHTEST_GRAY,
              height: KNOB_RADIUS * 2,
              left: frameInfo.scA,
              width: frameInfo.scB - frameInfo.scA,
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
              <div
                id='timeline-range-knob-left'
                style={{
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
              <div
                id='timeline-range-knob-right'
                style={{
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
          id='timeline-playhead-indicator-container'
          style={{
            width: this.props.timeline.getPropertiesPixelWidth() + this.props.timeline.getTimelinePixelWidth() - 35,
            left: 10,
            position: 'relative'
          }}>
          <div
            id='timeline-playhead-indicator'
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              height: KNOB_RADIUS * 2,
              width: 1,
              backgroundColor: Palette.ROCK,
              left: this.getPlayheadPc(frameInfo) + '%'
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
