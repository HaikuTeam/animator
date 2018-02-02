import * as React from 'react'
import * as Color from 'color'
import Palette from '../../../Palette'

const STYLES = {
  codebox: {
    color: Palette.ROCK,
    userSelect: 'auto',
  },
  container: {
    padding: '0 30px',
    margin: '0 auto',
    height: '100%',
  },
  bullet: {
    borderRadius: 50,
    backgroundColor: 'rgba(254, 254, 254, .06)',
    color: Palette.ROCK,
    textAlign: 'center',
    display: 'inline-block',
    width: '25px',
    height: '25px',
    lineHeight: '24px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  block: {
    display: 'inline-block',
    verticalAlign: 'top',
    fontSize: 15,
  },
  nav: {
    width: 190,
    borderLeft: 'none',
    padding: '30px 0 0 0',
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  link: {
    padding: '2px 16px',
    cursor: 'pointer',
    userSelect: 'none',
    color: Color(Palette.ROCK).fade(0.5),
    ':hover': {
      color: Color(Palette.ROCK).fade(0.2),
      backgroundColor: Color(Palette.LIGHTER_GRAY).fade(0.39),
    },
  },
  inlineLink: {
    color: Color(Palette.ROCK).fade(0.2),
    fontWeight: 'bold',
    textDecoration: 'underline',
    ':hover': {
      color: Color(Palette.ROCK).fade(0.3),
    },
  }  as React.CSSProperties,
  active: {
    fontWeight: 'bold',
    color: Palette.ROCK,
    backgroundColor: Palette.LIGHTER_GRAY,
  },
  code: {
    background: Palette.COAL,
    borderRadius: 5,
    padding: '12px 20px',
    display: 'block',
    marginRight: 40,
    overflowX: 'auto',
    MozUserSelect: 'text',
    WebkitUserSelect: 'text',
    userSelect: 'text',
  } as React.CSSProperties,
  instructionsRow: {
    width: '100%',
    marginBottom: '15px',
  },
  instructionsCol1: {
    width: '25px',
    marginRight: '10px',
    display: 'inline-block',
  },
  instructionsCol2: {
    width: 'calc(100% - 35px)',
    display: 'inline-block',
  },
};

export default class Lottie extends React.PureComponent {
  render () {
    return (
      <div style={[STYLES.block, {width: 450}]}>
      <div style={STYLES.title}>iOS/Android</div>
      <div style={STYLES.instructionsRow}>
        Native rendering for iOS and Android is supported with {' '}
        <a
          key="1"
          style={STYLES.inlineLink}
          target="_blank"
          href="https://airbnb.design/lottie/"
          rel="noopener noreferrer"
        >
          Lottie
        </a>.
      </div>
      <div style={STYLES.instructionsRow}>
        <div style={STYLES.instructionsCol1}>
          <span style={STYLES.bullet}>1</span>
        </div>
        <div style={STYLES.instructionsCol2}>
          Download <code>lottie.json</code> from Haiku CDN.
        </div>
      </div>
      <div style={STYLES.instructionsRow}>
        <div style={STYLES.instructionsCol1} />
        <div style={[STYLES.instructionsCol2, {textAlign: 'center'}]}>
          <a download>
            Download JSON
          </a>
        </div>
      </div>
      <div style={STYLES.instructionsRow}>
        <div style={STYLES.instructionsCol1}>
          <span style={STYLES.bullet}>2</span>
        </div>
        <div style={STYLES.instructionsCol2}>
          Embed <code>lottie.json</code> in your application.
        </div>
      </div>
      <div style={STYLES.instructionsRow}>
        <div style={STYLES.instructionsCol1} />
        <div style={STYLES.instructionsCol2}>
          See Lottie's instructions for {' '}
          <a
            key="3"
            href="http://airbnb.io/lottie/android/android.html"
            style={STYLES.inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Android
          </a>, {' '}
          <a
            key="4"
            href="http://airbnb.io/lottie/ios.html"
            style={STYLES.inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            iOS
          </a>,
          and {' '}
          <a
            key="5"
            href="http://airbnb.io/lottie/react-native/react-native.html"
            style={STYLES.inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            React Native
          </a>, and check {' '}
          <a
            key="6"
            href="https://docs.haiku.ai/embedding-and-using-haiku/lottie.html"
            style={STYLES.inlineLink}
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