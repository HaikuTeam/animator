import React from 'react'
import Color from 'color'
import uuid from 'uuid/v1'
import Palette from 'haiku-ui-common/lib/Palette'
import Globals from 'haiku-ui-common/lib/Globals'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'

export default class ConstantBody extends React.Component {
  componentWillMount () {
    this.teardownKeyframeUpdateReceiver = this.props.keyframe.registerUpdateReceiver(uuid(), (what) => {
      this.handleUpdate(what)
    })
  }

  componentDidMount () {
    this.mounted = true
  }

  componentWillUnmount () {
    this.mounted = false
    this.teardownKeyframeUpdateReceiver()
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

    const primaryKey = this.props.keyframe.getPrimaryKey()
    const pxOffsetLeft = this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)
    const pxOffsetRight = this.props.keyframe.getPixelOffsetRight(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)

    return (
      <span
        ref={(domElement) => {
          this[primaryKey] = domElement
        }}
        id={`constant-body-${primaryKey}`}
        className='constant-body'
        onContextMenu={(ctxMenuEvent) => {
          ctxMenuEvent.stopPropagation()
          this.props.keyframe.handleContextMenu({...Globals}, {isViaConstantBodyView: true})
          PopoverMenu.emit('show', {
            type: 'keyframe-segment',
            event: ctxMenuEvent.nativeEvent,
            model: this.props.keyframe,
            offset: pxOffsetLeft
          })
        }}
        onMouseDown={(mouseEvent) => {
          mouseEvent.stopPropagation()
          this.props.keyframe.handleMouseDown(mouseEvent, {...Globals}, {isViaConstantBodyView: true})
        }}
        onMouseUp={(mouseEvent) => {
          mouseEvent.stopPropagation()
          this.props.keyframe.handleMouseUp(mouseEvent, {...Globals}, {isViaConstantBodyView: true})
        }}
        style={{
          position: 'absolute',
          left: pxOffsetLeft + 4,
          width: pxOffsetRight - pxOffsetLeft,
          height: this.props.rowHeight
        }}>
        {(this.props.keyframe.isWithinCollapsedRow())
          ? ''
          : <span style={{
            height: 3,
            top: 12,
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            backgroundColor: (this.props.keyframe.isSelectedBody())
                ? Color(Palette.LIGHTEST_PINK).fade(0.5)
                : Palette.DARKER_GRAY
          }} />
        }
      </span>
    )
  }
}

ConstantBody.propTypes = {
  keyframe: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
