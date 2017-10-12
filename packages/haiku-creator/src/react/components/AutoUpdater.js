import React from 'react'
import autoUpdate from '../../utils/autoUpdate'
import {DOWNLOAD_STYLES as STYLES} from '../styles/downloadShared'

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
    this.onFail = this.onFail.bind(this)
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

  checkForUpdates () {
    this.setState({status: statuses.CHECKING})

    autoUpdate.checkUpdates()
      .then(({shouldUpdate, url}) => {
        shouldUpdate ? this.update(url) : this.dismiss()
      })
      .catch(this.onFail)
  }

  onFail (error) {
    console.error(error)
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

  update (url) {
    this.setState({status: statuses.DOWNLOADING})
    autoUpdate.update(url, this.updateProgress)
      .then(() => {
        this.setState({status: statuses.DOWNLOAD_FINISHED, progress: 0})
      })
      .catch(this.onFail)
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
    if (process.env.HAIKU_SKIP_AUTOUPDATE === '1' || !this.props.shouldDisplay) {
      return null
    }

    let content = this[`render${this.state.status}`]()

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
