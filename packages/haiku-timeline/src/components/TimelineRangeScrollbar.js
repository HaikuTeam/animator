import React from 'react'
import lodash from 'lodash'
import { DraggableCore } from 'react-draggable'
import Palette from 'haiku-ui-common/lib/Palette'
import TimelineRangeScrollbarPlayheadIndicator from './TimelineRangeScrollbarPlayheadIndicator'

const THROTTLE_TIME = 17 // ms
const KNOB_RADIUS = 5

export default class TimelineRangeScrollbar extends React.Component {
  constructor (props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)

    this.onStartDragContainer = this.onStartDragContainer.bind(this)
    this.onStopDragContainer = this.onStopDragContainer.bind(this)
    this.onDragContainer = lodash.throttle(this.onDragContainer.bind(this), THROTTLE_TIME)

    this.onStartDragLeft = this.onStartDragLeft.bind(this)
    this.onStopDragLeft = this.onStopDragLeft.bind(this)
    this.onDragLeft = lodash.throttle(this.onDragLeft.bind(this), THROTTLE_TIME)

    this.onStartDragRight = this.onStartDragRight.bind(this)
    this.onStopDragRight = this.onStopDragRight.bind(this)
    this.onDragRight = lodash.throttle(this.onDragRight.bind(this), THROTTLE_TIME)
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
    if (what === 'timeline-frame-range') {
      this.forceUpdate()
    }
  }

  onStartDragContainer (dragEvent, dragData) {
    this.props.timeline.scrollbarBodyStart(dragData)
    this.props.reactParent.setState({
      avoidTimelinePointerEvents: true
    })
  }

  onStopDragContainer (dragEvent, dragData) {
    this.props.timeline.scrollbarBodyStop(dragData)
    this.props.reactParent.setState({
      avoidTimelinePointerEvents: false
    })
  }

  onDragContainer (dragEvent, dragData) {
    // Don't drag on the body if we're already dragging on the ends
    if (!this.props.timeline.getScrollerLeftDragStart() && !this.props.timeline.getScrollerRightDragStart()) {
      this.props.timeline.changeVisibleFrameRange(dragData.x, dragData.x)
    }
  }

  onStartDragLeft (dragEvent, dragData) {
    this.props.timeline.scrollbarLeftStart(dragData)
  }

  onStopDragLeft (dragEvent, dragData) {
    this.props.timeline.scrollbarLeftStop(dragData)
  }

  onDragLeft (dragEvent, dragData) {
    this.props.timeline.changeVisibleFrameRange(dragData.x + this.frameInfo.scA, 0)
  }

  onStartDragRight (dragEvent, dragData) {
    this.props.timeline.scrollbarRightStart(dragData)
  }

  onStopDragRight (dragEvent, dragData) {
    this.props.timeline.scrollbarRightStop(dragData)
  }

  onDragRight (dragEvent, dragData) {
    this.props.timeline.changeVisibleFrameRange(0, dragData.x + this.frameInfo.scA)
  }

  render () {
    this.frameInfo = this.props.timeline.getFrameInfo()

    return (
      <div
        id='timeline-range-scrollbar-container'
        style={{
          width: this.frameInfo.scL,
          height: KNOB_RADIUS * 2,
          position: 'relative',
          backgroundColor: Palette.DARKER_GRAY,
          borderTop: '1px solid ' + Palette.FATHER_COAL,
          borderBottom: '1px solid ' + Palette.FATHER_COAL
        }}>
        <DraggableCore
          axis='x'
          onStart={this.onStartDragContainer}
          onStop={this.onStopDragContainer}
          onDrag={this.onDragContainer}>
          <div
            id='timeline-range-scrollbar'
            style={{
              position: 'absolute',
              backgroundColor: Palette.LIGHTEST_GRAY,
              height: KNOB_RADIUS * 2,
              left: this.frameInfo.scA,
              width: this.frameInfo.scB - this.frameInfo.scA,
              borderRadius: KNOB_RADIUS,
              cursor: 'move'
            }}>
            <DraggableCore
              axis='x'
              onStart={this.onStartDragLeft}
              onStop={this.onStopDragLeft}
              onDrag={this.onDragLeft}>
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
              onStart={this.onStartDragRight}
              onStop={this.onStopDragRight}
              onDrag={this.onDragRight}>
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
        <TimelineRangeScrollbarPlayheadIndicator
          timeline={this.props.timeline} />
      </div>
    )
  }
}

TimelineRangeScrollbar.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  reactParent: React.PropTypes.object.isRequired
}
