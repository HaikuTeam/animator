import * as React from 'react'
import * as lodash from 'lodash'
import Palette from 'haiku-ui-common/lib/Palette'
import formatSeconds from 'haiku-ui-common/lib/helpers/formatSeconds'
import * as Timeline from 'haiku-serialization/src/bll/Timeline'

export default class GaugeTimeReadout extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
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

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'time-display-mode-change') {
      this.forceUpdate()
    }
  }

  handleClick () {
    this.props.timeline.toggleTimeDisplayMode()
    this.props.reactParent.saveTimeDisplayModeSetting()
  }

  render () {
    return (
      <div>
        <div
          className='gauge-time-readout'
          style={{
            float: 'right',
            top: 0,
            minWidth: 86,
            height: 'inherit',
            verticalAlign: 'top',
            textAlign: 'right',
            paddingTop: 2,
            paddingRight: 10
          }}>
          <TimeReadout
            timeline={this.props.timeline} />
        </div>
        <div
          className='gauge-fps-readout'
          style={{
            width: 38,
            float: 'right',
            left: 211,
            height: 'inherit',
            verticalAlign: 'top',
            color: Palette.ROCK_MUTED,
            fontStyle: 'italic',
            textAlign: 'right',
            paddingTop: 5,
            paddingRight: 5,
            cursor: 'default'
          }}>
          <FpsReadout
            timeline={this.props.timeline} />
          <div style={{marginTop: '-4px'}}>{this.props.timeline.getFPS()}fps</div>
        </div>
        <div
          className='gauge-toggle'
          onClick={this.handleClick}
          style={{
            width: 50,
            float: 'right',
            marginRight: 10,
            fontSize: 9,
            height: 'inherit',
            verticalAlign: 'top',
            color: Palette.ROCK_MUTED,
            textAlign: 'right',
            paddingTop: 7,
            paddingRight: 5,
            cursor: 'pointer'
          }}>
          {this.props.timeline.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.FRAMES
            ? (<span>
              <div style={{color: Palette.ROCK, position: 'relative'}}>FRAMES
                  <span style={{width: 6, height: 6, backgroundColor: Palette.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2}} />
              </div>
              <div style={{marginTop: '-2px'}}>SECONDS</div>
            </span>)
            : (<span>
              <div>FRAMES</div>
              <div style={{marginTop: '-2px', color: Palette.ROCK, position: 'relative'}}>SECONDS
                  <span style={{width: 6, height: 6, backgroundColor: Palette.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2}} />
              </div>
            </span>)
          }
        </div>
      </div>
    )
  }
}

class FpsReadout extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.throttledForceUpdate = lodash.throttle(this.forceUpdate.bind(this), 64)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.timeline.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.timeline.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame') {
      this.throttledForceUpdate()
    } else if (what === 'timeline-frame-range') {
      this.forceUpdate()
    }
  }

  render () {
    return (
      <div>
        {(this.props.timeline.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.FRAMES)
          ? <span>{formatSeconds(this.props.timeline.getCurrentFrame() * 1000 / this.props.timeline.getFPS() / 1000)}s</span>
          : <span>{~~this.props.timeline.getCurrentFrame()}f</span>
        }
      </div>
    )
  }
}

class TimeReadout extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.throttledForceUpdate = lodash.throttle(this.forceUpdate.bind(this), 64)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.timeline.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.timeline.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame') {
      this.throttledForceUpdate()
    } else if (what === 'timeline-frame-range') {
      this.forceUpdate()
    }
  }

  render () {
    return (
      <span style={{ display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }}>
        {(this.props.timeline.getTimeDisplayMode() === Timeline.TIME_DISPLAY_MODE.FRAMES)
          ? <span>{~~this.props.timeline.getCurrentFrame()}f</span>
          : <span>{formatSeconds(this.props.timeline.getCurrentFrame() * 1000 / this.props.timeline.getFPS() / 1000)}s</span>
        }
      </span>
    )
  }
}

GaugeTimeReadout.propTypes = {
  timeline: React.PropTypes.object.isRequired
}

FpsReadout.propTypes = {
  timeline: React.PropTypes.object.isRequired
}

TimeReadout.propTypes = {
  timeline: React.PropTypes.object.isRequired
}
