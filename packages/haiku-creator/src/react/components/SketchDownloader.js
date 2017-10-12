import React from 'react'
import {download} from '../../utils/sketchUtils'
import STYLES from '../styles/downloadShared'

let statuses = {
  IDLE: 'Idle',
  CHECKING: 'Checking',
  DOWNLOADING: 'Downloading',
  DOWNLOAD_FINISHED: 'DownloadFinished',
  DOWNLOAD_FAILED: 'DownloadFailed'
}

class SketchDownloader extends React.Component {
  constructor (props) {
    super(props)

    this.updateProgress = this.updateProgress.bind(this)
    this.onFail = this.onFail.bind(this)

    this.state = {
      status: statuses.IDLE,
      progress: 0
    }
  }

  checkForUpdates () {
  }

  onFail (error) {
    console.error(error)
    this.setState({status: statuses.DOWNLOAD_FAILED})
  }

  update (url) {
    this.setState({status: statuses.DOWNLOADING})

    download(url, this.updateProgress)
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
  }

  renderDownloading () {
    const progress = this.state.progress.toFixed(1)

    return (
      <div>
        <span>
          Downloading and installing...
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
        Sketch is redy to use!
      </div>
    )
  }

  renderIdle () {
    return <span>Checking...</span>
  }

  renderDownloadFailed () {
    return (
      <div>
        <p>There was an error downloading Sketch, if the problem persists,
        please contact Haiku support.</p>
        <button style={STYLES.btn} onClick={this.hide}>Ok</button>
      </div>
    )
  }

  renderChecking () {
    return (
      <div>
        Checking...
      </div>
    )
  }

  render () {
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

export default SketchDownloader
