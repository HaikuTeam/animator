import Palette from 'haiku-ui-common/lib/Palette';
import {BTN_STYLES} from './btnShared.js';
import {DASH_STYLES} from './dashShared.js';

export const TOUR_STYLES = {
  heading: {
    marginTop: '20px',
    fontSize: '24px',
  },
  btn: {
    ...DASH_STYLES.upcase,
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.btnPrimary,
    ...BTN_STYLES.rightBtns,
  },
  btnSecondary: {
    textTransform: 'none',
    color: Palette.LIGHTEST_PINK,
  },
  linksWrapper: {
    margin: '20px 0',
  },
  link: {
    color: 'white',
  },
  text: {
    fontSize: '15px',
  },
  code: {
    padding: '17px',
    borderRadius: '3px',
    backgroundColor: Palette.LIGHTEST_GRAY,
  },
  list: {
    paddingLeft: '15px',
  },
};
