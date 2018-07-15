import * as React from 'react';
import * as Color from 'color';
import * as lodash from 'lodash';
import Palette from 'haiku-ui-common/lib/Palette';
import TimelineDraggable from './TimelineDraggable';
import KeyframeSVG from 'haiku-ui-common/lib/react/icons/KeyframeSVG';
import Globals from 'haiku-ui-common/lib/Globals';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

import {
  EaseInBackSVG,
  EaseInOutBackSVG,
  EaseOutBackSVG,
  EaseInBounceSVG,
  EaseInOutBounceSVG,
  EaseOutBounceSVG,
  EaseInElasticSVG,
  EaseInOutElasticSVG,
  EaseOutElasticSVG,
  EaseInExpoSVG,
  EaseInOutExpoSVG,
  EaseOutExpoSVG,
  EaseInCircSVG,
  EaseInOutCircSVG,
  EaseOutCircSVG,
  EaseInCubicSVG,
  EaseInOutCubicSVG,
  EaseOutCubicSVG,
  EaseInQuadSVG,
  EaseInOutQuadSVG,
  EaseOutQuadSVG,
  EaseInQuartSVG,
  EaseInOutQuartSVG,
  EaseOutQuartSVG,
  EaseInQuintSVG,
  EaseInOutQuintSVG,
  EaseOutQuintSVG,
  EaseInSineSVG,
  EaseInOutSineSVG,
  EaseOutSineSVG,
  LinearSVG,
} from 'haiku-ui-common/lib/react/icons/CurveSVGS';

const CURVESVGS = {
  EaseInBackSVG,
  EaseInBounceSVG,
  EaseInCircSVG,
  EaseInCubicSVG,
  EaseInElasticSVG,
  EaseInExpoSVG,
  EaseInQuadSVG,
  EaseInQuartSVG,
  EaseInQuintSVG,
  EaseInSineSVG,
  EaseInOutBackSVG,
  EaseInOutBounceSVG,
  EaseInOutCircSVG,
  EaseInOutCubicSVG,
  EaseInOutElasticSVG,
  EaseInOutExpoSVG,
  EaseInOutQuadSVG,
  EaseInOutQuartSVG,
  EaseInOutQuintSVG,
  EaseInOutSineSVG,
  EaseOutBackSVG,
  EaseOutBounceSVG,
  EaseOutCircSVG,
  EaseOutCubicSVG,
  EaseOutElasticSVG,
  EaseOutExpoSVG,
  EaseOutQuadSVG,
  EaseOutQuartSVG,
  EaseOutQuintSVG,
  EaseOutSineSVG,
  LinearSVG,
};

const THROTTLE_TIME = 17; // ms

