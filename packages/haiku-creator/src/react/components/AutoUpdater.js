import React from 'react'
import autoUpdate from '../../utils/autoUpdate'
import debounce from 'lodash.debounce'

const STYLES = {
  container: {
    color: 'black',
    fontSize: 20,
    marginTop: 50
  }
}

class AutoUpdater extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isDownloading: false,
      progress: 0
    }
  }

  componentWillMount () {
    this.checkForUpdates()
  }

  async checkForUpdates () {
    const {shouldUpdate, url} = await autoUpdate.checkUpdates()

    if (shouldUpdate) {
      this.setState({isDownloading: true})
      autoUpdate.update(url, debounce(({ progress }) => {
        this.setState({ progress })
      }, 500))
    } else {
      this.props.onAutoUpdateCheckComplete()
    }
  }

  renderProgressBar () {
    return (
      <div>
        <p>Downloading updates...</p>
        <p>{this.state.progress.toFixed(2)} %</p>
      </div>
    )
  }

  renderCheckingForUpdates () {
    return (
      <div>
        <p>Checking for updates...</p>
      </div>
    )
  }

  render () {
    return (
      <div style={STYLES.container}>
        {this.state.isDownloading
          ? this.renderProgressBar()
          : this.renderCheckingForUpdates()}
      </div>
    )
  }
}

export default AutoUpdater
