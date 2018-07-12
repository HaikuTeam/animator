import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import KeyframeSVG from 'haiku-ui-common/lib/react/icons/KeyframeSVG'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'

export default class SoloKeyframe extends React.Component {
  constructor (props) {
    super(props)
    this.handleProps(props)
  }

  componentWillReceiveProps (nextProps) {
    this.handleProps(nextProps)
  }

  handleProps ({ keyframe }) {
    if (
      keyframe !== this.props.keyframe ||
      !this.teardownKeyframeUpdateReceiver
    ) {
      if (this.teardownKeyframeUpdateReceiver) {
        this.teardownKeyframeUpdateReceiver()
      }
      this.teardownKeyframeUpdateReceiver = keyframe.registerUpdateReceiver(this.props.id, (what) => {
        this.handleUpdate(what)
      })
    }
  }

  componentDidMount () {
    this.mounted = true
  }

  componentWillUnmount () {
    this.mounted = false
    this.teardownKeyframeUpdateReceiver()
  }

  handleUpdate (what, ...args) {
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
    const leftPx = experimentIsEnabled(Experiment.TimelineMarqueeSelection)
      ? this.props.keyframe.getPixelOffsetLeft(0, frameInfo.pxpf, frameInfo.mspf)
      : this.props.keyframe.getPixelOffsetLeft(frameInfo.friA, frameInfo.pxpf, frameInfo.mspf)

    return (
      <span
        ref={(el) => {
          if (el && experimentIsEnabled(Experiment.TimelineMarqueeSelection)) {
            this.props.keyframe.storeViewPosition(el.getBoundingClientRect())
          }
        }}
        id={`solo-keyframe-${this.props.keyframe.getUniqueKey()}`}
        style={{
          position: 'absolute',
          left: leftPx,
          // width: 9,
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
            // left: 1,
            cursor: (this.props.keyframe.isWithinCollapsedRow()) ? 'pointer' : 'move'
          }}>
          <KeyframeSVG color={Palette[this.props.keyframe.getLeftKeyframeColorState()]} />
        </span>
      </span>
    )
  }
}

SoloKeyframe.propTypes = {
  id: React.PropTypes.string.isRequired,
  keyframe: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
