import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import SkipBackIconSVG from 'haiku-ui-common/lib/react/icons/SkipBackIconSVG'
import SkipForwardIconSVG from 'haiku-ui-common/lib/react/icons/SkipForwardIconSVG'
import PlayIconSVG from 'haiku-ui-common/lib/react/icons/PlayIconSVG'
import PauseIconSVG from 'haiku-ui-common/lib/react/icons/PauseIconSVG'

const STYLES = {
  btn: {
    transform: 'scale(1)',
    transition: 'transform 167ms ease',
    ':active': {
      transform: 'scale(.8)'
    }
  },
  btnPlayPause: {
    height: 29,
    width: 30,
    borderRadius: 3,
    backgroundColor: Palette.FATHER_COAL
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
}

class PlaybackButtons extends React.Component {
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
    if (what === 'timeline-frame') this.forceUpdate()
  }

  playbackSkipBack () {
    this.props.playbackSkipBack()
  }

  playbackSkipForward () {
    this.props.playbackSkipForward()
  }

  playbackPlayPause () {
    this.props.playbackPlayPause()
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()
    const lastFrame = frameInfo.maxf
    const currentFrame = this.props.timeline.getCurrentFrame()
    const isPlaying = this.props.timeline.isPlaying()

    return (
      <span>
        <button
          disabled={currentFrame < 1}
          key='skipback'
          style={[STYLES.btn, currentFrame < 1 && STYLES.disabled]}
          onClick={this.playbackSkipBack.bind(this)}
        >
          <SkipBackIconSVG />
        </button>
        <button
          key='pause'
          onClick={this.playbackPlayPause.bind(this)}
          style={[
            STYLES.btn,
            STYLES.btnPlayPause
          ]}
        >
          {isPlaying && currentFrame < lastFrame ? (
            <span style={{marginLeft: 2}}>
              <PauseIconSVG />
            </span>
          ) : (
            <PlayIconSVG />
          )}
        </button>
        <button
          disabled={currentFrame >= lastFrame}
          key='skipforward'
          style={[STYLES.btn, currentFrame >= lastFrame && STYLES.disabled]}
          onClick={this.playbackSkipForward.bind(this)}
        >
          <SkipForwardIconSVG />
        </button>
      </span>
    )
  }
}

PlaybackButtons.propTypes = {
  timeline: React.PropTypes.object.isRequired
}

export default Radium(PlaybackButtons)
