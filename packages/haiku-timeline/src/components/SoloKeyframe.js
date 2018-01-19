import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import KeyframeSVG from 'haiku-ui-common/lib/react/icons/KeyframeSVG'

export default class SoloKeyframe extends React.Component {
  constructor (props) {
    super(props)
    this.teardownKeyframeUpdateReceiver = this.props.keyframe.registerUpdateReceiver('soloKeyframe', (what) => {
      this.handleUpdate(what)
    })
  }

  componentWillUnmount () {
    this.mounted = false
    this.teardownKeyframeUpdateReceiver()
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
          <KeyframeSVG color={Palette[this.props.keyframe.getLeftKeyframeColorState()]} />
        </span>
      </span>
    )
  }
}

SoloKeyframe.propTypes = {
  keyframe: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
