import React from 'react'
import Color from 'color'
import Palette from 'haiku-ui-common/lib/Palette'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import FrameAction from './FrameAction'

export default class FrameGrid extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)

    this.rootElement = props.timeline.component.findElementRoot()
    this.upsertTimelineEvents()
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.timeline.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.timeline.on('update', this.handleUpdate)
  }

  componentWillReceiveProps (nextProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate)
      nextProps.timeline.on('update', this.handleUpdate)

      this.rootElement = nextProps.timeline.component.findElementRoot()
      this.upsertTimelineEvents()
    }
  }

  upsertTimelineEvents () {
    this.timelineEvents = this.rootElement
      .getTimelineEvents()
      .map(handler => Number(handler.split(':')[2]))
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame-hovered') {
      this.forceUpdate()
    }

    if (what === 'timeline-frame-action') {
      setTimeout(() => {
        this.upsertTimelineEvents()
        this.forceUpdate()
      }, 500)
    }
  }

  renderFrameActions (frameNumber, hoveredFrame) {
    if (this.timelineEvents.includes(frameNumber)) {
      return <FrameAction
        hasActions
        frame={frameNumber}
        onShowFrameActionsEditor={this.props.onShowFrameActionsEditor}
      />
    } else if (hoveredFrame === frameNumber) {
      return <FrameAction
        hasActions={false}
        frame={frameNumber}
        onShowFrameActionsEditor={this.props.onShowFrameActionsEditor}
      />
    }
  }

  render () {
    const borderLeftNormal = '1px solid ' + Color(Palette.COAL).fade(0.65)
    const borderLeftHighlighted = '1px solid ' + Color(Palette.ROCK).fade(0.8)
    const hoveredFrame = this.props.timeline.getHoveredFrame()
    const propertiesWidth = this.props.timeline.getPropertiesPixelWidth()

    return (
      <div
        id='frame-grid'
        style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
          position: 'sticky',
          top: 0,
          height: 12,
          backgroundColor: Palette.COAL
        } : {
          overflow: 'hidden'
        })}
      >
        {this.props.timeline.mapVisibleFrames(
          (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) => {
            return (
              <span
                id={`frame-${frameNumber}`}
                key={`frame-${frameNumber}`}
                style={{
                  height: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 'calc(100vh - 80px)' : 9999,
                  borderLeft:
                    hoveredFrame === frameNumber
                      ? borderLeftHighlighted
                      : borderLeftNormal,
                  position: 'absolute',
                  left: experimentIsEnabled(Experiment.NativeTimelineScroll) ? (pixelOffsetLeft + propertiesWidth) : pixelOffsetLeft,
                  top: 34
                }}
              >
                {this.renderFrameActions(frameNumber, hoveredFrame)}
              </span>
            )
          }
        )}
      </div>
    )
  }
}

FrameGrid.propTypes = {
  timeline: React.PropTypes.object.isRequired
}
