import * as React from 'react';
import * as Color from 'color';
import * as lodash from 'lodash';
import zIndex from './styles/zIndex';
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

const STYLE = {
  keyframePole: {
    transform: 'scale(1.7) translateY(-1.5px)',
  },
};

export default class TransitionBody extends React.Component {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.isDragging = false;
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
      const nextKeyframe = keyframe.next();
      if (nextKeyframe) {
        this.teardownNextKeyframeUpdateReceiver = nextKeyframe.registerUpdateReceiver(this.props.id, (what) => {
          this.handleUpdate(what);
        });
      } else {
        this.teardownNextKeyframeUpdateReceiver = () => {};
      }
    }
  }

  componentDidMount () {
    this.mounted = true;
  }

  componentWillUnmount () {
    this.mounted = false;
    this.teardownKeyframeUpdateReceiver();
    this.teardownNextKeyframeUpdateReceiver();
    this.props.keyframe.clearViewPosition();
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

    const uniqueKey = this.props.keyframe.getUniqueKey();
    const pxOffsetLeft = this.props.keyframe.getPixelOffsetLeft(0, frameInfo.pxpf, frameInfo.mspf);
    const pxOffsetRight = this.props.keyframe.getPixelOffsetRight(0, frameInfo.pxpf, frameInfo.mspf);
    const curve = this.props.keyframe.getCurveCapitalized();
    const breakingBounds = curve.includes('Back') || curve.includes('Bounce') || curve.includes('Elastic');
    // tslint:disable-next-line:variable-name
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
            this.isDragging = true;
            this.props.component.dragStartSelectedKeyframes(dragData);
          }
        }}
        onStop={(dragEvent, dragData, wasDrag, lastMouseButtonPressed) => {
          if (!this.props.preventDragging) {
            this.isDragging = false;
            this.props.keyframe.handleDragStop(dragData, {wasDrag, lastMouseButtonPressed, ...Globals}, {isViaKeyframeDraggerView: true});
          }
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          if (!this.props.preventDragging && this.isDragging) {
            this.props.component.dragSelectedKeyframes(frameInfo.pxpf, frameInfo.mspf, dragData, {alias: 'timeline'});
          }
        }, THROTTLE_TIME)}>
        <span
          className="pill-container"
          key={uniqueKey}
          ref={this.storeViewPosition}
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
            width: pxOffsetRight - pxOffsetLeft - 2,
            top: 1,
            height: 24,
            WebkitUserSelect: 'none',
            transform: 'translateX(3px)',
            zIndex: zIndex.segmentsBox.pill,
            cursor: (this.props.keyframe.isWithinCollapsedRow())
              ? 'pointer'
              : 'move',
          }}>
          <span
            className={`pill ${this.props.keyframe.isWithinCollapsedRow() ? '' : 'js-avoid-marquee-init'}`}
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
              <KeyframeSVG style={STYLE.keyframePole} color={Palette[this.props.keyframe.getLeftKeyframeColorState()]} />
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
              <KeyframeSVG style={STYLE.keyframePole} color={Palette[this.props.keyframe.getRightKeyframeColorState()]} />
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
