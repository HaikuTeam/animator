import * as React from 'react'
import * as Color from 'color'
import Palette from 'haiku-ui-common/lib/Palette'

export default class SimplifiedFrameGrid extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.defaultFrameBorder = `1px solid ${Color(Palette.COAL).fade(0.65)}`
    this.activeFrameBorder = `1px solid ${Color(Palette.ROCK).fade(0.8)}`
    this.lastHoveredFrame = 0
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
    }
  }

  toggleFrameHover () {
    const hoveredFrame = this.props.timeline.getHoveredFrame()

    if (hoveredFrame === this.lastHoveredFrame) {
      return
    }

    const hoveredFrameEl = document.getElementById(`frame-${hoveredFrame}`)
    const lastHoveredFrameEl = document.getElementById(`frame-${this.lastHoveredFrame}`)

    if (hoveredFrameEl && lastHoveredFrameEl) {
      hoveredFrameEl.style.borderLeft = this.activeFrameBorder
      lastHoveredFrameEl.style.borderLeft = this.defaultFrameBorder
      this.lastHoveredFrame = hoveredFrame
    }
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame-hovered') {
      this.toggleFrameHover()
    } else if (
      what === 'timeline-frame-range' ||
      what === 'timeline-timeline-pixel-width' ||
      what === 'time-display-mode-change' ||
      what === 'timeline-max-frame-changed'
    ) {
      this.forceUpdate()
    }
  }

  render () {
    const propertiesWidth = this.props.timeline.getPropertiesPixelWidth()

    return (
      <div
        id='frame-grid'
        style={{
          position: 'sticky',
          top: 0,
          width: propertiesWidth + this.props.timeline.calculateFullTimelineWidth()
        }}
      >
        {this.props.timeline.mapVisibleFrames(
          (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) => {
            return (
              <span
                id={`frame-${frameNumber}`}
                key={`frame-${frameNumber}`}
                style={{
                  height: 'calc(100vh - 80px)',
                  position: 'absolute',
                  borderLeft: this.defaultFrameBorder,
                  left: pixelOffsetLeft + propertiesWidth,
                  top: 34
                }}
               />
            )
          }
        )}
      </div>
    )
  }
}

SimplifiedFrameGrid.propTypes = {
  timeline: React.PropTypes.object.isRequired
}
