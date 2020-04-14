import * as React from 'react';
import autoUpdate from '../../utils/autoUpdate';
import {DOWNLOAD_STYLES as STYLES} from '../styles/downloadShared';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {isMac, isWindows} from 'haiku-common/lib/environments/os';

const statuses = {
  IDLE: 'Idle',
  OPT_IN: 'OptIn',
  CHECKING: 'Checking',
  DOWNLOADING: 'Downloading',
  NO_UPDATES: 'NoUpdates',
  DOWNLOAD_FINISHED: 'DownloadFinished',
  DOWNLOAD_FAILED: 'DownloadFailed',
};

class AutoUpdater extends React.Component {
  constructor (props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.update = this.update.bind(this);
    this.onFail = this.onFail.bind(this);
    this.url = undefined;
    this.state = {
      status: statuses.IDLE,
      progress: 0,
    };
  }

  componentWillReceiveProps (nextProps) {
    if (
      process.env.HAIKU_SKIP_AUTOUPDATE !== '1' &&
      this.state.status === statuses.IDLE &&
      nextProps.check
    ) {
      if (isMac()) {
        this.checkForUpdates();
      }

      if (isWindows()) {
        const {autoUpdater} = require('electron-updater');
        autoUpdater.checkForUpdatesAndNotify();
      }
    }
  }

  checkForUpdates () {
    this.setState({status: statuses.CHECKING});

    autoUpdate.checkUpdates()
      .then(({shouldUpdate, url}) => {
        if (shouldUpdate) {
          this.url = url;
          this.props.skipOptIn
            ? this.update()
            : this.setState({status: statuses.OPT_IN});
        } else {
          this.props.runOnBackground
            ? this.hide()
            : this.setState({status: statuses.NO_UPDATES});
        }
      })
      .catch((err) => {
        this.props.runOnBackground
          ? this.hide()
          : this.onFail(err);
      });
  }

  onFail (error) {
    logger.error(error);
    this.setState({status: statuses.DOWNLOAD_FAILED});
  }

  update () {
    this.setState({status: statuses.DOWNLOADING});
    autoUpdate.update(this.url, this.updateProgress)
      .then(() => {
        this.setState({status: statuses.DOWNLOAD_FINISHED, progress: 0});
      })
      .catch(this.onFail);
  }

  updateProgress (progress) {
    this.setState({progress});
  }

  hide () {
    this.setState({status: statuses.IDLE});
    this.props.onComplete();
  }

  renderOptIn () {
    return (
      <div>
        <p>
          There is a new version available. <br />
        </p>
        <p>Would you like to download it?</p>
        <button style={STYLES.btnSecondary} onClick={this.hide}>
          Not now
        </button>
        <button style={STYLES.btn} onClick={this.update}>
          Yes
        </button>
      </div>
    );
  }

  renderDownloading () {
    const progress = this.state.progress.toFixed(1);

    return (
      <div>
        <span>
          {this.props.skipOptIn && 'An update is available. '}
          Downloading and installing...
        </span>
        <p style={STYLES.progressNumber}>{progress} %</p>
        <progress value={progress} max="100" style={STYLES.progressBar}>
          {progress} %
        </progress>
      </div>
    );
  }

  renderDownloadFinished () {
    return (
      <div>
        Update installed! Loading your Haiku!
      </div>
    );
  }

  renderIdle () {
    return null;
  }

  renderNoUpdates () {
    if (this.props.runOnBackground) {
      return null;
    }

    return (
      <div>
        <p>You are using the latest version</p>
        <button style={STYLES.btn} onClick={this.hide}>Ok</button>
      </div>
    );
  }

  renderDownloadFailed () {
    return (
      <div>
        <p>There was an error downloading the update, if the problem persists,
        please contact Haiku support.</p>
        <button style={STYLES.btn} onClick={this.hide}>Ok</button>
      </div>
    );
  }

  renderChecking () {
    if (this.props.runOnBackground) {
      return null;
    }

    return (
      <div>
        Checking for updates...
      </div>
    );
  }

  render () {
    if (process.env.HAIKU_SKIP_AUTOUPDATE === '1') {
      return null;
    }

    const content = this[`render${this.state.status}`]();

    if (content) {
      return (
        <div>
          <div style={STYLES.container}>
            {content}
          </div>
          <div style={STYLES.overlay} />
        </div>
      );
    }

    return null;
  }
}

export default AutoUpdater;
