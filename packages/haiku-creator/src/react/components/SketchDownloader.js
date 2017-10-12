import React from 'react'
import {download} from '../../utils/sketchUtils'
import {DOWNLOAD_STYLES as STYLES} from '../styles/downloadShared'

let statuses = {
  PROMPT_USER: 'PromptUser',
  DOWNLOADING: 'Downloading',
  DOWNLOAD_FINISHED: 'DownloadFinished',
  DOWNLOAD_FAILED: 'DownloadFailed'
}

class SketchDownloader extends React.Component {
  constructor (props) {
    super(props)

    this.hide = this.hide.bind(this)
    this.download = this.download.bind(this)
    this.updateProgress = this.updateProgress.bind(this)
    this.onFail = this.onFail.bind(this)

    this.state = {
      status: statuses.PROMPT_USER,
      progress: 0
    }
  }

  onFail (error) {
    console.error(error)
    this.setState({status: statuses.DOWNLOAD_FAILED})
  }

  download (url) {
    this.setState({status: statuses.DOWNLOADING})

    download(this.updateProgress)
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

  renderPromptUser () {
    return (
      <div>
        <p>
          Sketch is required to edit this file. <br />
          You can install a 30-day trial for free.
        </p>
        <p>Would you like to download Sketch?</p>
        <button style={STYLES.btn} onClick={this.hide}>No</button>
        <button style={STYLES.btn} onClick={this.download}>Yes</button>
      </div>
    )
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
        <button style={STYLES.btn} onClick={this.hide}>Ok</button>
      </div>
    )
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

  render () {
    console.log(this.state.status)
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
