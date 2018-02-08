import * as React from 'react'
import * as assign from 'lodash.assign'
import Palette from '../../Palette'
import {LoadingTopBar} from '../../LoadingTopBar'
import {Tooltip} from '../Tooltip'

const STYLES = {
  btnText: {
    height: '25px',
    padding: '4px 9px',
    fontSize: 11,
    letterSpacing: '1.3px',
    marginRight: '5px',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    float: 'right',
    borderRadius: '3px',
    color: Palette.ROCK,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease, border-color 200ms ease',
    backgroundColor: Palette.FATHER_COAL,
    ':active': {
      transform: 'scale(.9)'
    },
    ':hover': {
      color: Palette.ROCK
    }
  },
  entry: {
    float: 'none',
    width: '100%',
    marginBottom: '8px',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    disabled: {
      backgroundColor: 'transparent',
      color: Palette.BLACK,
      border: `1px solid ${Palette.DARKEST_COAL}`
    },
    loading: {
      opacity: 0.7
    }
  }
}

export class EmbedOption extends React.PureComponent {
  props

  static propTypes = {
    disabled: React.PropTypes.bool,
    template: React.PropTypes.string,
    entry: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    snapshotSyndicated: React.PropTypes.bool
  }

  state = {
    progress: 0,
    speed: '2s',
    done: false
  }

  get tooltipText() {
    return this.props.disabled ? 'Coming Soon' : 'Click for details'
  }

  componentDidMount() {
    if (this.props.isSnapshotSaveInProgress) {
      this.start()
    }
  }

  componentWillReceiveProps({isSnapshotSaveInProgress, snapshotSyndicated}) {
    if (isSnapshotSaveInProgress) {
      this.start()
    } else {
      if (this.isGIF && !snapshotSyndicated) return

      this.setState({progress: 100, speed: '0.5s'}, () => {
        setTimeout(() => {
          this.setState({done: true, progress: 0, speed: '1ms'})
        }, 1000)
      })
    }
  }

  start() {
    setTimeout(() => {
      this.setState({progress: 80, speed: this.startSpeed, done: false})
    }, 10)
  }

  get startSpeed() {
    return this.isGIF ? '30s' : '15s'
  }

  get isGIF() {
    return this.props.entry === 'GIF'
  }

  render() {
    const {
      disabled,
      entry,
      isSnapshotSaveInProgress,
      done,
      onClick,
      template
    } = this.props

    return (
      <li>
        <Tooltip content={this.tooltipText} place="above">
          <button
            style={assign(
              {},
              {
                ...STYLES.btnText,
                ...STYLES.entry,
                ...(disabled && STYLES.entry.disabled),
                ...(!this.state.done && STYLES.entry.loading)
              }
            )}
            onClick={() => {
              if (!disabled && this.state.done) {
                onClick({entry, template})
              }
            }}
          >
            {!disabled && (
              <LoadingTopBar
                progress={this.state.progress}
                speed={this.state.speed}
                done={this.state.done}
              />
            )}
            {entry}
          </button>
        </Tooltip>
      </li>
    )
  }
}
