import React from 'react'
import lodash from 'lodash'
import TimelineDraggable from './TimelineDraggable'
import Globals from './Globals'

const THROTTLE_TIME = 17 // ms

export default class InvisibleKeyframeDragger extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.keyframe.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.keyframe.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (
      what === 'keyframe-activated' ||
      what === 'keyframe-deactivated' ||
      what === 'keyframe-selected' ||
      what === 'keyframe-deselected' ||
      what === 'keyframe-ms-set' ||
      what === 'keyframe-neighbor-move'
    ) {
      this.forceUpdate()
    }
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()
    const pxOffsetLeft = this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)

    return (
      <TimelineDraggable
        id={`keyframe-dragger-${this.props.keyframe.getUniqueKeyWithoutTimeIncluded()}`}
        axis='x'
        onMouseDown={() => {
          if(this.props.timeline.getSelectedKeyframes().length <= 1 && !Globals.isShiftKeyDown) {
            this.props.keyframe.select(
              {skipDeselect: false, directlySelected: true}
            )
          }
        }}
        onStart={(dragEvent, dragData) => {
          this.props.component.dragStartSelectedKeyframes(dragData)
        }}
        onStop={(dragEvent, dragData, wasDrag, lastMouseButtonPressed) => {
          const hasMultipleSelectedKeyframes =
            this.props.timeline.hasMultipleSelectedKeyframes()

          const skipDeselect =
            Globals.isShiftKeyDown ||
            ((Globals.isControlKeyDown || lastMouseButtonPressed === 3) &&
              hasMultipleSelectedKeyframes) ||
            (wasDrag && hasMultipleSelectedKeyframes)

          this.props.keyframe.toggleSelect(
            {skipDeselect, directlySelected: true},
            Globals.isShiftKeyDown
          )
          this.props.component.dragStopSelectedKeyframes(dragData)
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          this.props.component.dragSelectedKeyframes(frameInfo.pxpf, frameInfo.mspf, dragData, { alias: 'timeline' })
        }, THROTTLE_TIME)}>
        <span
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation()

            this.props.ctxmenu.show({
              type: 'keyframe',
              event: ctxMenuEvent.nativeEvent,
              model: this.props.keyframe,
              offset: pxOffsetLeft
            })
          }}
          style={{
            display: 'inline-block',
            position: 'absolute',
            // For debugging:
            // backgroundColor: 'red',
            // borderRight: '1px solid white',
            // opacity: '0.2',
            top: 1,
            left: this.props.offset + this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf),
            width: 10,
            height: 24,
            zIndex: 1003,
            cursor: 'col-resize'
          }} />
      </TimelineDraggable>
    )
  }
}

InvisibleKeyframeDragger.propTypes = {
  offset: React.PropTypes.number.isRequired,
  keyframe: React.PropTypes.object.isRequired,
  ctxmenu: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  $update: React.PropTypes.object.isRequired
}
