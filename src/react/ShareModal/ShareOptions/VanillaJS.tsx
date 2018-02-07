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
    width: '18px',
    height: '18px',
    lineHeight: '18px',
    fontWeight: 'bold',
    fontSize: '11px',
  } as React.CSSProperties,
  block: {
    display: 'inline-block',
    verticalAlign: 'top',
    fontSize: 14,
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
  },
  active: {
    fontWeight: 'bold',
    color: Palette.ROCK,
    backgroundColor: Palette.LIGHTER_GRAY,
  },
  code: {
    background: Palette.FATHER_COAL,
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

export default class VanillaJS extends React.PureComponent {
  render() {
    return (
      <div style={STYLES.block}>
        <div style={STYLES.instructionsRow}>
          <div style={STYLES.instructionsCol1}>
            <span style={STYLES.bullet}>1</span>
          </div>
          <div style={STYLES.instructionsCol2}>
            Install the Haiku CLI: <br />
          </div>
        </div>
        <div style={STYLES.instructionsRow}>
          <div style={STYLES.instructionsCol1}>&nbsp;</div>
          <div style={STYLES.instructionsCol2}>
            <code style={STYLES.code}>npm install -g @haiku/cli</code>
          </div>
        </div>

        <div style={STYLES.instructionsRow}>
          <div style={STYLES.instructionsCol1}>
            <span style={STYLES.bullet}>2</span>
          </div>
          <div style={STYLES.instructionsCol2}>
            <div style={{marginTop: 19}}>
              Run the following from your React project folder: <br />
            </div>
          </div>
        </div>
        <div style={STYLES.instructionsRow}>
          <div style={STYLES.instructionsCol1}>&nbsp;</div>
          <div style={STYLES.instructionsCol2}>
            <code style={STYLES.code}>haiku install percy</code>
          </div>
        </div>

        <div style={STYLES.instructionsRow}>
          <div style={STYLES.instructionsCol1}>
            <span style={STYLES.bullet}>3</span>
          </div>
          <div style={STYLES.instructionsCol2}>
            <div style={{marginTop: 19}}>
              Example use: <br />
            </div>
          </div>
        </div>
        <div style={STYLES.instructionsRow}>
          <div style={STYLES.instructionsCol1}>&nbsp;</div>
          <div style={STYLES.instructionsCol2}>
            <code style={STYLES.code}>
              {
                `import percy from '@haiku/rey12rey-percy/react';

                /*...*/

                render() {
                  return (
                    <div>
                      <percy haikuOptions={{loop: true}} />
                    </div>
                  );
                }`
              }
            </code>
          </div>
        </div>
      </div>
    )
  }
}
