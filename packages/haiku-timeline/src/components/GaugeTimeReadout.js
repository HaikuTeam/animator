import React from 'react'
import Palette from './DefaultPalette'
import formatSeconds from './helpers/formatSeconds'

export default class GaugeTimeReadout extends React.Component {
  constructor (props) {
    super(props)
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

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame' || what === 'timeline-frame-range') this.forceUpdate()
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
          <span style={{ display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }}>
            {(this.props.timeDisplayMode === 'frames')
              ? <span>{~~this.props.timeline.getCurrentFrame()}f</span>
              : <span>{formatSeconds(this.props.timeline.getCurrentFrame() * 1000 / this.props.timeline.getFPS() / 1000)}s</span>
            }
          </span>
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
          <div>
            {(this.props.timeDisplayMode === 'frames')
              ? <span>{formatSeconds(this.props.timeline.getCurrentFrame() * 1000 / this.props.timeline.getFPS() / 1000)}s</span>
              : <span>{~~this.props.timeline.getCurrentFrame()}f</span>
            }
          </div>
          <div style={{marginTop: '-4px'}}>{this.props.timeline.getFPS()}fps</div>
        </div>
        <div
          className='gauge-toggle'
          onClick={this.props.reactParent.toggleTimeDisplayMode.bind(this.props.reactParent)}
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
          {this.props.timeDisplayMode === 'frames'
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

GaugeTimeReadout.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  reactParent: React.PropTypes.object.isRequired,
  timeDisplayMode: React.PropTypes.string.isRequired,
}
