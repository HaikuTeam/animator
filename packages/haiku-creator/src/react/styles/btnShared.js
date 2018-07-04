import Palette from 'haiku-ui-common/lib/Palette';
import * as Color from 'color';

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
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    color: Palette.ROCK,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease',
    backgroundColor: Palette.FATHER_COAL,
    ':active': {
      transform: 'scale(.8)',
    },
  },
  btnIconHover: {
    ':hover': {
      color: Palette.ROCK,
    },
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
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    color: Palette.SUNSTONE,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease, border-color 200ms ease',
    backgroundColor: Palette.FATHER_COAL,
    ':active': {
      transform: 'scale(.9)',
    },
  },
  leftBtns: {
    float: 'left',
  },
  centerBtns: {
    float: 'center',
  },
  rightBtns: {
    float: 'right',
  },
  btnPrimary: {
    backgroundColor: Palette.LIGHTEST_PINK,
  },
  btnPrimaryAlt: {
    backgroundColor: Color(Palette.FATHER_COAL).darken(0.2),
  },
  btnCancel: {
    letterSpacing: '1.3px',
    marginTop: 4,
    marginRight: 20,
    cursor: 'pointer',
  },
  btnDisabled: {
    cursor: 'not-allowed',
  },
  btnBlack: {
    backgroundColor: Palette.BLACK,
    color: Palette.PALE_GRAY,
    padding: '5px 25px',
  },
  /* Legacy: many UI dialogs are using this button
   * (autoupdater, tour, sketch downloader) so we keep it until we unify
   * the styles in the whole app
   */
  pinkButton: {
    backgroundColor: Palette.LIGHTEST_PINK,
    borderRadius: 2,
    color: Palette.SUNSTONE,
    transform: 'scale(1)',
    textTransform: 'uppercase',
    transition: 'transform 200ms ease',
    ':active': {
      transform: 'scale(.8)',
    },
    padding: '10px 15px',
    fontSize: 16,
  },
};
