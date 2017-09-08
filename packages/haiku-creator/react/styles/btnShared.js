import Palette from '../components/Palette'
// import Color from 'color'

export const BTN_STYLES = {
  btnIcon: {
    width: '25px',
    height: '25px',
    padding: '4px',
    marginRight: '5px',
    display: 'inline-block',
    float: 'right',
    borderRadius: '3px',
    color: Palette.ROCK_MUTED,
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
    transition: 'transform 200ms ease',
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
  }
}
