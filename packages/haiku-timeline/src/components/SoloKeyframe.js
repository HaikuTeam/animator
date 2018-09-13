import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import KeyframeSVG from 'haiku-ui-common/lib/react/icons/KeyframeSVG';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

export default class SoloKeyframe extends React.Component {
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

  get domRef () {
    return this[this.props.keyframe.getUniqueKey()];
  }

  set domRef (domRef) {
    this[this.props.keyframe.getUniqueKey()] = domRef;
  }

  componentDidMount () {
    this.mounted = true;
  }

  componentWillUnmount () {
    this.mounted = false;
    this.teardownKeyframeUpdateReceiver();
    this.props.keyframe.clearViewPosition();
  }

  componentDidUpdate () {
    const viewPosition = this.props.keyframe.getViewPosition();
    if (!viewPosition || !viewPosition.left) {
      this.storeViewPosition(this.domRef);
    }
  }

  handleUpdate (what, ...args) {
    if (!this.mounted) {
      return null;
    }

    if (what === 'keyframe-ms-set' || what === 'keyframe-neighbor-move') {
      this.forceUpdate(() => {
        this.storeViewPosition(this.domRef);
      });
    }

    if (
      what === 'keyframe-activated' ||
      what === 'keyframe-deactivated' ||
      what === 'keyframe-selected' ||
      what === 'keyframe-deselected'
    ) {
      this.forceUpdate();
    }
  }

  storeViewPosition = (domElement) => {
    this.domRef = domElement;
    if (domElement && experimentIsEnabled(Experiment.TimelineMarqueeSelection)) {
      requestAnimationFrame(() => {
        this.props.keyframe.storeViewPosition({
          rect: domElement.getBoundingClientRect(),
          offset: this.props.timeline.getScrollLeft(),
        });
      });
    }
  };

  render () {
    const frameInfo = this.props.timeline.getFrameInfo();
    const leftPx = this.props.keyframe.getPixelOffsetLeft(0, frameInfo.pxpf, frameInfo.mspf);

    return (
      <span
        ref={this.storeViewPosition}
        id={`solo-keyframe-${this.props.keyframe.getUniqueKey()}`}
        style={experimentIsEnabled(Experiment.TimelineMarqueeSelection) ? {
          position: 'absolute',
          left: leftPx + 3,
          top: 10,
          transform: 'scale(1.7)',
          transition: 'opacity 130ms linear',
          zIndex: 1002,
        } : {
          position: 'absolute',
          left: leftPx,
          outline: '1px solid orange',
          // width: 9,
          height: 24,
          top: -3,
          transform: 'scale(1.7)',
          transition: 'opacity 130ms linear',
          zIndex: 1002,
        }}>
        <span
          className="keyframe-diamond"
          style={experimentIsEnabled(Experiment.TimelineMarqueeSelection) ? {
            cursor: (this.props.keyframe.isWithinCollapsedRow()) ? 'pointer' : 'move',
            display: 'flex',
          } : {
            position: 'absolute',
            top: 5,
            // left: 1,
            cursor: (this.props.keyframe.isWithinCollapsedRow()) ? 'pointer' : 'move',
          }}>
          <KeyframeSVG color={Palette[this.props.keyframe.getLeftKeyframeColorState()]} />
        </span>
      </span>
    );
  }
}

SoloKeyframe.propTypes = {
  id: React.PropTypes.string.isRequired,
  keyframe: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool.isRequired,
};
