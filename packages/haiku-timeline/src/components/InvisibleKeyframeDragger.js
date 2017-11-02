import React from 'react'
import lodash from 'lodash'
import { DraggableCore } from 'react-draggable'

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
      <DraggableCore
        id={`keyframe-dragger-${this.props.keyframe.getUniqueKeyWithoutTimeIncluded()}`}
        axis='x'
        onStart={(dragEvent, dragData) => {
          this.props.component.dragStartSelectedKeyframes(dragData)
        }}
        onStop={(dragEvent, dragData) => {
          this.props.component.dragStopSelectedKeyframes(dragData)
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          this.props.component.dragSelectedKeyframes(frameInfo.pxpf, frameInfo.mspf, dragData, { alias: 'timeline' })
        }, THROTTLE_TIME)}
        onMouseDown={(mouseEvent) => {
          this.props.keyframe.select(mouseEvent)
        }}>
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
      </DraggableCore>
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
