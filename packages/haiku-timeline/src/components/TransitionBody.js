import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import Palette from 'haiku-ui-common/lib/Palette'
import TimelineDraggable from './TimelineDraggable'
import KeyframeSVG from 'haiku-ui-common/lib/react/icons/KeyframeSVG'
import Globals from 'haiku-ui-common/lib/Globals'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'
import Keyframe from 'haiku-serialization/src/bll/Keyframe'

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
  LinearSVG
} from 'haiku-ui-common/lib/react/icons/CurveSVGS'

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
  LinearSVG
}

const THROTTLE_TIME = 17 // ms

export default class TransitionBody extends React.Component {
  constructor (props) {
    super(props)
    Keyframe.on('update', (keyframe, what) => {
      if (keyframe === this.props.keyframe && this.mounted) this.handleUpdate(what)
    })
  }

  componentWillUnmount () {
    this.mounted = false
  }

  componentDidMount () {
    this.mounted = true
  }

  handleUpdate (what) {
    if (!this.mounted) return null
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
      this.forceUpdate()
    }
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    const uniqueKey = this.props.keyframe.getUniqueKey()
    const pxOffsetLeft = this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)
    const pxOffsetRight = this.props.keyframe.getPixelOffsetRight(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)

    const curve = this.props.keyframe.getCurveCapitalized()

    const breakingBounds = curve.includes('Back') || curve.includes('Bounce') || curve.includes('Elastic')
    const CurveSVG = CURVESVGS[curve + 'SVG']

    return (
      <TimelineDraggable
        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        id={`transition-body-${this.props.keyframe.getUniqueKeyWithoutTimeIncluded()}`}
        axis='x'
        onMouseDown={(mouseEvent) => {
          // This logic is here to allow transitions to be dragged without having
          // to select them first.
          if (!this.props.preventDragging) {
            this.props.keyframe.handleMouseDown(mouseEvent, {...Globals}, {isViaTransitionBodyView: true})
          }
        }}
        onStart={(dragEvent, dragData) => {
          if (!this.props.preventDragging) {
            this.props.component.dragStartSelectedKeyframes(dragData)
          }
        }}
        onStop={(dragEvent, dragData, wasDrag, lastMouseButtonPressed) => {
          if (!this.props.preventDragging) {
            this.props.keyframe.handleDragStop(dragData, {wasDrag, lastMouseButtonPressed, ...Globals}, {isViaKeyframeDraggerView: true})
          }
          this.props.component.dragStopSelectedKeyframes(dragData)
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          if (!this.props.preventDragging) {
            this.props.component.dragSelectedKeyframes(frameInfo.pxpf, frameInfo.mspf, dragData, { alias: 'timeline' })
          }
        }, THROTTLE_TIME)}>
        <span
          className='pill-container'
          key={uniqueKey}
          ref={(domElement) => {
            this[uniqueKey] = domElement
          }}
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation()
            this.props.keyframe.handleContextMenu({...Globals}, {isViaTransitionBodyView: true})
            PopoverMenu.emit('show', {
              type: 'keyframe-transition',
              event: ctxMenuEvent.nativeEvent,
              model: this.props.keyframe,
              offset: pxOffsetLeft,
              curve: this.props.keyframe.getCurve()
            })
          }}
          onMouseUp={(mouseEvent) => {
            mouseEvent.stopPropagation()
            this.props.keyframe.handleMouseUp(mouseEvent, {...Globals}, {isViaTransitionBodyView: true})
          }}
          onMouseEnter={(reactEvent) => {
            if (this[uniqueKey]) this[uniqueKey].style.color = Palette.GRAY
          }}
          onMouseLeave={(reactEvent) => {
            if (this[uniqueKey]) this[uniqueKey].style.color = 'transparent'
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
              : 'move'
          }}>
          <span
            className='pill'
            style={{
              position: 'absolute',
              zIndex: 1001,
              width: '100%',
              height: '100%',
              top: 0,
              borderRadius: 5,
              left: 0,
              backgroundColor: Color(Palette.SUNSTONE).fade(0.98)
            }} />
          <span
            style={{
              position: 'absolute',
              left: -5,
              width: 9,
              height: 24,
              top: -4,
              transform: 'scale(1.7)',
              zIndex: 1002
            }}>
            <span
              className='keyframe-diamond'
              style={{
                position: 'absolute',
                top: 5,
                left: 1,
                cursor: (this.props.keyframe.isWithinCollapsedRow()) ? 'pointer' : 'move'
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
            overflow: breakingBounds ? 'visible' : 'hidden'
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
              zIndex: 1002
            }}>
            <span
              className='keyframe-diamond'
              style={{
                position: 'absolute',
                top: 5,
                left: 1,
                cursor: (this.props.keyframe.isWithinCollapsedRow())
                  ? 'pointer'
                  : 'move'
              }}>
              <KeyframeSVG color={Palette[this.props.keyframe.getRightKeyframeColorState()]} />
            </span>
          </span>
        </span>
      </TimelineDraggable>
    )
  }
}

TransitionBody.propTypes = {
  keyframe: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
