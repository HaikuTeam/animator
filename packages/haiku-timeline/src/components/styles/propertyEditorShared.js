import Palette from 'haiku-ui-common/lib/Palette';
import * as Color from 'color';

export const EDITOR_STYLES = {
  inputHolster: {
    position: 'relative',
    height: '100%',
  },
  input: {
    color: Color(Palette.ROCK).fade(0.2),
    width: '100%',
    height: 'calc(100% + 1px)',
    paddingLeft: 7,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    border: '1px solid ' + Palette.DARKER_GRAY,
    backgroundColor: Palette.LIGHT_GRAY,
    ':focus': {
      border: '1px solid ' + Palette.LIGHT_PINK,
    },
    ':hover': {},
  },
  inputFocus: {
    color: Palette.ROCK,
    backgroundColor: Color(Palette.LIGHT_PINK).fade(0.92),
    border: '1px solid ' + Color(Palette.LIGHT_PINK).fade(0.5),
  },
  unit: {
    position: 'absolute',
    right: 17,
    top: 4,
    color: Color(Palette.ROCK_MUTED).fade(0.3),
  },
};
