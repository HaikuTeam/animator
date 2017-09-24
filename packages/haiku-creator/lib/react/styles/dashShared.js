'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DASH_STYLES = undefined;

var _Palette = require('../components/Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DASH_STYLES = exports.DASH_STYLES = {
  dashLevelWrapper: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: (0, _color2.default)(_Palette2.default.FATHER_COAL).fade(0.07),
    opacity: 0,
    transform: 'scale(1.3)',
    transition: 'transform 340ms ease-out, opacity 140ms linear'
  },
  appearDashLevel: {
    pointerEvents: 'all',
    opacity: 1,
    transform: 'scale(1)'
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    zIndex: 1
  },
  projectsBar: {
    backgroundColor: _Palette2.default.FATHER_COAL,
    float: 'left',
    width: 300,
    height: '100%',
    color: _Palette2.default.ROCK,
    paddingTop: 30
  },
  titleWrapper: {
    paddingLeft: 32,
    paddingRight: 18,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  projectsTitle: {
    fontSize: 26,
    color: (0, _color2.default)(_Palette2.default.ROCK).fade(0.33),
    textTransform: 'uppercase'
  },
  btnNewProject: {
    borderRadius: '50%',
    backgroundColor: _Palette2.default.COAL,
    color: _Palette2.default.ROCK,
    width: 22,
    height: 22,
    marginTop: -1,
    ':hover': {
      backgroundColor: _Palette2.default.DARKER_GRAY
    }
  },
  tooltip: {
    backgroundColor: _Palette2.default.LIGHT_PINK,
    color: _Palette2.default.ROCK,
    position: 'absolute',
    right: '-132px',
    padding: '7px 16px',
    fontSize: 13,
    borderRadius: 4
  },
  arrowLeft: {
    width: 0,
    height: 0,
    position: 'absolute',
    left: -10,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '10px solid ' + _Palette2.default.LIGHT_PINK
  },
  projectWrapper: {
    height: 55,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    paddingRight: 12,
    cursor: 'pointer',
    WebkitUserSelect: 'none',
    ':hover': {
      backgroundColor: (0, _color2.default)(_Palette2.default.COAL).fade(0.38)
    }
  },
  activeWrapper: {
    backgroundColor: _Palette2.default.COAL
  },
  activeProject: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 7,
    backgroundColor: _Palette2.default.LIGHT_PINK
  },
  loadingWrap: {
    height: 'calc(100% - 113px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    paddingLeft: 32,
    height: 25,
    opacity: 0.4
  },
  logoActive: {
    opacity: 1
  },
  projectTitle: {
    paddingLeft: 12,
    fontSize: 18,
    opacity: 0.73,
    cursor: 'pointer',
    color: _Palette2.default.ROCK
  },
  projectTitleNew: {
    paddingLeft: 12,
    color: _Palette2.default.ROCK
  },
  newProjectInput: {
    fontSize: 18,
    backgroundColor: _Palette2.default.FATHER_COAL,
    marginTop: 0,
    height: 35,
    paddingLeft: 5,
    paddingRight: 5,
    width: 195,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    color: _Palette2.default.ROCK,
    border: '1px solid ' + (0, _color2.default)(_Palette2.default.FATHER_COAL).darken(0.4),
    ':focus': {
      border: '1px solid ' + _Palette2.default.LIGHT_PINK
    }
  },
  newProjectGoButton: {
    paddingLeft: 1,
    paddingRight: 1,
    backgroundColor: _Palette2.default.LIGHT_PINK,
    color: _Palette2.default.ROCK,
    marginTop: 0,
    width: 30,
    height: 35,
    fontSize: 12,
    letterSpacing: 1.3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: 'transform 200ms ease, background-color 200ms ease',
    ':hover': {
      backgroundColor: _Palette2.default.PINK
    },
    ':active': {
      transform: 'scale(.8)'
    },
    ':disabled': {
      backgroundColor: _Palette2.default.DARK_GRAY
    }
  },
  activeTitle: {
    opacity: 1
  },
  date: {
    marginLeft: 'auto',
    opacity: 0.6,
    textAlign: 'right',
    fontSize: 10,
    lineHeight: 1.3,
    color: (0, _color2.default)(_Palette2.default.ROCK).fade(0.1)
  },
  activeDate: {
    opacity: 1
  },
  dateTitle: {
    color: (0, _color2.default)(_Palette2.default.ROCK).fade(0.48)
  },
  details: {
    float: 'left',
    width: 'calc(100% - 300px)',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative'
  },
  centerCol: {
    width: 490,
    paddingTop: 68,
    paddingBottom: 68
  },
  fieldTitle: {
    fontSize: 15,
    color: (0, _color2.default)(_Palette2.default.ROCK).fade(0.3),
    marginBottom: 4
  },
  field: {
    height: 69,
    width: '100%',
    marginBottom: 30,
    paddingLeft: 25,
    fontSize: 32,
    backgroundColor: _Palette2.default.FATHER_COAL,
    borderRadius: 3,
    color: _Palette2.default.ROCK,
    border: '1px solid ' + (0, _color2.default)(_Palette2.default.FATHER_COAL).darken(0.4),
    ':focus': {
      border: '1px solid ' + _Palette2.default.LIGHT_PINK
    }
  },
  fieldDialogue: {
    width: 364,
    minHeight: 100,
    position: 'absolute',
    bottom: 'calc(-100% - 21px)',
    left: 'calc(50% - 177px)',
    boxShadow: '0 15px 24px 0 rgba(0,0,0,0.21)',
    borderRadius: 4,
    backgroundColor: _Palette2.default.COAL,
    padding: '17px 26px',
    fontSize: 16,
    transform: 'translateY(-25px)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'all 300ms cubic-bezier(0.51, 0.55, 0.17, 1.55)'
  },
  fieldDialogueActive: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto'
  },
  arrowTop: {
    width: 0,
    height: 0,
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '10px solid ' + _Palette2.default.COAL
  },
  fieldMono: {
    fontSize: 17,
    fontFamily: 'Fira Mono'
  },
  btn: {
    backgroundColor: _Palette2.default.LIGHT_PINK,
    padding: '5px 15px',
    borderRadius: 2,
    color: 'white',
    transform: 'scale(1)',
    textTransform: 'uppercase',
    transition: 'transform 200ms ease',
    ':active': {
      transform: 'scale(.8)'
    }
  },
  btnRight: {
    float: 'right',
    marginLeft: 6
  },
  btnSecondary: {
    backgroundColor: 'transparent'
  },
  editProject: {
    width: '100%',
    borderRadius: 3,
    height: 53,
    fontSize: 22,
    letterSpacing: 1.5,
    backgroundColor: _Palette2.default.LIGHT_PINK,
    color: _Palette2.default.ROCK
  },
  btnClose: {
    position: 'absolute',
    right: 15,
    top: 10,
    backgroundColor: _Palette2.default.LIGHT_PINK,
    padding: '10px 15px'
  },
  emptyState: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 490,
    fontSize: 40,
    color: (0, _color2.default)(_Palette2.default.FATHER_COAL).darken(0.2),
    textAlign: 'center'
  },
  noSelect: {
    WebkitUserSelect: 'none',
    cursor: 'default'
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9zdHlsZXMvZGFzaFNoYXJlZC5qcyJdLCJuYW1lcyI6WyJEQVNIX1NUWUxFUyIsImRhc2hMZXZlbFdyYXBwZXIiLCJwb3NpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJ0b3AiLCJsZWZ0Iiwid2lkdGgiLCJoZWlnaHQiLCJvdmVyZmxvdyIsImJhY2tncm91bmRDb2xvciIsIkZBVEhFUl9DT0FMIiwiZmFkZSIsIm9wYWNpdHkiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiYXBwZWFyRGFzaExldmVsIiwiZnJhbWUiLCJyaWdodCIsInpJbmRleCIsInByb2plY3RzQmFyIiwiZmxvYXQiLCJjb2xvciIsIlJPQ0siLCJwYWRkaW5nVG9wIiwidGl0bGVXcmFwcGVyIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwicHJvamVjdHNUaXRsZSIsImZvbnRTaXplIiwidGV4dFRyYW5zZm9ybSIsImJ0bk5ld1Byb2plY3QiLCJib3JkZXJSYWRpdXMiLCJDT0FMIiwibWFyZ2luVG9wIiwiREFSS0VSX0dSQVkiLCJ0b29sdGlwIiwiTElHSFRfUElOSyIsInBhZGRpbmciLCJhcnJvd0xlZnQiLCJib3JkZXJUb3AiLCJib3JkZXJCb3R0b20iLCJib3JkZXJSaWdodCIsInByb2plY3RXcmFwcGVyIiwiY3Vyc29yIiwiV2Via2l0VXNlclNlbGVjdCIsImFjdGl2ZVdyYXBwZXIiLCJhY3RpdmVQcm9qZWN0IiwibG9hZGluZ1dyYXAiLCJsb2dvIiwibG9nb0FjdGl2ZSIsInByb2plY3RUaXRsZSIsInByb2plY3RUaXRsZU5ldyIsIm5ld1Byb2plY3RJbnB1dCIsImJvcmRlclRvcExlZnRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwiYm9yZGVyIiwiZGFya2VuIiwibmV3UHJvamVjdEdvQnV0dG9uIiwibGV0dGVyU3BhY2luZyIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJQSU5LIiwiREFSS19HUkFZIiwiYWN0aXZlVGl0bGUiLCJkYXRlIiwibWFyZ2luTGVmdCIsInRleHRBbGlnbiIsImxpbmVIZWlnaHQiLCJhY3RpdmVEYXRlIiwiZGF0ZVRpdGxlIiwiZGV0YWlscyIsImNlbnRlckNvbCIsInBhZGRpbmdCb3R0b20iLCJmaWVsZFRpdGxlIiwibWFyZ2luQm90dG9tIiwiZmllbGQiLCJmaWVsZERpYWxvZ3VlIiwibWluSGVpZ2h0IiwiYm90dG9tIiwiYm94U2hhZG93IiwiZmllbGREaWFsb2d1ZUFjdGl2ZSIsImFycm93VG9wIiwiYm9yZGVyTGVmdCIsImZpZWxkTW9ubyIsImZvbnRGYW1pbHkiLCJidG4iLCJidG5SaWdodCIsImJ0blNlY29uZGFyeSIsImVkaXRQcm9qZWN0IiwiYnRuQ2xvc2UiLCJlbXB0eVN0YXRlIiwibm9TZWxlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFTyxJQUFNQSxvQ0FBYztBQUN6QkMsb0JBQWtCO0FBQ2hCQyxjQUFVLFVBRE07QUFFaEJDLG1CQUFlLE1BRkM7QUFHaEJDLFNBQUssQ0FIVztBQUloQkMsVUFBTSxDQUpVO0FBS2hCQyxXQUFPLE1BTFM7QUFNaEJDLFlBQVEsTUFOUTtBQU9oQkMsY0FBVSxRQVBNO0FBUWhCQyxxQkFBaUIscUJBQU0sa0JBQVFDLFdBQWQsRUFBMkJDLElBQTNCLENBQWdDLElBQWhDLENBUkQ7QUFTaEJDLGFBQVMsQ0FUTztBQVVoQkMsZUFBVyxZQVZLO0FBV2hCQyxnQkFBWTtBQVhJLEdBRE87QUFjekJDLG1CQUFpQjtBQUNmWixtQkFBZSxLQURBO0FBRWZTLGFBQVMsQ0FGTTtBQUdmQyxlQUFXO0FBSEksR0FkUTtBQW1CekJHLFNBQU87QUFDTGQsY0FBVSxVQURMO0FBRUxFLFNBQUssQ0FGQTtBQUdMQyxVQUFNLENBSEQ7QUFJTFksV0FBTyxDQUpGO0FBS0xWLFlBQVEsRUFMSDtBQU1MVyxZQUFRO0FBTkgsR0Fu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O0FBSVZQLFdBQU8sR0FKRztBQUtWeUIsY0FBVSxFQUxBO0FBTVZWLFdBQU8scUJBQU0sa0JBQVFYLFdBQWQsRUFBMkJpRCxNQUEzQixDQUFrQyxHQUFsQyxDQU5HO0FBT1ZVLGVBQVc7QUFQRCxHQTlSYTtBQXVTekJ5QixZQUFVO0FBQ1IvQyxzQkFBa0IsTUFEVjtBQUVSRCxZQUFRO0FBRkE7QUF2U2UsQ0FBcEIiLCJmaWxlIjoiZGFzaFNoYXJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWxldHRlIGZyb20gJy4uL2NvbXBvbmVudHMvUGFsZXR0ZSdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcblxuZXhwb3J0IGNvbnN0IERBU0hfU1RZTEVTID0ge1xuICBkYXNoTGV2ZWxXcmFwcGVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5GQVRIRVJfQ09BTCkuZmFkZSgwLjA3KSxcbiAgICBvcGFjaXR5OiAwLFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuMyknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMzQwbXMgZWFzZS1vdXQsIG9wYWNpdHkgMTQwbXMgbGluZWFyJ1xuICB9LFxuICBhcHBlYXJEYXNoTGV2ZWw6IHtcbiAgICBwb2ludGVyRXZlbnRzOiAnYWxsJyxcbiAgICBvcGFjaXR5OiAxLFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ1xuICB9LFxuICBmcmFtZToge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIHJpZ2h0OiAwLFxuICAgIGhlaWdodDogMzIsXG4gICAgekluZGV4OiAxXG4gIH0sXG4gIHByb2plY3RzQmFyOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgd2lkdGg6IDMwMCxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHBhZGRpbmdUb3A6IDMwXG4gIH0sXG4gIHRpdGxlV3JhcHBlcjoge1xuICAgIHBhZGRpbmdMZWZ0OiAzMixcbiAgICBwYWRkaW5nUmlnaHQ6IDE4LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInXG4gIH0sXG4gIHByb2plY3RzVGl0bGU6IHtcbiAgICBmb250U2l6ZTogMjYsXG4gICAgY29sb3I6IENvbG9yKFBhbGV0dGUuUk9DSykuZmFkZSgwLjMzKSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xuICB9LFxuICBidG5OZXdQcm9qZWN0OiB7XG4gICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHdpZHRoOiAyMixcbiAgICBoZWlnaHQ6IDIyLFxuICAgIG1hcmdpblRvcDogLTEsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWVxuICAgIH1cbiAgfSxcbiAgdG9vbHRpcDoge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9QSU5LLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6ICctMTMycHgnLFxuICAgIHBhZGRpbmc6ICc3cHggMTZweCcsXG4gICAgZm9udFNpemU6IDEzLFxuICAgIGJvcmRlclJhZGl1czogNFxuICB9LFxuICBhcnJvd0xlZnQ6IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgbGVmdDogLTEwLFxuICAgIGJvcmRlclRvcDogJzEwcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgIGJvcmRlckJvdHRvbTogJzEwcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgIGJvcmRlclJpZ2h0OiAnMTBweCBzb2xpZCAnICsgUGFsZXR0ZS5MSUdIVF9QSU5LXG4gIH0sXG4gIHByb2plY3RXcmFwcGVyOiB7XG4gICAgaGVpZ2h0OiA1NSxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgcGFkZGluZ1JpZ2h0OiAxMixcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5DT0FMKS5mYWRlKDAuMzgpXG4gICAgfVxuICB9LFxuICBhY3RpdmVXcmFwcGVyOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUxcbiAgfSxcbiAgYWN0aXZlUHJvamVjdDoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6IDAsXG4gICAgdG9wOiAwLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHdpZHRoOiA3LFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9QSU5LXG4gIH0sXG4gIGxvYWRpbmdXcmFwOiB7XG4gICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gMTEzcHgpJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInXG4gIH0sXG4gIGxvZ286IHtcbiAgICBwYWRkaW5nTGVmdDogMzIsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICBvcGFjaXR5OiAwLjRcbiAgfSxcbiAgbG9nb0FjdGl2ZToge1xuICAgIG9wYWNpdHk6IDFcbiAgfSxcbiAgcHJvamVjdFRpdGxlOiB7XG4gICAgcGFkZGluZ0xlZnQ6IDEyLFxuICAgIGZvbnRTaXplOiAxOCxcbiAgICBvcGFjaXR5OiAwLjczLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tcbiAgfSxcbiAgcHJvamVjdFRpdGxlTmV3OiB7XG4gICAgcGFkZGluZ0xlZnQ6IDEyLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tcbiAgfSxcbiAgbmV3UHJvamVjdElucHV0OiB7XG4gICAgZm9udFNpemU6IDE4LFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICBtYXJnaW5Ub3A6IDAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICBwYWRkaW5nTGVmdDogNSxcbiAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgd2lkdGg6IDE5NSxcbiAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiAzLFxuICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IDMsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmRhcmtlbigwLjQpLFxuICAgICc6Zm9jdXMnOiB7XG4gICAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuTElHSFRfUElOS1xuICAgIH1cbiAgfSxcbiAgbmV3UHJvamVjdEdvQnV0dG9uOiB7XG4gICAgcGFkZGluZ0xlZnQ6IDEsXG4gICAgcGFkZGluZ1JpZ2h0OiAxLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9QSU5LLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgbWFyZ2luVG9wOiAwLFxuICAgIHdpZHRoOiAzMCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgIGZvbnRTaXplOiAxMixcbiAgICBsZXR0ZXJTcGFjaW5nOiAxLjMsXG4gICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IDIsXG4gICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IDIsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZSwgYmFja2dyb3VuZC1jb2xvciAyMDBtcyBlYXNlJyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlBJTktcbiAgICB9LFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH0sXG4gICAgJzpkaXNhYmxlZCc6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLX0dSQVlcbiAgICB9XG4gIH0sXG4gIGFjdGl2ZVRpdGxlOiB7XG4gICAgb3BhY2l0eTogMVxuICB9LFxuICBkYXRlOiB7XG4gICAgbWFyZ2luTGVmdDogJ2F1dG8nLFxuICAgIG9wYWNpdHk6IDAuNixcbiAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgZm9udFNpemU6IDEwLFxuICAgIGxpbmVIZWlnaHQ6IDEuMyxcbiAgICBjb2xvcjogQ29sb3IoUGFsZXR0ZS5ST0NLKS5mYWRlKDAuMSlcbiAgfSxcbiAgYWN0aXZlRGF0ZToge1xuICAgIG9wYWNpdHk6IDFcbiAgfSxcbiAgZGF0ZVRpdGxlOiB7XG4gICAgY29sb3I6IENvbG9yKFBhbGV0dGUuUk9DSykuZmFkZSgwLjQ4KVxuICB9LFxuICBkZXRhaWxzOiB7XG4gICAgZmxvYXQ6ICdsZWZ0JyxcbiAgICB3aWR0aDogJ2NhbGMoMTAwJSAtIDMwMHB4KScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICB9LFxuICBjZW50ZXJDb2w6IHtcbiAgICB3aWR0aDogNDkwLFxuICAgIHBhZGRpbmdUb3A6IDY4LFxuICAgIHBhZGRpbmdCb3R0b206IDY4XG4gIH0sXG4gIGZpZWxkVGl0bGU6IHtcbiAgICBmb250U2l6ZTogMTUsXG4gICAgY29sb3I6IENvbG9yKFBhbGV0dGUuUk9DSykuZmFkZSgwLjMpLFxuICAgIG1hcmdpbkJvdHRvbTogNFxuICB9LFxuICBmaWVsZDoge1xuICAgIGhlaWdodDogNjksXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBtYXJnaW5Cb3R0b206IDMwLFxuICAgIHBhZGRpbmdMZWZ0OiAyNSxcbiAgICBmb250U2l6ZTogMzIsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgQ29sb3IoUGFsZXR0ZS5GQVRIRVJfQ09BTCkuZGFya2VuKDAuNCksXG4gICAgJzpmb2N1cyc6IHtcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5MSUdIVF9QSU5LXG4gICAgfVxuICB9LFxuICBmaWVsZERpYWxvZ3VlOiB7XG4gICAgd2lkdGg6IDM2NCxcbiAgICBtaW5IZWlnaHQ6IDEwMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBib3R0b206ICdjYWxjKC0xMDAlIC0gMjFweCknLFxuICAgIGxlZnQ6ICdjYWxjKDUwJSAtIDE3N3B4KScsXG4gICAgYm94U2hhZG93OiAnMCAxNXB4IDI0cHggMCByZ2JhKDAsMCwwLDAuMjEpJyxcbiAgICBib3JkZXJSYWRpdXM6IDQsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgcGFkZGluZzogJzE3cHggMjZweCcsXG4gICAgZm9udFNpemU6IDE2LFxuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTI1cHgpJyxcbiAgICBvcGFjaXR5OiAwLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICB0cmFuc2l0aW9uOiAnYWxsIDMwMG1zIGN1YmljLWJlemllcigwLjUxLCAwLjU1LCAwLjE3LCAxLjU1KSdcbiAgfSxcbiAgZmllbGREaWFsb2d1ZUFjdGl2ZToge1xuICAgIG9wYWNpdHk6IDEsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKScsXG4gICAgcG9pbnRlckV2ZW50czogJ2F1dG8nXG4gIH0sXG4gIGFycm93VG9wOiB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogLTEwLFxuICAgIGxlZnQ6ICc1MCUnLFxuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgIGJvcmRlckxlZnQ6ICcxMHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICBib3JkZXJSaWdodDogJzEwcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgIGJvcmRlckJvdHRvbTogJzEwcHggc29saWQgJyArIFBhbGV0dGUuQ09BTFxuICB9LFxuICBmaWVsZE1vbm86IHtcbiAgICBmb250U2l6ZTogMTcsXG4gICAgZm9udEZhbWlseTogJ0ZpcmEgTW9ubydcbiAgfSxcbiAgYnRuOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX1BJTkssXG4gICAgcGFkZGluZzogJzVweCAxNXB4JyxcbiAgICBib3JkZXJSYWRpdXM6IDIsXG4gICAgY29sb3I6ICd3aGl0ZScsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgJzphY3RpdmUnOiB7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSguOCknXG4gICAgfVxuICB9LFxuICBidG5SaWdodDoge1xuICAgIGZsb2F0OiAncmlnaHQnLFxuICAgIG1hcmdpbkxlZnQ6IDZcbiAgfSxcbiAgYnRuU2Vjb25kYXJ5OiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG4gIH0sXG4gIGVkaXRQcm9qZWN0OiB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgaGVpZ2h0OiA1MyxcbiAgICBmb250U2l6ZTogMjIsXG4gICAgbGV0dGVyU3BhY2luZzogMS41LFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9QSU5LLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tcbiAgfSxcbiAgYnRuQ2xvc2U6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICByaWdodDogMTUsXG4gICAgdG9wOiAxMCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfUElOSyxcbiAgICBwYWRkaW5nOiAnMTBweCAxNXB4J1xuICB9LFxuICBlbXB0eVN0YXRlOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICB3aWR0aDogNDkwLFxuICAgIGZvbnRTaXplOiA0MCxcbiAgICBjb2xvcjogQ29sb3IoUGFsZXR0ZS5GQVRIRVJfQ09BTCkuZGFya2VuKDAuMiksXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJ1xuICB9LFxuICBub1NlbGVjdDoge1xuICAgIFdlYmtpdFVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICBjdXJzb3I6ICdkZWZhdWx0J1xuICB9XG59XG4iXX0=