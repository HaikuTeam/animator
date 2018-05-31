import * as React from 'react';
import {PUBLISH_SHARED} from './PublishStyles';
import {ExternalLink} from '../../ExternalLink';
import {SHARED_STYLES} from '../../../SharedStyles';

export type LottieProps = {
  entry: string;
  userName: string;
  organizationName: string;
  projectUid: string;
  sha: string;
  mixpanel: any;
};

const CDN_BASE = 'https://cdn.haiku.ai/';

export default class Lottie extends React.PureComponent<LottieProps> {
  get cdnBase() {
    return `${CDN_BASE + this.props.projectUid}/${this.props.sha}/`;
  }

  render () {
    const lottiePath = `${this.cdnBase}code/main/lottie.json`;

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
          Download <code>lottie.json</code> from Haiku CDN.
        </div>
      </div>
      <div style={PUBLISH_SHARED.instructionsRow}>
        <div style={PUBLISH_SHARED.instructionsCol1} />
        <div style={{...PUBLISH_SHARED.instructionsCol2}}>
          <ExternalLink style={SHARED_STYLES.btn}  href={lottiePath} onClick={() => {
            this.props.mixpanel.haikuTrack('install-options', {
              from: 'app',
              event: 'lottie-download',
            });
          }}>
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
