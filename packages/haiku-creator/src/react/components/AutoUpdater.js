import React from 'react'
import autoUpdate from '../../utils/autoUpdate'
import debounce from 'lodash.debounce'
import Palette from './Palette'

const STYLES = {
  container: {
    color: 'black',
    fontSize: 18,
    zIndex: 999999,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 25,
    position: 'fixed',
    display: 'inline-block',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: Palette.SHADY,
    zIndex: 99999,
    pointerEvents: 'none'
  },
  progressNumber: {
    fontSize: 15,
    margin: '10px 0 0 0'
  }
}

class AutoUpdater extends React.Component {
  constructor (props) {
    super(props)

    this.debouncedSetState = debounce(this.setState.bind(this), 500)

    this.state = {
      isDownloading: false,
      isDownloadFinished: false,
      progress: 0
    }
  }

  componentWillMount () {
    this.checkForUpdates()
  }

  async checkForUpdates () {
    try {
      const {shouldUpdate, url} = await autoUpdate.checkUpdates()

      if (shouldUpdate) {
        this.setState({isDownloading: true})
        autoUpdate.update(url, this.debouncedSetState)
      } else {
        this.props.onAutoUpdateCheckComplete()
      }
    } catch (e) {
      this.props.onAutoUpdateCheckComplete()
    }
  }

  renderProgressBar () {
    const progress = this.state.progress.toFixed(1)

    return (
      <div>
        <span>
        {this.state.isDownloadFinished
          ? 'Update installed! Loading your Haiku!'
          : 'An update is available. Downloading and installing...'}
        </span>
        <p style={STYLES.progressNumber}>{progress} %</p>
        <progress value={progress} max='100'>{progress} %</progress>
      </div>
    )
  }

  renderCheckingForUpdates () {
    return (
      <div>
        <span>Checking for updates...</span>
      </div>
    )
  }

  render () {
    return (
      <div>
        <div style={STYLES.container}>
          {this.state.isDownloading
            ? this.renderProgressBar()
            : this.renderCheckingForUpdates()}
        </div>
        <div style={STYLES.overlay} />
      </div>
    )
  }
}

export default AutoUpdater
