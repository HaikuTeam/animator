import React from 'react'
import lodash from 'lodash'
import TimelineDraggable from './TimelineDraggable'
import Globals from 'haiku-ui-common/lib/Globals'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'

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
      what === 'keyframe-neighbor-move' ||
      what === 'keyframe-body-selected' ||
      what === 'keyframe-body-unselected'
    ) {
      this.forceUpdate()
    }
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()
    const pxOffsetLeft = this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)

    return (
      <TimelineDraggable
        axis='x'
        onMouseDown={(mouseEvent) => {
          this.props.keyframe.handleMouseDown(mouseEvent, {...Globals}, {isViaKeyframeDraggerView: true})
        }}
        onStart={(dragEvent, dragData) => {
          this.props.component.dragStartSelectedKeyframes(dragData)
        }}
        onStop={(dragEvent, dragData, wasDrag, lastMouseButtonPressed) => {
          this.props.keyframe.handleDragStop(dragData, {wasDrag, lastMouseButtonPressed, ...Globals}, {isViaKeyframeDraggerView: true})
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          this.props.component.dragSelectedKeyframes(frameInfo.pxpf, frameInfo.mspf, dragData, { alias: 'timeline' })
        }, THROTTLE_TIME)}>
        <span
          id={`keyframe-dragger-${this.props.keyframe.getUniqueKeyWithoutTimeIncluded()}`}
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation()
            this.props.keyframe.handleContextMenu({...Globals}, {isViaKeyframeDraggerView: true})
            PopoverMenu.emit('show', {
              type: 'keyframe',
              event: ctxMenuEvent.nativeEvent,
              model: this.props.keyframe,
              offset: pxOffsetLeft
            })
          }}
          onMouseUp={(mouseEvent) => {
            mouseEvent.stopPropagation()
            this.props.keyframe.handleMouseUp(mouseEvent, {...Globals}, {isViaKeyframeDraggerView: true})
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
  rowHeight: React.PropTypes.number.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired
}
