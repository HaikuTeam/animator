import {remote} from 'electron';
import {copyFile, exists} from 'fs-extra';
import {join} from 'path';
import * as React from 'react';
import {SHARED_STYLES} from '../../../SharedStyles';
import {ExternalLink} from '../../ExternalLink';
import {PUBLISH_SHARED} from './PublishStyles';

const {dialog} = remote;

export interface LottieProps {
  entry: string;
  userName: string;
  organizationName: string;
  mixpanel: any;
  folder: string;
}

export default class Lottie extends React.PureComponent<LottieProps> {
  private onClick = () => {
    this.props.mixpanel.haikuTrack('install-options', {
      from: 'app',
      event: 'lottie-download',
    });

    // Bit of a hack—until we can actually pass down Envoy Exporter listeners the right way.
    // #FIXME
    const originalPath = join(this.props.folder, 'code', 'main', 'lottie.json');
    dialog.showSaveDialog(
      undefined,
      {
        defaultPath: 'lottie.json',
        filters: [{
          name: 'Lottie', extensions: ['json'],
        }],
      },
      (filename) => {
        if (!filename) {
          return;
        }

        exists(originalPath, (fileExists) => {
          if (!fileExists) {
            return;
          }

          copyFile(originalPath, filename, () => {});
        });
      },
    );
  };

  render () {
    return (
      <div style={[PUBLISH_SHARED.block, {width: 450}]}>
      <div style={PUBLISH_SHARED.instructionsRow}>
        Native rendering for {this.props.entry} is supported with {' '}
        <ExternalLink
          key="1"
          style={PUBLISH_SHARED.inlineLink}
          href="https://airbnb.design/lottie/"
        >
          Lottie
        </ExternalLink>.
      </div>
      <div style={PUBLISH_SHARED.instructionsRow}>
        <div style={PUBLISH_SHARED.instructionsCol1}>
          <span style={PUBLISH_SHARED.bullet}>1</span>
        </div>
        <div style={PUBLISH_SHARED.instructionsCol2}>
          Download <code>lottie.json</code>.
        </div>
      </div>
      <div style={PUBLISH_SHARED.instructionsRow}>
        <div style={PUBLISH_SHARED.instructionsCol1} />
        <div style={{...PUBLISH_SHARED.instructionsCol2}}>
          <ExternalLink style={SHARED_STYLES.btn} href="#" onClick={this.onClick}>
            Download JSON
          </ExternalLink>
        </div>
      </div>
      <div style={PUBLISH_SHARED.instructionsRow}>
        <div style={PUBLISH_SHARED.instructionsCol1}>
          <span style={PUBLISH_SHARED.bullet}>2</span>
        </div>
        <div style={PUBLISH_SHARED.instructionsCol2}>
          Embed <code>lottie.json</code> in your application.
        </div>
      </div>
      <div style={PUBLISH_SHARED.instructionsRow}>
        <div style={PUBLISH_SHARED.instructionsCol1} />
        <div style={PUBLISH_SHARED.instructionsCol2}>
          See Lottie's instructions for {' '}
          <ExternalLink
            key="3"
            href="http://airbnb.io/lottie/android/android.html"
            style={PUBLISH_SHARED.inlineLink}
          >
            Android
          </ExternalLink>, {' '}
          <ExternalLink
            key="4"
            href="http://airbnb.io/lottie/ios.html"
            style={PUBLISH_SHARED.inlineLink}
          >
            iOS
          </ExternalLink>,
          and {' '}
          <ExternalLink
            key="5"
            href="http://airbnb.io/lottie/react-native/react-native.html"
            style={PUBLISH_SHARED.inlineLink}
          >
            React Native
          </ExternalLink>, and check {' '}
          <ExternalLink
            key="6"
            href="https://docs.haiku.ai/embedding-and-using-haiku/lottie.html"
            style={PUBLISH_SHARED.inlineLink}
          >
            Haiku docs
          </ExternalLink> for supported Lottie versions.
        </div>
      </div>
    </div>
    );
  }
}
