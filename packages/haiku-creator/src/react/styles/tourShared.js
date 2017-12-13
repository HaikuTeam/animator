import Palette from 'haiku-ui-common/lib/Palette'
import { BTN_STYLES } from './btnShared.js'

export const TOUR_STYLES = {
  heading: {
    marginTop: 20
  },
  btn: {
    ...BTN_STYLES.pinkButton
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
