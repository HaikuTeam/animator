import Palette from '../components/Palette'
import Color from 'color'

export const BTN_STYLES = {
  btnIcon: {
    minWidth: '25px',
    height: '25px',
    padding: '4px 7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '7px',
    float: 'right',
    borderRadius: '3px',
    color: Palette.ROCK,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease',
    backgroundColor: Palette.FATHER_COAL,
    ':active': {
      transform: 'scale(.8)'
    }
  },
  btnIconHover: {
    ':hover': {
      color: Palette.ROCK
    }
  },
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
  leftBtns: {
    float: 'left'
  },
  rightBtns: {
    float: 'right'
  },
  btnPrimary: {
    backgroundColor: Palette.LIGHTEST_PINK,
    color: Palette.SUNSTONE
  },
  btnPrimaryAlt: {
    backgroundColor: Color(Palette.FATHER_COAL).darken(0.2)
  },
  btnCancel: {
    letterSpacing: '1.3px',
    marginTop: 4,
    marginRight: 20,
    cursor: 'pointer'
  },
  btnDisabled: {
    cursor: 'not-allowed'
  }
}
