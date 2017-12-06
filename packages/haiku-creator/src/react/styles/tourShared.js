import { DASH_STYLES } from './dashShared'
import Palette from '../components/Palette'

export const TOUR_STYLES = {
  heading: {
    marginTop: 20
  },
  btn: {
    backgroundColor: Palette.LIGHT_PINK,
    padding: '5px 15px',
    borderRadius: 2,
    color: 'white',
    transform: 'scale(1)',
    textTransform: 'uppercase',
    transition: 'transform 200ms ease',
    ':active': {
      transform: 'scale(.8)'
    },
    padding: '10px 15px',
    fontSize: 16
  },
  btnSecondary: {
    textTransform: 'none',
    color: Palette.DARK_PINK
  },
  linksWrapper: {
    margin: '20px 0'
  },
  link: {
    color: 'white'
  },
  text: {
    fontSize: 16
  },
  code: {
    padding: 17,
    borderRadius: 3,
    background: Palette.LIGHTEST_GRAY
  },
  list: {
    paddingLeft: 15
  }
}
