'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KEYFRAME_STYLES = undefined;

var _DefaultPalette = require('./../DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KEYFRAME_STYLES = exports.KEYFRAME_STYLES = {
  keyframeHolster: {
    position: 'absolute',
    height: '100%',
    right: -4,
    top: 0,
    width: 7,
    zIndex: 1,
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: (0, _color2.default)(_DefaultPalette2.default.LIGHT_PINK).fade(0.77)
    }
  },
  keyframeActive: {
    backgroundColor: (0, _color2.default)(_DefaultPalette2.default.LIGHT_PINK).fade(0.77)
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
    backgroundColor: _DefaultPalette2.default.ROCK
  },
  keyframePoleActive: {
    backgroundColor: _DefaultPalette2.default.LIGHT_PINK
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3N0eWxlcy9rZXlmcmFtZVNoYXJlZC5qcyJdLCJuYW1lcyI6WyJLRVlGUkFNRV9TVFlMRVMiLCJrZXlmcmFtZUhvbHN0ZXIiLCJwb3NpdGlvbiIsImhlaWdodCIsInJpZ2h0IiwidG9wIiwid2lkdGgiLCJ6SW5kZXgiLCJiYWNrZ3JvdW5kQ29sb3IiLCJMSUdIVF9QSU5LIiwiZmFkZSIsImtleWZyYW1lQWN0aXZlIiwia2V5ZnJhbWUiLCJrZXlmcmFtZVBvbGUiLCJST0NLIiwia2V5ZnJhbWVQb2xlQWN0aXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRU8sSUFBTUEsNENBQWtCO0FBQzdCQyxtQkFBaUI7QUFDZkMsY0FBVSxVQURLO0FBRWZDLFlBQVEsTUFGTztBQUdmQyxXQUFPLENBQUMsQ0FITztBQUlmQyxTQUFLLENBSlU7QUFLZkMsV0FBTyxDQUxRO0FBTWZDLFlBQVEsQ0FOTztBQU9mQyxxQkFBaUIsYUFQRjtBQVFmLGNBQVU7QUFDUkEsdUJBQWlCLHFCQUFNLHlCQUFRQyxVQUFkLEVBQTBCQyxJQUExQixDQUErQixJQUEvQjtBQURUO0FBUkssR0FEWTtBQWE3QkMsa0JBQWdCO0FBQ2RILHFCQUFpQixxQkFBTSx5QkFBUUMsVUFBZCxFQUEwQkMsSUFBMUIsQ0FBK0IsSUFBL0I7QUFESCxHQWJhO0FBZ0I3QkUsWUFBVTtBQUNSTCxZQUFRLENBREE7QUFFUkwsY0FBVSxVQUZGO0FBR1JHLFNBQUs7QUFIRyxHQWhCbUI7QUFxQjdCUSxnQkFBYztBQUNaUCxXQUFPLENBREs7QUFFWkgsWUFBUSxNQUZJO0FBR1pELGNBQVUsVUFIRTtBQUlaRSxXQUFPLENBSks7QUFLWkMsU0FBSyxDQUxPO0FBTVpHLHFCQUFpQix5QkFBUU07QUFOYixHQXJCZTtBQTZCN0JDLHNCQUFvQjtBQUNsQlAscUJBQWlCLHlCQUFRQztBQURQO0FBN0JTLENBQXhCIiwiZmlsZSI6ImtleWZyYW1lU2hhcmVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi8uLi9EZWZhdWx0UGFsZXR0ZSdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcblxuZXhwb3J0IGNvbnN0IEtFWUZSQU1FX1NUWUxFUyA9IHtcbiAga2V5ZnJhbWVIb2xzdGVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgcmlnaHQ6IC00LFxuICAgIHRvcDogMCxcbiAgICB3aWR0aDogNyxcbiAgICB6SW5kZXg6IDEsXG4gICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuTElHSFRfUElOSykuZmFkZSgwLjc3KVxuICAgIH1cbiAgfSxcbiAga2V5ZnJhbWVBY3RpdmU6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuTElHSFRfUElOSykuZmFkZSgwLjc3KVxuICB9LFxuICBrZXlmcmFtZToge1xuICAgIHpJbmRleDogMSxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDRcbiAgfSxcbiAga2V5ZnJhbWVQb2xlOiB7XG4gICAgd2lkdGg6IDEsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6IDMsXG4gICAgdG9wOiAwLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLXG4gIH0sXG4gIGtleWZyYW1lUG9sZUFjdGl2ZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9QSU5LXG4gIH1cbn1cbiJdfQ==