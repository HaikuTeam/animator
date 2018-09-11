import * as React from 'react';
import * as lodash from 'lodash';
import {DraggableCore} from 'react-draggable';
import Palette from 'haiku-ui-common/lib/Palette';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import TimelineRangeScrollbarPlayheadIndicator from './TimelineRangeScrollbarPlayheadIndicator';

const THROTTLE_TIME = 17; // ms
const KNOB_DIAMETER = 10;

export default class TimelineRangeScrollbar extends React.Component {
  constructor (props) {
    super(props);

    this.handleUpdate = this.handleUpdate.bind(this);

    this.onStartDragContainer = this.onStartDragContainer.bind(this);
    this.onStopDragContainer = this.onStopDragContainer.bind(this);
    this.onDragContainer = this.onDragContainer.bind(this);
    this.onStartDragLeft = this.onStartDragLeft.bind(this);
    this.onStopDragLeft = this.onStopDragLeft.bind(this);
    this.onDragLeft = lodash.throttle(this.onDragLeft.bind(this), THROTTLE_TIME);

    this.onStartDragRight = this.onStartDragRight.bind(this);
    this.onStopDragRight = this.onStopDragRight.bind(this);
    this.onDragRight = lodash.throttle(this.onDragRight.bind(this), THROTTLE_TIME);
  }

  componentWillUnmount () {
    this.mounted = false;
    this.props.timeline.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.timeline.on('update', this.handleUpdate);
  }

  componentWillReceiveProps (nextProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate);
      nextProps.timeline.on('update', this.handleUpdate);
    }
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }
    if (
      what === 'timeline-frame-range' ||
      what === 'timeline-scroll' ||
      what === 'timeline-scroll-from-scrollbar'
    ) {
      this.forceUpdate();
    }
  }

  onStartDragContainer (dragEvent, dragData) {
    this.props.timeline.scrollbarBodyStart(dragData);
    this.props.disableTimelinePointerEvents();
  }

  onStopDragContainer (dragEvent, dragData) {
    this.props.timeline.scrollbarBodyStop(dragData);
    this.props.enableTimelinePointerEvents();
  }

  onDragContainer (dragEvent, dragData) {
    const {timeline} = this.props;
    // Don't drag on the body if we're already dragging on the ends
    if (!timeline.getScrollerLeftDragStart() && !timeline.getScrollerRightDragStart()) {
      // The extra offset makes timeline.getScrollLeft to add extra frames at the end of the timeline
      const extraOffset = dragData.deltaX === 0 && timeline.getScrollLeft() === timeline.calculateMaxScrollValue() ? 1 : 0;
      const scrollDelta = dragData.deltaX * this.frameInfo.scRatio + extraOffset;
      timeline.setScrollLeftFromScrollbar(scrollDelta + timeline.getScrollLeft());
    }
  }

  onStartDragLeft (dragEvent, dragData) {
    this.props.timeline.scrollbarLeftStart(dragData);
  }

  onStopDragLeft (dragEvent, dragData) {
    this.props.timeline.scrollbarLeftStop(dragData);
  }

  calculateScrollbarFromMouse ({mousePosition, considerBarWidth}) {
    const timeline = this.props.timeline;
    const maybeBarWidth = considerBarWidth ? this.frameInfo.scB - this.frameInfo.scA : 0;

    return {
      frame: timeline.mapXCoordToFrame(mousePosition),
      offset: timeline.mapXCoordToFrame(timeline.getScrollLeft() / this.frameInfo.scRatio + maybeBarWidth),
    };
  }

  onDragLeft (dragEvent, dragData) {
    const {frame, offset} = this.calculateScrollbarFromMouse({mousePosition: dragEvent.clientX, considerBarWidth: true});
    this.props.timeline.zoomByLeftAndRightEndpoints(frame, offset, true);
  }

  onStartDragRight (dragEvent, dragData) {
    this.props.timeline.scrollbarRightStart(dragData);
  }

  onStopDragRight (dragEvent, dragData) {
    this.props.timeline.scrollbarRightStop(dragData);
  }

  onDragRight (dragEvent, dragData) {
    const {frame, offset} = this.calculateScrollbarFromMouse({mousePosition: dragEvent.clientX, considerBarWidth: false});
    this.props.timeline.zoomByLeftAndRightEndpoints(offset, frame, true);
  }

  render () {
    this.frameInfo = this.props.timeline.getFrameInfo();
    let leftPosition;
    const {timeline} = this.props;
    const isNearEnd = timeline.calculateMaxScrollValue() - timeline.getScrollLeft() < 60;
    leftPosition = (isNearEnd ? timeline.calculateMaxScrollValue() : timeline.getScrollLeft()) / this.frameInfo.scRatio;

    return (
      <div
        id="timeline-range-scrollbar-container"
        style={{
          width: this.frameInfo.scL,
          height: KNOB_DIAMETER,
          position: 'relative',
          backgroundColor: Palette.DARKER_GRAY,
          borderTop: '1px solid ' + Palette.FATHER_COAL,
          borderBottom: '1px solid ' + Palette.FATHER_COAL,
        }}>
        <DraggableCore
          axis="x"
          onStart={this.onStartDragContainer}
          onStop={this.onStopDragContainer}
          onDrag={this.onDragContainer}>
          <div
            id="timeline-range-scrollbar"
            style={{
              position: 'absolute',
              backgroundColor: Palette.LIGHTEST_GRAY,
              height: KNOB_DIAMETER,
              left: leftPosition,
              width: this.frameInfo.scB - this.frameInfo.scA - KNOB_DIAMETER,
              minWidth: 35,
              borderRadius: KNOB_DIAMETER / 2,
              cursor: 'move',
            }}>
            <DraggableCore
              axis="x"
              onStart={this.onStartDragLeft}
              onStop={this.onStopDragLeft}
              onDrag={this.onDragLeft}>
              <div
                id="timeline-range-knob-left"
                style={{
                  width: KNOB_DIAMETER,
                  height: KNOB_DIAMETER,
                  position: 'absolute',
                  cursor: 'ew-resize',
                  left: 0,
                  borderRadius: '50%',
                  backgroundColor: Palette.SUNSTONE,
                }} />
            </DraggableCore>
            <DraggableCore
              axis="x"
              onStart={this.onStartDragRight}
              onStop={this.onStopDragRight}
              onDrag={this.onDragRight}>
              <div
                id="timeline-range-knob-right"
                style={{
                  width: KNOB_DIAMETER,
                  height: KNOB_DIAMETER,
                  position: 'absolute',
                  cursor: 'ew-resize',
                  right: 0,
                  borderRadius: '50%',
                  backgroundColor: Palette.SUNSTONE,
                }} />
            </DraggableCore>
          </div>
        </DraggableCore>
        <TimelineRangeScrollbarPlayheadIndicator
          timeline={this.props.timeline} />
      </div>
    );
  }
}

TimelineRangeScrollbar.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  disableTimelinePointerEvents: React.PropTypes.func.isRequired,
  enableTimelinePointerEvents: React.PropTypes.func.isRequired,
};
