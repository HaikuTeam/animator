import React from 'react'
import {download} from '../../utils/sketchUtils'
import {DOWNLOAD_STYLES as STYLES} from '../styles/downloadShared'
import {createSketchDialogFile} from 'haiku-serialization/src/utils/HaikuHomeDir'

let statuses = {
  PROMPT_USER: 'PromptUser',
  DOWNLOADING: 'Downloading',
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
      progress: 0,
      shouldCancel: false
    }
  }

  componentWillReceiveProps () {
    this.setState({status: statuses.PROMPT_USER})
  }

  download (url) {
    this.setState({status: statuses.DOWNLOADING})
    this.dismiss()

    download(this.updateProgress, () => this.state.shouldCancel)
      .then(() => {
        this.props.onDownloadComplete()
      })
      .catch(error => {
        error.message === 'Download cancelled' ? this.hide() : this.onFail(error)
      })
  }

  updateProgress (progress) {
    this.setState({progress})
  }

  onFail (error) {
    this.setState({
      status: statuses.DOWNLOAD_FAILED,
      progress: 0,
      shouldCancel: false
    })

    console.error(error)
  }

  hide () {
    this.setState({
      status: statuses.IDLE,
      progress: 0,
      shouldCancel: false
    })

    this.dismiss()
  }

  dismiss () {
    if (this.checkInput.checked) {
      createSketchDialogFile()
    }

    this.props.onDismiss(!this.checkInput.checked)
  }

  renderPromptUser () {
    return (
      <div>
        <p>
          Sketch is required to edit this file. <br />
          You can install a 30-day trial for free.
        </p>
        <p>Would you like to download Sketch?</p>

        <form action='#' style={STYLES.formInput}>
          <input
            type='checkbox'
            name='not-show-again'
            id='not-show-again'
            style={STYLES.checkInput}
            ref={(input) => { this.checkInput = input }} />
          <label htmlFor='not-show-again'>Don't show this again.</label>
        </form>

        <button style={STYLES.btnSecondary} onClick={this.hide}>
          Not now
        </button>
        <button style={STYLES.btn} onClick={this.download}>
          Yes
        </button>
      </div>
    )
  }

  renderDownloading () {
    const progress = this.state.progress.toFixed(1)

    return (
      <div>
        <span>Downloading and installing...</span>
        <p style={STYLES.progressNumber}>{progress} %</p>
        <progress value={progress} max='100' style={STYLES.progressBar}>
          {progress} %
        </progress>
        <button
          style={STYLES.btn}
          onClick={() => this.setState({shouldCancel: true})}
        >
          Cancel
        </button>
      </div>
    )
  }

  renderDownloadFailed () {
    return (
      <div>
        <p>
          There was an error downloading Sketch, if the problem persists, please
          contact Haiku support.
        </p>
        <button style={STYLES.btn} onClick={this.hide}>
          Ok
        </button>
      </div>
    )
  }

  render () {
    const {status} = this.state
    if (status === statuses.IDLE) return null
    let content = this[`render${status}`]()

    return (
      <div>
        <div style={STYLES.container}>{content}</div>
        <div style={STYLES.overlay} />
      </div>
    )
  }
}

export default SketchDownloader
