import React from 'react'
import { DraggableCore } from 'react-draggable'
import ScrubberInterior from './ScrubberInterior'

export default class Scrubber extends React.Component {
  constructor (props) {
    super(props)
    this.onStartDrag = this.onStartDrag.bind(this)
    this.onStopDrag = this.onStopDrag.bind(this)
    this.onDrag = this.onDrag.bind(this)
  }

  onStartDrag (dragEvent, dragData) {
    this.props.timeline.setScrubberDragStart(dragData.x)
    this.props.timeline.setFrameBaseline(this.props.timeline.getCurrentFrame())
    this.props.reactParent.setState({
      avoidTimelinePointerEvents: true
    })
  }

  onStopDrag (dragEvent, dragData) {
    this.props.timeline.setScrubberDragStart(null)
    this.props.timeline.setFrameBaseline(this.props.timeline.getCurrentFrame())
    this.props.reactParent.setState({
      avoidTimelinePointerEvents: false
    })
  }

  onDrag (dragEvent, dragData) {
    this.props.timeline.changeScrubberPosition(dragData.x)
  }

  render () {
    return (
      <DraggableCore
        axis='x'
        onStart={this.onStartDrag}
        onStop={this.onStopDrag}
        onDrag={this.onDrag}>
        <div> {/* draggable requires this div wrapper */}
          <ScrubberInterior
            timeline={this.props.timeline}
            isScrubbing={this.props.isScrubbing}
            displayTime={this.props.displayTime} />
        </div>
      </DraggableCore>
    )
  }
}

Scrubber.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  reactParent: React.PropTypes.object.isRequired,
  isScrubbing: React.PropTypes.bool.isRequired
}
