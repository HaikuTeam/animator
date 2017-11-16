import React from 'react'
import Palette from './DefaultPalette'
import KeyframeSVG from './icons/KeyframeSVG'

export default class SoloKeyframe extends React.Component {
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
    const leftPx = this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)
    return (
      <span
        id={`solo-keyframe-${this.props.keyframe.getUniqueKey()}`}
        style={{
          position: 'absolute',
          left: leftPx,
          width: 9,
          height: 24,
          top: -3,
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
            cursor: (this.props.keyframe.isWithinCollapsedRow()) ? 'pointer' : 'move'
          }}>
          <KeyframeSVG color={(this.props.keyframe.isWithinCollapsedRow())
            ? Palette.BLUE
            : (this.props.keyframe.isWithinCollapsedProperty())
                ? Palette.DARK_ROCK
                : (this.props.keyframe.isActive() || this.props.keyframe.isSelected())
                  ? Palette.LIGHTEST_PINK
                  : Palette.ROCK
          } />
        </span>
      </span>
    )
  }
}

SoloKeyframe.propTypes = {
  keyframe: React.PropTypes.object.isRequired,
  $update: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool.isRequired,
}
