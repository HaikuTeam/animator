import Palette from '../components/Palette'
import Color from 'color'
import { DASH_STYLES } from './dashShared'

export const TOUR_STYLES = {
  btn: {
    ...DASH_STYLES.btn,
    padding: '10px 15px',
    margin: '0 10px 0 0',
    fontSize: 16
  },
  btnSecondary: {
    textTransform: 'none',
    padding: '10px'
  },
  linksWrapper: {
    margin: '20px 0'
  },
  link: {
    display: 'block',
    color: 'white'
  },
  text: {
    fontSize: 16
  }
}
