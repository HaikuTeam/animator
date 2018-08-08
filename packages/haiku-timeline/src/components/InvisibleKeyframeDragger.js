import * as React from 'react';
import * as lodash from 'lodash';
import TimelineDraggable from './TimelineDraggable';
import Globals from 'haiku-ui-common/lib/Globals';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

const THROTTLE_TIME = 17; // ms

export default class InvisibleKeyframeDragger extends React.Component {
  constructor (props) {
    super(props);
    this.handleProps(props);
  }

  componentWillReceiveProps (nextProps) {
    this.handleProps(nextProps);
  }

  handleProps ({keyframe}) {
    if (
      keyframe !== this.props.keyframe ||
      !this.teardownKeyframeUpdateReceiver
    ) {
      if (this.teardownKeyframeUpdateReceiver) {
        this.teardownKeyframeUpdateReceiver();
      }
      this.teardownKeyframeUpdateReceiver = keyframe.registerUpdateReceiver(this.props.id, (what) => {
        this.handleUpdate(what);
      });
    }
  }

  componentDidMount () {
    this.mounted = true;
  }

  componentWillUnmount () {
    this.mounted = false;
    this.teardownKeyframeUpdateReceiver();
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }
    if (
      what === 'keyframe-activated' ||
      what === 'keyframe-deactivated' ||
      what === 'keyframe-selected' ||
      what === 'keyframe-deselected' ||
      what === 'keyframe-ms-set' ||
      what === 'keyframe-neighbor-move' ||
      what === 'keyframe-body-selected' ||
      what === 'keyframe-body-unselected'
    ) {
      this.forceUpdate();
    }
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo();
    const pxOffsetLeft = experimentIsEnabled(Experiment.NativeTimelineScroll)
      ? this.props.keyframe.getPixelOffsetLeft(0, frameInfo.pxpf, frameInfo.mspf)
      : this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf);

    return (
      <TimelineDraggable
        axis="x"
        onMouseDown={(mouseEvent) => {
          if (this.props.preventDragging) {
            return;
          }
          this.props.keyframe.handleMouseDown(mouseEvent, {...Globals}, {isViaKeyframeDraggerView: true});
        }}
        onStart={(dragEvent, dragData) => {
          if (this.props.preventDragging) {
            return;
          }
          this.props.component.dragStartSelectedKeyframes(dragData, this.props.keyframe);
        }}
        onStop={(dragEvent, dragData, wasDrag, lastMouseButtonPressed) => {
          if (this.props.preventDragging) {
            return;
          }
          this.props.keyframe.handleDragStop(dragData, {wasDrag, lastMouseButtonPressed, ...Globals}, {isViaKeyframeDraggerView: true});
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          if (this.props.preventDragging) {
            return;
          }
          this.props.component.dragSelectedKeyframes(frameInfo.pxpf, frameInfo.mspf, dragData, {alias: 'timeline'}, this.props.keyframe);
        }, THROTTLE_TIME)}>
        <span
          id={`keyframe-dragger-${this.props.keyframe.getUniqueKey()}`}
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation();
            this.props.keyframe.handleContextMenu({...Globals}, {isViaKeyframeDraggerView: true});
            PopoverMenu.emit('show', {
              type: 'keyframe',
              event: ctxMenuEvent.nativeEvent,
              model: this.props.keyframe,
              offset: pxOffsetLeft,
            });
          }}
          onMouseUp={(mouseEvent) => {
            mouseEvent.stopPropagation();
            if (this.props.preventDragging) {
              return;
            }
            this.props.keyframe.handleMouseUp(mouseEvent, {...Globals}, {isViaKeyframeDraggerView: true});
          }}
          style={{
            display: 'inline-block',
            position: 'absolute',
            // For debugging:
            // backgroundColor: 'red',
            // borderRight: '1px solid white',
            // opacity: '0.2',
            top: 1,
            left: this.props.offset + pxOffsetLeft,
            width: 10,
            height: 24,
            zIndex: 1003,
            cursor: this.props.preventDragging ? 'not-allowed' : 'col-resize',
          }} />
      </TimelineDraggable>
    );
  }
}

InvisibleKeyframeDragger.propTypes = {
  id: React.PropTypes.string.isRequired,
  offset: React.PropTypes.number.isRequired,
  keyframe: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool,
};
