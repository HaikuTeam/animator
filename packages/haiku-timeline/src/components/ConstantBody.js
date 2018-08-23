import * as React from 'react';
import * as Color from 'color';
import Palette from 'haiku-ui-common/lib/Palette';
import Globals from 'haiku-ui-common/lib/Globals';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

export default class ConstantBody extends React.Component {
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

    if (what === 'keyframe-ms-set' || what === 'keyframe-neighbor-move') {
      this.forceUpdate(() => {
        this.storeViewPosition(this.domRef);
      });
    }

    if (
      what === 'keyframe-activated' ||
      what === 'keyframe-deactivated' ||
      what === 'keyframe-selected' ||
      what === 'keyframe-deselected' ||
      what === 'keyframe-body-selected' ||
      what === 'keyframe-body-unselected'
    ) {
      this.forceUpdate();
    }
  }

  get domRef () {
    return this[this.props.keyframe.getUniqueKey()];
  }

  set domRef (domRef) {
    this[this.props.keyframe.getUniqueKey()] = domRef;
  }

  componentDidUpdate () {
    const viewPosition = this.props.keyframe.getViewPosition();
    if (!viewPosition || !viewPosition.left) {
      this.storeViewPosition(this.domRef);
    }
  }

  storeViewPosition = (domElement) => {
    this.domRef = domElement;

    if (experimentIsEnabled(Experiment.TimelineMarqueeSelection) && domElement) {
      setTimeout(() => {
        this.props.keyframe.storeViewPosition({
          rect: domElement.getBoundingClientRect(),
          offset: this.props.timeline.getScrollLeft(),
        });
      });
    }
  };

  render () {
    const frameInfo = this.props.timeline.getFrameInfo();

    const uniqueKey = this.props.keyframe.getUniqueKey();
    const pxOffsetLeft = experimentIsEnabled(Experiment.NativeTimelineScroll)
      ? this.props.keyframe.getPixelOffsetLeft(0, frameInfo.pxpf, frameInfo.mspf)
      : this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf);
    const pxOffsetRight = experimentIsEnabled(Experiment.NativeTimelineScroll)
      ? this.props.keyframe.getPixelOffsetRight(0, frameInfo.pxpf, frameInfo.mspf)
      : this.props.keyframe.getPixelOffsetRight(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf);

    return (
      <span
        ref={this.storeViewPosition}
        id={`constant-body-${uniqueKey}`}
        className="constant-body js-avoid-marquee-init"
        onContextMenu={(ctxMenuEvent) => {
          ctxMenuEvent.stopPropagation();
          this.props.keyframe.handleContextMenu({...Globals}, {isViaConstantBodyView: true});
          PopoverMenu.emit('show', {
            type: 'keyframe-segment',
            event: ctxMenuEvent.nativeEvent,
            model: this.props.keyframe,
            offset: pxOffsetLeft,
          });
        }}
        onMouseDown={(mouseEvent) => {
          mouseEvent.stopPropagation();
          this.props.keyframe.handleMouseDown(mouseEvent, {...Globals}, {isViaConstantBodyView: true});
        }}
        onMouseUp={(mouseEvent) => {
          mouseEvent.stopPropagation();
          this.props.keyframe.handleMouseUp(mouseEvent, {...Globals}, {isViaConstantBodyView: true});
        }}
        style={experimentIsEnabled(Experiment.TimelineMarqueeSelection) ? {
          position: 'absolute',
          left: pxOffsetLeft + 4,
          width: pxOffsetRight - pxOffsetLeft,
          height: this.props.rowHeight - 10,
          top: 5,
        } : {
          position: 'absolute',
          left: pxOffsetLeft + 4,
          width: pxOffsetRight - pxOffsetLeft,
          height: this.props.rowHeight,
        }}>
        {(this.props.keyframe.isWithinCollapsedRow())
          ? ''
          : <span style={experimentIsEnabled(Experiment.TimelineMarqueeSelection) ? {
            height: 3,
            top: 7,
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            backgroundColor: (this.props.keyframe.isSelectedBody())
                ? Color(Palette.LIGHTEST_PINK).fade(0.5)
                : Palette.DARKER_GRAY,
          } : {
            height: 3,
            top: 12,
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            backgroundColor: (this.props.keyframe.isSelectedBody())
                ? Color(Palette.LIGHTEST_PINK).fade(0.5)
                : Palette.DARKER_GRAY,
          }} />
        }
      </span>
    );
  }
}

ConstantBody.propTypes = {
  id: React.PropTypes.string.isRequired,
  keyframe: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  preventDragging: React.PropTypes.bool.isRequired,
};
