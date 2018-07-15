import Palette from 'haiku-ui-common/lib/Palette'
import * as Color from 'color'

export const KEYFRAME_STYLES = {
  keyframeHolster: {
    position: 'absolute',
    height: '100%',
    right: -4,
    top: 0,
    width: 7,
    zIndex: 1,
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: Color(Palette.LIGHT_PINK).fade(0.77)
    }
  },
  keyframeActive: {
    backgroundColor: Color(Palette.LIGHT_PINK).fade(0.77)
  },
  keyframe: {
    zIndex: 1,
    position: 'absolute',
    top: 4
  },
  keyframePole: {
    width: 1,
    height: '100%',
    position: 'absolute',
    right: 3,
    top: 0,
    backgroundColor: Palette.ROCK
  },
  keyframePoleActive: {
    backgroundColor: Palette.LIGHT_PINK
  }
}
