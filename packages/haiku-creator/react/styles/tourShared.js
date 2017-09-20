import { DASH_STYLES } from './dashShared'
import Palette from '../components/Palette'

export const TOUR_STYLES = {
  heading: {
    marginTop: 0
  },
  btn: {
    ...DASH_STYLES.btn,
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
  }
}
