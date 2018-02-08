import * as React from 'react'
import * as ShareTemplates from './ShareOptions'
import Palette from '../../Palette'

const STYLES = {
  btnText: {
    height: '25px',
    padding: '4px 9px',
    fontSize: 11,
    letterSpacing: '1.3px',
    marginRight: '5px',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '3px',
    color: Palette.ROCK,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease, border-color 200ms ease',
    backgroundColor: Palette.FATHER_COAL,
    marginBottom: '20px',
    ':active': {
      transform: 'scale(.9)'
    },
    ':hover': {
      color: Palette.ROCK
    }
  } as React.CSSProperties,
  wrapper: {
    padding: '20px',
    color: 'white'
  }
}

export class EmbedDetails extends React.PureComponent {
  props;

  static propTypes = {
    entry: React.PropTypes.object,
    onHide: React.PropTypes.func.isRequired
  }

  render () {
    if(!this.props.entry) return null

    const Template = ShareTemplates[this.props.entry.template]

    return (
      <div style={STYLES.wrapper}>
        <button onClick={this.props.onHide} style={STYLES.btnText}>
          &lt; ALL OPTIONS
        </button>

        <Template entry={this.props.entry.entry} />
      </div>
    )
  }
}
