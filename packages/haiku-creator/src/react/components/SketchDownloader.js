import * as React from 'react';
import {createSketchDialogFile} from 'haiku-serialization/src/utils/HaikuHomeDir';
import {DOWNLOAD_STYLES as STYLES} from '../styles/downloadShared';
import {ExternalLink} from 'haiku-ui-common/lib/react/ExternalLink';

const DOWNLOAD_URL = 'https://download.sketchapp.com/sketch.zip';

class SketchDownloader extends React.PureComponent {
  dismiss = () => {
    if (this.checkInput.checked) {
      createSketchDialogFile();
    }

    this.props.onDismiss(!this.checkInput.checked);
  };

  render () {
    return (
      <div>
        <div style={STYLES.container}>
          <p>
            Sketch is required to edit this file. <br />
            You can install a 30-day trial for free.
          </p>
          <p>Would you like to download it?</p>

          <form action="#" style={STYLES.formInput}>
            <input
              type="checkbox"
              name="not-show-again"
              id="not-show-again"
              style={STYLES.checkInput}
              ref={(input) => {
                this.checkInput = input;
              }} />
            <label htmlFor="not-show-again">Don't show this again.</label>
          </form>

          <button style={STYLES.btnSecondary} onClick={this.dismiss}>
            Not now
          </button>

          <ExternalLink href={DOWNLOAD_URL} style={STYLES.btn} onClick={this.dismiss}>
            Get Sketch
          </ExternalLink>
        </div>
        <div style={STYLES.overlay} />
      </div>
    );
  }
}

export default SketchDownloader;
