import * as Color from 'color';
import Palette from 'haiku-ui-common/lib/Palette';
import {BTN_STYLES} from './btnShared.js';

export const DOWNLOAD_STYLES = {
  container: {
    fontSize: 16,
    zIndex: 9999999,
    backgroundColor: Palette.COAL,
    borderRadius: 3,
    padding: 20,
    color: Palette.ROCK,
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
    position: 'fixed',
    display: 'inline-block',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 325,
  },
  btn: {
    ...BTN_STYLES.pinkButton,
    padding: '10px 15px',
    fontSize: 16,
    float: 'right',
  },
  btnSecondary: {
    textTransform: 'none',
    color: Palette.DARK_PINK,
  },
  overlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: Color(Palette.GRAY).fade(0.023),
    zIndex: 99999,
  },
  progressNumber: {
    fontSize: 15,
    margin: '10px 0 0 0',
  },
  progressBar: {
    width: '100%',
  },
  formInput: {
    display: 'flex',
    marginBottom: 15,
  },
  checkInput: {
    marginRight: 10,
  },
};
