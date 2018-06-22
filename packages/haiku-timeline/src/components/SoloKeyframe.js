import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import KeyframeSVG from 'haiku-ui-common/lib/react/icons/KeyframeSVG'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

export default class SoloKeyframe extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
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
    if (experimentIsEnabled(Experiment.TimelineMarqueeSelection)) {
      this.props.timeline.on('update', this.handleUpdate)
    }
  }

  componentWillUnmount () {
    this.mounted = false
    this.teardownKeyframeUpdateReceiver()
    if (experimentIsEnabled(Experiment.TimelineMarqueeSelection)) {
      this.props.timeline.removeListener('update', this.handleUpdate)
    }
  }

  handleUpdate (what, ...args) {
    if (!this.mounted) return null
    if (experimentIsEnabled(Experiment.TimelineMarqueeSelection)) {
      if (what === 'marquee-selection') {
        const containerRect = this.position
        const elementRect = args[0]
        if (
          containerRect.x < elementRect.x + elementRect.width &&
          containerRect.x + containerRect.width > elementRect.x &&
          containerRect.y < elementRect.y + elementRect.height &&
          containerRect.height + containerRect.y > elementRect.y
        ) {
          this.props.keyframe.select()
          this.props.keyframe.activate()
        }
      }
    }

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
        ref={(el) => {
          if (el && experimentIsEnabled(Experiment.TimelineMarqueeSelection)) {
            this.position = el.getBoundingClientRect()
          }
        }}
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
  id: React.PropTypes.string.isRequired,
  keyframe: React.PropTypes.object.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
