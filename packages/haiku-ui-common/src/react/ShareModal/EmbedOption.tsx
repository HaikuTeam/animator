import * as React from 'react'
import * as assign from 'lodash.assign'
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
    float: 'right',
    borderRadius: '3px',
    color: Palette.ROCK,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease, border-color 200ms ease',
    backgroundColor: Palette.FATHER_COAL,
    ':active': {
      transform: 'scale(.9)'
    },
    ':hover': {
      color: Palette.ROCK
    }
  },
  entry: {
    float: 'none',
    width: '100%',
    marginBottom: '8px',
    justifyContent: 'center',
    disabled: {
      backgroundColor: 'transparent',
      color: Palette.BLACK,
      border: `1px solid ${Palette.DARKEST_COAL}`
    }
  }
}

export class EmbedOption extends React.PureComponent {
  props;

  static propTypes = {
    disabled: React.PropTypes.bool,
    entry: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  }

  render () {
    const {
      disabled,
      entry
    } = this.props

    return (
      <li>
        <button
          style={assign({}, {
            ...STYLES.btnText,
            ...STYLES.entry,
            ...(disabled && STYLES.entry.disabled)
          })}
          onClick={() => {
            this.props.onClick(this.props.entry)
          }}
          disabled={disabled}
          title={disabled ? 'Coming Soon' : ''}
        >
          {entry}
        </button>
      </li>
    )
  }
}
