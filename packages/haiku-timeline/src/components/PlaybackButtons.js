import * as React from 'react'
import * as Radium from 'radium'
import * as lodash from 'lodash'
import Palette from 'haiku-ui-common/lib/Palette'
import SkipBackIconSVG from 'haiku-ui-common/lib/react/icons/SkipBackIconSVG'
import SkipForwardIconSVG from 'haiku-ui-common/lib/react/icons/SkipForwardIconSVG'
import PlayIconSVG from 'haiku-ui-common/lib/react/icons/PlayIconSVG'
import PauseIconSVG from 'haiku-ui-common/lib/react/icons/PauseIconSVG'
import RepeatIconSVG from 'haiku-ui-common/lib/react/icons/RepeatIconSVG'

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
  btnRepeat: {
    transform: 'scale(0.8)',
    ':active': {
      transform: 'scale(0.7)'
    }
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
    this.throttledForceUpdate = lodash.throttle(this.forceUpdate.bind(this), 64 * 2)
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
    if (!this.mounted) { return null }
    if (what === 'timeline-frame') {
      this.throttledForceUpdate()
    }
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()
    const lastFrame = frameInfo.maxf
    const currentFrame = this.props.timeline.getCurrentFrame()
    const isPlaying = this.props.timeline.isPlaying()
    const {
      playbackSkipBack,
      playbackSkipForward,
      playbackPlayPause,
      toggleRepeat,
      isRepeat
    } = this.props

    return (
      <span>
        <button
          disabled={currentFrame < 1}
          key='skipback'
          style={[STYLES.btn, currentFrame < 1 && STYLES.disabled]}
          onClick={playbackSkipBack}
        >
          <SkipBackIconSVG />
        </button>
        <button
          key='pause'
          onClick={playbackPlayPause}
          style={[
            STYLES.btn,
            STYLES.btnPlayPause
          ]}
        >
          {(isPlaying) ? (
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
          onClick={playbackSkipForward}
        >
          <SkipForwardIconSVG />
        </button>

        <button
          key='repeat'
          style={[STYLES.btn, STYLES.btnRepeat, !isRepeat && {opacity: 0.5}]}
          onClick={toggleRepeat}
        >
          <RepeatIconSVG
            color={isRepeat ? Palette.LIGHTEST_PINK : Palette.SUNSTONE}
          />
        </button>
      </span>
    )
  }
}

PlaybackButtons.propTypes = {
  timeline: React.PropTypes.object.isRequired
}

export default Radium(PlaybackButtons)
