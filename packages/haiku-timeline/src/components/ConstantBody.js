import React from 'react'
import Color from 'color'
import Palette from './DefaultPalette'
import Globals from './Globals'

export default class ConstantBody extends React.Component {
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

    const uniqueKey = this.props.keyframe.getUniqueKey()
    const pxOffsetLeft = this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)
    const pxOffsetRight = this.props.keyframe.getPixelOffsetRight(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)

    return (
      <span
        ref={(domElement) => {
          this[uniqueKey] = domElement
        }}
        id={`constant-body-${uniqueKey}`}
        className='constant-body'
        onContextMenu={(ctxMenuEvent) => {
          if (this.props.keyframe.isWithinCollapsedRow()) {
            return false
          }

          ctxMenuEvent.stopPropagation()

          this.props.ctxmenu.show({
            type: 'keyframe-segment',
            event: ctxMenuEvent.nativeEvent,
            model: this.props.keyframe,
            offset: pxOffsetLeft
          })
        }}
        onMouseDown={(mouseEvent) => {
          mouseEvent.stopPropagation()
          const skipDeselect = (
            Globals.isShiftKeyDown ||
            (
              (Globals.isControlKeyDown || mouseEvent.nativeEvent.which === 3) &&
              this.props.timeline.hasMultipleSelectedKeyframes()
            )
          )
          this.props.keyframe.select({ skipDeselect, selectConstBody: true })
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
  ctxmenu: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  $update: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
