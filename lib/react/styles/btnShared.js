'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BTN_STYLES = undefined;

var _Palette = require('../components/Palette');

var _Palette2 = _interopRequireDefault(_Palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Color from 'color'

var BTN_STYLES = exports.BTN_STYLES = {
  btnIcon: {
    width: '25px',
    height: '25px',
    padding: '4px',
    marginRight: '5px',
    display: 'inline-block',
    float: 'right',
    borderRadius: '3px',
    color: _Palette2.default.ROCK_MUTED,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease',
    backgroundColor: _Palette2.default.FATHER_COAL,
    ':active': {
      transform: 'scale(.8)'
    }
  },
  btnIconHover: {
    ':hover': {
      color: _Palette2.default.ROCK
    }
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
    borderRadius: '3px',
    color: _Palette2.default.ROCK,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease',
    backgroundColor: _Palette2.default.FATHER_COAL,
    ':active': {
      transform: 'scale(.9)'
    },
    ':hover': {
      color: _Palette2.default.ROCK
    }
  },
  leftBtns: {
    float: 'left'
  },
  rightBtns: {
    float: 'right'
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9zdHlsZXMvYnRuU2hhcmVkLmpzIl0sIm5hbWVzIjpbIkJUTl9TVFlMRVMiLCJidG5JY29uIiwid2lkdGgiLCJoZWlnaHQiLCJwYWRkaW5nIiwibWFyZ2luUmlnaHQiLCJkaXNwbGF5IiwiZmxvYXQiLCJib3JkZXJSYWRpdXMiLCJjb2xvciIsIlJPQ0tfTVVURUQiLCJ0cmFuc2Zvcm0iLCJjdXJzb3IiLCJ0cmFuc2l0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwiRkFUSEVSX0NPQUwiLCJidG5JY29uSG92ZXIiLCJST0NLIiwiYnRuVGV4dCIsImZvbnRTaXplIiwibGV0dGVyU3BhY2luZyIsImxpbmVIZWlnaHQiLCJhbGlnbkl0ZW1zIiwibGVmdEJ0bnMiLCJyaWdodEJ0bnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBQ0E7O0FBRU8sSUFBTUEsa0NBQWE7QUFDeEJDLFdBQVM7QUFDUEMsV0FBTyxNQURBO0FBRVBDLFlBQVEsTUFGRDtBQUdQQyxhQUFTLEtBSEY7QUFJUEMsaUJBQWEsS0FKTjtBQUtQQyxhQUFTLGNBTEY7QUFNUEMsV0FBTyxPQU5BO0FBT1BDLGtCQUFjLEtBUFA7QUFRUEMsV0FBTyxrQkFBUUMsVUFSUjtBQVNQQyxlQUFXLFVBVEo7QUFVUEMsWUFBUSxTQVZEO0FBV1BDLGdCQUFZLHNCQVhMO0FBWVBDLHFCQUFpQixrQkFBUUMsV0FabEI7QUFhUCxlQUFXO0FBQ1RKLGlCQUFXO0FBREY7QUFiSixHQURlO0FBa0J4QkssZ0JBQWM7QUFDWixjQUFVO0FBQ1JQLGFBQU8sa0JBQVFRO0FBRFA7QUFERSxHQWxCVTtBQXVCeEJDLFdBQVM7QUFDUGYsWUFBUSxNQUREO0FBRVBDLGFBQVMsU0FGRjtBQUdQZSxjQUFVLEVBSEg7QUFJUEMsbUJBQWUsT0FKUjtBQUtQZixpQkFBYSxLQUxOO0FBTVBnQixnQkFBWSxDQU5MO0FBT1BmLGFBQVMsTUFQRjtBQVFQZ0IsZ0JBQVksUUFSTDtBQVNQZixXQUFPLE9BVEE7QUFVUEMsa0JBQWMsS0FWUDtBQVdQQyxXQUFPLGtCQUFRUSxJQVhSO0FBWVBOLGVBQVcsVUFaSjtBQWFQQyxZQUFRLFNBYkQ7QUFjUEMsZ0JBQVksc0JBZEw7QUFlUEMscUJBQWlCLGtCQUFRQyxXQWZsQjtBQWdCUCxlQUFXO0FBQ1RKLGlCQUFXO0FBREYsS0FoQko7QUFtQlAsY0FBVTtBQUNSRixhQUFPLGtCQUFRUTtBQURQO0FBbkJILEdBdkJlO0FBOEN4Qk0sWUFBVTtBQUNSaEIsV0FBTztBQURDLEdBOUNjO0FBaUR4QmlCLGFBQVc7QUFDVGpCLFdBQU87QUFERTtBQWpEYSxDQUFuQiIsImZpbGUiOiJidG5TaGFyZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGFsZXR0ZSBmcm9tICcuLi9jb21wb25lbnRzL1BhbGV0dGUnXG4vLyBpbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5cbmV4cG9ydCBjb25zdCBCVE5fU1RZTEVTID0ge1xuICBidG5JY29uOiB7XG4gICAgd2lkdGg6ICcyNXB4JyxcbiAgICBoZWlnaHQ6ICcyNXB4JyxcbiAgICBwYWRkaW5nOiAnNHB4JyxcbiAgICBtYXJnaW5SaWdodDogJzVweCcsXG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgYm9yZGVyUmFkaXVzOiAnM3B4JyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDIwMG1zIGVhc2UnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAnOmFjdGl2ZSc6IHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKC44KSdcbiAgICB9XG4gIH0sXG4gIGJ0bkljb25Ib3Zlcjoge1xuICAgICc6aG92ZXInOiB7XG4gICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLXG4gICAgfVxuICB9LFxuICBidG5UZXh0OiB7XG4gICAgaGVpZ2h0OiAnMjVweCcsXG4gICAgcGFkZGluZzogJzRweCA5cHgnLFxuICAgIGZvbnRTaXplOiAxMSxcbiAgICBsZXR0ZXJTcGFjaW5nOiAnMS4zcHgnLFxuICAgIG1hcmdpblJpZ2h0OiAnNXB4JyxcbiAgICBsaW5lSGVpZ2h0OiAxLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICBib3JkZXJSYWRpdXM6ICczcHgnLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjkpJ1xuICAgIH0sXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tcbiAgICB9XG4gIH0sXG4gIGxlZnRCdG5zOiB7XG4gICAgZmxvYXQ6ICdsZWZ0J1xuICB9LFxuICByaWdodEJ0bnM6IHtcbiAgICBmbG9hdDogJ3JpZ2h0J1xuICB9XG59XG4iXX0=