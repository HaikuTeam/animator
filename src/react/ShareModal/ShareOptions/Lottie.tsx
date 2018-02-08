import * as React from 'react'
import * as Color from 'color'
import Palette from '../../../Palette'
import {PUBLISH_SHARED} from './PublishStyles'

export default class Lottie extends React.PureComponent {
  props

  static propTypes = {
    entry: React.PropTypes.string
  }

  render () {
    return (
      <div style={[PUBLISH_SHARED.block, {width: 450}]}>
      <div style={PUBLISH_SHARED.instructionsRow}>
        Native rendering for {this.props.entry} is supported with {' '}
        <a
          key="1"
          style={PUBLISH_SHARED.inlineLink}
          target="_blank"
          href="https://airbnb.design/lottie/"
          rel="noopener noreferrer"
        >
          Lottie
        </a>.
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
        <div style={[PUBLISH_SHARED.instructionsCol2, {textAlign: 'center'}]}>
          <a download>
            Download JSON
          </a>
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
          <a
            key="3"
            href="http://airbnb.io/lottie/android/android.html"
            style={PUBLISH_SHARED.inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Android
          </a>, {' '}
          <a
            key="4"
            href="http://airbnb.io/lottie/ios.html"
            style={PUBLISH_SHARED.inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            iOS
          </a>,
          and {' '}
          <a
            key="5"
            href="http://airbnb.io/lottie/react-native/react-native.html"
            style={PUBLISH_SHARED.inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            React Native
          </a>, and check {' '}
          <a
            key="6"
            href="https://docs.haiku.ai/embedding-and-using-haiku/lottie.html"
            style={PUBLISH_SHARED.inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Haiku docs
          </a> for supported Lottie versions.
        </div>
      </div>
    </div>
    )
  }
}