export default class TransitionBody extends React.Component {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
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
      this.teardownNextKeyframeUpdateReceiver = keyframe.next().registerUpdateReceiver(this.props.id, (what) => {
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
    this.teardownNextKeyframeUpdateReceiver();
  }

  handleUpdate (what, ...args) {
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

    const uniqueKey = this.props.keyframe.getUniqueKey();
    const pxOffsetLeft = experimentIsEnabled(Experiment.NativeTimelineScroll)
      ? this.props.keyframe.getPixelOffsetLeft(0, frameInfo.pxpf, frameInfo.mspf)
      : this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf);
    const pxOffsetRight = experimentIsEnabled(Experiment.NativeTimelineScroll)
      ? this.props.keyframe.getPixelOffsetRight(0, frameInfo.pxpf, frameInfo.mspf)
      : this.props.keyframe.getPixelOffsetRight(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf);

    const curve = this.props.keyframe.getCurveCapitalized();

    const breakingBounds = curve.includes('Back') || curve.includes('Bounce') || curve.includes('Elastic');
    const CurveSVG = CURVESVGS[curve + 'SVG'];

    return (
      <TimelineDraggable
        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        id={`transition-body-${this.props.keyframe.getUniqueKey()}`}
        axis="x"
        onMouseDown={(mouseEvent) => {
          // This logic is here to allow transitions to be dragged without having
          // to select them first.
          if (!this.props.preventDragging) {
            this.props.keyframe.handleMouseDown(mouseEvent, {...Globals}, {isViaTransitionBodyView: true});
          }
        }}
        onStart={(dragEvent, dragData) => {
          if (!this.props.preventDragging) {
            this.props.component.dragStartSelectedKeyframes(dragData);
          }
        }}
        onStop={(dragEvent, dragData, wasDrag, lastMouseButtonPressed) => {
          if (!this.props.preventDragging) {
            this.props.keyframe.handleDragStop(dragData, {wasDrag, lastMouseButtonPressed, ...Globals}, {isViaKeyframeDraggerView: true});
          }
          this.props.component.dragStopSelectedKeyframes(dragData);
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          if (!this.props.preventDragging) {
            this.props.component.dragSelectedKeyframes(frameInfo.pxpf, frameInfo.mspf, dragData, {alias: 'timeline'});
          }
        }, THROTTLE_TIME)}>
        <span
          className="pill-container"
          key={uniqueKey}
          ref={(domElement) => {
            this[uniqueKey] = domElement;
            if (experimentIsEnabled(Experiment.TimelineMarqueeSelection) && domElement) {
              this.props.keyframe.storeViewPosition(domElement.getBoundingClientRect());
            }
          }}
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation();
            this.props.keyframe.handleContextMenu({...Globals}, {isViaTransitionBodyView: true});
            PopoverMenu.emit('show', {
              type: 'keyframe-transition',
              event: ctxMenuEvent.nativeEvent,
              model: this.props.keyframe,
              offset: pxOffsetLeft,
              curve: this.props.keyframe.getCurve(),
            });
          }}
          onMouseUp={(mouseEvent) => {
            mouseEvent.stopPropagation();
            this.props.keyframe.handleMouseUp(mouseEvent, {...Globals}, {isViaTransitionBodyView: true});
          }}
          onMouseEnter={(reactEvent) => {
            if (this[uniqueKey]) {
              this[uniqueKey].style.color = Palette.GRAY;
            }
          }}
          onMouseLeave={(reactEvent) => {
            if (this[uniqueKey]) {
              this[uniqueKey].style.color = 'transparent';
            }
          }}
          style={{
            position: 'absolute',
            left: pxOffsetLeft + 4,
            width: pxOffsetRight - pxOffsetLeft,
            top: 1,
            height: 24,
            WebkitUserSelect: 'none',
            cursor: (this.props.keyframe.isWithinCollapsedRow())
              ? 'pointer'
              : 'move',
          }}>
          <span
            className="pill"
            style={{
              position: 'absolute',
              zIndex: 1001,
              width: '100%',
              height: '100%',
              top: 0,
              borderRadius: 5,
              left: 0,
              backgroundColor: Color(Palette.SUNSTONE).fade(0.98),
            }} />
          <span
            style={{
              position: 'absolute',
              left: -5,
              width: 9,
              height: 24,
              top: -4,
              transform: 'scale(1.7)',
              zIndex: 1002,
            }}>
            <span
              className="keyframe-diamond"
              style={{
                position: 'absolute',
                top: 5,
                left: 1,
                cursor: (this.props.keyframe.isWithinCollapsedRow()) ? 'pointer' : 'move',
              }}>
              <KeyframeSVG color={Palette[this.props.keyframe.getLeftKeyframeColorState()]} />
            </span>
          </span>
          <span style={{
            position: 'absolute',
            zIndex: 1002,
            width: '100%',
            height: '100%',
            borderRadius: 5,
            paddingTop: 6,
            overflow: breakingBounds ? 'visible' : 'hidden',
            pointerEvents: 'none',
          }}>
            <CurveSVG
              id={uniqueKey}
              leftGradFill={Palette[this.props.keyframe.getCurveColorState()]}
              rightGradFill={Palette[this.props.keyframe.getCurveColorState()]}
            />
          </span>
          <span
            style={{
              position: 'absolute',
              right: -5,
              width: 9,
              height: 24,
              top: -4,
              transform: 'scale(1.7)',
              transition: 'opacity 130ms linear',
              zIndex: 1002,
            }}>
            <span
              className="keyframe-diamond"
              style={{
                position: 'absolute',
                top: 5,
                left: 1,
                cursor: (this.props.keyframe.isWithinCollapsedRow())
                  ? 'pointer'
                  : 'move',
              }}>
              <KeyframeSVG color={Palette[this.props.keyframe.getRightKeyframeColorState()]} />
            </span>
          </span>
        </span>
      </TimelineDraggable>
    );
  }
}

TransitionBody.propTypes = {
  id: React.PropTypes.string.isRequired,
  keyframe: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool.isRequired,
};
