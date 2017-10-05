import React from 'react'
import autoUpdate from '../../utils/autoUpdate'
import Palette from './Palette'
import Color from 'color'
import { DASH_STYLES } from '../styles/dashShared'

const STYLES = {
  container: {
    fontSize: 16,
    zIndex: 9999999,
    backgroundColor: Palette.COAL,
    borderRadius: 3,
    padding: 20,
    color: Palette.ROCK,
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
    position: 'fixed',
    display: 'inline-block',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 270
  },
  btn: {
    ...DASH_STYLES.btn,
    padding: '10px 15px',
    fontSize: 16,
    float: 'right'
  },
  overlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: Color(Palette.GRAY).fade(0.023),
    zIndex: 99999,
    pointerEvents: 'none'
  },
  progressNumber: {
    fontSize: 15,
    margin: '10px 0 0 0'
  },
  progressBar: {
    width: '100%'
  }
}

let statuses = {
  IDLE: 'Idle',
  CHECKING: 'Checking',
  DOWNLOADING: 'Downloading',
  NO_UPDATES: 'NoUpdates',
  DOWNLOAD_FINISHED: 'DownloadFinished',
  DOWNLOAD_FAILED: 'DownloadFailed'
}

class AutoUpdater extends React.Component {
  constructor (props) {
    super(props)

    this.hide = this.hide.bind(this)
    this.updateProgress = this.updateProgress.bind(this)
    this.isFirstRun = true

    this.state = {
      status: statuses.IDLE,
      progress: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.shouldDisplay && this.state.status === statuses.IDLE) {
      this.checkForUpdates()
    }
  }

  async checkForUpdates () {
    this.setState({status: statuses.CHECKING})

    try {
      const {shouldUpdate, url} = await autoUpdate.checkUpdates()
      shouldUpdate ? this.update(url) : this.dismiss()
    } catch (e) {
      this.onFail()
    }
  }

  onFail () {
    this.setState({status: statuses.DOWNLOAD_FAILED})
  }

  dismiss () {
    if (!this.isFirstRun) {
      this.setState({status: statuses.NO_UPDATES})
    } else {
      this.hide()
      this.isFirstRun = false
    }
  }

  async update (url) {
    try {
      this.setState({status: statuses.DOWNLOADING})
      await autoUpdate.update(url, this.updateProgress)
      this.setState({status: statuses.DOWNLOAD_FINISHED, progress: 0})
    } catch (err) {
      this.onFail()
    }
  }

  updateProgress (progress) {
    this.setState({ progress })
  }

  hide () {
    this.setState({status: statuses.IDLE})
    this.props.onAutoUpdateCheckComplete()
  }

  renderDownloading () {
    const progress = this.state.progress.toFixed(1)

    return (
      <div>
        <span>
          An update is available. Downloading and installing...
        </span>
        <p style={STYLES.progressNumber}>{progress} %</p>
        <progress value={progress} max='100' style={STYLES.progressBar}>
          {progress} %
        </progress>
      </div>
    )
  }

  renderDownloadFinished () {
    return (
      <div>
        Update installed! Loading your Haiku!
      </div>
    )
  }

  renderIdle () {
    return <span>Checking for updates...</span>
  }

  renderNoUpdates () {
    return (
      <div>
        <p>You are using the latest version</p>
        <button style={STYLES.btn} onClick={this.hide}>Ok</button>
      </div>
    )
  }

  renderDownloadFailed () {
    return (
      <div>
        <p>There was an error downloading the update, if the problem persists,
        please contact Haiku support.</p>
        <button style={STYLES.btn} onClick={this.hide}>Ok</button>
      </div>
    )
  }

  renderChecking () {
    return (
      <div>
        Checking for updates...
      </div>
    )
  }

  render () {
    let content = this[`render${this.state.status}`]()

    if (!this.props.shouldDisplay) {
      return null
    }

    return (
      <div>
        <div style={STYLES.container}>
          {content}
        </div>
        <div style={STYLES.overlay} />
      </div>
    )
  }
}

export default AutoUpdater
