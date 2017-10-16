import React from 'react'
import Radium from 'radium'
import Palette from './DefaultPalette'
import SkipBackIconSVG from './icons/SkipBackIconSVG'
import SkipForwardIconSVG from './icons/SkipForwardIconSVG'
import PlayIconSVG from './icons/PlayIconSVG'
import PauseIconSVG from './icons/PauseIconSVG'

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
  playbackSkipBack() {
    this.props.removeTimelineShadow()
    this.props.playbackSkipBack()
  }

  playbackSkipForward() {
    this.props.playbackSkipForward()
  }

  playbackPlayPause() {
    this.props.playbackPlayPause()
  }

  render() {
    const lastFrame = this.props.lastFrame
    const currentFrame = this.props.currentFrame
    const isPlaying = this.props.isPlaying
    return (
      <span>
        <button
          disabled={currentFrame < 1}
          key="skipback"
          style={[STYLES.btn, currentFrame < 1 && STYLES.disabled]}
          onClick={this.playbackSkipBack.bind(this)}
        >
          <SkipBackIconSVG />
        </button>
        <button
          disabled={currentFrame >= lastFrame}
          key="pause"
          onClick={this.playbackPlayPause.bind(this)}
          style={[
            STYLES.btn,
            STYLES.btnPlayPause,
            currentFrame >= lastFrame && STYLES.disabled
          ]}
        >
          {isPlaying ? (
            <span style={{marginLeft: 2}}>
              <PauseIconSVG />
            </span>
          ) : (
            <PlayIconSVG />
          )}
        </button>
        <button
          disabled={currentFrame >= lastFrame}
          key="skipforward"
          style={[STYLES.btn, currentFrame >= lastFrame && STYLES.disabled]}
          onClick={this.playbackSkipForward.bind(this)}
        >
          <SkipForwardIconSVG />
        </button>
      </span>
    )
  }
}

export default Radium(PlaybackButtons)
